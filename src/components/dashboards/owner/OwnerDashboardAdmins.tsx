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
  Modal,
  Fade,
  Backdrop,
  Select,
  MenuItem,
  TextField,
  Snackbar, // Added Snackbar for toasts
  Alert as MuiAlert, // Added Alert for Snackbar content (aliased to avoid conflict if you have a custom Alert)
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useUpdateAdminById } from "../../../services/queries/admin"; // Adjust path if needed
import { useGetAllAdmins } from "../../../services/queries/admin"; // Adjust path if needed

// Forward ref for MuiAlert to be used in Snackbar
const Alert = React.forwardRef<
  HTMLDivElement,
  import("@mui/material").AlertProps
>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  height: "100%",
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
  background: "rgba(30, 30, 46, 0.95)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(15px)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
  padding: theme.spacing(4),
  borderRadius: 20,
  color: theme.palette.text.primary,
}));

export interface Admin {
  createdAt: string;
  email: string;
  entityType: string;
  firstName: string;
  id: number;
  isSubscriptionActive: boolean;
  lastName: string;
  middleName: string | null;
  subscriptionPlan: "monthly" | "yearly"; // Made this more specific
  updatedAt: string;
}

const OwnerDashboardAdmins: React.FC = () => {
  const {
    data: queryData,
    isLoading,
    isError,
    error: fetchErrorData,
  } = useGetAllAdmins(); // Renamed error to fetchErrorData
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const adminMutation = useUpdateAdminById(); // Renamed for clarity

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const showAppToast = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (queryData?.data) {
      setAdmins(queryData.data);
    } else if (!isLoading && !isError) {
      setAdmins([]);
    }
  }, [queryData, isLoading, isError]);

  const handleToggleSubscription = (adminId: number) => {
    const currentAdmin = admins.find((admin) => admin.id === adminId);
    if (!currentAdmin) return;

    const newSubscriptionState = !currentAdmin.isSubscriptionActive; // Determine the NEW state

    // Optimistically update UI
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === adminId
          ? { ...admin, isSubscriptionActive: newSubscriptionState }
          : admin
      )
    );

    const payload = {
      ...currentAdmin,
      isSubscriptionActive: newSubscriptionState,
    };
    // Ensure `id` is not part of the `data` field if your API expects `adminId` separately
    // delete payload.id; // If `id` is not part of the `data` object for the mutation

    adminMutation.mutate(
      { adminId, data: payload },
      {
        onSuccess: () => {
          showAppToast(
            `Subscription for ${currentAdmin.firstName} ${
              newSubscriptionState ? "activated" : "deactivated"
            }.`,
            "success"
          );
        },
        onError: (err: any) => {
          showAppToast(
            `Failed to update subscription: ${err.message || "Unknown error"}`,
            "error"
          );
          // Revert UI change
          setAdmins((prevAdmins) =>
            prevAdmins.map((admin) =>
              admin.id === adminId
                ? {
                    ...admin,
                    isSubscriptionActive: currentAdmin.isSubscriptionActive,
                  } // Revert to original state
                : admin
            )
          );
        },
      }
    );
  };

  const handleUpdateSubscriptionType = (
    adminId: number,
    newPlan: "monthly" | "yearly"
  ) => {
    const currentAdmin = admins.find((admin) => admin.id === adminId);
    if (!currentAdmin || currentAdmin.subscriptionPlan === newPlan) return;

    const oldPlan = currentAdmin.subscriptionPlan;

    // Optimistically update UI
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === adminId ? { ...admin, subscriptionPlan: newPlan } : admin
      )
    );

    const payload = { ...currentAdmin, subscriptionPlan: newPlan };
    // delete payload.id; // If `id` is not part of the `data` object for the mutation

    adminMutation.mutate(
      { adminId, data: payload },
      {
        onSuccess: () => {
          console.log("Mutation succeeded. Attempting to show success toast."); // DEBUG
          showAppToast(
            `Subscription plan for ${currentAdmin.firstName} updated to ${newPlan}.`,
            "success"
          );
        },
        onError: (err: any) => {
          showAppToast(
            `Failed to update plan: ${err.message || "Unknown error"}`,
            "error"
          );
          // Revert UI change
          setAdmins((prevAdmins) =>
            prevAdmins.map((admin) =>
              admin.id === adminId
                ? { ...admin, subscriptionPlan: oldPlan }
                : admin
            )
          );
        },
      }
    );
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
        {" "}
        <CircularProgress />{" "}
        <Typography sx={{ ml: 2, color: "text.secondary" }}>
          {" "}
          Loading Admins...{" "}
        </Typography>{" "}
      </Box>
    );
  }

  if (isError) {
    return (
      <GlassCard sx={{ m: 2, p: { xs: 1, sm: 2, md: 3 } }}>
        {" "}
        <Typography variant="h6" color="error" gutterBottom>
          {" "}
          Error{" "}
        </Typography>{" "}
        <Typography color="error.light">
          {" "}
          Failed to fetch admin data.{" "}
          {fetchErrorData instanceof Error
            ? fetchErrorData.message
            : "An unknown error occurred."}{" "}
        </Typography>{" "}
      </GlassCard>
    );
  }

  if (!admins || admins.length === 0) {
    return (
      <GlassCard sx={{ m: 2, p: { xs: 1, sm: 2, md: 3 } }}>
        {" "}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 2, color: "text.primary" }}
        >
          {" "}
          Admins Management{" "}
        </Typography>{" "}
        <Typography
          sx={{ color: "text.secondary", textAlign: "center", py: 4 }}
        >
          {" "}
          No admin data available.{" "}
        </Typography>{" "}
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
        sx={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          boxShadow: "none",
          backdropFilter: "blur(5px)",
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
                {" "}
                Name{" "}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                {" "}
                Email{" "}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                {" "}
                Sub. Status{" "}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                {" "}
                Sub. Plan{" "}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  borderBottomColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                {" "}
                Actions{" "}
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
                  },
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
                  <TextField
                    select
                    label="Plan"
                    value={admin.subscriptionPlan}
                    onChange={(e) =>
                      handleUpdateSubscriptionType(
                        admin.id,
                        e.target.value as "monthly" | "yearly"
                      )
                    }
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value={"monthly"}>Monthly</MenuItem>
                    <MenuItem value={"yearly"}>Yearly</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="view details"
                    onClick={() => handleViewDetails(admin)}
                    color="info"
                    size="small"
                  >
                    {" "}
                    <VisibilityIcon />{" "}
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    color={admin.isSubscriptionActive ? "warning" : "success"}
                    onClick={() => handleToggleSubscription(admin.id)}
                    sx={{ ml: 1, minWidth: "110px" }}
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
        sx={{ color: "text.secondary", mt: 2 }}
      />

      {/* Admin Details Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="admin-details-modal-title"
        aria-describedby="admin-details-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
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
                  {" "}
                  <strong>Name:</strong> {selectedAdmin.firstName}{" "}
                  {selectedAdmin.middleName
                    ? `${selectedAdmin.middleName} `
                    : ""}{" "}
                  {selectedAdmin.lastName}{" "}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {" "}
                  <strong>Email:</strong> {selectedAdmin.email}{" "}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {" "}
                  <strong>Subscription Plan:</strong>{" "}
                  <Chip
                    label={selectedAdmin.subscriptionPlan}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />{" "}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {" "}
                  <strong>Subscription Status:</strong>{" "}
                  <Chip
                    label={
                      selectedAdmin.isSubscriptionActive ? "Active" : "Inactive"
                    }
                    color={
                      selectedAdmin.isSubscriptionActive ? "success" : "error"
                    }
                    size="small"
                  />{" "}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {" "}
                  <strong>Entity Type:</strong> {selectedAdmin.entityType}{" "}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  mt={2}
                >
                  {" "}
                  Created: {new Date(
                    selectedAdmin.createdAt
                  ).toLocaleString()}{" "}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  {" "}
                  Last Updated:{" "}
                  {new Date(selectedAdmin.updatedAt).toLocaleString()}{" "}
                </Typography>
              </Box>
            )}
          </StyledModalBox>
        </Fade>
      </Modal>

      {/* Toast Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </GlassCard>
  );
};
export default OwnerDashboardAdmins;
