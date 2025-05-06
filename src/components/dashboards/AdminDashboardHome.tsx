import {
  Container,
  Grid,
  Paper,
  Typography,
  styled,
  ThemeProvider,
  Box,
} from "@mui/material";
import { darkTheme } from "../../theme/darkTheme";
import { useGetSchoolAdminId } from "../../services/queries/school";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router";

// --- Glass-styled container ---
const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  height: "100%",
}));

const AdminDashboardHome = () => {
  const navigate = useNavigate();
  const { data: userData } = useUser();
  console.log(userData);
  const adminId = userData?.data.role == "ADMIN" ? userData.data.user.id : "";
  if (adminId == "") navigate("/login");
  console.log(adminId);
  const { data } = useGetSchoolAdminId(adminId as number, !!adminId);
  console.log(data);
  // Mock data (replace with actual data from API later)
  const schoolData = {
    name: "Bright Future Academy",
    brandColor: "#00C9A7",
    students: 420,
    teachers: 28,
    classes: 12,
    sections: 36,
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
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
              <Typography variant="body1">{schoolData.name}</Typography>
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Brand Color
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: schoolData.brandColor,
                    border: "2px solid white",
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
              <Typography variant="h4">{schoolData.students}</Typography>
            </GlassCard>
          </Grid>

          {/* Teacher Count */}
          <Grid item xs={12} md={3}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Teachers
              </Typography>
              <Typography variant="h4">{schoolData.teachers}</Typography>
            </GlassCard>
          </Grid>

          {/* Classes */}
          <Grid item xs={12} md={3}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Total Classes
              </Typography>
              <Typography variant="h4">{schoolData.classes}</Typography>
            </GlassCard>
          </Grid>

          {/* Sections */}
          <Grid item xs={12} md={3}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Total Sections
              </Typography>
              <Typography variant="h4">{schoolData.sections}</Typography>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default AdminDashboardHome;
