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
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: palette.primary.dark, // custom background for contained primary buttons
          "&:hover": {
            backgroundColor: "#c0392b", // custom hover state
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
  },
});

export default theme;
