import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#64b5f6", // Material Light Blue 400 - better contrast
    },
    secondary: {
      main: "#81d4fa", // Material Light Blue 300 - softer secondary color
    },
    background: {
      default: "#0d0d0d", // Base dark background
      paper: "rgba(30, 30, 30, 0.92)", // Slightly lighter than before
    },
    text: {
      primary: "#ffffff", // Main content
      secondary: "#cccccc", // Subtle gray for helper text, labels
      disabled: "#757575", // Grayed out/disabled text
    },
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.12)",
      disabledBackground: "rgba(255, 255, 255, 0.06)",
      focus: "rgba(255, 255, 255, 0.12)",
    },
    error: {
      main: "#ef5350", // Material Red 400
    },
    warning: {
      main: "#ffb74d", // Material Orange 400
    },
    info: {
      main: "#29b6f6", // Material Light Blue 400
    },
    success: {
      main: "#66bb6a", // Material Green 400
    },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#bbbbbb", // Softer white-gray for form labels
          "&.Mui-focused": {
            color: "#eeeeee", // Brighter on focus
          },
          "&.Mui-disabled": {
            color: "#757575", // Gray for disabled fields
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#bbbbbb", // Softer label
          "&.Mui-focused": {
            color: "#ffffff", // Full white when focused
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#ffffff", // Actual input text
          "&::placeholder": {
            color: "#888888", // Darker placeholder
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.15)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555555", // Subtle hover effect
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#64b5f6", // Primary blue on focus
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(30, 30, 30, 0.92)", // Softer than pure black
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          // Ensures all Typography uses proper contrast
          color: "#ffffff",
        },
        h1: { color: "#ffffff" },
        h2: { color: "#ffffff" },
        h3: { color: "#ffffff" },
        h4: { color: "#ffffff" },
        h5: { color: "#ffffff" },
        h6: { color: "#ffffff" },
        body1: { color: "#dddddd" }, // Slightly softer for long-form text
        body2: { color: "#bbbbbb" },
        caption: { color: "#999999" }, // Even softer for helper text
        overline: { color: "#888888" },
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
              borderColor: "#555555",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#64b5f6",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: "#ffffff", // Ensure Select text is visible
        },
        icon: {
          color: "#ffffff",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.16)",
            },
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
        },
        message: {
          color: "#ffffff",
        },
        action: {
          color: "#ffffff",
        },
      },
    },
  },
});
