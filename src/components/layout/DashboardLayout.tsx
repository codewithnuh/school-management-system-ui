import { Box } from "@mui/material";
import Sidebar from "../globals/Sidebar";
import { Outlet } from "react-router";

const DashboardLayout = ({ role }: { role: "admin" | "owner" | "teacher" }) => {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar role={role} />
      <Box component="main" flexGrow={1} p={3}>
        <Outlet /> {/* Renders nested route content */}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
