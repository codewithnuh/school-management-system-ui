import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion, useInView, useAnimationControls } from "motion/react";
import { useRef, useEffect } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Link } from "react-router";

// Create motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);
const MotionButton = motion(Button);

const EmpowerSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const instructionsControls = useAnimationControls();

  useEffect(() => {
    if (isInView) {
      instructionsControls.start("visible");
    } else {
      instructionsControls.start("hidden");
    }
  }, [isInView, instructionsControls]);

  const instructions = [
    {
      imgUrl: "/laptop.jpg",
      title: "Setup Your School Management System Effortlessly",
      subtitle:
        "We provide a straightforward setup process to get you started quickly",
      icon: <AccessTimeIcon />,
      color: "#8C9EFF",
    },
    {
      imgUrl: "/exams.jpg",
      title: "Manage Your Classes and Exams with Ease",
      subtitle:
        "Our tools simplify scheduling and administration, saving you time",
      icon: <TrendingUpIcon />,
      color: "#90CAF9",
    },
    {
      imgUrl: "/progress.jpg",
      title: "Track Student Progress in Real-Time",
      subtitle:
        "Stay updated with comprehensive analytics and reporting features",
      icon: <EmojiEventsIcon />,
      color: "#81C784",
    },
  ];

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3 + i * 0.1,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    },
    tap: { scale: 0.98 },
  };

  const instructionCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2 + i * 0.2,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -10,
      boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
      transition: {
        duration: 0.3,
      },
    },
  };

  // Custom animated underline component
  const AnimatedUnderline = ({ color = "#8C9EFF", delay = 0 }) => (
    <MotionBox
      initial={{ width: 0 }}
      animate={isInView ? { width: "100%" } : { width: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeInOut",
      }}
      sx={{
        height: "2px",
        background: `linear-gradient(to right, ${color}, transparent)`,
        marginTop: "4px",
        marginBottom: "16px",
      }}
    />
  );

  // Animated progress bar for instruction cards
  const ProgressBar = ({ active, color }) => (
    <MotionBox
      initial={{ width: 0 }}
      animate={active ? { width: "100%" } : { width: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      sx={{
        height: "3px",
        background: color,
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 2,
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
      }}
    />
  );

  return (
    <MotionBox
      component="section"
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      sx={{
        background: "black",
        py: "4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background gradient */}
      <MotionBox
        animate={{
          background: [
            "radial-gradient(circle at 10% 50%, rgba(140, 158, 255, 0.03) 0%, rgba(0, 0, 0, 0) 50%)",
            "radial-gradient(circle at 90% 50%, rgba(140, 158, 255, 0.03) 0%, rgba(0, 0, 0, 0) 50%)",
            "radial-gradient(circle at 10% 50%, rgba(140, 158, 255, 0.03) 0%, rgba(0, 0, 0, 0) 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Left content section */}
          <MotionGrid
            size={{ xs: 12, md: 16 }}
            sx={{
              textAlign: { xs: "center", md: "left" },
              order: { xs: 2, md: 1 },
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
                Empower
              </motion.span>
            </MotionTypography>

            <MotionTypography
              variant="h3"
              component="h3"
              variants={titleVariants}
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Transforming School Management for the Future
            </MotionTypography>

            <AnimatedUnderline delay={0.3} />

            <MotionTypography
              variant="body1"
              variants={textVariants}
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
            </MotionTypography>

            <MotionBox
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
                    transition: "all 0.5s",
                  },
                  "&:hover:before": {
                    left: "100%",
                  },
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
            </MotionBox>
          </MotionGrid>
        </Grid>

        {/* Instructions section */}
        <MotionGrid
          container
          spacing={4}
          sx={{ mt: 4 }}
          justifyContent="center"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate={instructionsControls}
        >
          {instructions.map((instruction, index) => (
            <MotionGrid
              component={motion.div}
              key={index}
              size={{ xs: 12, sm: 6, md: 4 }}
              custom={index}
              variants={instructionCardVariants}
              whileHover="hover"
              sx={{
                textAlign: { sm: "center", md: "left" },
                zIndex: 1,
              }}
            >
              <MotionBox
                sx={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  mb: 2,
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(to bottom, transparent 70%, ${instruction.color}30)`,
                    zIndex: 1,
                  },
                }}
              >
                {/* Floating icon indicator */}
                <MotionBox
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.5 + index * 0.2,
                  }}
                  sx={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: instruction.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    zIndex: 2,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 5, 0, -5, 0],
                      scale: [1, 1.1, 1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      delay: 1 + index * 0.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    {instruction.icon}
                  </motion.div>
                </MotionBox>

                <motion.img
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  src={instruction.imgUrl}
                  alt={instruction.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                  }}
                />

                {/* Progress bar */}
                <ProgressBar active={isInView} color={instruction.color} />
              </MotionBox>

              <MotionTypography
                fontWeight={600}
                my={1}
                fontSize={"1.3rem"}
                color="#fff"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.2,
                }}
              >
                {instruction.title}
              </MotionTypography>

              <MotionTypography
                fontWeight={200}
                color="#fff"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + index * 0.2,
                }}
              >
                {instruction.subtitle}
              </MotionTypography>
            </MotionGrid>
          ))}
        </MotionGrid>

        <MotionBox
          sx={{
            display: "flex",
            gap: 2,
            my: 4,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
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
                transition: "all 0.5s",
              },
              "&:hover:before": {
                left: "100%",
              },
            }}
          >
            <Link to={"/sign-up"}>Sign Up</Link>
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
        </MotionBox>
      </Container>
    </MotionBox>
  );
};

export default EmpowerSection;
