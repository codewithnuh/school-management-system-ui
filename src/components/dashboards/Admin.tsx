// src/pages/Admin.tsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Outlet } from "react-router";
import Sidebar, { NavItem } from "@/components/dashboards/Sidebar.tsx";

const drawerWidth = 240;

// Create a dark theme with a glassy effect for the sidebar.
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

// Define navigation items for the admin dashboard.
// Replace the icons below with appropriate MUI icons for each menu item.
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";

const navItems: NavItem[] = [
  { label: "Overview", path: "/admin/overview", icon: <DashboardIcon /> },
  { label: "Reports", path: "/admin/reports", icon: <AssessmentIcon /> },
  { label: "Settings", path: "/admin/settings", icon: <SettingsIcon /> },
];

const Admin: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* Top AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            {/* For mobile: show hamburger menu (if needed) */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Sidebar
          navItems={navItems}
          userName="Admin User"
          userAvatarUrl="" // Provide a valid URL if available
          onLogout={() => {
            // Perform any additional logout logic here
            window.location.href = "/login";
          }}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor: darkTheme.palette.background.default,
            minHeight: "100vh",
          }}
        >
          <Toolbar />
          <Outlet />
          <Typography paragraph color="white">
            Welcome to the admin dashboard.
          </Typography>
          {/* Additional admin content can be added here */}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Admin;
