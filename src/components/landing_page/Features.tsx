import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { palette } from "../../themes/theme";
import { AutoMode, Email, SecurityRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Container from "@mui/material/Container";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router";

// Wrap MUI components with motion
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);
const MotionButton = motion(Button);

const Features = () => {
  // References for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const featureCardVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.2,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 25px rgba(140, 158, 255, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

  // Floating particles animation
  const Particles = () => (
    <MotionBox
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {[...Array(15)].map((_, i) => (
        <MotionBox
          key={i}
          sx={{
            position: "absolute",
            width: i % 3 === 0 ? "10px" : i % 3 === 1 ? "15px" : "8px",
            height: i % 3 === 0 ? "10px" : i % 3 === 1 ? "15px" : "8px",
            borderRadius: "50%",
            background:
              i % 3 === 0
                ? "rgba(140, 158, 255, 0.2)"
                : i % 3 === 1
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(140, 158, 255, 0.1)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </MotionBox>
  );

  return (
    <MotionBox
      id="features"
      component={motion.section}
      ref={sectionRef}
      sx={{
        backgroundColor: palette.global.background,
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Background particles */}
      <Particles />

      {/* Animated light beam */}
      <MotionBox
        sx={{
          position: "absolute",
          width: "200%",
          height: "20px",
          background:
            "linear-gradient(90deg, rgba(140,158,255,0) 0%, rgba(140,158,255,0.1) 50%, rgba(140,158,255,0) 100%)",
          transform: "rotate(35deg)",
          left: "-50%",
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.3, 0],
          top: ["0%", "100%", "0%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      <Container maxWidth="lg">
        <MotionBox
          component={motion.div}
          variants={containerVariants}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Grid columns={{ sm: 8, md: 16 }} container>
            <Grid size={8}>
              <MotionTypography
                component={motion.div}
                variants={itemVariants}
                variant="subtitle1"
                fontWeight={500}
                fontSize={20}
                sx={{ color: "#fff" }}
              >
                <motion.span
                  initial={{ color: "#fff" }}
                  animate={{
                    color: ["#fff", "#8C9EFF", "#fff"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Features
                </motion.span>
              </MotionTypography>

              <MotionTypography
                component={motion.div}
                variants={itemVariants}
                variant="h2"
                component={"h2"}
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
                      "0 0 5px rgba(140, 158, 255, 0)",
                      "0 0 15px rgba(140, 158, 255, 0.3)",
                      "0 0 5px rgba(140, 158, 255, 0)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Explore Our Advanced School Management Features
                </motion.span>
              </MotionTypography>
            </Grid>

            <Grid size={8}>
              <MotionTypography
                component={motion.div}
                variants={itemVariants}
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
              </MotionTypography>
            </Grid>
          </Grid>

          <MotionGrid
            component={motion.div}
            variants={containerVariants}
            container
            spacing={{ xs: 4, md: 6 }}
            columns={{ sm: 1, md: 32 }}
            alignItems="center"
            justifyItems={"center"}
            sx={{ textAlign: { xs: "center", md: "left", my: 1.3 } }}
          >
            {featuresContent.map((feature, index) => (
              <MotionGrid
                component={motion.div}
                custom={index}
                variants={featureCardVariants}
                whileHover="hover"
                size={10}
                key={index}
              >
                <MotionBox
                  component={motion.div}
                  sx={{
                    padding: 3,
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Icon with animation */}
                  <MotionBox
                    component={motion.div}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: [0, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </MotionBox>

                  {/* Feature highlight glow effect */}
                  <MotionBox
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "radial-gradient(circle at center, rgba(140, 158, 255, 0.1) 0%, rgba(140, 158, 255, 0) 70%)",
                      opacity: 0,
                    }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <MotionTypography
                    component={motion.p}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    sx={{ margin: "10px 0" }}
                    fontSize={"1.3rem"}
                    fontWeight={600}
                    color="#fff"
                  >
                    {feature.title}
                  </MotionTypography>

                  <MotionTypography
                    component={motion.p}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    fontWeight={300}
                    color="#fff"
                  >
                    {feature.subtitle}
                  </MotionTypography>
                </MotionBox>
              </MotionGrid>
            ))}
          </MotionGrid>

          <MotionBox
            component={motion.div}
            variants={containerVariants}
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "center", md: "flex-start" },
              mt: 4,
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
              <Link to={"/sign-up"}>Sign Up</Link>
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
            >
              Learn More
            </MotionButton>
          </MotionBox>
        </MotionBox>
      </Container>
    </MotionBox>
  );
};

export default Features;
