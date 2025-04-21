import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2"; // MUI v6 "Grid2" import
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import { motion } from "motion/react";
import { useRef } from "react";

// Wrap MUI components with motion
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const Hero = () => {
  const constraintsRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
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

  const floatingElements = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  // Decorative elements for education theme
  const EducationalElements = () => (
    <MotionBox
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      ref={constraintsRef}
    >
      {/* Graduation Cap */}
      <MotionBox
        component={motion.div}
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          color: "rgba(255, 255, 255, 0.15)",
          fontSize: "3rem",
        }}
        variants={floatingElements}
        initial="initial"
        animate="animate"
        whileHover={{ scale: 1.2, color: "rgba(255, 255, 255, 0.3)" }}
      >
        <SchoolIcon fontSize="inherit" />
      </MotionBox>

      {/* Mathematical Symbols */}
      {["+", "÷", "×", "=", "π", "∑"].map((symbol, index) => (
        <MotionBox
          key={index}
          component={motion.div}
          drag
          dragConstraints={constraintsRef}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
          sx={{
            position: "absolute",
            top: `${15 + index * 12}%`,
            right: `${5 + index * 3}%`,
            color: "rgba(255, 255, 255, 0.1)",
            fontSize: "2rem",
            fontWeight: "bold",
            cursor: "grab",
          }}
          animate={{
            y: [0, -(index + 1) * 5, 0],
            opacity: [0.1, 0.2, 0.1],
            transition: {
              duration: 3 + index,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
          whileHover={{ scale: 1.3, color: "rgba(255, 255, 255, 0.4)" }}
        >
          {symbol}
        </MotionBox>
      ))}
    </MotionBox>
  );

  return (
    <MotionBox
      initial={{ backgroundColor: "#090909" }}
      animate={{ backgroundColor: "#121212" }}
      transition={{ duration: 1.5 }}
      sx={{
        py: { xs: 4, md: 6 },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <EducationalElements />

      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          columns={{ sm: 1, md: 16 }}
          alignItems="center"
        >
          {/* Left content section */}
          <Grid spacing={{ xs: 12, md: 6 }} size={8}>
            <MotionBox
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              sx={{
                textAlign: { xs: "center", md: "left" },
                order: { xs: 2, md: 1 },
              }}
            >
              <MotionTypography
                component={motion.div}
                variants={itemVariants}
                variant="overline"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                <motion.span
                  initial={{ color: "#FFFFFF" }}
                  animate={{
                    color: ["#FFFFFF", "#8C9EFF", "#FFFFFF"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Empower Education
                </motion.span>
              </MotionTypography>

              <MotionTypography
                variants={itemVariants}
                variant="h3"
                component="h1"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 5px rgba(150, 150, 255, 0)",
                      "0 0 15px rgba(150, 150, 255, 0.5)",
                      "0 0 5px rgba(150, 150, 255, 0)",
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Transforming School Management for the Future
                </motion.span>
              </MotionTypography>

              <MotionTypography
                component={motion.div}
                variants={itemVariants}
                variant="body1"
                sx={{
                  color: "#FFFFFF",
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Our School Management System streamlines operations through
                robust authentication, efficient academic management, and
                comprehensive financial oversight. Experience seamless
                integration of all school functions in one powerful platform.
              </MotionTypography>

              <MotionBox
                component={motion.div}
                variants={itemVariants}
                sx={{
                  display: "flex",
                  gap: 2,
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
                  size="large"
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
                  size="large"
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

          {/* Right image section */}
          <Grid spacing={{ xs: 12, md: 6 }} size={8}>
            <MotionBox
              component={motion.div}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "300px", sm: "400px", md: "500px" },
                overflow: "hidden",
                borderRadius: 2,
                margin: "0 auto",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                order: { xs: 1, md: 2 },
              }}
            >
              {/* Animated overlay for the image */}
              <MotionBox
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1, delay: 1 }}
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, #8C9EFF, transparent)",
                  zIndex: 1,
                }}
              />

              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                }}
                src="/hero.jpg" // Replace with your actual image path
                alt="Person working on a laptop in a cozy environment"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Animated border */}
              <MotionBox
                component={motion.div}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(140, 158, 255, 0)",
                    "0 0 0 4px rgba(140, 158, 255, 0.3)",
                    "0 0 0 0 rgba(140, 158, 255, 0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 2,
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </MotionBox>
  );
};

export default Hero;
