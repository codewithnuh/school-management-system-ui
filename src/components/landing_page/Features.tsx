import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { palette } from "../../themes/theme";
import { AutoMode, Email, SecurityRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const Features = () => {
  const featuresContent = [
    {
      icon: <Email sx={{ color: "#fff", fontSize: "2rem" }} />,
      title: "Seamless Email Service Integration",
      subtitle:
        "Effortlessly manage communication with integrated email service",
    },
    {
      icon: <AutoMode sx={{ color: "#fff", fontSize: "2rem" }} />,
      title: "Automated Cron Jobs for efficient management",
      subtitle:
        "Schedule tasks automatically to enhance operational efficiency",
    },
    {
      icon: <SecurityRounded sx={{ color: "#fff", fontSize: "2rem" }} />,
      title: "Robust JWT Authentication for Security",
      subtitle: "Ensure secure access with our JWT-based authentication",
    },
  ];
  return (
    <Box
      component={"section"}
      sx={{ backgroundColor: palette.global.background, padding: "80px 0" }}
    >
      <Box component={"div"} className="container">
        <Grid columns={{ sm: 8, md: 16 }} container>
          <Grid size={8}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              fontSize={20}
              sx={{ color: "#fff" }}
            >
              Feature
            </Typography>

            <Typography
              variant="h2"
              component={"h2"}
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Explore Our Advanced School Management Features
            </Typography>
          </Grid>
          <Grid size={8}>
            <Typography
              variant="body1"
              component={"p"}
              sx={{
                color: "#FFFFFF",
                mb: 2,
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
              }}
            >
              Our School Management System comes packed with powerful features
              designed to streamline operations and enhance productivity. From
              user management to financial tracking, we cover every aspect of
              school administration. Discover how our innovative tools can
              transform your educational institution.
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          // direction={{ xs: "column", md: "row" }}
          columns={{ sm: 1, md: 32 }}
          sx={{ my: 1.3 }}
          alignItems="center"
        >
          {featuresContent.map((feature, index) => (
            <Grid size={10} key={index}>
              <Box component={"div"}>
                {feature.icon}
                <Typography
                  component={"p"}
                  sx={{ margin: "3px 0" }}
                  fontSize={"1.3rem"}
                  fontWeight={600}
                  color="#fff"
                >
                  {feature.title}
                </Typography>
                <Typography component={"p"} fontWeight={300} color="#fff">
                  {feature.subtitle}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Button
            variant="contained"
            size="small"
            color="secondary"
            sx={{
              px: 3,
              py: 1.5,
              my: 1,
            }}
          >
            Sign Up
          </Button>

          <Button
            variant="text"
            size="small"
            color="secondary"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 3,
              py: 1.5,
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Features;
