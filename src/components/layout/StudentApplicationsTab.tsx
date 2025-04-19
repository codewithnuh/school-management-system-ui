import React, { useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Button,
  Alert,
  Snackbar,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import DetailsDialog from "../common/DetailsDialog";
import { Application } from "../../types";
import {
  useAcceptStudentApplication,
  useRejectStudentApplication,
} from "../../services/queries/application";
import { useStudentApplications } from "../../services/queries/studentApplication";

// Type for tracking which application is being processed
interface ProcessingState {
  [id: number]: {
    accepting: boolean;
    rejecting: boolean;
  };
}

const StudentApplicationsTab: React.FC = () => {
  // Query hooks
  const { data, isLoading, isError, error } = useStudentApplications();
  const acceptMutation = useAcceptStudentApplication();
  const rejectMutation = useRejectStudentApplication();

  // Filter out accepted applications
  const pendingApplications = data?.data
    ? data.data.filter(
        (applicant: Application) => applicant.isRegistered != true
      )
    : [];
  console.log(pendingApplications);
  // State management
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Track processing state for each application
  const [processingState, setProcessingState] = useState<ProcessingState>({});

  // Event handlers
  const handleOpenDetails = (applicant: Application): void => {
    setSelectedApplicant(applicant);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = (): void => {
    setOpenDetailsDialog(false);
    setSelectedApplicant(null);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error"
  ): void => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAccept = (id: number): void => {
    // Update processing state
    setProcessingState((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), accepting: true, rejecting: false },
    }));

    acceptMutation.mutate(id);

    // Handle success/error with useEffect
    if (acceptMutation.isSuccess) {
      showSnackbar("Student application accepted successfully!", "success");
      // Reset processing state
      setProcessingState((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), accepting: false },
      }));
    } else if (acceptMutation.isError) {
      const error = acceptMutation.error;
      showSnackbar(
        `Error accepting application: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
      // Reset processing state
      setProcessingState((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), accepting: false },
      }));
    }
  };

  const handleReject = (id: number): void => {
    // Update processing state
    setProcessingState((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), accepting: false, rejecting: true },
    }));

    rejectMutation.mutate(id);

    // Handle success/error with useEffect
    if (rejectMutation.isSuccess) {
      showSnackbar("Application rejected successfully!", "success");
      // Reset processing state
      setProcessingState((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), rejecting: false },
      }));
    } else if (rejectMutation.isError) {
      const error = rejectMutation.error;
      showSnackbar(
        `Error rejecting application: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
      // Reset processing state
      setProcessingState((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), rejecting: false },
      }));
    }
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ): void => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Effect to handle mutation success and errors
  React.useEffect(() => {
    if (acceptMutation.isSuccess) {
      showSnackbar("Student application accepted successfully!", "success");
      // Reset all processing states since we'll refetch data
      setProcessingState({});
    } else if (acceptMutation.isError) {
      const error = acceptMutation.error;
      showSnackbar(
        `Error accepting application: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
      // Reset processing state for all applications
      setProcessingState({});
    }
  }, [acceptMutation.isSuccess, acceptMutation.isError, acceptMutation.error]);

  React.useEffect(() => {
    if (rejectMutation.isSuccess) {
      showSnackbar("Application rejected successfully!", "success");
      // Reset all processing states since we'll refetch data
      setProcessingState({});
    } else if (rejectMutation.isError) {
      const error = rejectMutation.error;
      showSnackbar(
        `Error rejecting application: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
      // Reset processing state for all applications
      setProcessingState({});
    }
  }, [rejectMutation.isSuccess, rejectMutation.isError, rejectMutation.error]);

  // Render loading state
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading applications:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    );
  }

  // Return the main component UI
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="student applications table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Details</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingApplications.length > 0 ? (
            pendingApplications.map((applicant) => {
              const isProcessing = processingState[applicant.id] || {
                accepting: false,
                rejecting: false,
              };
              return (
                <TableRow
                  key={applicant.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {applicant.firstName} {applicant.lastName}
                  </TableCell>
                  <TableCell align="right">{applicant.email}</TableCell>
                  <TableCell align="right">{applicant.phoneNo}</TableCell>
                  <TableCell align="right">{applicant.address}</TableCell>
                  <TableCell align="right">
                    {applicant.applicationStatus}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => handleOpenDetails(applicant)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ mr: 1, minWidth: "80px" }}
                        onClick={() => handleAccept(applicant.id)}
                        disabled={
                          isProcessing.accepting || isProcessing.rejecting
                        }
                      >
                        {isProcessing.accepting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Accept"
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{ minWidth: "80px" }}
                        onClick={() => handleReject(applicant.id)}
                        disabled={
                          isProcessing.accepting || isProcessing.rejecting
                        }
                      >
                        {isProcessing.rejecting ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Reject"
                        )}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body1">
                  No pending applications found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialogs and notifications */}
      <DetailsDialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        applicant={
          selectedApplicant as Application
        } /* Type casting as a temporary fix */
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
};

export default StudentApplicationsTab;
