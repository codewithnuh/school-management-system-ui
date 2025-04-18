"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router"; // Import from react-router-dom

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
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  School as TeacherIcon,
  Person as StudentIcon,
  ChildCare as ParentIcon,
} from "@mui/icons-material";
import { useUser } from "../../hooks/useUser";

type Role = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  statusCode: number;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });

  const { data: user, isSuccess: userIsSuccess } = useUser();

  useEffect(() => {
    if (userIsSuccess && user) {
      if (user.data.role) {
        navigate(`/dashboard/${user.data.role.toLowerCase()}`);
      }
    }
  }, [user, userIsSuccess, navigate]);

  const loginMutation = useMutation({
    mutationFn: async () => {
      if (!selectedRole) {
        throw new Error("Please select a role");
      }

      const response = await fetch(
        // "https://school-management-system-production-366e.up.railway.app/api/v1/auth/login",
        "http://localhost:3000/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, entityType: selectedRole }),
          credentials: "include",
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid server response");
      }

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Login failed");
      }

      return data;
    },
    onSuccess: () => {
      // after successfully logging in refetch the user
      navigate(`/dashboard/${selectedRole!.toLowerCase()}`);
      // because the backend might set the cookies after login
      // this will trigger the use effect up there and navigate to dashboard
      // This will also cause the login button to "disappear" as the component reloads
      // after successful login
      // queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      // navigate(`/${role.toLowerCase()}/dashboard`);
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const roleCards = [
    { role: "ADMIN", icon: <AdminIcon /> },
    { role: "TEACHER", icon: <TeacherIcon /> },
    { role: "STUDENT", icon: <StudentIcon /> },
    { role: "PARENT", icon: <ParentIcon /> },
  ];

  return (
    <Box sx={{ background: "black", mt: { xs: 17.5, sm: 15, md: 0, lg: 8 } }}>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ height: "100vh", display: "flex", alignItems: "center" }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Login to School Management System
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Select Your Role
              </Typography>
              <Grid container spacing={2}>
                {roleCards.map(({ role, icon }) => (
                  <Grid item xs={6} key={role}>
                    <Card
                      raised={selectedRole === role}
                      onClick={() => setSelectedRole(role as Role)}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.3s",
                        transform:
                          selectedRole === role ? "scale(1.05)" : "scale(1)",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <Box sx={{ mb: 2 }}>{icon}</Box>
                        <Typography variant="body1">{role}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box component="form" onSubmit={handleLogin} noValidate>
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
                />
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
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link to="/forgot-password">Forgot password?</Link>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
