// theme.ts
import { createTheme } from "@mui/material/styles";
export const palette = {
  primary: {
    main: "#ff5733", // Your custom primary color
    light: "#ff8a66", // Optional: custom light shade
    dark: "#c0392b", // Optional: custom dark shade
    contrastText: "#fff", // Optional: text color on primary backgrounds
  },
  global: {
    background: "#000000", //black  }
  },
};
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#ff5733", // custom background for contained primary buttons
          "&:hover": {
            backgroundColor: "#c0392b", // custom hover state
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
