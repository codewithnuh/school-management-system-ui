import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid2";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import SchoolIcon from "@mui/icons-material/School";

// Create Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionAvatar = motion(Avatar);
const MotionRating = motion(Rating);
const MotionGrid = motion(Grid);

// Expanded testimonial data with more examples
const testimonials = [
  {
    rating: 5,
    text: "The School Management System has streamlined our operations, making everything more efficient and user-friendly. We've saved countless hours on administrative tasks.",
    author: {
      name: "John Doe",
      role: "Principal, ABC School",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-26%20093721-LA9vFAbqlMXcm0o7Btz9VYZDL846rn.png",
    },
  },
  {
    rating: 5,
    text: "As a teacher, I appreciate the ease of managing classes and grades seamlessly. The system has transformed how we track student progress and communicate with parents.",
    author: {
      name: "Jane Smith",
      role: "Teacher, XYZ Academy",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-26%20093721-LA9vFAbqlMXcm0o7Btz9VYZDL846rn.png",
    },
  },
  {
    rating: 4,
    text: "The attendance tracking and reporting features have been invaluable. Our school has significantly improved parent communication with the integrated messaging system.",
    author: {
      name: "Robert Johnson",
      role: "Administrator, Lincoln High",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-26%20093721-LA9vFAbqlMXcm0o7Btz9VYZDL846rn.png",
    },
  },
];

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index, isActive }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  return (
    <MotionGrid
      id="testimonial"
      ref={cardRef}
      size={8}
      key={index}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.2,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      exit={{ opacity: 0, y: 30 }}
    >
      <MotionBox
        whileHover={{
          y: -10,
          boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
        }}
        transition={{ duration: 0.3 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          background: "rgba(255, 255, 255, 0.03)",
          padding: 3,
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Background gradient animation */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 0%, #8C9EFF, transparent 70%)",
            zIndex: -1,
          }}
        />

        {/* Quotation mark */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
          sx={{
            position: "absolute",
            right: "20px",
            top: "20px",
            fontSize: "4rem",
            color: "white",
            zIndex: 0,
          }}
        >
          <FormatQuoteIcon fontSize="inherit" />
        </MotionBox>

        <MotionRating
          value={testimonial.rating}
          readOnly
          sx={{
            "& .MuiRating-icon": {
              color: "white",
            },
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 + index * 0.2 }}
        />

        <MotionTypography
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
          sx={{
            fontSize: "1.1rem",
            lineHeight: 1.5,
            fontStyle: "italic",
            opacity: 0.9,
            position: "relative",
            zIndex: 1,
          }}
        >
          "{testimonial.text}"
        </MotionTypography>

        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: "auto", // Push to bottom
          }}
        >
          <MotionAvatar
            src={testimonial.author.image}
            alt={testimonial.author.name}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.7 + index * 0.2,
            }}
            whileHover={{ scale: 1.1 }}
            sx={{
              width: 48,
              height: 48,
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          />
          <Box>
            <MotionTypography
              sx={{ fontWeight: 500 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.8 + index * 0.2,
              }}
            >
              {testimonial.author.name}
            </MotionTypography>
            <MotionTypography
              sx={{ opacity: 0.8, fontSize: "0.875rem" }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.9 + index * 0.2,
              }}
            >
              {testimonial.author.role}
            </MotionTypography>
          </Box>
          <MotionTypography
            sx={{
              ml: "auto",
              opacity: 0.8,
              fontSize: "0.875rem",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{
              duration: 0.3,
              delay: 1 + index * 0.2,
            }}
          >
            Verified
          </MotionTypography>
        </MotionBox>
      </MotionBox>
    </MotionGrid>
  );
};

// Floating School Icons Component
const FloatingSchoolIcons = () => {
  return (
    <MotionBox
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {[...Array(6)].map((_, i) => (
        <MotionBox
          key={`school-icon-${i}`}
          initial={{
            opacity: 0,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
          }}
          animate={{
            opacity: 0.07,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            rotate: Math.random() * 20 - 10,
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            fontSize: 30 + i * 5,
            color: "white",
            top: `${10 + i * 15}%`,
            left: `${10 + i * 15}%`,
          }}
        >
          <SchoolIcon fontSize="inherit" />
        </MotionBox>
      ))}
    </MotionBox>
  );
};

// Main Testimonials Component
export default function Testimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Auto slide testimonials every 5 seconds
  useEffect(() => {
    if (!isAutoSliding) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoSliding]);

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "80px",
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // Indicators for the active testimonial
  const Indicators = () => (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1,
        mt: 4,
      }}
    >
      {testimonials.map((_, i) => (
        <MotionBox
          key={`indicator-${i}`}
          onClick={() => {
            setActiveIndex(i);
            setIsAutoSliding(false);
            // Resume auto sliding after 10 seconds of inactivity
            setTimeout(() => setIsAutoSliding(true), 10000);
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          sx={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor:
              i === activeIndex ? "#8C9EFF" : "rgba(255,255,255,0.3)",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        />
      ))}
    </MotionBox>
  );

  return (
    <MotionBox
      ref={sectionRef}
      sx={{
        bgcolor: "black",
        color: "white",
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingSchoolIcons />

      <Container maxWidth="lg">
        <MotionTypography
          variant="h3"
          sx={{ mb: 1, position: "relative", display: "inline-block" }}
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          User Testimonials
          <MotionBox
            variants={underlineVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            sx={{
              height: "4px",
              background: "linear-gradient(90deg, #8C9EFF, transparent)",
              position: "absolute",
              bottom: "-5px",
              left: 0,
            }}
          />
        </MotionTypography>

        <MotionTypography
          sx={{ mb: 6, opacity: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          See what educators and administrators say about our system.
        </MotionTypography>

        <AnimatePresence mode="wait">
          <Grid
            container
            spacing={4}
            columns={{ xs: 8, sm: 8, md: 12 }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`testimonial-${index}`}
                testimonial={testimonial}
                index={index}
                isActive={index === activeIndex}
              />
            ))}
          </Grid>
        </AnimatePresence>

        <Indicators />
      </Container>
    </MotionBox>
  );
}
