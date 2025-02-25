import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2"; // MUI v6 "Grid2" import
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const Features3 = () => {
  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
        backgroundColor: "#121212",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          // direction={{ xs: "column", md: "row" }}
          columns={{ sm: 1, md: 16 }}
          alignItems="center"
        >
          {/* Left content section */}
          <Grid spacing={{ xs: 12, md: 6 }} size={8}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
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
                component="h1"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                Streamline School Operations for Success
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#FFFFFF",
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Our School Management System enhances efficiency and simplifies
                daily tasks. Experience seamless integration of academic,
                administrative, and financial functions
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  my: 3,
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Box>
                  <Typography
                    component={"p"}
                    sx={{ mb: 1 }}
                    color="#fff"
                    fontWeight={700}
                  >
                    For Teachers
                  </Typography>
                  <Typography component={"p"} color="#fff">
                    Simplify Lesson planning and track student progress with
                    ease
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    component={"p"}
                    sx={{ mb: 1 }}
                    color="#fff"
                    fontWeight={700}
                  >
                    For Schools
                  </Typography>
                  <Typography component={"p"} color="#fff">
                    Manage schools effortlessly and focus on student process
                  </Typography>
                </Box>
              </Box>
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
            </Box>
          </Grid>

          {/* Right image section */}
          <Grid spacing={{ xs: 12, md: 6 }} size={8}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "300px", sm: "400px", md: "500px" },
                overflow: "hidden",
                borderRadius: 2,
                margin: "0 auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src="/hero.jpg" // Replace with your actual image path
                alt="Person working on a laptop in a cozy environment"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Features3;
