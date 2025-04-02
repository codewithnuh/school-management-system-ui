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
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Header from "./components/globals/Header.tsx";
import LoginPage from "@/components/landing_page/LoginPage.tsx";

import ForgotPasswordPage from "./components/landing_page/ForgotPassword.tsx";
import StudentRegistrationForm from "./components/landing_page/StudentRigisteration.tsx";
import TeacherRegistrationForm from "./components/landing_page/TeacherRegisteration.tsx";
import SignupForm from "./components/landing_page/SignUp.tsx";

// Import TanStack Query components
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Optional dev tools
import { queryClient } from "./utils/queryClient.ts";
import { RoleGuard } from "./components/RoleGuard.tsx";
import Admin from "./components/dashboards/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import ApplicationsTab from "./components/layout/Application.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
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
              path="/dashboard/admin"
              element={
                <RoleGuard allowedRoles={["ADMIN"]}>
                  <Admin />
                </RoleGuard>
              }
            >
              <Route index element={<Navigate to="applications" replace />} />
              <Route
                path="applications/teachers"
                element={<ApplicationsTab />}
              />
              <Route path="reports" element={<div>REPORTS</div>} />
              <Route path="settings" element={<div>Setting</div>} />
            </Route>

            <Route
              path="/register/teacher"
              element={<TeacherRegistrationForm />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
    {/* Add dev tools for debugging */}
    <ReactQueryDevtools initialIsOpen={false} client={queryClient} />
  </StrictMode>
);
