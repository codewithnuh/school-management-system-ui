import { useState } from "react";
import { Typography, Container, Alert, Snackbar } from "@mui/material";
import TeacherRegistrationForm from "@/components/forms/TeacherRegistrationForm";
import type { TeacherSchemaType } from "@/schema/teacher.schema";

// Import API service (to be implemented)
// import { registerTeacher } from '@/api/teachers';

const RegisterTeacherPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Mock data for demo purposes
  const subjectsMock = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Science" },
    { id: 3, name: "English" },
    { id: 4, name: "Computer Science" },
    { id: 5, name: "History" },
    { id: 6, name: "Geography" },
    { id: 7, name: "Physical Education" },
    { id: 8, name: "Arts" },
  ];

  const handleSubmit = async (data: TeacherSchemaType) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call API to register teacher
      // await registerTeacher(data);
      console.log("Form submitted with data:", data);

      // Show success message
      setSuccess(true);

      // Reset form or redirect
      // formRef.current.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register teacher"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mt: 4, mb: 2 }}
      >
        Register New Teacher
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TeacherRegistrationForm
        onSubmit={handleSubmit}
        subjects={subjectsMock}
        isLoading={isLoading}
      />

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Teacher registered successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterTeacherPage;
