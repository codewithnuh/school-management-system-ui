import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../../../theme/darkTheme";
import styled from "@mui/material/styles/styled";

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  color: "#fff",
}));

const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  height: "120px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
  },
}));

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number | string;
  description: string;
}) {
  return (
    <StatBox elevation={3}>
      <Typography variant="h4" component="div" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="caption" color="text.disabled" mt={1}>
        {description}
      </Typography>
    </StatBox>
  );
}

export default function OwnerDashboard() {
  // These are placeholder values — you'll replace them with real data from your backend
  const stats = {
    totalTeachers: 47,
    totalStudents: 982,
    totalClasses: 34,
    activeSchools: 5,
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Page Title */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            School Management Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Overview of all schools and users in the system
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Teachers"
              value={stats.totalTeachers}
              description="Total teachers registered across all schools"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Students"
              value={stats.totalStudents}
              description="Currently enrolled students"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Classes"
              value={stats.totalClasses}
              description="Active classes created"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Schools"
              value={stats.activeSchools}
              description="Number of active institutions"
            />
          </Grid>
        </Grid>

        {/* Additional Content Area */}
        <Box mt={6}>
          <GlassCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is your admin dashboard. From here, you can monitor
                activity, manage schools, view analytics, and generate reports.
              </Typography>
            </CardContent>
          </GlassCard>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
