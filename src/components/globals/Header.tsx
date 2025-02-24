import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MobileMenu from "./MobileNav";
const Header = () => {
  return (
    <header>
      <nav className="nav container">
        <span>LOGO</span>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <ul>
            <Stack direction={"row"} spacing={2}>
              {["Home", "About", "Contact", "Pricing"].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </Stack>
          </ul>
        </Box>
        <Stack direction={"row"} gap={2}>
          <Button variant="contained" color="primary">
            Sign Up
          </Button>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <MobileMenu />
          </Box>
        </Stack>
      </nav>
    </header>
  );
};

export default Header;
