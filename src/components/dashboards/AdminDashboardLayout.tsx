import { Box } from "@mui/material";
import Sidebar from "../globals/Sidebar";

export const AdminDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box display="flex">
      <Sidebar role="admin" />
      <Box flex={1} p={4}>
        {children}
      </Box>
    </Box>
  );
};
