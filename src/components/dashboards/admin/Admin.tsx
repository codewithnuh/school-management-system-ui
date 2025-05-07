import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";

import { ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router";
import Sidebar, { NavItem, SidebarThemeOptions } from "../dashboards/Sidebar";

import { darkTheme } from "../../theme/darkTheme";

// Admin-specific sidebar theme options
const adminSidebarTheme: SidebarThemeOptions = {
  backgroundColor: "rgba(30, 30, 46, 0.9)",
  backdropFilter: "blur(10px)",
  activeItemColor: "rgba(144, 202, 249, 0.2)",
  drawerWidth: 260,
  hoverColor: "rgba(144, 202, 249, 0.1)",
};

import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Class,
  ClassOutlined,
  Create,
  SettingsApplications,
  Dashboard,
  ViewAgenda,
} from "@mui/icons-material";
import { TimeIcon } from "@mui/x-date-pickers/icons";

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard/admin",
    icon: <Dashboard />,
  },
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
    label: "TimeTable",
    icon: <TimeIcon />,
    subItems: [
      {
        label: "generate",
        path: "/dashboard/admin/timetable/generate",
        icon: <SettingsIcon />,
      },
      {
        label: "View",
        path: "/dashboard/admin/timetable/view",
        icon: <ViewAgenda />,
      },
    ],
  },
  {
    label: "Classes",
    icon: <Class />,
    subItems: [
      {
        label: "Create Class",
        path: "/dashboard/admin/class/create",
        icon: <Create />,
      },
      {
        label: "All Classes",
        path: "/dashboard/admin/classes",
        icon: <ClassOutlined />,
      },
    ],
  },
];

const Admin: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* Top AppBar */}

        {/* Enhanced Sidebar with admin-specific options */}
        <Sidebar
          navItems={navItems}
          userName="Admin User"
          userAvatarUrl="" // Provide a valid URL if available
          title="Admin Dashboard"
          themeOptions={adminSidebarTheme}
          onLogout={() => {
            // Perform any additional logout logic here
            window.location.href = "/login";
          }}
          // Additional custom props can be added here
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: {
              sm: `calc(100% - ${adminSidebarTheme.drawerWidth || 240}px)`,
            },
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
