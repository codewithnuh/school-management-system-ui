import { createTheme } from "@mui/material";

// Create a dark theme for consistent dark mode UI
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Lighter blue for better visibility on dark background
    },
    secondary: {
      main: "#ce93d8", // Lighter purple for better visibility on dark background
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});
