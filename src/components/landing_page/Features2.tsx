import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import SecurityIcon from "@mui/icons-material/Security";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleIcon from "@mui/icons-material/People";
import Container from "@mui/material/Container";
const features = [
  {
    icon: <PeopleIcon fontSize="large" />,
    title:
      "Experience seamless user management for admins, teachers, and parents.",
    description:
      "Our system simplifies academic operations, ensuring efficient class and exam management.",
    buttonText: "Learn More",
  },
  {
    icon: <PaymentIcon fontSize="large" />,
    title:
      "Effortlessly manage financial operations with our comprehensive fee tracking system.",
    description:
      "Track payments and manage fee structures with ease and accuracy.",
    buttonText: "Sign Up",
  },
  {
    icon: <SecurityIcon fontSize="large" />,
    title: "Robust security features ensure your data is safe and secure.",
    description:
      "With JWT authentication and password encryption, your information is protected.",
    buttonText: "Get Started",
  },
];

const Features2 = () => {
  return (
    <Box sx={{ backgroundColor: "#121212", padding: "80px 0", color: "#fff" }}>
      <Container>
        <Typography
          component={"h2"}
          fontWeight={700}
          fontSize={"1.9rem"}
          maxWidth={900}
          margin={"0 auto"}
          textAlign={"center"}
          variant="h2"
        >
          Discover how our School Management System streamlines your educational
          operations.
        </Typography>

        <Grid
          container
          columns={{ sm: 16, md: 32 }}
          alignItems={"top"}
          sx={{
            my: 10,
            gap: 12,
          }}
          justifyContent={"center"}
        >
          {features.map((feature, index) => (
            <Grid key={index} size={8} textAlign={"center"}>
              <Box component={"div"}>
                {feature.icon}
                <Typography
                  variant="h3"
                  sx={{ my: 1.2 }}
                  fontWeight={500}
                  fontSize={"1.6rem"}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={400}
                  fontSize={"1.4rem"}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features2;
