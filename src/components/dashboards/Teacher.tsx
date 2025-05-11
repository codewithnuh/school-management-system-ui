// import React, { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
// import CssBaseline from "@mui/material/CssBaseline";
// import Toolbar from "@mui/material/Toolbar";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { Outlet } from "react-router";
// import Sidebar, { NavItem, SidebarThemeOptions } from "../dashboards/Sidebar";
// import Typography from "@mui/material/Typography";
// import Chip from "@mui/material/Chip";

// // Import icons
// import { MenuBook, School, Dashboard } from "@mui/icons-material";
// import { useUser } from "../../hooks/useUser";
// import { useSubject } from "../../services/queries/subject";
// import { useTeacherSections } from "../../services/queries/teachers";
// import { TimeIcon } from "@mui/x-date-pickers/icons";
// // Create a teacher-specific theme
// const teacherTheme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: {
//       main: "#1976d2",
//     },
//     secondary: {
//       main: "#dc004e",
//     },
//     background: {
//       default: "black",
//       paper: "black",
//     },
//   },
// });

// // Teacher-specific sidebar theme options
// const teacherSidebarTheme: SidebarThemeOptions = {
//   backgroundColor: "black",
//   backdropFilter: "blur(10px)",
//   activeItemColor: "rgba(144, 202, 249, 0.2)",
//   drawerWidth: 260,
//   hoverColor: "rgba(144, 202, 249, 0.1)",
// };

// // Teacher navigation items
// const navItems: NavItem[] = [
//   {
//     label: "Dashboard",
//     path: "/dashboard/teacher",
//     icon: <Dashboard />,
//   },
//   {
//     label: "TimeTable",
//     path: "/dashboard/teacher/timetable",
//     icon: <TimeIcon />,
//   },
//   {
//     label: "Classes",
//     icon: <School />,
//     subItems: [
//       {
//         label: "My Classes",
//         path: "/dashboard/teacher/classes",
//         icon: <MenuBook />,
//       },
//     ],
//   },
// ];

// // Custom user info component for teacher
// const TeacherInfo = ({ subjectName }: { subjectName: string }) => (
//   <Box sx={{ mt: 1, textAlign: "center" }}>
//     <Chip
//       label={subjectName}
//       size="small"
//       sx={{ m: 0.5, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//     />

//     <Typography variant="caption" display="block" sx={{ mt: 1 }}>
//       Faculty ID: TCH-2023-001
//     </Typography>
//   </Box>
// );

// const Teacher: React.FC = () => {
//   const { data: user } = useUser();
//   const [subjectId, setSubjectId] = useState<number | undefined>();
//   const { data: subject } = useSubject(subjectId!);
//   console.log(user);
//   const { data } = useTeacherSections(user!.data.user.id!, subjectId!);
//   console.log(data);
//   useEffect(() => {
//     setSubjectId(user!.data.user.subjectId);
//   }, []);
//   return (
//     <ThemeProvider theme={teacherTheme}>
//       <Box sx={{ display: "flex" }}>
//         <CssBaseline />

//         {/* Enhanced Sidebar with teacher-specific options */}
//         <Sidebar
//           navItems={navItems}
//           userName={user!.data.user.firstName + " " + user!.data.user.lastName}
//           userAvatarUrl="/assets/teacher-avatar.jpg"
//           title="Teacher Portal"
//           themeOptions={teacherSidebarTheme}
//           userInfo={<TeacherInfo subjectName={subject?.name || ""} />}
//           onLogout={() => {
//             // Perform any additional logout logic here
//             window.location.href = "/login";
//           }}
//         />

//         {/* Main Content */}
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             p: 3,
//             width: {
//               sm: `calc(100% - ${teacherSidebarTheme.drawerWidth || 240}px)`,
//             },
//             backgroundColor: teacherTheme.palette.background.default,
//             minHeight: "100vh",
//           }}
//         >
//           <Toolbar />
//           <Outlet />
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default Teacher;
