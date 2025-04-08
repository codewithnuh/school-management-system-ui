import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function Footer() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url(/discover.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          py: { xs: 8, md: 12 },
          mb: -1,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 500,
              mb: 2,
              maxWidth: 600,
            }}
          >
            Discover Our School Management System
          </Typography>
          <Typography sx={{ mb: 4, maxWidth: 500 }}>
            Transform your school operations with our comprehensive management
            system. Request a demo today!
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "black",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
              }}
            >
              Learn More
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": { borderColor: "rgba(255,255,255,0.9)" },
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box sx={{ bgcolor: "black", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Newsletter Section */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "cursive",
                  mb: 3,
                }}
              >
                Logo
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Subscribe to our newsletter for the latest updates on features
                and releases.
              </Typography>
              <TextField
                fullWidth
                placeholder="Your email here"
                variant="outlined"
                size="small"
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "black",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
              >
                Subscribe
              </Button>
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 1, opacity: 0.7 }}
              >
                By subscribing, you consent to our Privacy Policy and agree to
                receive updates.
              </Typography>
            </Grid>

            {/* Resources Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Resources
              </Typography>
              <Stack spacing={1}>
                {["About Us", "Contact Us", "Careers", "Blog", "Support"].map(
                  (item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: "white",
                        opacity: 0.7,
                        textDecoration: "none",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item}
                    </Link>
                  )
                )}
              </Stack>
            </Grid>

            {/* Connect Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Connect
              </Typography>
              <Stack spacing={1}>
                {[
                  "Newsletter",
                  "Events",
                  "Community",
                  "Partners",
                  "Testimonials",
                ].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    sx={{
                      color: "white",
                      opacity: 0.7,
                      textDecoration: "none",
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* Follow Us Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Follow Us
              </Typography>
              <Stack spacing={1}>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    opacity: 0.7,
                    textDecoration: "none",
                    "&:hover": { opacity: 1 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <FacebookIcon /> Facebook
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    opacity: 0.7,
                    textDecoration: "none",
                    "&:hover": { opacity: 1 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <InstagramIcon /> Instagram
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    opacity: 0.7,
                    textDecoration: "none",
                    "&:hover": { opacity: 1 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <TwitterIcon /> Twitter
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    opacity: 0.7,
                    textDecoration: "none",
                    "&:hover": { opacity: 1 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LinkedInIcon /> LinkedIn
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    opacity: 0.7,
                    textDecoration: "none",
                    "&:hover": { opacity: 1 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <YouTubeIcon /> YouTube
                </Link>
              </Stack>
            </Grid>
          </Grid>

          {/* Bottom Bar */}
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              mt: 6,
              pt: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2024 Resume. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link
                href="#"
                sx={{
                  color: "white",
                  opacity: 0.7,
                  textDecoration: "none",
                  "&:hover": { opacity: 1 },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                sx={{
                  color: "white",
                  opacity: 0.7,
                  textDecoration: "none",
                  "&:hover": { opacity: 1 },
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                sx={{
                  color: "white",
                  opacity: 0.7,
                  textDecoration: "none",
                  "&:hover": { opacity: 1 },
                }}
              >
                Cookie Settings
              </Link>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
