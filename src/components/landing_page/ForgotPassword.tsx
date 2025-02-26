"use client";

import type React from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

// OTP Input component (unchanged)
const OtpInput: React.FC<{ otp: string; setOtp: (otp: string) => void }> = ({
  otp,
  setOtp,
}) => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id="otp"
      label="Enter OTP"
      name="otp"
      autoComplete="one-time-code"
      autoFocus
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      inputProps={{ maxLength: 6 }}
    />
  );
};

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
    } else {
      // Placeholder for sending OTP to email
      setMessage({ type: "success", text: "OTP sent to your email" });
      setActiveStep(1);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ type: "error", text: "Please enter the OTP" });
    } else {
      // Placeholder for OTP verification
      setMessage({
        type: "success",
        text: "OTP verified. Please set your new password.",
      });
      setActiveStep(2);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long",
      });
    } else if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
    } else {
      // Placeholder for password reset logic
      setMessage({
        type: "success",
        text: "Password has been reset successfully",
      });
      // Here you would typically redirect to the login page
    }
  };

  const steps = ["Enter Email", "Enter OTP", "Set New Password"];

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ height: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ width: "100%", mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box
            component="form"
            onSubmit={handleEmailSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Registered Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send OTP
            </Button>
          </Box>
        )}
        {activeStep === 1 && (
          <Box
            component="form"
            onSubmit={handleOtpSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <OtpInput otp={otp} setOtp={setOtp} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Verify OTP
            </Button>
          </Box>
        )}
        {activeStep === 2 && (
          <Box
            component="form"
            onSubmit={handlePasswordSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
          </Box>
        )}
        {message && (
          <Alert severity={message.type} sx={{ mt: 2, width: "100%" }}>
            {message.text}
          </Alert>
        )}
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
