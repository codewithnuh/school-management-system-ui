// [Admin.tsx](file:///C:\Users\Noor%20Ul%20Hassan\Desktop\Projects\school-management-system-ui\src\components\dashboards\Admin.tsx)
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

import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import { SettingsApplications } from "@mui/icons-material";

const navItems: NavItem[] = [
  {
    label: "Applications",
    icon: <SettingsApplications />,
    subItems: [
      {
        label: "Teachers",
        path: "/dashboard/admin/applications/teachers",
        icon: <AssessmentIcon />,
      },
      {
        label: "Students",
        path: "/dashboard/admin/applications/students",
        icon: <SettingsIcon />,
      },
    ],
  },
  {
    label: "Reports",
    path: "/dashboard/admin/reports",
    icon: <AssessmentIcon />,
  },
  {
    label: "Settings",
    path: "/dashboard/admin/settings",
    icon: <SettingsIcon />,
  },
];

const Admin: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* Top AppBar */}

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
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Admin;
