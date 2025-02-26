import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const EmpowerSection = () => {
  const instructions = [
    {
      imgUrl: "/hero.jpg",
      title: "Setup Your School Management System Effortlessly",
      subtitle:
        "We provide a straightforward setup process to get you started quickly",
    },
    {
      imgUrl: "/hero.jpg",
      title: "Manage Your Classes and Exams with Ease",
      subtitle:
        "Our tools simplify scheduling and administration, saving you time",
    },
    {
      imgUrl: "/hero.jpg",
      title: "Track Student Progress in Real-Time",
      subtitle:
        "Stay updated with comprehensive analytics and reporting features",
    },
  ];

  return (
    <Box component="section" sx={{ background: "black", py: "4rem" }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Left content section */}
          <Grid
            size={{ xs: 12, md: 16 }}
            sx={{
              textAlign: { xs: "center", md: "left" },
              order: { xs: 2, md: 1 },
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "#FFFFFF",
                fontWeight: 600,
                mb: 1,
                display: "block",
              }}
            >
              Empower
            </Typography>

            <Typography
              variant="h3"
              component="h3"
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Transforming School Management for the Future
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#FFFFFF",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Our School Management System streamlines operations through robust
              authentication, efficient academic management, and comprehensive
              financial oversight. Experience seamless integration of all school
              functions in one powerful platform.
            </Typography>

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
                size="large"
                color="secondary"
                sx={{
                  px: 3,
                  py: 1.5,
                }}
              >
                Sign Up
              </Button>

              <Button
                variant="text"
                size="large"
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
          </Grid>
        </Grid>

        {/* Instructions section */}
        <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
          {instructions.map((instruction, index) => (
            <Grid
              key={index}
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{ textAlign: { sm: "center", md: "left" } }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  mb: 2,
                }}
              >
                <img
                  src={instruction.imgUrl} // Ensure this path is correct
                  alt={instruction.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </Box>
              <Typography
                fontWeight={600}
                my={1}
                fontSize={"1.3rem"}
                color="#fff"
              >
                {instruction.title}
              </Typography>
              <Typography fontWeight={200} color="#fff">
                {instruction.subtitle}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            my: 4,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Button
            variant="contained"
            size="large"
            color="secondary"
            sx={{
              px: 3,
              py: 1.5,
            }}
          >
            Sign Up
          </Button>

          <Button
            variant="text"
            size="large"
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
      </Container>
    </Box>
  );
};

export default EmpowerSection;
