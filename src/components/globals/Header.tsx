// src/components/globals/Header.tsx
import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router"; // Use react-router-dom Link
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Link as MuiLink, // MUI Link for styling consistency
  useTheme,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School"; // Example Logo Icon
import { navItems } from "../../constant"; // Assuming navItems has { label: string, link: string }

const Header = () => {
  const theme = useTheme();
  const location = useLocation(); // Hook to get the current location object
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  // Determine if we are on the home page (root path)
  const isOnHomePage = location.pathname === "/";

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    // AppBar provides the main header bar structure
    <AppBar
      position="sticky" // Keeps the header visible while scrolling
      elevation={1} // Subtle shadow
      sx={{
        // Background with slight transparency or gradient for modern look
        background: alpha(theme.palette.background.paper, 0.85), // Adjust alpha for desired transparency
        backdropFilter: "blur(10px)", // Glassmorphism effect
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary, // Ensure text color contrasts with background
      }}
    >
      <Container maxWidth="lg">
        {/* Toolbar helps align items horizontally */}
        <Toolbar disableGutters>
          {/* Logo */}
          <MuiLink
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit", // Inherit color from AppBar
              mr: 2, // Margin right for spacing
              flexShrink: 0, // Prevent logo from shrinking
            }}
          >
            <SchoolIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography
              variant="h6"
              noWrap
              component="span" // Use span to avoid block layout issues
              sx={{
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit", // Use AppBar's text color
                textDecoration: "none",
              }}
            >
              SMS
            </Typography>
          </MuiLink>

          {/* Spacer to push items to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation Links (Only on Home Page) */}
          {isOnHomePage && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  // Decide if it's an internal route or external link/hash
                  {...(item.link.startsWith("/")
                    ? { component: RouterLink, to: item.link }
                    : { component: "a", href: item.link })}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: theme.palette.text.secondary, // Subtler color for nav links
                    display: "block",
                    textTransform: "none", // Keep original casing
                    fontWeight: 500,
                    "&:hover": {
                      color: theme.palette.primary.main, // Highlight on hover
                      backgroundColor: "transparent", // No background change on hover
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Login Button (Always Visible on Desktop, conditional on Mobile) */}
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            size="small"
            color="primary"
            sx={{
              ml: 2, // Margin left for spacing
              // Show on medium+ screens OR if not on home page on xs screens
              display: {
                xs: isOnHomePage ? "none" : "inline-flex",
                md: "inline-flex",
              },
              borderRadius: "20px", // Rounded corners
              px: 3, // Padding horizontal
              flexShrink: 0, // Prevent button from shrinking
            }}
          >
            Login
          </Button>

          {/* Mobile Menu Icon & Dropdown (Only on Home Page) */}
          {isOnHomePage && (
            <Box sx={{ display: { xs: "flex", md: "none" }, ml: 1 }}>
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit" // Use AppBar's color
              >
                <MenuIcon />
              </IconButton>
              {/* Mobile Menu Dropdown */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right", // Align menu to the right
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right", // Align menu to the right
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  // Styling for the menu paper
                  "& .MuiPaper-root": {
                    backgroundColor: alpha(
                      theme.palette.background.paper,
                      0.95
                    ),
                    backdropFilter: "blur(10px)",
                    borderRadius: 2,
                    mt: 1.5,
                    minWidth: 180, // Ensure minimum width
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={handleCloseNavMenu}
                    // Decide if it's an internal route or external link/hash
                    {...(item.link.startsWith("/")
                      ? { component: RouterLink, to: item.link }
                      : { component: "a", href: item.link })}
                    sx={{
                      justifyContent: "center", // Center text
                      "&:hover": {
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <Typography textAlign="center">{item.label}</Typography>
                  </MenuItem>
                ))}
                {/* Add Login button inside mobile menu as well */}
                <MenuItem
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to="/login"
                  sx={{ justifyContent: "center", mt: 1 }}
                >
                  <Button variant="contained" color="primary" size="small">
                    Login
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
