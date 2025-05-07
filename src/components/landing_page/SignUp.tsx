import { useState } from "react";
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
  createTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSignUpMutation } from "../../services/queries/auth";
import { Link } from "react-router";

// --- Pure dark glassmorphic theme ---
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2e2e2e" }, // Deep dark neutral
    background: {
      default: "#0d0d0d", // Almost black background
      paper: "rgba(20, 20, 20, 0.9)", // Slightly transparent dark card
    },
    text: { primary: "#ffffff" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.15)",
            },
            "&:hover fieldset": {
              borderColor: "#555", // subtle hover
            },
          },
        },
      },
    },
  },
});

// --- Glass-styled container ---
const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
}));

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  // State for toast notification
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Handle toast close
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };
  const SignUpMutation = useSignUpMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    SignUpMutation.mutate(formData, {
      onSuccess(data, variables, context) {
        setToast({
          message: "Account created successfully",
          open: true,
          severity: "success",
        });
        setLoading(false);
      },
      onError(error) {
        if (error) {
          console.log(error);
          setToast({
            message: error.response.data.error,
            open: true,
            severity: "error",
          });
          setLoading(false);
        }
      },
    });
    // setTimeout(() => {
    //   setLoading(false);
    //   setToastOpen(true);
    //   console.log("Form submitted:", formData);
    // }, 1500);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <GlassPaper>
            <Typography variant="h4" align="center" gutterBottom>
              Create Your Account
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
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
              </Grid>

              <Box textAlign="center" mt={4}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
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
                  {loading ? "Creating..." : "Register"}
                </Button>
              </Box>
              <Box display={"flex"} justifyContent={"space-between"} mt={3}>
                <div style={{ opacity: 0 }} />
                <Link to={"/login"}>Login</Link>
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

export default SignUp;
