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
import AdminDashboardHome from "./components/dashboards/admin/AdminDashboardHome.tsx";
import ForgotPasswordPage from "./components/landing_page/ForgotPassword.tsx";
import TeacherRegistrationForm from "./components/forms/TeacherRegistrationForm.tsx";
import SignupForm from "./components/landing_page/SignUp.tsx";

// Import TanStack Query components
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Optional dev tools
import { queryClient } from "./utils/queryClient.ts";

import NotFound from "./pages/NotFound.tsx";
import UserRegistrationForm from "./components/forms/UserRegistrationForm.tsx";
import Login from "./components/landing_page/Login.tsx";
import CreateSchool from "./components/forms/SchoolCreation.tsx";
import ActivationStatusPage from "./components/ActivationStatusPage.tsx";
// import { AdminDashboardLayout } from "./components/dashboards/AdminDashboardLayout.tsx";
import DashboardLayout from "./components/layout/DashboardLayout.tsx";
// import TeacherRegistrationPage from "./pages/TeacherRegistrationPage.tsx";
import TeacherCreation from "./components/forms/TeacherCreation.tsx";
import AdminDashboardLinks from "./components/dashboards/admin/AdminDashboardLinks.tsx";
import CreateClassForm from "./components/layout/CreateClassForm.tsx";
import TimetableView from "./components/timetable/TimetableView.tsx";
import TimeTableGenerate from "./components/dashboards/admin/TimetableGenerator.tsx";
import UserCreation from "./components/forms/UserCreation.tsx";
import StudentLogin from "./components/landing_page/StudentLogin.tsx";
import TeacherLogin from "./components/landing_page/TeacherLogin.tsx";
import StudentDashboardHome from "./components/dashboards/student/StudentDashboardHome.tsx";
import OwnerLogin from "./components/landing_page/OwnerLogin.tsx";
import OwnerDashboardHome from "./components/dashboards/owner/OwnerDashboardHome.tsx";
import OwnerDashboardAdmins from "./components/dashboards/owner/OwnerDashboardAdmins.tsx";
import TeachersTab from "./components/dashboards/admin/TeachersTab.tsx";
import TeacherDetailView from "./components/dashboards/admin/TeacherDetailedView.tsx";
import TeacherGridView from "./components/dashboards/admin/TeachersGridView.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<App />} />
            {/* --------------- AUTHENTICATION ROUTES --------------------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/teacher" element={<TeacherLogin />} />
            <Route path="/login/owner" element={<OwnerLogin />} />
            <Route path="/sign-up" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/register/student"
              element={<UserRegistrationForm />}
            />
            {/*  ----------------- ADMIN ROUTES ------------------- */}
            <Route
              path="/dashboard/admin/"
              element={<DashboardLayout role="admin" />}
            >
              <Route index element={<AdminDashboardHome />} />
              <Route
                path="registration-links"
                element={<AdminDashboardLinks />}
              />
              <Route path="activate" element={<ActivationStatusPage />} />
              <Route path="student/create" element={<UserCreation />} />
              <Route path="classes" element={<CreateClassForm />} />
              <Route path="school/create" element={<CreateSchool />} />
              <Route path="teachers/view" element={<TeachersTab />} />
              <Route
                path="teachers/view/:teacherId"
                element={<TeacherDetailView />}
              />
              <Route path="teachers/grid-view" element={<TeacherGridView />} />
              <Route path="teacher/create" element={<TeacherCreation />} />
              <Route path="timetables/view" element={<TimetableView />} />
              <Route
                path="timetables/generate"
                element={<TimeTableGenerate />}
              />
              <Route path="timetable" element={<h1>TIMETABLE PAGE</h1>} />
            </Route>
            {/* ----------------------- OWNER ROUTES ------------------ */}
            <Route
              path="/dashboard/owner/"
              element={<DashboardLayout role="owner" />}
            >
              <Route index element={<OwnerDashboardHome />} />
              <Route path="admins" element={<OwnerDashboardAdmins />} />
            </Route>
            {/* --------------------STUDENT/USER ROUTES ----------------- */}
            <Route
              path="/dashboard/student"
              element={<DashboardLayout role="student" />}
            >
              <Route index element={<StudentDashboardHome />} />
            </Route>
            {/* <Route path="/dashboard/admin" element={<Admin />}>
              <Route
                element={<Navigate to="applications/teachers" replace />}
              />
              <Route
                path="applications/teachers"
                element={<ApplicationsTab />}
              />
              <Route
                path="applications/students"
                element={<StudentApplicationsTab />}
              />
              <Route path="class/create" element={<CreateClassForm />} />
              <Route path="classes/edit/:id" element={<UpdateClassForm />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route
                path="timetable/generate"
                element={<TimetableGenerator />}
              />
              <Route path="timetable/view" element={<TimetableView />} />
            </Route> */}

            <Route
              path="/register/teacher"
              element={<TeacherRegistrationForm />}
            />
            <Route
              path="/register/student"
              element={
                <UserRegistrationForm
                  onSubmit={function (data: {
                    firstName: string;
                    lastName: string;
                    dateOfBirth: string;
                    gender: "Male" | "Female" | "Other";
                    email: string;
                    phoneNo: string;
                    emergencyContactName: string;
                    emergencyContactNumber: string;
                    address: string;
                    guardianName: string;
                    guardianCNIC: string;
                    CNIC: string;
                    classId: number;
                    sectionId: number;
                    enrollmentDate: string;
                    middleName?: string | undefined;
                    placeOfBirth?: string | undefined;
                    nationality?: string | undefined;
                    currentAddress?: string | undefined;
                    previousSchool?: string | undefined;
                    previousGrade?: string | undefined;
                    previousMarks?: string | undefined;
                    password?: string | undefined;
                    guardianPhone?: string | undefined;
                    guardianEmail?: string | undefined;
                    photo?: string | undefined;
                    transportation?: string | undefined;
                    extracurriculars?: string | undefined;
                    medicalConditions?: string | undefined;
                    allergies?: string | undefined;
                    healthInsuranceInfo?: string | undefined;
                    doctorContact?: string | undefined;
                  }): void {
                    throw new Error("Function not implemented.");
                  }}
                  classes={[]}
                  sections={[]}
                />
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* Moved ReactQueryDevtools inside the QueryClientProvider */}
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
