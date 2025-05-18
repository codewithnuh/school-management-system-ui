import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  styled,
  Divider,
  Tooltip,
  Collapse,
} from "@mui/material";
import {
  Home,
  School,
  People,
  CalendarMonth,
  Settings,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  LinkSharp,
  Class,
  ExpandMore,
  ExpandLess,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../../services/queries/auth";
import React, { useState } from "react";

const GlassSidebar = styled(Box)(({ theme }) => ({
  height: "100vh",
  background: "rgba(255, 255, 255, 0.04)",
  borderRight: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
  transition: "width 0.3s",
  overflowX: "hidden",
}));

type SidebarProps = {
  role: "admin" | "owner" | "teacher";
};

// Define menu structure with submenus
const menuStructure = {
  common: [
    { label: "Dashboard", icon: <Home />, path: "/dashboard/admin/" },
    {
      label: "Timetable",
      icon: <CalendarMonth />,
      submenu: [
        {
          label: "View Timetable",
          path: "/dashboard/admin/timetable/view",
        },
      ],
    },
  ],
  admin: [
    {
      label: "Registration",
      path: "/dashboard/admin/registration-links",
      icon: <LinkSharp />,
    },
    {
      label: "Staff",
      icon: <People />,
      submenu: [
        { label: "Teachers", path: "/dashboard/admin/teachers" },
        { label: "Students", path: "/dashboard/admin/students" },
      ],
    },
    {
      label: "School",
      icon: <School />,
      submenu: [
        { label: "Manage Classes", path: "/dashboard/admin/classes" },
        { label: "Sections", path: "/dashboard/admin/sections" },
        { label: "Subjects", path: "/dashboard/admin/subjects" },
      ],
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/dashboard/admin/settings",
    },
  ],
  teacher: [
    {
      label: "Students",
      icon: <People />,
      path: "/teacher/students",
    },
    {
      label: "Class",
      icon: <Class />,
      submenu: [
        { label: "View Timetable", path: "/timetable/view" },
        { label: "Attendance", path: "/teacher/attendance" },
        { label: "Grades", path: "/teacher/grades" },
      ],
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/teacher/settings",
    },
  ],
  owner: [
    {
      label: "My Schools",
      icon: <School />,
      path: "/owner/schools",
    },
    {
      label: "Staff",
      icon: <People />,
      submenu: [
        { label: "Admins", path: "/owner/staff/admins" },
        { label: "Teachers", path: "/owner/staff/teachers" },
      ],
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/owner/settings",
    },
  ],
};

type MenuItemType = {
  label: string;
  icon: React.ReactNode;
  path?: string;
  submenu?: Array<{ label: string; path: string }>;
};

const Sidebar = ({ role }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const logout = useLogoutMutation();
  const navigate = useNavigate();

  const toggleSidebar = () => setOpen(!open);
  const handleLogout = () => {
    try {
      logout.mutate();
    } catch (error) {
      console.log(error);
    }
  };
  const handleMenuClick = (label: string) => {
    if (
      menuStructure[role].find((item) => item.label === label)?.submenu ||
      menuStructure.common.find((item) => item.label === label)?.submenu
    ) {
      setExpandedMenu(expandedMenu === label ? null : label);
    } else {
      const path =
        menuStructure[role].find((item) => item.label === label)?.path ||
        menuStructure.common.find((item) => item.label === label)?.path;

      if (path) navigate(path);
    }
  };

  return (
    <GlassSidebar sx={{ width: open ? 240 : 82 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={open ? "space-between" : "center"}
        px={2}
        py={2}
      >
        {open && (
          <Typography variant="h6" color="white">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Typography>
        )}
        <IconButton onClick={toggleSidebar} size="small" sx={{ color: "#fff" }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 1 }} />

      <List>
        {/* Common Items */}
        {menuStructure.common.map(({ label, icon, path, submenu }) => (
          <React.Fragment key={label}>
            <Tooltip title={!open ? label : ""} placement="right">
              <ListItemButton
                onClick={() => handleMenuClick(label)}
                sx={{ px: 2 }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
                  {icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      sx: { color: "#fff", fontSize: "0.95rem" },
                    }}
                  />
                )}
                {open &&
                  submenu &&
                  (expandedMenu === label ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </Tooltip>

            {/* Submenu */}
            {submenu && (
              <Collapse
                in={open && expandedMenu === label}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {submenu.map((subItem) => (
                    <ListItemButton
                      key={subItem.label}
                      sx={{ pl: 4, pr: 2, py: 0.7 }}
                      onClick={() => navigate(subItem.path)}
                    >
                      <ListItemText
                        primary={subItem.label}
                        primaryTypographyProps={{
                          sx: { color: "#ccc", fontSize: "0.85rem" },
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}

        {/* Role-Specific Items */}
        {menuStructure[role].map(({ label, icon, path, submenu }) => (
          <React.Fragment key={label}>
            <Tooltip title={!open ? label : ""} placement="right">
              <ListItemButton
                onClick={() => handleMenuClick(label)}
                sx={{ px: 2 }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
                  {icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      sx: { color: "#fff", fontSize: "0.95rem" },
                    }}
                  />
                )}
                {open &&
                  submenu &&
                  (expandedMenu === label ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </Tooltip>

            {/* Submenu for role-specific items */}
            {submenu && (
              <Collapse
                in={open && expandedMenu === label}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {submenu.map((subItem) => (
                    <ListItemButton
                      key={subItem.label}
                      sx={{ pl: 4, pr: 2, py: 0.7 }}
                      onClick={() => navigate(subItem.path)}
                    >
                      <ListItemText
                        primary={subItem.label}
                        primaryTypographyProps={{
                          sx: { color: "#ccc", fontSize: "0.85rem" },
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 1 }} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent={open ? "space-between" : "center"}
        px={2}
        py={2}
      >
        <IconButton onClick={handleLogout}>
          <Tooltip title="Logout">
            <Logout />
          </Tooltip>
        </IconButton>
      </Box>
    </GlassSidebar>
  );
};

export default Sidebar;
