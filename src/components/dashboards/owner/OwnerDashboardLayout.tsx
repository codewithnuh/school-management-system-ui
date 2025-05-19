import { Box } from "@mui/material";
import Sidebar from "../../globals/Sidebar";

export const OwnerDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box display="flex">
      <Sidebar role="owner" />
      <Box flex={1} p={4}>
        {children}
      </Box>
    </Box>
  );
};
