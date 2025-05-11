"use client";

import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { ThemeProvider, styled } from "@mui/material/styles";

// Your custom dark theme
import { darkTheme } from "../../../theme/darkTheme";
import { useClasses } from "../../../services/queries/classes";
// Mutation hook
import { useGenerateTimetableOfAClass } from "../../../services/queries/timeTable";

// Types (you can adjust based on your API)
interface ClassOption {
  id: number;
  name: string;
}

interface SectionOption {
  id: number;
  name: string;
}

const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
}));

export function GenerateTimetableForm() {
  const [sectionId, setSectionId] = useState<number | "">("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const generateTimetableMutation = useGenerateTimetableOfAClass();

  const handleSubmit = async () => {
    if (!classId || !sectionId) {
      setToast({
        open: true,
        message: "Please select both class and section.",
        severity: "info",
      });
      return;
    }

    try {
      await generateTimetableMutation.mutateAsync({ classId, sectionId });

      setToast({
        open: true,
        message: "Timetable generated successfully!",
        severity: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        message: "Failed to generate timetable.",
        severity: "error",
      });
    }
  };

  // Mock data — replace with real API calls
  const classes: ClassOption[] = classData.data;

  const sections: SectionOption[] = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
    { id: 4, name: "D" },
  ];

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <GlassPaper>
          <Typography variant="h5" align="center" gutterBottom>
            Generate Timetable for Class
          </Typography>

          <Box mt={3}>
            {/* Class Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="class-select-label">Select Class</InputLabel>
              <Select
                labelId="class-select-label"
                value={classId}
                onChange={(e) => setClassId(Number(e.target.value))}
                label="Select Class"
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.15)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#555",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1e88e5", // Primary blue
                  },
                }}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Section Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="section-select-label">Select Section</InputLabel>
              <Select
                labelId="section-select-label"
                value={sectionId}
                onChange={(e) => setSectionId(Number(e.target.value))}
                label="Select Section"
                disabled={!classId}
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: classId
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(255, 255, 255, 0.08)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#555",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1e88e5",
                  },
                }}
              >
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Generate Button */}
            <Box textAlign="center" mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={
                  generateTimetableMutation.isPending || !classId || !sectionId
                }
                startIcon={
                  generateTimetableMutation.isPending && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
                sx={{
                  width: "100%",
                  borderRadius: 5,
                  backgroundColor: "#1c1c1c",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                {generateTimetableMutation.isPending
                  ? "Generating..."
                  : "Generate Timetable"}
              </Button>
            </Box>
          </Box>
        </GlassPaper>

        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
