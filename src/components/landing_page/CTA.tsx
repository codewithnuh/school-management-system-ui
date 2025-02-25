import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
const CTA = () => {
  return (
    <div className="cta">
      <Container>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "300px", sm: "400px", md: "500px" },
            overflow: "hidden",
            borderRadius: 2,
            py: { xs: 4, md: 6 },
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
              borderRadius: "20px",
            }}
          />
        </Box>
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          // direction={{ xs: "column", md: "row" }}
          columns={{ sm: 1, md: 16 }}
          alignItems="center"
        >
          <Grid size={8}>
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
              Transform Your School Management Experience Today
            </Typography>
          </Grid>
          <Grid size={8}>
            <Box>
              <Typography variant="body1" color="#fff">
                Our School Management System streamlines academic,
                administrative, and financial operations, making it easier for
                schools to manage their daily tasks. Experience enhanced
                efficiency and improved communication with our user-friendly
                platform.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  padding: "10px 0",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
                component={"div"}
              >
                <Button variant="contained">Learn More</Button>
                <Button variant="outlined">Sign Up</Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default CTA;
