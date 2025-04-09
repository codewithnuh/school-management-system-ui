import React from "react";
import { Container, Typography, Box } from "@mui/material";
import TeacherRegistrationForm from "../components/forms/TeacherRegistrationForm";

const TeacherRegistrationPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Teacher Registration
        </Typography>
        <Typography variant="subtitle1" paragraph align="center" sx={{ mb: 4 }}>
          Fill out the form below to register a new teacher in the system.
        </Typography>

        <TeacherRegistrationForm />
      </Box>
    </Container>
  );
};

export default TeacherRegistrationPage;
