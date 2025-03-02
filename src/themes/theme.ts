import { createTheme } from "@mui/material/styles";
export const palette = {
  primary: {
    main: "#ff5733", // Your custom primary color
    light: "#ff8a66", // Optional: custom light shade
    dark: "#c0392b", // Optional: custom dark shade
    contrastText: "#fff", // Optional: text color on primary backgrounds
  },
  secondary: {
    main: "#2c2c2c",
    text: "#fff",
  },
  global: {
    background: "#121212",
  },
};
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: palette.primary.dark, // custom background for contained primary buttons
          color: "white",
          "&:hover": {
            backgroundColor: palette.primary.main, // custom hover state
          },
        },
        containedSecondary: {
          backgroundColor: palette.secondary.main,
          color: palette.secondary.text,
        },
        outlinedSecondary: {
          borderColor: palette.primary.light,
          color: palette.primary.light,
        },
        outlined: {
          borderColor: palette.primary.dark,
          color: palette.primary.main,
        },
        textSecondary: {
          color: palette.secondary.text,
          "&:hover": {
            background: palette.secondary.main,
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        colorPrimary: palette.primary.main,
      },
    },
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          color: "#fff",
        },
        h1: {
          color: "#fff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#171515d4",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#171515f9",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderColor: palette.primary.main,
          outlineColor: palette.primary.main,
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          // backgroundColor: palette.primary.dark,
          color: palette.primary.dark,
          "&:active": {
            color: palette.primary.main,
          },
        },
      },
    },
  },
});

export default theme;
