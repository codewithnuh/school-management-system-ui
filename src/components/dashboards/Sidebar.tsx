// [src/components/dashboards/Sidebar.tsx](file:///C:\Users\Noor%20Ul%20Hassan\Desktop\Projects\school-management-system-ui\src\components\dashboards\Sidebar.tsx)
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
  Collapse, // Import Collapse
} from "@mui/material";

import { NavLink } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess"; // Import ExpandLess
import ExpandMore from "@mui/icons-material/ExpandMore"; // Import ExpandMore

export interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactElement;
  subItems?: NavItem[]; // Optional array of sub-items
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
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>(
    {}
  ); // State to manage dropdown open state

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

  // Function to toggle dropdown
  const handleDropdownToggle = (label: string) => {
    setOpenDropdown((prevState) => ({
      ...prevState,
      [label]: !prevState[label],
    }));
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
            <React.Fragment key={index}>
              {item.subItems ? (
                <>
                  <ListItemButton
                    onClick={() => handleDropdownToggle(item.label)}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openDropdown[item.label] ? (
                      <ExpandLess sx={{ color: "white" }} />
                    ) : (
                      <ExpandMore sx={{ color: "white" }} />
                    )}
                  </ListItemButton>
                  <Collapse
                    in={openDropdown[item.label] || false}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem, subIndex) => (
                        <ListItemButton
                          key={subIndex}
                          component={NavLink}
                          to={subItem.path}
                          sx={{ pl: 4 }}
                        >
                          <ListItemIcon sx={{ color: "white" }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText primary={subItem.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={({ isActive }) => ({
                    backgroundColor: isActive
                      ? "rgba(144,202,249, 0.2)"
                      : "inherit",
                  })}
                >
                  <ListItemIcon sx={{ color: "white" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </React.Fragment>
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
