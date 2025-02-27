import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@emotion/react";
import theme from "./themes/theme.ts";
import { BrowserRouter, Route, Routes } from "react-router";

import Header from "./components/globals/Header.tsx";
import LoginPage from "./components/landing_page/LoginPage.tsx";
import ForgotPasswordPage from "./components/landing_page/ForgotPassword.tsx";
import StudentRegistrationForm from "./components/landing_page/StudentRigisteration.tsx";
import TeacherRegistrationForm from "./components/landing_page/TeacherRegisteration.tsx";
import SignupForm from "./components/landing_page/SignUp.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/register/student"
            element={<StudentRegistrationForm />}
          />
          <Route
            path="/register/teacher"
            element={<TeacherRegistrationForm />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
