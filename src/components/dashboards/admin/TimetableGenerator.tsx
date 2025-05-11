import React, { useState, useEffect } from "react";
import { useClasses } from "../../../services/queries/classes"; // Your query hook
import { ThemeProvider } from "@mui/material/styles";
import {
  styled,
  Paper,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import { darkTheme } from "../../../theme/darkTheme";
import { useGenerateTimetableOfAClass } from "../../../services/queries/timeTable";

const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
}));

const Test = () => {
  const { data: classData, isLoading, isError, error } = useClasses();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const generateTimetableMutation = useGenerateTimetableOfAClass();
  const [classId, setClassId] = useState<number | undefined>();

  console.log("Raw classData:", classData); // This should now work

  const handleSubmit = async () => {
    if (!classId) {
      setToast({
        open: true,
        message: "Please select a class.",
        severity: "info",
      });
      return;
    }

    try {
      await generateTimetableMutation.mutateAsync(classId);
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

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Log for debugging
  useEffect(() => {
    if (classData) {
      console.log("classData received:", classData);
    }
  }, [classData]);

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
                value={classId || ""}
                onChange={(e) => setClassId(Number(e.target.value))}
                label="Select Class"
                displayEmpty
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.15)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#555",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1e88e5",
                  },
                }}
              >
                {/* Show loading state */}
                {isLoading && (
                  <MenuItem disabled value="">
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    Loading classes...
                  </MenuItem>
                )}

                {/* Show error */}
                {isError && (
                  <MenuItem disabled value="">
                    Failed to load classes:{" "}
                    {error instanceof Error ? error.message : "Unknown error"}
                  </MenuItem>
                )}

                {/* Show actual classes */}
                {!isLoading &&
                  !isError &&
                  classData?.data?.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}

                {/* Show empty state */}
                {!isLoading &&
                  !isError &&
                  (!classData?.data || classData.data.length === 0) && (
                    <MenuItem disabled value="">
                      No classes found
                    </MenuItem>
                  )}
              </Select>
            </FormControl>

            {/* Generate Button */}
            <Box textAlign="center" mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={
                  generateTimetableMutation.isPending || !classId || isLoading
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
};

export default Test;
