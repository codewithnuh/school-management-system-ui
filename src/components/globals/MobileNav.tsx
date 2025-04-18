import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { navItems } from "../../constant";

const MobileMenu: React.FC = () => {
  // State to manage drawer visibility
  const [open, setOpen] = useState(false);

  // Toggles the state of the drawer
  const toggleDrawer =
    (newOpen: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent): void => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(newOpen);
    };

  // A list component that renders all navigation items
  const list = () => (
    <Box
      sx={{
        width: 250,
        backgroundColor: "rgba(0, 0, 0, 1)",
        backdropFilter: "blur(5px)",
        height: "100%",
        color: "white",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemText primary={item.label} role="link" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Button to open the mobile menu */}
      <Button
        onClick={toggleDrawer(true)}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <MenuIcon sx={{ color: "#ff5733" }} fontSize="large" />
      </Button>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  );
};

export default MobileMenu;
