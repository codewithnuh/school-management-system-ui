import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2e2e2e" }, // Deep dark neutral
    background: {
      default: "#0d0d0d", // Almost black background
      paper: "rgba(20, 20, 20, 0.9)", // Slightly transparent dark card
    },
    text: { primary: "#ffffff" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.15)",
            },
            "&:hover fieldset": {
              borderColor: "#555", // subtle hover
            },
          },
        },
      },
    },
  },
});
