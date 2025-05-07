import {
  Container,
  Grid,
  Paper,
  Typography,
  styled,
  ThemeProvider,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { darkTheme } from "../../../theme/darkTheme";
import { useGetSchoolAdminId } from "../../../services/queries/school";
import { useUser } from "../../../hooks/useUser";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { Add } from "@mui/icons-material";

// --- Glass-styled container ---
const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  height: "100%",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5)",
  },
}));

const AdminDashboardHome = () => {
  const navigate = useNavigate();
  const { data: userData } = useUser();

  // Redirect non-admins
  const adminId = userData?.data.role === "ADMIN" ? userData.data.user.id : "";
  useEffect(() => {
    if (!adminId) {
      navigate("/login");
    }
  }, [adminId, navigate]);

  // Fetch school data
  const {
    data: SchoolData,
    error,
    isLoading,
  } = useGetSchoolAdminId(adminId as number, !!adminId);

  // Safely extract school data
  const school = SchoolData?.data || {
    name: "Loading...",
    brandColor: "#ffffff33",
    students: 0,
    teachers: 0,
    classes: 0,
    sections: 0,
  };

  // Conditional rendering based on loading/error states
  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6" mt={2}>
            Loading school information...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load school data. Please try again later.
          </Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" sx={{ py: 1 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Admin
        </Typography>

        <Grid container spacing={4}>
          {/* School Info */}
          <Grid item xs={12} md={6}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                School Name
              </Typography>
              <Typography variant="body1">{school.name}</Typography>
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Brand Color
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: school.brandColor,
                    border: "2px solid white",
                    boxShadow: `0 0 8px ${school.brandColor}`,
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      boxShadow: `0 0 16px ${school.brandColor}`,
                    },
                  }}
                />
              </Box>
            </GlassCard>
          </Grid>

          {/* Student Count */}
          <Grid item xs={12} md={3}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Students Enrolled
              </Typography>
              <Typography variant="h4">{school.students}</Typography>
            </GlassCard>
          </Grid>

          {/* Teacher Count */}
          <Grid item xs={12} md={3}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Teachers
              </Typography>
              <Button
                sx={{
                  color: "white",
                  background: "green",
                }}
              >
                <Link to={"/dashboard/admin/teacher/create"}>
                  <span style={{ display: "flex" }}>
                    <Add /> Teacher
                  </span>
                </Link>
              </Button>
            </GlassCard>
          </Grid>

          {/* Classes */}
          <Grid item xs={12} md={3}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Total Classes
              </Typography>
              <Typography variant="h4">{school.classes}</Typography>
            </GlassCard>
          </Grid>

          {/* Sections */}
          <Grid item xs={12} md={3}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Total Sections
              </Typography>
              <Typography variant="h4">{school.sections}</Typography>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Teacher Registration Link
              </Typography>
              <Button
                color="primary"
                variant="contained"
                sx={{
                  background: "green",
                }}
              >
                Generate
              </Button>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Student Registration Link
              </Typography>
              <Button
                color="primary"
                variant="contained"
                sx={{
                  background: "green",
                }}
              >
                Generate
              </Button>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default AdminDashboardHome;
