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
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";

export default function Footer() {
  const theme = useTheme();
  const [hovered, setHovered] = useState("");

  // Animation for hero buttons
  const [heroHovered, setHeroHovered] = useState(false);

  return (
    <Box>
      {/* Hero Section with animations */}
      <Box
        sx={{
          background:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url(/discover.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          py: { xs: 8, md: 12 },
          mb: -1,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            backgroundPosition: "center 25%",
          },
        }}
      >
        <Container maxWidth="lg">
          <Fade in={true} timeout={1000}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 500,
                mb: 2,
                maxWidth: 600,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  color: theme.palette.primary.main,
                },
              }}
            >
              Discover Our School Management System
            </Typography>
          </Fade>
          <Fade in={true} timeout={1500}>
            <Typography
              sx={{
                mb: 4,
                maxWidth: 500,
                transition: "opacity 0.3s ease",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Transform your school operations with our comprehensive management
              system. Request a demo today!
            </Typography>
          </Fade>
          <Stack
            direction="row"
            spacing={2}
            onMouseEnter={() => setHeroHovered(true)}
            onMouseLeave={() => setHeroHovered(false)}
          >
            <Zoom in={true} style={{ transitionDelay: "500ms" }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "black",
                  transition: "all 0.3s ease",
                  transform: heroHovered ? "translateY(-5px)" : "none",
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Learn More
              </Button>
            </Zoom>
            <Zoom in={true} style={{ transitionDelay: "700ms" }}>
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  transition: "all 0.3s ease",
                  transform: heroHovered ? "translateY(-5px)" : "none",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Sign Up
              </Button>
            </Zoom>
          </Stack>
        </Container>
      </Box>

      {/* Footer Section with animations */}
      <Box
        sx={{
          bgcolor: "black",
          color: "white",
          py: 6,
          transition: "background-color 0.3s ease",
          "&:hover": {
            bgcolor: "#0f0f0f",
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Newsletter Section */}
            <Grid item xs={12} md={3}>
              <Fade in={true} timeout={800}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "cursive",
                    mb: 3,
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Logo
                </Typography>
              </Fade>
              <Fade in={true} timeout={1000}>
                <Typography sx={{ mb: 2 }}>
                  Subscribe to our newsletter for the latest updates on features
                  and releases.
                </Typography>
              </Fade>
              <Fade in={true} timeout={1200}>
                <TextField
                  fullWidth
                  placeholder="Your email here"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 1,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                    },
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.3)",
                        transition: "border-color 0.3s ease",
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Fade>
              <Fade in={true} timeout={1400}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.primary.dark,
                    color: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: theme.palette.primary.main,
                      transform: "translateY(-3px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Fade>
              <Fade in={true} timeout={1600}>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, opacity: 0.7 }}
                >
                  By subscribing, you consent to our Privacy Policy and agree to
                  receive updates.
                </Typography>
              </Fade>
            </Grid>

            {/* Resources Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in={true} timeout={1000}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Resources
                </Typography>
              </Fade>
              <Stack spacing={1}>
                {["About Us", "Contact Us", "Careers", "Blog", "Support"].map(
                  (item, index) => (
                    <Fade in={true} timeout={1000 + index * 100} key={item}>
                      <Link
                        href="#"
                        onMouseEnter={() => setHovered(item)}
                        onMouseLeave={() => setHovered("")}
                        sx={{
                          color: "white",
                          opacity: hovered === item ? 1 : 0.7,
                          textDecoration: "none",
                          position: "relative",
                          paddingLeft: "10px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            opacity: 1,
                            color: theme.palette.primary.main,
                            transform: "translateX(5px)",
                          },
                          "&:before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            width: hovered === item ? "5px" : "0px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: theme.palette.primary.main,
                            transform: "translateY(-50%)",
                            transition: "width 0.3s ease",
                          },
                        }}
                      >
                        {item}
                      </Link>
                    </Fade>
                  )
                )}
              </Stack>
            </Grid>

            {/* Connect Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in={true} timeout={1200}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Connect
                </Typography>
              </Fade>
              <Stack spacing={1}>
                {[
                  "Newsletter",
                  "Events",
                  "Community",
                  "Partners",
                  "Testimonials",
                ].map((item, index) => (
                  <Fade in={true} timeout={1200 + index * 100} key={item}>
                    <Link
                      href="#"
                      onMouseEnter={() => setHovered(item)}
                      onMouseLeave={() => setHovered("")}
                      sx={{
                        color: "white",
                        opacity: hovered === item ? 1 : 0.7,
                        textDecoration: "none",
                        position: "relative",
                        paddingLeft: "10px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          opacity: 1,
                          color: theme.palette.primary.main,
                          transform: "translateX(5px)",
                        },
                        "&:before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          width: hovered === item ? "5px" : "0px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: theme.palette.primary.main,
                          transform: "translateY(-50%)",
                          transition: "width 0.3s ease",
                        },
                      }}
                    >
                      {item}
                    </Link>
                  </Fade>
                ))}
              </Stack>
            </Grid>

            {/* Follow Us Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Fade in={true} timeout={1400}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Follow Us
                </Typography>
              </Fade>
              <Stack spacing={1}>
                {[
                  { name: "Facebook", icon: <FacebookIcon /> },
                  { name: "Instagram", icon: <InstagramIcon /> },
                  { name: "Twitter", icon: <TwitterIcon /> },
                  { name: "LinkedIn", icon: <LinkedInIcon /> },
                  { name: "YouTube", icon: <YouTubeIcon /> },
                ].map((item, index) => (
                  <Fade in={true} timeout={1400 + index * 100} key={item.name}>
                    <Link
                      href="#"
                      onMouseEnter={() => setHovered(item.name)}
                      onMouseLeave={() => setHovered("")}
                      sx={{
                        color: "white",
                        opacity: hovered === item.name ? 1 : 0.7,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        transition: "all 0.3s ease",
                        transform:
                          hovered === item.name ? "translateX(5px)" : "none",
                        "&:hover": {
                          opacity: 1,
                          color: theme.palette.primary.main,
                        },
                        "& .MuiSvgIcon-root": {
                          transition: "transform 0.3s ease",
                          transform:
                            hovered === item.name ? "scale(1.2)" : "scale(1)",
                        },
                      }}
                    >
                      {item.icon} {item.name}
                    </Link>
                  </Fade>
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* Bottom Bar */}
          <Fade in={true} timeout={1800}>
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
                transition: "border-color 0.3s ease",
                "&:hover": {
                  borderTopColor: `rgba(${parseInt(
                    theme.palette.primary.main.slice(1, 3),
                    16
                  )}, ${parseInt(
                    theme.palette.primary.main.slice(3, 5),
                    16
                  )}, ${parseInt(
                    theme.palette.primary.main.slice(5, 7),
                    16
                  )}, 0.3)`,
                },
              }}
            >
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © 2024 School Management System. All rights reserved.
              </Typography>
              <Stack direction="row" spacing={3}>
                {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(
                  (item) => (
                    <Link
                      key={item}
                      href="#"
                      onMouseEnter={() => setHovered(item)}
                      onMouseLeave={() => setHovered("")}
                      sx={{
                        color: "white",
                        opacity: hovered === item ? 1 : 0.7,
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        position: "relative",
                        "&:hover": {
                          opacity: 1,
                          color: theme.palette.primary.main,
                        },
                        "&:after": {
                          content: '""',
                          position: "absolute",
                          bottom: -2,
                          left: 0,
                          width: hovered === item ? "100%" : "0%",
                          height: "1px",
                          backgroundColor: theme.palette.primary.main,
                          transition: "width 0.3s ease",
                        },
                      }}
                    >
                      {item}
                    </Link>
                  )
                )}
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}
