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
import LoginPage from "../src/components/landing_page/LoginPage.tsx";

import ForgotPasswordPage from "./components/landing_page/ForgotPassword.tsx";
import TeacherRegistrationForm from "./components/forms/TeacherRegistrationForm.tsx";
import SignupForm from "./components/landing_page/SignUp.tsx";

// Import TanStack Query components
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Optional dev tools
import { queryClient } from "./utils/queryClient.ts";
import { RoleGuard } from "./components/RoleGuard.tsx";
import Admin from "./components/dashboards/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import ApplicationsTab from "./components/layout/Application.tsx";
import StudentApplicationsTab from "./components/layout/StudentApplicationsTab.tsx";
import CreateClassForm from "./components/layout/CreateClassForm.tsx";
import ClassesPage from "./pages/ClassesPage";
import UpdateClassForm from "./components/layout/UpdateClassForm.tsx";

import TimetableGenerator from "./pages/TimetableGenerator.tsx";
import TimetableView from "./components/timetable/TimetableView.tsx";
import UserRegistrationForm from "./components/forms/UserRegistrationForm.tsx";
import SampleUploadForm from "./components/forms/SampleUploadForm.tsx";
import Teacher from "./components/dashboards/Teacher.tsx";
import MyClasses from "./components/Classes/TeacherClass.tsx";
import TeacherTimetable from "./components/timetable/TeacherTimetable.tsx";
import StudentDashboard from "./components/Student/StudentDashboard.tsx";
import StudentTimetable from "./components/timetable/StudentTImeTable.tsx";
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
            <Route path="/sample-upload" element={<SampleUploadForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/register/student"
              element={<UserRegistrationForm />}
            />
            <Route
              path="/dashboard/teacher"
              element={
                <RoleGuard allowedRoles={["TEACHER"]}>
                  <Teacher />
                </RoleGuard>
              }
            >
              <Route
                index
                path="classes"
                element={
                  <RoleGuard allowedRoles={["TEACHER"]}>
                    <MyClasses />
                  </RoleGuard>
                }
              />
              <Route
                index
                path="timetable"
                element={
                  <RoleGuard allowedRoles={["TEACHER"]}>
                    <TeacherTimetable teacherId={1} />
                  </RoleGuard>
                }
              />
              <Route index element={<Navigate to="classes" replace />} />
            </Route>
            <Route
              path="/dashboard/user"
              element={
                <RoleGuard allowedRoles={["USER"]}>
                  <StudentDashboard />
                </RoleGuard>
              }
            >
              <Route
                path="/dashboard/user/timetable"
                element={<StudentTimetable />}
              />
            </Route>

            <Route
              path="/dashboard/admin"
              element={
                <RoleGuard allowedRoles={["ADMIN"]}>
                  <Admin />
                </RoleGuard>
              }
            >
              <Route
                index
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
            </Route>

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
