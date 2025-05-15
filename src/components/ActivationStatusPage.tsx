import {
  Container,
  Paper,
  Typography,
  Button,
  styled,
  ThemeProvider,
  CircularProgress,
  Box,
} from "@mui/material";
import { darkTheme } from "../theme/darkTheme";
import { useGetSubscriptionStatus } from "../services/queries/admin";
import { useUser } from "../hooks/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  textAlign: "center",
}));

const ActivationStatusPage = () => {
  const { data: userData } = useUser();
  const adminId = userData?.data.user.id;
  const navigate = useNavigate();

  const { data, isPending, isError } = useGetSubscriptionStatus(
    adminId!,
    !!adminId
  );
  console.log(data);
  useEffect(() => {
    if (data?.data?.isSubscriptionActive) {
      navigate("/dashboard/admin");
    }
  }, [data, navigate]);

  if (isPending) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <GlassPaper>
            <Box display="flex" flexDirection="column" alignItems="center">
              <CircularProgress color="success" />
              <Typography mt={2}>Checking activation status...</Typography>
            </Box>
          </GlassPaper>
        </Container>
      </ThemeProvider>
    );
  }

  if (isError) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <GlassPaper>
            <Typography variant="h6" color="error">
              Failed to fetch activation status. Please try again later.
            </Typography>
          </GlassPaper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <GlassPaper>
          <Typography variant="h4" gutterBottom>
            Awaiting Activation
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Your school has been created,but your account is not yet activated.
            Maybe You haven't clear the payment
            <br />
            Please contact our team on WhatsApp to activate your admin access.
          </Typography>

          <Button
            variant="contained"
            color="success"
            href="https://wa.me/919999999999"
            target="_blank"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 5,
              fontWeight: "bold",
              backgroundColor: "#25D366",
              "&:hover": {
                backgroundColor: "#1EBE57",
                color: "white",
              },
            }}
          >
            Contact on WhatsApp
          </Button>
        </GlassPaper>
      </Container>
    </ThemeProvider>
  );
};

export default ActivationStatusPage;
