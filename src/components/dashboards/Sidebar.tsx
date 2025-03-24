// src/components/dashboard/Sidebar.tsx
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
} from "@mui/material";
import { NavLink } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

interface SidebarProps {
  navItems: NavItem[];
  userName: string;
  userAvatarUrl?: string;
  onLogout: () => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  userName,
  userAvatarUrl,
  onLogout,
}) => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [open, setOpen] = useState(true);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    onLogout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <>
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
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          },
        }}
      >
        {open ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            color: "white",
            transform: open ? "none" : `translateX(-${drawerWidth}px)`,
            transition: "transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
          },
        }}
      >
        {/* User Profile Section */}
        <Toolbar>
          <Box display="flex" alignItems="center">
            {userAvatarUrl ? (
              <Avatar src={userAvatarUrl} />
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
            <Typography variant="subtitle1" ml={1}>
              {userName}
            </Typography>
          </Box>
        </Toolbar>

        {/* Navigation Items */}
        <List>
          {navItems.map((item, index) => (
            <ListItemButton
              key={index}
              component={NavLink}
              to={item.path}
              sx={({ isActive }) => ({
                backgroundColor: isActive
                  ? "rgba(144,202,249, 0.2)"
                  : "inherit",
              })}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>

        {/* Spacer to push the logout button to the bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Logout Button */}
        <Box sx={{ p: 2 }}>
          <ListItemButton onClick={handleLogoutClick} sx={{ color: "white" }}>
            <ListItemIcon sx={{ color: "white" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
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
          <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
