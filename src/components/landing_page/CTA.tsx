import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// Wrap MUI components with motion
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionContainer = motion(Container);

const CTA = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect for the image
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
    },
    tap: {
      scale: 0.95,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
  };

  // Floating decoration elements
  const FloatingIcons = () => (
    <MotionBox
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {[SchoolIcon, BookIcon, EmojiEventsIcon].map((Icon, index) => (
        <MotionBox
          key={index}
          component={motion.div}
          sx={{
            position: "absolute",
            color: "rgba(255, 255, 255, 0.1)",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
          initial={{
            x: index * 150 + 100,
            y: index * 80 + 50,
            opacity: 0,
          }}
          animate={{
            opacity: 0.15,
            y: [index * 80 + 50, index * 80 + 30, index * 80 + 50],
            rotate: [0, index % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: index * 0.2 },
            y: {
              duration: 3 + index,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            rotate: {
              duration: 5 + index,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
        >
          <Icon fontSize="inherit" />
        </MotionBox>
      ))}
    </MotionBox>
  );

  return (
    <MotionBox
      id="about"
      ref={containerRef}
      className="cta"
      sx={{
        position: "relative",
        py: 8,
        backgroundImage:
          "linear-gradient(to bottom, #121212, #1A1A1A, #121212)",
        overflow: "hidden",
      }}
      initial={{ backgroundColor: "#121212" }}
      animate={{
        background: [
          "linear-gradient(to bottom, #121212, #1A1A1A, #121212)",
          "linear-gradient(to bottom, #141420, #1A1A2A, #141420)",
          "linear-gradient(to bottom, #121212, #1A1A1A, #121212)",
        ],
      }}
      transition={{ duration: 8, repeat: Infinity }}
    >
      {/* Decorative elements */}
      <FloatingIcons />

      {/* Light beam effect */}
      <MotionBox
        sx={{
          position: "absolute",
          width: "150%",
          height: "10px",
          background:
            "linear-gradient(90deg, rgba(140,158,255,0) 0%, rgba(140,158,255,0.2) 50%, rgba(140,158,255,0) 100%)",
          transform: "rotate(-45deg)",
          left: "-25%",
          top: "30%",
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.7, 0],
          top: ["30%", "80%", "30%"],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      <MotionContainer
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <MotionBox
          component={motion.div}
          style={{ y: imageY, opacity, scale }}
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "300px", sm: "400px", md: "500px" },
            overflow: "hidden",
            borderRadius: 2,
            py: { xs: 4, md: 6 },
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            mb: 6,
          }}
        >
          {/* Overlay with animated gradient */}
          <MotionBox
            component={motion.div}
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(140,158,255,0.3), transparent)",
              zIndex: 1,
              borderRadius: "20px",
            }}
            animate={{
              background: [
                "linear-gradient(135deg, rgba(140,158,255,0.3), transparent)",
                "linear-gradient(135deg, rgba(140,158,255,0.1), transparent)",
                "linear-gradient(135deg, rgba(140,158,255,0.3), transparent)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <motion.img
            src="/notebook.webp" // Replace with your actual image path
            alt="Person working on a laptop in a cozy environment"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              borderRadius: "20px",
            }}
            whileInView={{
              scale: [1, 1.05, 1],
              transition: { duration: 10, repeat: Infinity },
            }}
          />

          {/* Animated border effect */}
          <MotionBox
            component={motion.div}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0)",
              zIndex: 2,
            }}
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(140,158,255,0)",
                "0 0 0 4px rgba(140,158,255,0.2)",
                "0 0 0 0px rgba(140,158,255,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </MotionBox>

        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          columns={{ sm: 1, md: 16 }}
          alignItems="center"
        >
          <Grid size={8}>
            <MotionTypography
              component={motion.div}
              variants={itemVariants}
              variant="h3"
              component="h3"
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                position: "relative",
              }}
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 5px rgba(140,158,255,0)",
                    "0 0 15px rgba(140,158,255,0.3)",
                    "0 0 5px rgba(140,158,255,0)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Transform Your School Management Experience Today
              </motion.span>
            </MotionTypography>
          </Grid>

          <Grid size={8}>
            <MotionBox component={motion.div} variants={itemVariants}>
              <MotionTypography
                component={motion.p}
                variant="body1"
                color="#fff"
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Our School Management System streamlines academic,
                administrative, and financial operations, making it easier for
                schools to manage their daily tasks. Experience enhanced
                efficiency and improved communication with our user-friendly
                platform.
              </MotionTypography>

              <MotionBox
                component={motion.div}
                variants={itemVariants}
                sx={{
                  display: "flex",
                  gap: 2,
                  margin: "20px 0",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <MotionButton
                  component={motion.button}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  variant="contained"
                  size="small"
                  color="secondary"
                  sx={{
                    px: 3,
                    py: 1.5,
                    position: "relative",
                    overflow: "hidden",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      transition: "all 0.6s",
                    },
                    "&:hover:before": {
                      left: "100%",
                    },
                  }}
                >
                  Sign Up
                </MotionButton>

                <MotionButton
                  component={motion.button}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  variant="text"
                  size="small"
                  color="secondary"
                  endIcon={
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowForwardIcon />
                    </motion.div>
                  }
                  sx={{
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Learn More
                </MotionButton>
              </MotionBox>
            </MotionBox>
          </Grid>
        </Grid>
      </MotionContainer>
    </MotionBox>
  );
};

export default CTA;
