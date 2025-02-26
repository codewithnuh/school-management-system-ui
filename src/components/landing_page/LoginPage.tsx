"use client";

import type React from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  School as TeacherIcon,
  Person as StudentIcon,
  ChildCare as ParentIcon,
} from "@mui/icons-material";

type Role = "Administrator" | "Teacher" | "Student" | "Parent";

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for login logic
    if (!selectedRole) {
      setError("Please select a role");
    } else if (!email || !password) {
      setError("Please enter both email and password");
    } else {
      setError(null);
      console.log("Login attempt", {
        role: selectedRole,
        email,
        password,
        rememberMe,
      });
    }
  };

  const roleCards: { role: Role; icon: React.ReactNode }[] = [
    { role: "Administrator", icon: <AdminIcon /> },
    { role: "Teacher", icon: <TeacherIcon /> },
    { role: "Student", icon: <StudentIcon /> },
    { role: "Parent", icon: <ParentIcon /> },
  ];

  return (
    <Box sx={{ background: "black" }}>
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
                      onClick={() => setSelectedRole(role)}
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
                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
                <Grid
                  container
                  justifyContent={isMobile ? "center" : "flex-end"}
                >
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      variant="body2"
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
