import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import DetailsDialog from "../common/DetailsDialog";
// Ensure the Application type includes 'userId'
import { Application } from "../../types";
import {
  useAcceptStudentApplication,
  useRejectStudentApplication,
} from "../../services/queries/application";
import { useStudentApplications } from "../../services/queries/studentApplication";
import { useFetchAllSectionsOfAClass } from "../../services/queries/section";
import { useUpdateStudentById } from "../../services/queries/student";

// Types
interface ProcessingState {
  [id: number]: {
    accepting: boolean;
    rejecting: boolean;
  };
}

interface Section {
  id: string; // Keep as string if API returns string IDs
  name: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const StudentApplicationsTab: React.FC = () => {
  // =============== STATE MANAGEMENT ===============
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({});
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [openSectionDialog, setOpenSectionDialog] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(""); // Keep as string
  const [sections, setSections] = useState<Section[]>([]);
  const [classId, setClassId] = useState<number | undefined>(undefined); // Initialize as undefined
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // =============== DATA FETCHING ===============
  const { data, isLoading, isError, error, refetch } = useStudentApplications();
  const acceptMutation = useAcceptStudentApplication();
  const rejectMutation = useRejectStudentApplication();
  const updateStudentMutation = useUpdateStudentById();

  // Fetch sections only if classId is defined and the dialog is open
  const {
    data: sectionsData,
    isLoading: sectionsLoading,
    isError: isSectionsError,
    error: sectionsError,
  } = useFetchAllSectionsOfAClass(classId!, {
    enabled: !!classId && openSectionDialog, // Only fetch when classId is set and dialog is open
  });

  // =============== DERIVED STATE ===============
  const pendingApplications = data?.data
    ? data.data.filter(
        (applicant: Application) => applicant.isRegistered !== true
      )
    : [];

  // =============== EFFECTS ===============
  // Update sections when data is loaded
  useEffect(() => {
    if (sectionsData) {
      // Ensure section IDs are strings if needed, or parse if backend expects numbers
      setSections(sectionsData.data.map((s) => ({ ...s, id: String(s.id) }))); // Example: Ensure ID is string
      if (
        snackbar.severity === "error" &&
        snackbar.message.includes("section")
      ) {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }
    }
  }, [sectionsData, snackbar.message, snackbar.severity]); // Added dependencies

  // Handle errors in section loading
  useEffect(() => {
    if (isSectionsError && openSectionDialog) {
      showSnackbar(
        `Error loading sections: ${
          sectionsError instanceof Error
            ? sectionsError.message
            : "Unknown error"
        }`,
        "error"
      );
    }
  }, [isSectionsError, sectionsError, openSectionDialog]);

  // Handle accept mutation status
  useEffect(() => {
    if (acceptMutation.isSuccess) {
      // Message moved to handleAcceptWithSection success block
      setProcessingState({});
      refetch(); // Refetch data after successful accept
    } else if (acceptMutation.isError) {
      showSnackbar(
        `Error accepting application: ${
          acceptMutation.error instanceof Error
            ? acceptMutation.error.message
            : "Unknown error"
        }`,
        "error"
      );
      setProcessingState({});
    }
  }, [
    acceptMutation.isSuccess,
    acceptMutation.isError,
    acceptMutation.error,
    refetch,
  ]); // Added refetch

  // Handle reject mutation status
  useEffect(() => {
    if (rejectMutation.isSuccess) {
      showSnackbar("Application rejected successfully!", "success");
      setProcessingState({});
      refetch(); // Refetch data after successful reject
    } else if (rejectMutation.isError) {
      showSnackbar(
        `Error rejecting application: ${
          rejectMutation.error instanceof Error
            ? rejectMutation.error.message
            : "Unknown error"
        }`,
        "error"
      );
      setProcessingState({});
    }
  }, [
    rejectMutation.isSuccess,
    rejectMutation.isError,
    rejectMutation.error,
    refetch,
  ]); // Added refetch

  // =============== EVENT HANDLERS ===============
  const showSnackbar = (
    message: string,
    severity: "success" | "error"
  ): void => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event, // Make event optional
    reason?: string
  ): void => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenDetails = (applicant: Application): void => {
    setSelectedApplicant(applicant);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = (): void => {
    setOpenDetailsDialog(false);
    setSelectedApplicant(null);
  };

  // Section dialog handlers
  const handleOpenSectionDialog = (applicant: Application): void => {
    if (applicant.classId) {
      setSelectedApplicant(applicant);
      setClassId(applicant.classId); // Set classId here to trigger section fetching
      setOpenSectionDialog(true);
    } else {
      showSnackbar("Applicant is missing class information.", "error");
    }
  };

  const handleCloseSectionDialog = (): void => {
    setOpenSectionDialog(false);
    setSelectedSectionId("");
    setSelectedApplicant(null); // Clear selected applicant
    setClassId(undefined); // Reset classId
  };

  // Use MUI's SelectChangeEvent type for better type safety
  const handleSectionChange = (event: SelectChangeEvent<string>): void => {
    setSelectedSectionId(event.target.value);
  };

  // Action handlers
  const handleAccept = (id: number): void => {
    const applicant = pendingApplications.find((app) => app.id === id);
    if (applicant) {
      handleOpenSectionDialog(applicant);
    } else {
      showSnackbar("Could not find applicant information", "error");
    }
  };

  const handleAcceptWithSection = async (): Promise<void> => {
    if (!selectedApplicant || !selectedSectionId) {
      showSnackbar(
        "Applicant information or section selection is missing. Cannot proceed.",
        "error"
      );
      return;
    }

    // Use the applicant's ID if the userId is not available
    // The backend might be expecting the applicant's ID as the userId
    // or there might be a relationship where the ID is used to link records
    const userId = selectedApplicant.id;

    const applicantId = selectedApplicant.id; // Store ID before clearing state

    setProcessingState((prev) => ({
      ...prev,
      [applicantId]: {
        ...(prev[applicantId] || {}),
        accepting: true,
        rejecting: false,
      },
    }));

    try {
      // First update the student with the section and userId
      await updateStudentMutation.mutate({
        id: applicantId,
        data: {
          // Ensure the types match what your backend expects (Number vs String)
          sectionId: Number(selectedSectionId), // Convert if backend expects number
          isRegistered: true,
        },
      });

      // Then accept the application (this might just update status)
      await acceptMutation.mutateAsync(applicantId);

      // Success message after both mutations succeed
      showSnackbar(
        "Student application accepted and section assigned successfully!",
        "success"
      );
      handleCloseSectionDialog(); // Close dialog on success
      // refetch() will be called by the useEffect hook listening to acceptMutation.isSuccess
    } catch (error) {
      console.error("Error accepting application with section:", error);
      // Provide more specific error feedback if possible
      const updateError = updateStudentMutation.error;
      const acceptError = acceptMutation.error;
      let errorMessage = "Error accepting application";
      if (updateError instanceof Error) {
        errorMessage += `: Failed to update student - ${updateError.message}`;
      } else if (acceptError instanceof Error) {
        errorMessage += `: Failed to accept application - ${acceptError.message}`;
      } else if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      } else {
        errorMessage += ": Unknown error";
      }
      showSnackbar(errorMessage, "error");

      // Reset processing state even on error
      setProcessingState((prev) => {
        const newState = { ...prev };
        if (newState[applicantId]) {
          newState[applicantId] = {
            ...newState[applicantId],
            accepting: false,
          };
        }
        return newState;
      });
    }
    // No finally block needed for resetting state here, as useEffect handles it on success/error
  };

  const handleReject = (id: number): void => {
    setProcessingState((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), accepting: false, rejecting: true },
    }));
    rejectMutation.mutate(id);
  };

  // =============== RENDER METHODS ===============
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading applications:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
        <Button variant="outlined" onClick={() => refetch()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  // No need for renderApplicationRow function if mapping directly
  // const renderApplicationRow = (applicant: Application) => { ... }

  // =============== MAIN RENDER ===============
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
              // Calculate processing state inside the map
              const isProcessing = processingState[applicant.id] || {
                accepting: false,
                rejecting: false,
              };
              const isDisabled =
                isProcessing.accepting || isProcessing.rejecting;

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
                      disabled={isDisabled}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      {" "}
                      {/* Added gap */}
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ minWidth: "80px" }}
                        onClick={() => handleAccept(applicant.id)}
                        disabled={isDisabled}
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
                        disabled={isDisabled}
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
        applicant={selectedApplicant}
        // Add onViewFile prop if DetailsDialog needs it
        // onViewFile={(url, type, title) => console.log('View file:', url, type, title)}
      />

      {/* Section Selection Dialog */}
      <Dialog open={openSectionDialog} onClose={handleCloseSectionDialog}>
        <DialogTitle>Assign Section</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a section for student{" "}
            {selectedApplicant
              ? `${selectedApplicant.firstName} ${selectedApplicant.lastName}`
              : ""}{" "}
            before accepting the application.
          </DialogContentText>
          {isSectionsError &&
            !sectionsLoading && ( // Show error only if not loading
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                Error loading sections:{" "}
                {sectionsError instanceof Error
                  ? sectionsError.message
                  : "Unknown error"}
              </Alert>
            )}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="section-select-label">Section</InputLabel>
            <Select<string> // Explicitly type Select value as string
              labelId="section-select-label"
              value={selectedSectionId}
              label="Section"
              onChange={handleSectionChange} // Use updated handler
              disabled={sectionsLoading || sections.length === 0} // Disable if loading or no sections
            >
              {sectionsLoading && (
                <MenuItem disabled value="">
                  <em>Loading sections...</em>
                </MenuItem>
              )}
              {!sectionsLoading && sections.length === 0 && (
                <MenuItem disabled value="">
                  <em>No sections available for this class</em>
                </MenuItem>
              )}
              {!sectionsLoading &&
                sections.length > 0 &&
                sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {" "}
                    {/* Ensure value is string */}
                    {section.name}
                  </MenuItem>
                ))}
            </Select>
            {sectionsLoading && <LinearProgress sx={{ mt: 1 }} />}{" "}
            {/* Optional: Show linear progress */}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSectionDialog}
            disabled={
              updateStudentMutation.isLoading || acceptMutation.isLoading
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleAcceptWithSection}
            variant="contained"
            color="primary"
            // Disable button if no section selected, still loading sections, or mutations are in progress
            disabled={
              !selectedSectionId ||
              sectionsLoading ||
              updateStudentMutation.isLoading ||
              acceptMutation.isLoading
            }
          >
            {updateStudentMutation.isLoading || acceptMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Accept & Assign"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position snackbar
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled" // Use filled variant for better visibility
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
};

// Need to import SelectChangeEvent and LinearProgress from MUI
import { SelectChangeEvent, LinearProgress } from "@mui/material";

export default StudentApplicationsTab;
