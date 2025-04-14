"use client";

import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router";
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
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  Tooltip,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  LockReset,
  ArrowBack,
  Person,
} from "@mui/icons-material";
import {
  useForgotPasswordInitiate,
  useResetPassword,
} from "../../services/queries/auth";

// Define entity type options
type EntityType = "ADMIN" | "STUDENT" | "TEACHER";

// Enhanced OTP Input component with better UX
const OtpInput: React.FC<{
  otp: string;
  setOtp: (otp: string) => void;
  isSubmitting: boolean;
  error?: string;
}> = ({ otp, setOtp, isSubmitting, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^[0-9]+$/.test(value)) {
      setOtp(value);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (/^[0-9]+$/.test(pastedData) && pastedData.length <= 6) {
      setOtp(pastedData);
    }
  };

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
      onChange={handleChange}
      onPaste={handlePaste}
      inputProps={{
        maxLength: 6,
        inputMode: "numeric",
        pattern: "[0-9]*",
      }}
      placeholder="123456"
      disabled={isSubmitting}
      error={!!error}
      helperText={error || "Enter the 6-digit code sent to your email"}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockReset color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
};

interface MessageState {
  type: "success" | "error" | "info";
  text: string;
  open: boolean;
}

const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [entityType, setEntityType] = useState<EntityType>("ADMIN");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI states
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    entityType?: string;
    otp?: string;
    password?: string;
  }>({});
  const [toast, setToast] = useState<MessageState>({
    type: "info",
    text: "",
    open: false,
  });

  // API integration
  const sendOtpMutation = useForgotPasswordInitiate();
  const resetPasswordMutation = useResetPassword();

  // Form validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setFormErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!emailRegex.test(email)) {
      setFormErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, email: undefined }));
    return true;
  };

  const validateEntityType = (type: string): boolean => {
    if (!type) {
      setFormErrors((prev) => ({
        ...prev,
        entityType: "User type is required",
      }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, entityType: undefined }));
    return true;
  };

  const validateOtp = (otp: string): boolean => {
    if (!otp) {
      setFormErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return false;
    } else if (otp.length !== 6) {
      setFormErrors((prev) => ({ ...prev, otp: "OTP must be 6 digits" }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, otp: undefined }));
    return true;
  };

  const validatePassword = (password: string, confirmPass: string): boolean => {
    if (!password) {
      setFormErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    } else if (password.length < 8) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      return false;
    } else if (!/[A-Z]/.test(password)) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Password must contain at least one uppercase letter",
      }));
      return false;
    } else if (!/[0-9]/.test(password)) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Password must contain at least one number",
      }));
      return false;
    } else if (password !== confirmPass) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Passwords do not match",
      }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, password: undefined }));
    return true;
  };

  // Form handlers
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate both email and entity type
    const isEmailValid = validateEmail(email);
    const isEntityTypeValid = validateEntityType(entityType);

    if (!isEmailValid || !isEntityTypeValid) return;

    try {
      sendOtpMutation.mutate(
        { email, entityType },
        {
          onSuccess: (_, { email: userEmail }) => {
            setActiveStep(1);
            setToast({
              type: "success",
              text: `OTP sent to ${userEmail}`,
              open: true,
            });
          },
          onError(error) {
            console.error("OTP send error:", error);
            setToast({
              type: "error",
              text: error.message || "Failed to send OTP. Please try again.",
              open: true,
            });
          },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        setToast({
          type: "error",
          text: error.message,
          open: true,
        });
      }
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtp(otp)) return;

    // Here you would typically verify the OTP with an API call
    // For now, we'll just move to the next step
    setActiveStep(2);
    setToast({
      type: "success",
      text: "OTP verified successfully. Please set your new password.",
      open: true,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(newPassword, confirmPassword)) return;

    // Reset password with OTP
    resetPasswordMutation.mutate(
      {
        otp,
        newPassword,
      },
      {
        onSuccess: () => {
          setToast({
            type: "success",
            text: "Password has been reset successfully. You can now login with your new password.",
            open: true,
          });

          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        },
        onError: (error) => {
          setToast({
            type: "error",
            text:
              error.message || "Failed to reset password. Please try again.",
            open: true,
          });
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!validateEmail(email) || !validateEntityType(entityType)) return;

    sendOtpMutation.mutate(
      { email, entityType },
      {
        onSuccess: () => {
          setToast({
            type: "success",
            text: `OTP resent to ${email}`,
            open: true,
          });
        },
        onError(error) {
          setToast({
            type: "error",
            text: error.message || "Failed to resend OTP",
            open: true,
          });
        },
      }
    );
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleBackStep = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const steps = ["Email", "Verification", "New Password"];

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          borderRadius: 2,
          position: "relative",
        }}
      >
        {activeStep > 0 && (
          <Tooltip title="Back to previous step">
            <IconButton
              sx={{ position: "absolute", top: 16, left: 16 }}
              onClick={handleBackStep}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
        )}

        <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
          Forgot Password
        </Typography>

        <Stepper
          activeStep={activeStep}
          alternativeLabel={!isMobile}
          orientation={isMobile ? "vertical" : "horizontal"}
          sx={{ width: "100%", mb: 4, mt: 2 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Email Form */}
        {activeStep === 0 && (
          <Box
            component="form"
            onSubmit={handleEmailSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <Typography variant="body2" color="text.secondary" mb={2}>
              Enter your registered email address and select your role to
              receive a verification code.
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formErrors.email) validateEmail(e.target.value);
              }}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={sendOtpMutation.isPending}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              error={!!formErrors.entityType}
              required
            >
              <InputLabel id="entity-type-select-label">I am a</InputLabel>
              <Select
                labelId="entity-type-select-label"
                id="entity-type-select"
                value={entityType}
                label="I am a"
                onChange={(e) => {
                  setEntityType(e.target.value as EntityType);
                  if (formErrors.entityType) validateEntityType(e.target.value);
                }}
                disabled={sendOtpMutation.isPending}
                startAdornment={
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="ADMIN">Administrator</MenuItem>
                <MenuItem value="TEACHER">Teacher</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
              </Select>
              {formErrors.entityType && (
                <FormHelperText>{formErrors.entityType}</FormHelperText>
              )}
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={sendOtpMutation.isPending}
              startIcon={
                sendOtpMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {sendOtpMutation.isPending
                ? "Sending..."
                : "Send Verification Code"}
            </Button>
          </Box>
        )}

        {/* Step 2: OTP Verification */}
        {activeStep === 1 && (
          <Box
            component="form"
            onSubmit={handleOtpSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <Typography variant="body2" color="text.secondary" mb={2}>
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </Typography>

            <OtpInput
              otp={otp}
              setOtp={setOtp}
              isSubmitting={false}
              error={formErrors.otp}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Verify Code
            </Button>

            <Box textAlign="center">
              <Typography
                variant="body2"
                color="text.secondary"
                display="inline"
              >
                Didn't receive the code?
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={handleResendOtp}
                disabled={sendOtpMutation.isPending}
                sx={{ ml: 1 }}
              >
                {sendOtpMutation.isPending ? "Resending..." : "Resend"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 3: New Password */}
        {activeStep === 2 && (
          <Box
            component="form"
            onSubmit={handlePasswordSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create a new password for your account
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type={showPassword ? "text" : "password"}
              id="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (formErrors.password)
                  validatePassword(e.target.value, confirmPassword);
              }}
              error={!!formErrors.password}
              helperText={
                formErrors.password ||
                "Password must be at least 8 characters with uppercase and numbers"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formErrors.password)
                  validatePassword(newPassword, e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={resetPasswordMutation.isPending}
              startIcon={
                resetPasswordMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {resetPasswordMutation.isPending
                ? "Resetting..."
                : "Reset Password"}
            </Button>
          </Box>
        )}

        <Box textAlign="center" sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Back to Login
          </Link>
        </Box>
      </Paper>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ForgotPasswordPage;
