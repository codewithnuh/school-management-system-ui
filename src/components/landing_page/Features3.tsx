import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2"; // MUI v6 "Grid2" import
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Create Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionGrid = motion(Grid);

const Features3 = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.2,
      },
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  // Education-themed decorative elements (paper, books, etc.)
  const EducationDecorations = () => (
    <MotionBox
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Floating book icons */}
      {[...Array(5)].map((_, i) => (
        <MotionBox
          key={`book-${i}`}
          initial={{
            opacity: 0,
            scale: 0.7,
            x: i % 2 === 0 ? -50 : 50,
            y: 30 + i * 35,
            rotate: i % 2 === 0 ? 15 : -15,
          }}
          animate={
            isInView
              ? {
                  opacity: 0.07,
                  x: i % 2 === 0 ? -80 : 80,
                  y: 30 + i * 35 - 10,
                  rotate: i % 2 === 0 ? 10 : -10,
                }
              : {}
          }
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            top: `${10 + i * 15}%`,
            left: `${i % 2 === 0 ? 5 : 85}%`,
            color: "white",
            fontSize: { xs: 30, md: 40 },
          }}
        >
          {i % 2 === 0 ? (
            <MenuBookIcon fontSize="inherit" />
          ) : (
            <SchoolIcon fontSize="inherit" />
          )}
        </MotionBox>
      ))}

      {/* Paper-like floating elements */}
      {[...Array(3)].map((_, i) => (
        <MotionBox
          key={`paper-${i}`}
          initial={{
            opacity: 0,
            right: `${20 + i * 25}%`,
            top: `${60 - i * 15}%`,
            rotate: i % 2 === 0 ? 5 : -5,
          }}
          animate={
            isInView
              ? {
                  opacity: 0.05,
                  y: [0, -15, 0],
                  rotate: i % 2 === 0 ? [5, 8, 5] : [-5, -8, -5],
                }
              : {}
          }
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            width: { xs: 100, md: 150 },
            height: { xs: 130, md: 200 },
            background: "white",
            borderRadius: "4px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Lines on the paper */}
          {[...Array(6)].map((_, j) => (
            <Box
              key={`line-${i}-${j}`}
              sx={{
                position: "absolute",
                top: `${30 + j * 14}%`,
                left: "15%",
                width: "70%",
                height: "2px",
                backgroundColor: "rgba(0,0,0,0.1)",
              }}
            />
          ))}
        </MotionBox>
      ))}
    </MotionBox>
  );

  // Page turn effect for image
  const PageTurnImage = () => {
    return (
      <MotionBox
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "300px", sm: "400px", md: "500px" },
          overflow: "hidden",
          borderRadius: 2,
          margin: "0 auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          perspective: "1200px",
        }}
      >
        {/* Main image */}
        <MotionBox
          whileHover={{ rotateY: -5 }}
          transition={{ duration: 0.5 }}
          sx={{
            position: "absolute",
            inset: 0,
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            background: "#000",
          }}
        >
          <motion.img
            initial={{ scale: 1.1 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            src="/school-managment.jpg"
            alt="School management interface with students and teachers"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </MotionBox>

        {/* Page corner effect */}
        <MotionBox
          initial={{ rotateY: 0 }}
          whileHover={{ rotateY: -30 }}
          transition={{ duration: 0.5 }}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "80px",
            height: "80px",
            backgroundColor: "#f1f1f1",
            transformOrigin: "right top",
            background: "linear-gradient(135deg, transparent 50%, #f1f1f1 50%)",
            zIndex: 2,
            cursor: "pointer",
            "&:after": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%)",
              pointerEvents: "none",
            },
          }}
        >
          <MotionBox
            animate={{
              opacity: [0, 1, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            sx={{
              position: "absolute",
              bottom: "15px",
              left: "10px",
              color: "#555",
              transform: "rotate(-45deg)",
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            Hover me
          </MotionBox>
        </MotionBox>
      </MotionBox>
    );
  };

  // Feature List with simple animation
  const FeatureList = () => {
    const items = [
      "Track attendance digitally",
      "Manage grades & assignments",
      "Streamline communication",
      "Schedule classes efficiently",
    ];

    return (
      <Box sx={{ mt: 2 }}>
        {items.map((item, index) => (
          <MotionBox
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            <MotionBox
              animate={{
                scale: [1, 1.2, 1],
                color: ["#8C9EFF", "#90CAF9", "#8C9EFF"],
              }}
              transition={{
                duration: 2,
                delay: index * 0.3,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              sx={{ mr: 1, color: "#8C9EFF" }}
            >
              <CheckCircleIcon fontSize="small" />
            </MotionBox>
            <Typography variant="body2" color="white">
              {item}
            </Typography>
          </MotionBox>
        ))}
      </Box>
    );
  };

  return (
    <MotionBox
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      sx={{
        py: { xs: 4, md: 6 },
        backgroundColor: "#121212",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Educational decorative elements */}
      <EducationDecorations />

      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          columns={{ sm: 1, md: 16 }}
          alignItems="center"
        >
          {/* Left content section */}
          <MotionGrid spacing={{ xs: 12, md: 6 }} size={8} variants={fadeIn}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                position: "relative",
                zIndex: 1,
              }}
            >
              <MotionTypography
                variant="overline"
                initial={{ opacity: 0, y: -10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  mb: 1,
                  display: "block",
                }}
              >
                <motion.span
                  animate={{
                    color: ["#FFFFFF", "#8C9EFF", "#FFFFFF"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Empower Education
                </motion.span>
              </MotionTypography>

              {/* Writing text effect */}
              <MotionTypography
                variant="h3"
                component="h1"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  position: "relative",
                }}
              >
                <motion.span
                  initial={{ width: "0%" }}
                  animate={isInView ? { width: "100%" } : { width: "0%" }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                  style={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  Streamline School
                </motion.span>
                <br />
                <motion.span
                  initial={{ width: "0%" }}
                  animate={isInView ? { width: "100%" } : { width: "0%" }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                  style={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  Operations for Success
                </motion.span>
              </MotionTypography>

              <MotionTypography
                variant="body1"
                variants={fadeIn}
                transition={{ delay: 0.4 }}
                sx={{
                  color: "#FFFFFF",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                Our School Management System enhances efficiency and simplifies
                daily tasks. Experience seamless integration of academic,
                administrative, and financial functions.
              </MotionTypography>

              {/* Feature list with check icons */}
              <FeatureList />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  my: 3,
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <MotionBox
                  variants={fadeIn}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Typography
                    component="p"
                    sx={{ mb: 1 }}
                    color="#fff"
                    fontWeight={700}
                  >
                    For Teachers
                  </Typography>
                  <Typography component="p" color="#fff">
                    Simplify lesson planning and track student progress with
                    ease
                  </Typography>
                </MotionBox>

                <MotionBox
                  variants={fadeIn}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Typography
                    component="p"
                    sx={{ mb: 1 }}
                    color="#fff"
                    fontWeight={700}
                  >
                    For Schools
                  </Typography>
                  <Typography component="p" color="#fff">
                    Manage schools effortlessly and focus on student process
                  </Typography>
                </MotionBox>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <MotionButton
                  custom={0}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  variant="contained"
                  size="large"
                  color="secondary"
                  sx={{
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Sign Up
                </MotionButton>

                <MotionButton
                  custom={1}
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
              </Box>
            </Box>
          </MotionGrid>

          {/* Right image section with page turn effect */}
          <MotionGrid
            spacing={{ xs: 12, md: 6 }}
            size={8}
            variants={fadeIn}
            transition={{ delay: 0.3 }}
          >
            <PageTurnImage />
          </MotionGrid>
        </Grid>
      </Container>
    </MotionBox>
  );
};

export default Features3;
