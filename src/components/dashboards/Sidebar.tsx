import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Avatar,
  Typography,
  IconButton,
  Collapse,
  Alert,
  Theme,
  useTheme,
  SxProps,
} from "@mui/material";

import { NavLink } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useLogoutMutation } from "../../services/queries/auth";

export interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactElement;
  subItems?: NavItem[]; // Optional array of sub-items
  action?: () => void; // Optional custom action
  disabled?: boolean; // Optional disabled state
}

export interface SidebarThemeOptions {
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  activeItemColor?: string;
  drawerWidth?: number;
  backdropFilter?: string;
  hoverColor?: string;
}

export interface SidebarProps {
  navItems: NavItem[];
  userName: string;
  userAvatarUrl?: string;
  onLogout?: () => void; // Made optional
  title?: string; // Dashboard title
  defaultOpen?: boolean; // Whether sidebar is open by default
  variant?: "permanent" | "persistent" | "temporary"; // Drawer variant
  themeOptions?: SidebarThemeOptions; // Custom theme options
  userInfo?: React.ReactNode; // Additional user info component
  footerContent?: React.ReactNode; // Custom footer content
  headerContent?: React.ReactNode; // Custom header content
  showToggleButton?: boolean; // Whether to show the toggle button
  className?: string; // Additional CSS class
  sx?: SxProps<Theme>; // Material UI sx prop for custom styling
}

const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  userName,
  userAvatarUrl,
  onLogout,
  title = "Dashboard",
  defaultOpen = true,
  variant = "permanent",
  themeOptions = {},
  userInfo,
  footerContent,
  headerContent,
  showToggleButton = true,
  className,
  sx,
}) => {
  const theme = useTheme();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { mutate: logout, isPending, isError } = useLogoutMutation();

  // Apply default theme options with fallbacks
  const {
    backgroundColor = "rgba(0, 0, 0, 0.8)",
    textColor = "white",
    iconColor = "white",
    activeItemColor = "rgba(144, 202, 249, 0.2)",
    drawerWidth = 240,
    backdropFilter = "blur(10px)",
    hoverColor = "rgba(255, 255, 255, 0.08)",
  } = themeOptions;

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    try {
      logout();
      setLogoutDialogOpen(false);
      // Call the custom onLogout if provided
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Function to toggle dropdown
  const handleDropdownToggle = (label: string) => {
    setOpenDropdown((prevState) => ({
      ...prevState,
      [label]: !prevState[label],
    }));
  };

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item, index) => (
      <React.Fragment key={`${level}-${index}`}>
        {item.subItems ? (
          <>
            <ListItemButton
              onClick={() => handleDropdownToggle(item.label)}
              disabled={item.disabled}
              sx={{
                pl: level * 2 + 2,
                color: textColor,
                "&:hover": {
                  backgroundColor: hoverColor,
                },
              }}
            >
              <ListItemIcon sx={{ color: iconColor }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {openDropdown[item.label] ? (
                <ExpandLess sx={{ color: iconColor }} />
              ) : (
                <ExpandMore sx={{ color: iconColor }} />
              )}
            </ListItemButton>
            <Collapse
              in={openDropdown[item.label] || false}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {renderNavItems(item.subItems, level + 1)}
              </List>
            </Collapse>
          </>
        ) : (
          <ListItemButton
            component={item.path ? NavLink : "div"}
            to={item.path}
            onClick={item.action}
            disabled={item.disabled}
            sx={({ isActive }) => ({
              pl: level * 2 + 2,
              backgroundColor:
                isActive && item.path ? activeItemColor : "inherit",
              color: textColor,
              "&:hover": {
                backgroundColor: hoverColor,
              },
            })}
          >
            <ListItemIcon sx={{ color: iconColor }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        )}
      </React.Fragment>
    ));
  };

  return (
    <>
      {showToggleButton && (
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            position: "fixed",
            left: open ? drawerWidth - 40 : 10,
            top: 10,
            zIndex: 1300,
            backgroundColor: backgroundColor,
            color: textColor,
            "&:hover": {
              backgroundColor: hoverColor,
            },
          }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      )}

      <Drawer
        variant={variant}
        open={open}
        className={className}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: backgroundColor,
            backdropFilter: backdropFilter,
            color: textColor,
            transform: open ? "none" : `translateX(-${drawerWidth}px)`,
            transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          },
          ...sx,
        }}
      >
        {/* Dashboard title or custom header */}
        {headerContent || (
          <Toolbar sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
          </Toolbar>
        )}

        {/* User Profile Section */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {userAvatarUrl ? (
            <Avatar
              src={userAvatarUrl}
              sx={{
                width: 64,
                height: 64,
                mb: 1,
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mb: 1,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <AccountCircleIcon fontSize="large" />
            </Avatar>
          )}
          <Typography variant="subtitle1" fontWeight="bold">
            {userName}
          </Typography>

          {/* Render additional user info if provided */}
          {userInfo}
        </Box>

        {/* Navigation Items */}
        <List sx={{ flexGrow: 1, overflow: "auto", py: 0 }}>
          {renderNavItems(navItems)}
        </List>

        {/* Custom footer content or default logout */}
        <Box sx={{ p: 0, borderTop: `1px solid ${theme.palette.divider}` }}>
          {footerContent || (
            <ListItemButton
              onClick={handleLogoutClick}
              sx={{ color: textColor }}
            >
              <ListItemIcon sx={{ color: iconColor }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          )}
        </Box>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            disabled={isPending}
            color="primary"
            autoFocus
          >
            Logout
          </Button>
          {isError && <Alert severity="error">Logout failed</Alert>}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
