import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Outlet } from "react-router";
import { Logout } from "@mui/icons-material";

const drawerWidth = 240;

interface AdminProps {
  window?: () => Window;
}

const Admin: React.FC<AdminProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Toggle the mobile sidebar
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar content
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" color="white">
          Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {["Overview", "Reports", "Settings"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? (
                <InboxIcon sx={{ color: "white" }} />
              ) : (
                <MailIcon sx={{ color: "white" }} />
              )}
            </ListItemIcon>
            <ListItemText primary={text} sx={{ color: "white" }} />
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem
          sx={{
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </ListItem>
      </List>
    </div>
  );

  // Define a dark theme using MUI's createTheme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
    },
  });

  // For responsive drawer container
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            {/* Mobile: show hamburger menu */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Sidebar / Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="sidebar navigation"
        >
          {/* Mobile Drawer */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Improves performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                backgroundColor: darkTheme.palette.background.paper,
              },
            }}
          >
            {drawer}
          </Drawer>
          {/* Desktop Permanent Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                backgroundColor: darkTheme.palette.background.paper,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
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
          {/* Insert additional admin content here */}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Admin;
