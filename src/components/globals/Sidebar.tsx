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
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useState } from "react";

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

const Sidebar = ({ role }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setOpen(!open);

  const commonItems = [
    { label: "Dashboard", icon: <Home />, path: "/dashboard" },
    { label: "Timetable", icon: <CalendarMonth />, path: "/timetable" },
  ];

  const roleItems = {
    admin: [
      {
        label: "Registration Links",
        icon: <LinkSharp />,
        path: "/dashboard/admin/registration-links",
      },
      {
        label: "Teachers",
        icon: <People />,
        path: "/dashboard/admin/teachers",
      },
      { label: "Classes", icon: <Class />, path: "/dashboard/admin/classes" },
      {
        label: "Settings",
        icon: <Settings />,
        path: "/dashboard/admin/settings",
      },
    ],
    teacher: [
      { label: "Students", icon: <People />, path: "/teacher/students" },
      { label: "Settings", icon: <Settings />, path: "/teacher/settings" },
    ],
    owner: [
      { label: "My Schools", icon: <School />, path: "/owner/schools" },
      { label: "Staff", icon: <People />, path: "/owner/staff" },
    ],
  };

  const menuItems = [...commonItems, ...(roleItems[role] || [])];

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
        {menuItems.map(({ label, icon, path }) => (
          <Tooltip key={label} title={!open ? label : ""} placement="right">
            <ListItemButton onClick={() => navigate(path)} sx={{ px: 2 }}>
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
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </GlassSidebar>
  );
};

export default Sidebar;
