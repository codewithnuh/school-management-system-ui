// src/components/OwnerDashboardAdmins.tsx
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  CircularProgress,
  Typography,
  Box,
  Chip,
  IconButton,
  Paper,
  styled,
  Modal, // Added Modal
  Fade, // Added Fade for modal transition
  Backdrop, // Added Backdrop for modal
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit"; // Using EditIcon for subscription toggle

import { useGetAllAdmins } from "../../../services/queries/admin"; // Adjust path if needed

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.05)", // As per your definition
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  height: "100%", // Be mindful of layout implications
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.5)",
  },
}));

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  background: "rgba(30, 30, 46, 0.95)", // Darker, more solid glass for modal
  border: "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(15px)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
  padding: theme.spacing(4),
  borderRadius: 20,
  color: theme.palette.text.primary,
}));
// Define the Admin type based on the provided JSON structure
interface Admin {
  createdAt: string;
  email: string;
  entityType: string;
  firstName: string;
  id: number;
  isSubscriptionActive: boolean;
  lastName: string;
  middleName: string | null;
  subscriptionPlan: string;
  updatedAt: string;
}

const OwnerDashboardAdmins: React.FC = () => {
  const { data: queryData, isLoading, isError, error } = useGetAllAdmins();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(queryData);
  useEffect(() => {
    if (queryData?.data) {
      setAdmins(queryData.data);
    } else if (!isLoading && !isError) {
      // If not loading, no error, but no data
      setAdmins([]);
    }
  }, [queryData, isLoading, isError]);

  const handleToggleSubscription = (adminId: number) => {
    console.log(`Plan update initiated for admin ID: ${adminId}`); // Mock function log as requested
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === adminId
          ? { ...admin, isSubscriptionActive: !admin.isSubscriptionActive }
          : admin
      )
    );
    console.log(
      `Subscription status visually updated for admin ID: ${adminId}. (Client-side only)`
    );
    // In a real application, you would call a mutation here:
    // e.g., updateAdminSubscriptionMutation.mutate({ adminId, newStatus: newStatus });
  };

  const handleViewDetails = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          p: 3,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2, color: "text.secondary" }}>
          Loading Admins...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <GlassCard sx={{ m: 2, p: { xs: 1, sm: 2, md: 3 } }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error
        </Typography>
        <Typography color="error.light">
          Failed to fetch admin data.{" "}
          {error instanceof Error
            ? error.message
            : "An unknown error occurred."}
        </Typography>
      </GlassCard>
    );
  }

  // Handles the case where data is fetched but is null/undefined or an empty array
  if (!admins || admins.length === 0) {
    return (
      <GlassCard sx={{ m: 2, p: { xs: 1, sm: 2, md: 3 } }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 2, color: "text.primary" }}
        >
          Admins Management
        </Typography>
        <Typography
          sx={{ color: "text.secondary", textAlign: "center", py: 4 }}
        >
          No admin data available.
        </Typography>
      </GlassCard>
    );
  }

  const paginatedAdmins = admins.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <GlassCard sx={{ m: { xs: 1, sm: 2 }, p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mb: 3, color: "text.primary", fontWeight: "bold" }}
      >
        Admins Management
      </Typography>
      <TableContainer
        component={Paper}
        // Make TableContainer's Paper transparent to let GlassCard's style through
        // The theme's MuiPaper style (backdropFilter, border, backgroundColor) might conflict if not transparent here.
        sx={{
          background: "rgba(255, 255, 255, 0.03)", // Very subtle background for the table area within the glass
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "12px", // Rounded corners for the table container itself
          boxShadow: "none", // Remove default Paper shadow if GlassCard provides the main shadow
          backdropFilter: "blur(5px)", // Optional: slight inner blur if desired
        }}
      >
        <Table stickyHeader aria-label="admins table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                Sub. Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                Sub. Plan
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAdmins.map((admin) => (
              <TableRow
                key={admin.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "action.hover" },
                  "& td, & th": {
                    borderBottomColor: "rgba(255, 255, 255, 0.1)",
                  }, // Lighter border for rows
                }}
              >
                <TableCell sx={{ color: "text.primary" }}>
                  {`${admin.firstName || ""} ${admin.lastName || ""}`.trim()}
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  {admin.email}
                </TableCell>
                <TableCell>
                  <Chip
                    label={admin.isSubscriptionActive ? "Active" : "Inactive"}
                    color={admin.isSubscriptionActive ? "success" : "error"}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell
                  sx={{ color: "text.primary", textTransform: "capitalize" }}
                >
                  {admin.subscriptionPlan}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="view details"
                    onClick={() => handleViewDetails(admin)}
                    color="info"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    color={admin.isSubscriptionActive ? "warning" : "success"}
                    onClick={() => handleToggleSubscription(admin.id)}
                    sx={{ ml: 1, minWidth: "110px" }} // Ensure enough width for text
                    startIcon={<EditIcon />}
                  >
                    {admin.isSubscriptionActive ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={admins.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ color: "text.secondary", mt: 2 }} // Ensure pagination controls are visible
      />

      {/* Admin Details Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="admin-details-modal-title"
        aria-describedby="admin-details-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
          <StyledModalBox>
            <Typography
              id="admin-details-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: "bold",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                pb: 1,
                mb: 2,
              }}
            >
              Admin Details
            </Typography>
            {selectedAdmin && (
              <Box id="admin-details-modal-description">
                <Typography variant="body1" gutterBottom>
                  <strong>Name:</strong> {selectedAdmin.firstName}{" "}
                  {selectedAdmin.middleName
                    ? `${selectedAdmin.middleName} `
                    : ""}
                  {selectedAdmin.lastName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {selectedAdmin.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Subscription Plan:</strong>{" "}
                  <Chip
                    label={selectedAdmin.subscriptionPlan}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Subscription Status:</strong>{" "}
                  <Chip
                    label={
                      selectedAdmin.isSubscriptionActive ? "Active" : "Inactive"
                    }
                    color={
                      selectedAdmin.isSubscriptionActive ? "success" : "error"
                    }
                    size="small"
                  />
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Entity Type:</strong> {selectedAdmin.entityType}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  mt={2}
                >
                  Created: {new Date(selectedAdmin.createdAt).toLocaleString()}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  Last Updated:{" "}
                  {new Date(selectedAdmin.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            )}
          </StyledModalBox>
        </Fade>
      </Modal>
    </GlassCard>
  );
};
export default OwnerDashboardAdmins;
