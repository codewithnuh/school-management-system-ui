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
import SignUp from "./components/landing_page/SignUp.tsx";
import AdminDashboardHome from "./components/dashboards/admin/AdminDashboardHome.tsx";
import ForgotPasswordPage from "./components/landing_page/ForgotPassword.tsx";
import TeacherRegistrationForm from "./components/forms/TeacherRegistrationForm.tsx";
import SignupForm from "./components/landing_page/SignUp.tsx";

// Import TanStack Query components
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Optional dev tools
import { queryClient } from "./utils/queryClient.ts";
import { RoleGuard } from "./components/RoleGuard.tsx";
import NotFound from "./pages/NotFound.tsx";
import UserRegistrationForm from "./components/forms/UserRegistrationForm.tsx";
import SampleUploadForm from "./components/forms/SampleUploadForm.tsx";
import Teacher from "./components/dashboards/Teacher.tsx";
import MyClasses from "./components/Classes/TeacherClass.tsx";
import TeacherTimetable from "./components/timetable/TeacherTimetable.tsx";
import StudentDashboard from "./components/Student/StudentDashboard.tsx";
import StudentTimetable from "./components/timetable/StudentTImeTable.tsx";
import StudentProfile from "./components/Student/StudentProfile.tsx";
import Login from "./components/landing_page/Login.tsx";
import CreateSchool from "./components/forms/SchoolCreation.tsx";
import ActivationStatusPage from "./components/ActivationStatusPage.tsx";
// import { AdminDashboardLayout } from "./components/dashboards/AdminDashboardLayout.tsx";
import DashboardLayout from "./components/layout/DashboardLayout.tsx";
// import TeacherRegistrationPage from "./pages/TeacherRegistrationPage.tsx";
import TeacherCreation from "./components/forms/TeacherCreation.tsx";
import AdminDashboardLinks from "./components/dashboards/admin/AdminDashboardLinks.tsx";
import CreateClassForm from "./components/layout/CreateClassForm.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignupForm />} />
            <Route path="/sample-upload" element={<SampleUploadForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/register/student"
              element={<UserRegistrationForm />}
            />
            <Route
              path="/dashboard/admin/school/create"
              element={<CreateSchool />}
            />

            <Route
              path="/dashboard/admin/teacher/create"
              element={<TeacherCreation />}
            />
            <Route
              path="/dashboard/admin/activate"
              element={<ActivationStatusPage />}
            />
            <Route
              path="/dashboard/admin/"
              element={<DashboardLayout role="admin" />}
            >
              <Route index element={<AdminDashboardHome />} />
              <Route
                path="registration-links"
                element={<AdminDashboardLinks />}
              />
              <Route path="classes" element={<CreateClassForm />} />
              <Route path="students" element={<h1>STUDENT PAGE</h1>} />
              <Route path="timetable" element={<h1>TIMETABLE PAGE</h1>} />
            </Route>
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
              <Route path="timetable" element={<StudentTimetable />} />
              <Route index path="profile" element={<StudentProfile />} />
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
