import { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./themes/theme";
import LandingPage from "./pages/landingpage";

export default function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LandingPage toggleColorMode={toggleColorMode} mode={mode} />
    </ThemeProvider>
  );
}
