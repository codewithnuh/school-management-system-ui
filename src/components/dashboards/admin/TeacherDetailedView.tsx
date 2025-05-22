import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { useGetSingleTeacher as useGetTeacherById } from "../../../services/queries/teachers";
// import { useUpdateTeacher } from "../../../services/mutations/teacherMutations";
import { darkTheme } from "../../../theme/darkTheme";
import { ThemeProvider } from "@mui/material/styles";

export default function TeacherDetailView() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const { data: teacher, isLoading, error } = useGetTeacherById(teacherId);
  //   const updateTeacherMutation = useUpdateTeacher();
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const [formValues, setFormValues] = useState<any>({});

  const originalData = teacher?.data || {};
  const changedFields = Object.keys(editedFields).filter(
    (key) => editedFields[key] !== originalData[key]
  );

  useEffect(() => {
    if (originalData) {
      setFormValues(originalData);
    }
  }, [originalData]);

  const handleChange = (field: string, value: any) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // updateTeacherMutation.mutate(
    //   { id, updates: editedFields },
    //   {
    //     onSuccess: () => {
    //       setEditedFields({});
    //       alert("Teacher updated successfully!");
    //     },
    //     onError: (err) => {
    //       alert(`Error updating teacher: ${err.message}`);
    //     },
    //   }
    // );
    console.log("Updated");
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box textAlign="center" mt={6}>
          <CircularProgress />
          <Typography mt={2}>Loading teacher data...</Typography>
        </Box>
      </Container>
    );
  }

  if (!teacher?.data) {
    return (
      <Container maxWidth="lg">
        <Box textAlign="center" mt={6}>
          <Typography>Teacher not found.</Typography>
          <Button onClick={() => navigate("/dashboard/admin/teachers")}>
            Back to Teachers
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {formValues.firstName} {formValues.lastName}
        </Typography>

        <Grid container spacing={4}>
          {Object.entries(formValues).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <TextField
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                fullWidth
                value={value ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                sx={{
                  ".MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                  },
                }}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={changedFields.length === 0}
                sx={{ textTransform: "none" }}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
