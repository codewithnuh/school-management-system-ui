import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import SecurityIcon from "@mui/icons-material/Security";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleIcon from "@mui/icons-material/People";
import Container from "@mui/material/Container";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
} from "motion/react";
import { useRef, useState, useEffect } from "react";
import { alpha } from "@mui/material";

// Create Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionContainer = motion(Container);
const MotionGrid = motion(Grid);

// Custom motion icon wrapper
const MotionIcon = ({ children, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconRef = useRef(null);

  return (
    <MotionBox
      ref={iconRef}
      component={motion.div}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        rotateY: isHovered ? [0, 360] : 0,
        scale: isHovered ? [1, 1.2, 1] : 1,
      }}
      transition={{
        rotateY: { duration: 1.5, ease: "easeInOut" },
        scale: { duration: 0.5, ease: "easeInOut" },
      }}
      sx={{
        display: "inline-flex",
        fontSize: "3rem",
        color: "#8C9EFF",
        filter: "drop-shadow(0 0 10px rgba(140, 158, 255, 0.5))",
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </MotionBox>
  );
};

const features = [
  {
    icon: <PeopleIcon fontSize="inherit" />,
    title:
      "Experience seamless user management for admins, teachers, and parents.",
    description:
      "Our system simplifies academic operations, ensuring efficient class and exam management.",
    buttonText: "Learn More",
    particleColor: "#8C9EFF", // Blue
  },
  {
    icon: <PaymentIcon fontSize="inherit" />,
    title:
      "Effortlessly manage financial operations with our comprehensive fee tracking system.",
    description:
      "Track payments and manage fee structures with ease and accuracy.",
    buttonText: "Sign Up",
    particleColor: "#90CAF9", // Light blue
  },
  {
    icon: <SecurityIcon fontSize="inherit" />,
    title: "Robust security features ensure your data is safe and secure.",
    description:
      "With JWT authentication and password encryption, your information is protected.",
    buttonText: "Get Started",
    particleColor: "#9FA8DA", // Indigo
  },
];

// Custom Neural Network / Knowledge Growth Animation Component
const NeuralNetworkAnimation = () => {
  const networkRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

  // Setup nodes and connections on mount
  useEffect(() => {
    if (!networkRef.current) return;

    const { width, height } = networkRef.current.getBoundingClientRect();
    setDimensions({ width, height });

    // Create nodes (knowledge points)
    const nodeCount = 15;
    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 3 + Math.random() * 5,
      color: features[i % 3].particleColor,
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
      },
    }));
    setNodes(newNodes);

    // Create connections between nodes
    const newConnections = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() > 0.7) {
          // Only connect some nodes
          newConnections.push({ from: i, to: j });
        }
      }
    }
    setConnections(newConnections);
  }, [networkRef.current]);

  // Update node positions with animation frame
  useEffect(() => {
    if (nodes.length === 0) return;

    const animate = () => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          // Update position based on velocity
          let newX = node.x + node.velocity.x;
          let newY = node.y + node.velocity.y;

          // Bounce off edges
          if (newX <= 0 || newX >= dimensions.width) {
            node.velocity.x *= -1;
            newX = Math.max(0, Math.min(newX, dimensions.width));
          }

          if (newY <= 0 || newY >= dimensions.height) {
            node.velocity.y *= -1;
            newY = Math.max(0, Math.min(newY, dimensions.height));
          }

          return {
            ...node,
            x: newX,
            y: newY,
          };
        })
      );
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [nodes, dimensions]);

  return (
    <MotionBox
      ref={networkRef}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        opacity: 0.4,
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%">
        {/* Draw connections */}
        {connections.map((connection, index) => {
          const fromNode = nodes[connection.from];
          const toNode = nodes[connection.to];
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`connection-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={alpha(fromNode.color, 0.3)}
              strokeWidth={0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.8, 0.8, 0],
                strokeWidth: [0.5, 1, 1, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.radius}
            fill={node.color}
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1, 1.5, 1],
              opacity: [0, 1, 0.8, 1],
              filter: [
                "drop-shadow(0 0 0px rgba(255, 255, 255, 0))",
                "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))",
                "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
                "drop-shadow(0 0 0px rgba(255, 255, 255, 0))",
              ],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </MotionBox>
  );
};

// Interactive 3D Feature Card Component
const FeatureCard = ({ feature, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position tracking for 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMouseX(x);
    setMouseY(y);
  };

  // Spring animations for smooth motion
  const rotateX = useSpring(0);
  const rotateY = useSpring(0);
  const cardScale = useSpring(1);

  useEffect(() => {
    if (isHovered) {
      rotateX.set(-(mouseY - 0.5) * 20); // Rotate based on mouse position
      rotateY.set((mouseX - 0.5) * 20);
      cardScale.set(1.03);
    } else {
      rotateX.set(0);
      rotateY.set(0);
      cardScale.set(1);
    }
  }, [mouseX, mouseY, isHovered]);

  // Growing line animation
  const lineWidth = useMotionValue(0);
  const lineOpacity = useTransform(lineWidth, [0, 100], [0, 1]);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        lineWidth.set(100);
      }, index * 300);
    } else {
      lineWidth.set(0);
    }
  }, [isInView, index]);

  return (
    <MotionGrid
      component={motion.div}
      ref={cardRef}
      size={8}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      sx={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      <MotionBox
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          scale: cardScale,
        }}
        sx={{
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          transformStyle: "preserve-3d",
          transform: "translateZ(0px)",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Feature-specific particle background */}
        <MotionBox
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            background: `radial-gradient(circle at center, ${feature.particleColor} 0%, transparent 70%)`,
            zIndex: -1,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Icon with 3D depth effect */}
        <MotionBox
          style={{
            transform: "translateZ(30px)",
            transformStyle: "preserve-3d",
          }}
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <MotionIcon index={index}>{feature.icon}</MotionIcon>
        </MotionBox>

        {/* Growing underline animation */}
        <MotionBox
          style={{
            width: lineWidth.get() + "%",
            opacity: lineOpacity,
          }}
          sx={{
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${feature.particleColor}, transparent)`,
            my: 2,
            mx: "auto",
            transition: "width 1.5s ease-out",
          }}
        />

        {/* Title with growing text shadow */}
        <MotionTypography
          variant="h3"
          style={{ transform: "translateZ(20px)" }}
          animate={{
            textShadow: isHovered
              ? [
                  "0 0 0px rgba(140, 158, 255, 0)",
                  "0 0 10px rgba(140, 158, 255, 0.3)",
                  "0 0 0px rgba(140, 158, 255, 0)",
                ]
              : "none",
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          sx={{
            my: 1.2,
            fontWeight: 500,
            fontSize: "1.6rem",
          }}
        >
          {feature.title}
        </MotionTypography>

        {/* Description with depth effect */}
        <MotionTypography
          variant="body1"
          style={{ transform: "translateZ(10px)" }}
          sx={{
            fontWeight: 400,
            fontSize: "1.4rem",
          }}
        >
          {feature.description}
        </MotionTypography>

        {/* Interactive highlight glow on hover */}
        {isHovered && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at ${mouseX * 100}% ${
                mouseY * 100
              }%, ${alpha(feature.particleColor, 0.2)} 0%, transparent 60%)`,
              zIndex: -1,
            }}
          />
        )}
      </MotionBox>
    </MotionGrid>
  );
};

const Features2 = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const titleProgress = useMotionValue(0);
  const titleOpacity = useTransform(titleProgress, [0, 100], [0, 1]);

  useEffect(() => {
    if (isInView) {
      titleProgress.set(100);
    } else {
      titleProgress.set(0);
    }
  }, [isInView]);

  return (
    <MotionBox
      ref={sectionRef}
      component="section"
      sx={{
        backgroundColor: "#121212",
        padding: "80px 0",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Knowledge Growth Neural Network Animation */}
      <NeuralNetworkAnimation />

      <MotionContainer>
        {/* Animated title that writes itself letter by letter */}
        <MotionBox
          sx={{
            position: "relative",
            mb: 8,
          }}
        >
          <MotionTypography
            component="h2"
            style={{
              opacity: titleOpacity,
            }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
            sx={{
              fontWeight: 700,
              fontSize: "1.9rem",
              maxWidth: 900,
              margin: "0 auto",
              textAlign: "center",
              variant: "h2",
              position: "relative",
            }}
          >
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{
                backgroundSize: "300% 100%",
                backgroundImage: "linear-gradient(90deg, #fff, #8C9EFF, #fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Discover how our School Management System streamlines your
              educational operations.
            </motion.span>
          </MotionTypography>

          {/* Animated underline */}
          <MotionBox
            initial={{ width: 0 }}
            animate={isInView ? { width: "50%" } : { width: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            sx={{
              height: "3px",
              background:
                "linear-gradient(90deg, transparent, #8C9EFF, transparent)",
              position: "absolute",
              bottom: "-10px",
              left: "25%",
            }}
          />
        </MotionBox>

        <Grid
          container
          columns={{ sm: 16, md: 32 }}
          sx={{
            my: 10,
            gap: 4,
          }}
          justifyContent="center"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </Grid>
      </MotionContainer>
    </MotionBox>
  );
};

export default Features2;
