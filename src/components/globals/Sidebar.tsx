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
  Drawer,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  Fab,
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
  Close as CloseIcon,
  Person,
  Create,
  ClassOutlined,
  RemoveRedEye,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../../services/queries/auth";
import React, { useState, useCallback, useEffect } from "react";
import path from "path";

const GlassSidebar = styled(Box)(({ theme }) => ({
  height: "100vh",
  background: "rgba(255, 255, 255, 0.04)",
  borderRight: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
  transition: "width 0.3s ease-in-out",
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
}));

const MobileMenuFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: theme.zIndex.speedDial,
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "#fff",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
  },
}));

const StyledDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    background: "rgba(0, 0, 0, 0.9)",
    backdropFilter: "blur(12px)",
    border: "none",
    width: 280,
  },
}));

type SidebarProps = {
  role: "admin" | "owner" | "teacher" | "student";
};

// Define menu structure with submenus
const menuStructure = {
  admin: [
    {
      label: "Home",
      path: "/dashboard/admin",
      icon: <Home />,
      ariaLabel: "Home",
    },
    {
      label: "Registration Links",
      icon: <LinkSharp />,
      ariaLabel: "Registration Links",
      path: "/dashboard/admin/registration-links",
    },
    {
      label: "Students",
      icon: <Person />,
      ariaLabel: "Students",
      submenu: [
        {
          label: "Create Student",
          path: "/dashboard/admin/student/create",
          ariaLabel: "Create Student",
          icon: <Create />,
        },
      ],
    },

    {
      label: "Classes",
      icon: <ClassOutlined />,
      path: "/dashboard/admin/classes",
      ariaLabel: "Classes",
    },
    {
      label: "school",
      icon: <School />,
      ariaLabel: "School",
      submenu: [
        {
          label: "Create School",
          ariaLabel: "Create School",
          icon: <Create />,
          path: "/dashboard/admin/school/create",
        },
      ],
    },
    {
      label: "Teachers",
      ariaLabel: "Teachers",
      icon: <Person />,
      submenu: [
        {
          label: "Create Teacher",
          ariaLabel: "Create Teacher",
          icon: <Create />,
          path: "/dashboard/admin/teacher/create",
        },
        {
          label: "View Teacher",
          ariaLabel: "View Teacher",
          icon: <RemoveRedEye />,
          path: "/dashboard/admin/teachers/grid-view",
        },
      ],
    },
  ],
  teacher: [
    {
      label: "Students",
      icon: <People />,
      path: "/teacher/students",
      ariaLabel: "View students",
    },
    {
      label: "Class",
      icon: <Class />,
      ariaLabel: "Class management menu",
      submenu: [
        {
          label: "View Timetable",
          path: "/timetable/view",
          ariaLabel: "View class timetable",
        },
        {
          label: "Attendance",
          path: "/teacher/attendance",
          ariaLabel: "Manage student attendance",
        },
        {
          label: "Grades",
          path: "/teacher/grades",
          ariaLabel: "Manage student grades",
        },
      ],
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/teacher/settings",
      ariaLabel: "Teacher settings",
    },
  ],
  owner: [
    {
      label: "Home",
      path: "/dashboard/owner",
      icon: <Home />,
      ariaLabel: "Home",
    },
    {
      label: "Admins",
      icon: <Person />,
      path: "/dashboard/owner/admins",
      ariaLabel: "Admins",
    },
  ],
  student: [
    {
      label: "Dashboard",
      icon: <Home />,
      path: "/dashboard/student",
      ariaLabel: "Student dashboard",
    },
    {
      label: "Timetable",
      icon: <CalendarMonth />,
      path: "/dashboard/student/timetable",
      ariaLabel: "View timetable",
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/dashboard/student/settings",
      ariaLabel: "Student settings",
    },
  ],
};

const Sidebar = ({ role }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const logout = useLogoutMutation();
  const navigate = useNavigate();

  // Close sidebar on mobile when screen size changes
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setMobileDrawerOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setOpen(!open);
    }
  }, [isMobile, open, mobileDrawerOpen]);

  const handleLogout = useCallback(async () => {
    try {
      logout.mutate(undefined, {
        onSuccess: () => {
          navigate("/login");
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout]);

  const handleMenuClick = useCallback(
    (label: string, path?: string) => {
      const menuItem = menuStructure[role].find((item) => item.label === label);

      if (menuItem?.submenu) {
        // Toggle submenu
        setExpandedMenu(expandedMenu === label ? null : label);
      } else if (path) {
        // Navigate to path
        navigate(path);
        // Close mobile drawer after navigation
        if (isMobile) {
          setMobileDrawerOpen(false);
        }
      }
    },
    [role, expandedMenu, navigate, isMobile]
  );

  const handleSubmenuClick = useCallback(
    (path: string) => {
      navigate(path);
      if (isMobile) {
        setMobileDrawerOpen(false);
      }
    },
    [navigate, isMobile]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, action: () => void) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
      }
    },
    []
  );

  const renderMenuItems = (isInDrawer = false) => (
    <List
      component="nav"
      aria-label={`${role} navigation menu`}
      sx={{ flexGrow: 1 }}
    >
      {menuStructure[role].map(({ label, icon, path, submenu, ariaLabel }) => (
        <React.Fragment key={label}>
          <Tooltip
            title={!open && !isInDrawer ? label : ""}
            placement="right"
            disableHoverListener={open || isInDrawer}
          >
            <ListItemButton
              onClick={() => handleMenuClick(label, path)}
              onKeyDown={(e) =>
                handleKeyDown(e, () => handleMenuClick(label, path))
              }
              sx={{
                px: 2,
                py: 1.5,
                minHeight: 48,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                "&:focus": {
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  outline: "2px solid rgba(255, 255, 255, 0.5)",
                  outlineOffset: "-2px",
                },
              }}
              aria-label={ariaLabel}
              aria-expanded={submenu ? expandedMenu === label : undefined}
              aria-haspopup={submenu ? "true" : undefined}
              role={submenu ? "button" : "menuitem"}
              tabIndex={0}
            >
              <ListItemIcon
                sx={{
                  color: "#fff",
                  minWidth: 40,
                  justifyContent: "center",
                }}
              >
                {icon}
              </ListItemIcon>
              {(open || isInDrawer) && (
                <>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      sx: {
                        color: "#fff",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                  {submenu && (
                    <Box sx={{ color: "white", ml: 1 }}>
                      {expandedMenu === label ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </>
              )}
            </ListItemButton>
          </Tooltip>

          {/* Submenu */}
          {submenu && (
            <Collapse
              in={(open || isInDrawer) && expandedMenu === label}
              timeout="auto"
              unmountOnExit
            >
              <List
                component="div"
                disablePadding
                aria-label={`${label} submenu`}
                role="menu"
              >
                {submenu.map((subItem) => (
                  <ListItemButton
                    key={subItem.label}
                    sx={{
                      pl: 6,
                      pr: 2,
                      py: 1,
                      minHeight: 40,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                      },
                      "&:focus": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        outline: "2px solid rgba(255, 255, 255, 0.5)",
                        outlineOffset: "-2px",
                      },
                    }}
                    onClick={() => handleSubmenuClick(subItem.path)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => handleSubmenuClick(subItem.path))
                    }
                    aria-label={subItem.ariaLabel}
                    role="menuitem"
                    tabIndex={0}
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
  );

  // Mobile version with SwipeableDrawer
  if (isMobile) {
    return (
      <>
        <MobileMenuFab
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          size="medium"
        >
          <MenuIcon />
        </MobileMenuFab>

        <StyledDrawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          onOpen={() => setMobileDrawerOpen(true)}
          disableBackdropTransition
          disableDiscovery
          aria-label="Navigation drawer"
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* Header */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={2}
              py={2}
              sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
            >
              <Typography variant="h6" color="white" component="h1">
                {role.charAt(0).toUpperCase() + role.slice(1)} Menu
              </Typography>
              <IconButton
                onClick={() => setMobileDrawerOpen(false)}
                size="small"
                sx={{ color: "#fff" }}
                aria-label="Close navigation menu"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Menu Items */}
            {renderMenuItems(true)}

            {/* Logout Button */}
            <Box
              sx={{
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                p: 2,
              }}
            >
              <ListItemButton
                onClick={handleLogout}
                onKeyDown={(e) => handleKeyDown(e, handleLogout)}
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  "&:focus": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    outline: "2px solid rgba(255, 255, 255, 0.5)",
                    outlineOffset: "-2px",
                  },
                }}
                aria-label="Logout from application"
                tabIndex={0}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    sx: { color: "#fff", fontSize: "0.95rem" },
                  }}
                />
              </ListItemButton>
            </Box>
          </Box>
        </StyledDrawer>
      </>
    );
  }

  // Desktop version
  return (
    <GlassSidebar
      sx={{
        width: open ? 270 : 82,
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: 64,
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={open ? "space-between" : "center"}
        px={2}
        py={2}
      >
        {open && (
          <Typography variant="h6" color="white" component="h1">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Typography>
        )}
        <IconButton
          onClick={toggleSidebar}
          onKeyDown={(e) => handleKeyDown(e, toggleSidebar)}
          size="small"
          sx={{
            color: "#fff",
            "&:focus": {
              outline: "2px solid rgba(255, 255, 255, 0.5)",
              outlineOffset: "2px",
            },
          }}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          tabIndex={0}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 1 }} />

      {/* Menu Items */}
      {renderMenuItems()}

      {/* Logout Section */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 1 }} />
        <Box
          display="flex"
          alignItems="center"
          justifyContent={open ? "flex-start" : "center"}
          px={2}
          py={1}
        >
          <Tooltip title={!open ? "Logout" : ""} placement="right">
            <IconButton
              onClick={handleLogout}
              onKeyDown={(e) => handleKeyDown(e, handleLogout)}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                "&:focus": {
                  outline: "2px solid rgba(255, 255, 255, 0.5)",
                  outlineOffset: "2px",
                },
              }}
              aria-label="Logout from application"
              tabIndex={0}
            >
              <Logout />
            </IconButton>
          </Tooltip>
          {open && (
            <Typography
              variant="body2"
              color="white"
              sx={{ ml: 1, cursor: "pointer" }}
              onClick={handleLogout}
            >
              Logout
            </Typography>
          )}
        </Box>
      </Box>
    </GlassSidebar>
  );
};

export default Sidebar;
