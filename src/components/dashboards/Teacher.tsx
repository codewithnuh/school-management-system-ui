import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Outlet } from "react-router";
import Sidebar, { NavItem, SidebarThemeOptions } from "../dashboards/Sidebar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

// Import icons
import {
  Assignment,
  AssignmentTurnedIn,
  PeopleAlt,
  Event,
  MenuBook,
  Person,
  School,
  Dashboard,
} from "@mui/icons-material";
import { useTeachers } from "../../services/queries/teachers";
import { useUser } from "../../hooks/useUser";
// Create a teacher-specific theme
const teacherTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

// Teacher-specific sidebar theme options
const teacherSidebarTheme: SidebarThemeOptions = {
  backgroundColor: "rgba(30, 30, 46, 0.9)",
  backdropFilter: "blur(10px)",
  activeItemColor: "rgba(144, 202, 249, 0.2)",
  drawerWidth: 260,
  hoverColor: "rgba(144, 202, 249, 0.1)",
};

// Teacher navigation items
const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard/teacher",
    icon: <Dashboard />,
  },
  {
    label: "Classes",
    icon: <School />,
    subItems: [
      {
        label: "My Classes",
        path: "/dashboard/teacher/classes",
        icon: <MenuBook />,
      },
      {
        label: "Students",
        path: "/dashboard/teacher/students",
        icon: <PeopleAlt />,
      },
    ],
  },
  {
    label: "Assignments",
    icon: <Assignment />,
    subItems: [
      {
        label: "Create Assignment",
        path: "/dashboard/teacher/assignments/create",
        icon: <Assignment />,
      },
      {
        label: "Grade Submissions",
        path: "/dashboard/teacher/assignments/grade",
        icon: <AssignmentTurnedIn />,
      },
    ],
  },
  {
    label: "Schedule",
    path: "/dashboard/teacher/schedule",
    icon: <Event />,
  },
  {
    label: "Profile",
    path: "/dashboard/teacher/profile",
    icon: <Person />,
  },
];

// Custom user info component for teacher
const TeacherInfo: React.FC = () => (
  <Box sx={{ mt: 1, textAlign: "center" }}>
    <Chip
      label="Mathematics"
      size="small"
      sx={{ m: 0.5, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
    />
    <Chip
      label="Science"
      size="small"
      sx={{ m: 0.5, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
    />
    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
      Faculty ID: TCH-2023-001
    </Typography>
  </Box>
);

const Teacher: React.FC = () => {
  const { data: user, isLoading, isError } = useUser();
  console.log(user?.data.user.firstName);
  return (
    <ThemeProvider theme={teacherTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* Enhanced Sidebar with teacher-specific options */}
        <Sidebar
          navItems={navItems}
          userName={user!.data.user.firstName + " " + user!.data.user.lastName}
          userAvatarUrl="/assets/teacher-avatar.jpg"
          title="Teacher Portal"
          themeOptions={teacherSidebarTheme}
          userInfo={<TeacherInfo />}
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
            width: {
              sm: `calc(100% - ${teacherSidebarTheme.drawerWidth || 240}px)`,
            },
            backgroundColor: teacherTheme.palette.background.default,
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

export default Teacher;
