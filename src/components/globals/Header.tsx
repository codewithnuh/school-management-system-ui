import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MobileMenu from "./MobileNav";
import Container from "@mui/material/Container";
import { Link } from "react-router";
const Header = () => {
  return (
    <header>
      <Container>
        <nav className="nav ">
          <span className="logo">LOGO</span>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <ul>
              <Stack direction={"row"} spacing={2}>
                {["Home", "About", "Contact", "Pricing"].map((item, index) => (
                  <li key={index}>
                    <a href="/">{item}</a>
                  </li>
                ))}
              </Stack>
            </ul>
          </Box>
          <Stack direction={"row"} alignItems={"center"} gap={2}>
            <Link to={"/login"}>
              <Button variant="contained" size="small" color="primary">
                Login
              </Button>
            </Link>
            <Box sx={{ display: { xs: "inline-block", sm: "none" }, mt: 1 }}>
              <MobileMenu />
            </Box>
          </Stack>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
