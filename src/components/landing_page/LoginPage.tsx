"use client";
import { useState, useEffect } from "react";
// Correct import for react-router v6+
import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";

import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Box,
  Snackbar,
  Alert,
  AlertColor,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  School as TeacherIcon,
  Person as StudentIcon,
} from "@mui/icons-material";

import { useUser } from "../../hooks/useUser";

// --- Constants ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Types ---
// Ensure Role type matches the possible entityType values from your backend
type Role = "ADMIN" | "TEACHER" | "USER"; // Changed USER to STUDENT to match entityType

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  statusCode: number;
  data?: any;
}

// --- Component ---
const LoginPage = () => {
  // --- Hooks ---
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    data: userResponse,
    isLoading: userIsLoading,
    isSuccess: userIsSuccess,
    refetch: refetchUser,
  } = useUser();
  console.log(userResponse);
  // --- State ---
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });

  // --- Effects ---
  // Redirect user if already logged in and user data is available
  useEffect(() => {
    // Check if fetching is done, was successful, and user data/entityType exists
    if (!userIsLoading && userIsSuccess && userResponse?.data?.role) {
      // Use entityType as the source of truth for the role
      const userRole = userResponse.data.role;

      let redirectPath: string;

      switch (userRole) {
        case "ADMIN":
          console.log("This is admin");
          // Redirect admin to their default page (e.g., teacher applications)
          redirectPath = "/dashboard/admin/applications/teachers";
          break;
        case "TEACHER":
          // Redirect teacher to their default page (e.g., classes)
          redirectPath = "/dashboard/teacher/classes";
          break;
        case "USER":
          // *** Redirect student directly to their profile page ***
          redirectPath = "/dashboard/user/profile";
          break;
        default:
          console.warn("Unknown user role/entityType:", userRole);
          // Fallback to home page if role is unknown
          navigate("/");
          return; // Exit early
      }

      console.log(
        `User already logged in as ${userRole}. Redirecting to ${redirectPath}`
      );
      navigate(redirectPath); // Use the determined redirect path
    }
    // This effect runs when the component mounts and whenever the user's status changes.
  }, [userResponse, userIsLoading, userIsSuccess, navigate]);

  // --- Mutations ---
  const loginMutation = useMutation({
    mutationFn: async (): Promise<ApiResponse> => {
      if (!selectedRole) {
        throw new Error("Please select a role");
      }

      const response = await fetch(`${API_BASE_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, entityType: selectedRole }), // Send entityType
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        const errorText = await response.text();
        console.error("Server Error:", response.status, errorText);
        throw new Error(
          `Login failed: ${response.statusText || "Server error"}. ${errorText}`
        );
      }

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || data.message || "Login failed");
      }

      return data;
    },
    onSuccess: async (data) => {
      setSnackbar({
        open: true,
        message: data.message || "Login successful!",
        severity: "success",
      });

      // Refetch user data *before* navigation relies on the useEffect
      await refetchUser();
      // The useEffect hook will handle the navigation to the correct specific path
      // (e.g., /dashboard/user/profile) once the user state is updated.
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message:
          error.message ||
          "Login failed. Please check your credentials or role.",
        severity: "error",
      });
    },
  });

  // --- Event Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setSnackbar({
        open: true,
        message: "Please select a role.",
        severity: "warning",
      });
      return;
    }
    if (!email || !password) {
      setSnackbar({
        open: true,
        message: "Please enter email and password.",
        severity: "warning",
      });
      return;
    }
    loginMutation.mutate();
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  // --- Data for Rendering ---
  // Use STUDENT entityType for the Student card
  const roleCards = [
    {
      role: "ADMIN" as Role,
      icon: <AdminIcon fontSize="large" />,
      label: "Admin",
    },
    {
      role: "TEACHER" as Role,
      icon: <TeacherIcon fontSize="large" />,
      label: "Teacher",
    },
    {
      role: "USER" as Role, // Use STUDENT to match entityType
      icon: <StudentIcon fontSize="large" />,
      label: "Student",
    },
  ];

  // --- Render ---

  // Show loading indicator while checking user status initially
  if (userIsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e1e2f 0%, #121212 100%)",
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2, color: "#fff" }}>
          Checking login status...
        </Typography>
      </Box>
    );
  }

  // If user is already logged in, the useEffect will redirect.
  // Render the login form if not loading and not yet redirected.
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1e1e2f 0%, #121212 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 0 },
      }}
    >
      <Container component="main" maxWidth="md">
        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.1),
            backdropFilter: "blur(12px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            color: theme.palette.text.primary,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 3,
              color: theme.palette.primary.main,
            }}
          >
            Login
          </Typography>

          <Grid container spacing={4} alignItems="stretch">
            {/* === Role Selection Section === */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  textAlign: "center",
                  mb: 2,
                  color: theme.palette.text.secondary,
                }}
              >
                Select Your Role
              </Typography>
              <Grid container spacing={2}>
                {roleCards.map(({ role, icon, label }) => (
                  <Grid item xs={6} key={role}>
                    <Card
                      onClick={() => handleRoleSelect(role)}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                        transform:
                          selectedRole === role ? "scale(1.05)" : "scale(1)",
                        border:
                          selectedRole === role
                            ? `2px solid ${theme.palette.primary.light}`
                            : `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        backgroundColor:
                          selectedRole === role
                            ? alpha(theme.palette.primary.main, 0.15)
                            : alpha(theme.palette.background.default, 0.2),
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: `0 0 15px ${alpha(
                            theme.palette.primary.main,
                            0.4
                          )}`,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          textAlign: "center",
                          color: theme.palette.text.primary,
                        }}
                      >
                        <Box
                          sx={{
                            mb: 1,
                            color:
                              selectedRole === role
                                ? theme.palette.primary.light
                                : "inherit",
                          }}
                        >
                          {icon}
                        </Box>
                        <Typography variant="body1">{label}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {/* === Login Form Section === */}
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                onSubmit={handleLogin}
                noValidate
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Email Input */}
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
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{
                    sx: { color: alpha(theme.palette.text.primary, 0.7) },
                  }}
                  InputProps={{
                    sx: {
                      color: theme.palette.text.primary,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.divider, 0.4),
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.light,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                {/* Password Input */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{
                    sx: { color: alpha(theme.palette.text.primary, 0.7) },
                  }}
                  InputProps={{
                    sx: {
                      color: theme.palette.text.primary,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.divider, 0.4),
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.light,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                {/* Remember Me Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{ color: alpha(theme.palette.text.primary, 0.7) }}
                    />
                  }
                  label="Remember me"
                  sx={{ mt: 1, color: alpha(theme.palette.text.primary, 0.9) }}
                />
                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold" }}
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </Button>
                {/* Links */}
                <Grid
                  container
                  justifyContent="space-between"
                  sx={{ mt: "auto" }} // Push links to bottom
                >
                  <Grid item>
                    <Link
                      to="/forgot-password"
                      style={{
                        color: theme.palette.primary.light,
                        textDecoration: "none",
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
                {/* Specific Registration Links */}
                <Grid
                  container
                  spacing={1}
                  justifyContent="flex-end"
                  sx={{ mt: 1 }}
                >
                  <Grid item>
                    <Link
                      to="/register/student"
                      style={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.8rem",
                        textDecoration: "none",
                      }}
                    >
                      Register as Student
                    </Link>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.8rem",
                    }}
                  >
                    |
                  </Grid>{" "}
                  {/* Separator */}
                  <Grid item>
                    <Link
                      to="/register/teacher"
                      style={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.8rem",
                        textDecoration: "none",
                      }}
                    >
                      Register as Teacher
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Snackbar for Notifications */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
