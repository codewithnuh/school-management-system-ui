import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  styled,
  ThemeProvider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLoginMutation } from "../../services/queries/auth";
import { Link, useNavigate } from "react-router";
import { darkTheme } from "../../theme/darkTheme";
import { useUser } from "../../hooks/useUser";

// --- Glass-styled container ---
const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
}));

const StudentLogin = () => {
  const { data: userData, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    entityType: "ADMIN",
    email: "",
    password: "",
    schoolCode: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const [loading, setLoading] = useState(false);

  const LoginMutation = useLoginMutation();

  // 🔁 Handle redirection only after user data is fetched
  useEffect(() => {
    if (!isUserLoading && userData?.data?.role === "ADMIN") {
      navigate("/dashboard/admin/activate");
    }
  }, [userData, isUserLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    LoginMutation.mutate(formData, {
      onSuccess: () => {
        setToast({
          message: "Login successful",
          open: true,
          severity: "success",
        });
        setLoading(false);
      },
      onError: (error) => {
        console.error("Login error:", error);
        setToast({
          message: "Failed to log in",
          open: true,
          severity: "error",
        });
        setLoading(false);
      },
    });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  // ⏳ Show loading while we check user status
  if (isUserLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box textAlign="center" mt={6}>
          <Typography>
            {" "}
            <CircularProgress size={24} />
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // 🔒 Don't show login form if user is already logged in
  if (userData?.data?.role === "ADMIN") {
    return null; // Or return a loading spinner until navigation kicks in
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <GlassPaper>
            <Typography variant="h4" align="center" gutterBottom>
              Login
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="schoolCode"
                    label="School Code"
                    type="text"
                    value={formData.schoolCode}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>

              <Box textAlign="center" mt={4}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || LoginMutation.isPending}
                  sx={{
                    px: 5,
                    py: 1.5,
                    width: "100%",
                    borderRadius: 5,
                    backgroundColor: "#1c1c1c",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                  }}
                >
                  {loading || LoginMutation.isPending
                    ? "Logging In..."
                    : "Login"}
                </Button>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={3}>
                <div style={{ opacity: 0 }} />

                <Link to="/forgot-password">Forgot Password</Link>
              </Box>
            </form>
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
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default StudentLogin;
