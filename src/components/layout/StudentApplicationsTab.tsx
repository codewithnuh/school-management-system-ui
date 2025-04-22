import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress, // Added here
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent, // Added here
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// Assuming DetailsDialog is correctly imported and memoized if necessary
import DetailsDialog from "../common/DetailsDialog";
import { Application } from "../../types"; // Ensure this type includes necessary fields like classId
import {
  useAcceptStudentApplication,
  useRejectStudentApplication,
} from "../../services/queries/application";
import { useStudentApplications } from "../../services/queries/studentApplication";
import { useFetchAllSectionsOfAClass } from "../../services/queries/section";
import { useUpdateStudentById } from "../../services/queries/student";

// --- Types ---
interface ProcessingState {
  [id: number]: {
    accepting: boolean;
    rejecting: boolean;
  };
}

interface Section {
  id: string; // Keep as string if API returns string IDs or adjust as needed
  name: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

// --- Component ---
const StudentApplicationsTab: React.FC = () => {
  // --- State ---
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({});
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [openSectionDialog, setOpenSectionDialog] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [classIdForSections, setClassIdForSections] = useState<
    number | undefined
  >(undefined);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // --- Data Fetching (React Query Hooks) ---
  const {
    data: applicationsData,
    isLoading: isLoadingApplications,
    isError: isApplicationsError,
    error: applicationsError,
    refetch: refetchApplications,
  } = useStudentApplications();

  const acceptMutation = useAcceptStudentApplication();
  const rejectMutation = useRejectStudentApplication();
  const updateStudentMutation = useUpdateStudentById();

  const {
    data: sectionsData,
    isLoading: isLoadingSections,
    isError: isSectionsError,
    error: sectionsError,
  } = useFetchAllSectionsOfAClass(classIdForSections!, {
    enabled: !!classIdForSections && openSectionDialog, // Fetch only when needed
  });

  // --- Derived State ---
  const pendingApplications = useMemo(() => {
    return applicationsData?.data
      ? applicationsData.data.filter(
          (applicant: Application) => applicant.isRegistered !== true
        )
      : [];
  }, [applicationsData]);

  // --- Effects ---

  // Update sections state when fetched
  useEffect(() => {
    if (sectionsData?.data) {
      // Ensure section IDs are strings if the Select component expects strings
      setSections(sectionsData.data.map((s) => ({ ...s, id: String(s.id) })));
    } else if (!isLoadingSections) {
      // Clear sections if data is null/undefined after loading finishes
      setSections([]);
    }
  }, [sectionsData, isLoadingSections]);

  // Show error snackbar if fetching sections fails
  useEffect(() => {
    if (isSectionsError && openSectionDialog) {
      const message =
        sectionsError instanceof Error
          ? sectionsError.message
          : "Unknown error loading sections";
      setSnackbar({
        open: true,
        message: `Error: ${message}`,
        severity: "error",
      });
    }
  }, [isSectionsError, sectionsError, openSectionDialog]);

  // Handle mutation results (accept/reject)
  useEffect(() => {
    if (acceptMutation.isSuccess || acceptMutation.isError) {
      if (acceptMutation.isError) {
        const message =
          acceptMutation.error instanceof Error
            ? acceptMutation.error.message
            : "Unknown error accepting application";
        setSnackbar({
          open: true,
          message: `Error: ${message}`,
          severity: "error",
        });
      }
      // Reset processing state on success or error
      setProcessingState({});
      // Refetch if mutation succeeded (success message handled in handleAcceptWithSection)
      if (acceptMutation.isSuccess) refetchApplications();
    }
  }, [
    acceptMutation.isSuccess,
    acceptMutation.isError,
    acceptMutation.error,
    refetchApplications,
  ]);

  useEffect(() => {
    if (rejectMutation.isSuccess || rejectMutation.isError) {
      if (rejectMutation.isSuccess) {
        setSnackbar({
          open: true,
          message: "Application rejected successfully!",
          severity: "success",
        });
        refetchApplications();
      } else {
        // isError
        const message =
          rejectMutation.error instanceof Error
            ? rejectMutation.error.message
            : "Unknown error rejecting application";
        setSnackbar({
          open: true,
          message: `Error: ${message}`,
          severity: "error",
        });
      }
      // Reset processing state on success or error
      setProcessingState({});
    }
  }, [
    rejectMutation.isSuccess,
    rejectMutation.isError,
    rejectMutation.error,
    refetchApplications,
  ]);

  // --- Event Handlers (Memoized) ---

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error"): void => {
      setSnackbar({ open: true, message, severity });
    },
    [] // No dependencies needed
  );

  const handleSnackbarClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string): void => {
      if (reason === "clickaway") return;
      setSnackbar((prev) => ({ ...prev, open: false }));
    },
    [] // No dependencies needed
  );

  const handleOpenDetails = useCallback((applicant: Application): void => {
    setSelectedApplicant(applicant);
    setOpenDetailsDialog(true);
  }, []);

  const handleCloseDetailsDialog = useCallback((): void => {
    setOpenDetailsDialog(false);
    setSelectedApplicant(null);
  }, []);

  const handleOpenSectionDialog = useCallback(
    (applicant: Application): void => {
      if (applicant.classId) {
        setSelectedApplicant(applicant);
        setClassIdForSections(applicant.classId); // Trigger section fetching
        setOpenSectionDialog(true);
      } else {
        showSnackbar("Applicant is missing class information.", "error");
      }
    },
    [showSnackbar] // Dependency: showSnackbar
  );

  const handleCloseSectionDialog = useCallback((): void => {
    setOpenSectionDialog(false);
    setSelectedSectionId("");
    setSelectedApplicant(null);
    setClassIdForSections(undefined); // Reset classId
    setSections([]); // Clear sections state
  }, []);

  const handleSectionChange = useCallback(
    (event: SelectChangeEvent<string>): void => {
      setSelectedSectionId(event.target.value);
    },
    []
  );

  const handleAccept = useCallback(
    (id: number): void => {
      const applicant = pendingApplications.find((app) => app.id === id);
      if (applicant) {
        handleOpenSectionDialog(applicant);
      } else {
        showSnackbar("Could not find applicant information.", "error");
      }
    },
    [pendingApplications, handleOpenSectionDialog, showSnackbar] // Dependencies
  );

  const handleReject = useCallback(
    (id: number): void => {
      setProcessingState((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), accepting: false, rejecting: true },
      }));
      rejectMutation.mutate(id);
    },
    [rejectMutation] // Dependency: rejectMutation hook
  );

  const handleAcceptWithSection = useCallback(async (): Promise<void> => {
    if (!selectedApplicant || !selectedSectionId) {
      showSnackbar(
        "Applicant information or section selection is missing.",
        "error"
      );
      return;
    }

    // Use applicant ID consistently, backend might map this to a user or student record
    const applicantId = selectedApplicant.id;

    setProcessingState((prev) => ({
      ...prev,
      [applicantId]: { accepting: true, rejecting: false },
    }));

    try {
      // 1. Update student record with section and mark as registered
      await updateStudentMutation.mutateAsync({
        // Use mutateAsync to await
        id: applicantId,
        data: {
          // Ensure type matches backend expectation (Number vs String)
          sectionId: Number(selectedSectionId),
          isRegistered: true,
          firstName: selectedApplicant?.firstName || "",
          lastName: selectedApplicant?.lastName || "",
          dateOfBirth: selectedApplicant?.dateOfBirth
            ? new Date(selectedApplicant.dateOfBirth)
            : new Date(),
          gender: selectedApplicant?.gender || "",
          email: selectedApplicant?.email || "",
          phoneNo: selectedApplicant?.phoneNo || "",
          address: selectedApplicant?.address || "",
          // Add other required fields from the User type here
        },
      });

      // 2. Update the application status itself (if needed)
      await acceptMutation.mutateAsync(applicantId); // Use mutateAsync to await

      // 3. Success feedback and cleanup
      showSnackbar(
        "Student application accepted and section assigned successfully!",
        "success"
      );
      handleCloseSectionDialog(); // Close dialog on success
      // Refetch is handled by the useEffect hook listening to acceptMutation
    } catch (error) {
      console.error("Error accepting application with section:", error);
      // Error feedback (uses state from hooks if available, otherwise generic)
      const updateErrorMsg =
        updateStudentMutation.error instanceof Error
          ? `Update failed: ${updateStudentMutation.error.message}`
          : "";
      const acceptErrorMsg =
        acceptMutation.error instanceof Error
          ? `Accept failed: ${acceptMutation.error.message}`
          : "";
      const generalErrorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";

      showSnackbar(
        `Error accepting application: ${
          updateErrorMsg || acceptErrorMsg || generalErrorMsg
        }`,
        "error"
      );

      // Reset processing state on error (useEffect will also catch this, but good practice here too)
      setProcessingState((prev) => {
        const newState = { ...prev };
        if (newState[applicantId]) {
          newState[applicantId] = {
            ...newState[applicantId],
            accepting: false, // Ensure acceptance state is cleared
          };
        }
        return newState;
      });
    }
    // No finally needed as useEffect handles state cleanup robustly on success/error completion
  }, [
    selectedApplicant,
    selectedSectionId,
    updateStudentMutation,
    acceptMutation,
    showSnackbar,
    handleCloseSectionDialog,
    // Note: processingState is *not* needed as dependency, setting it doesn't require the previous value directly here
  ]);

  // --- Render Logic: Loading / Error States ---
  if (isLoadingApplications) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isApplicationsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading applications:{" "}
          {applicationsError instanceof Error
            ? applicationsError.message
            : "Unknown error"}
        </Alert>
        <Button
          variant="outlined"
          onClick={() => refetchApplications()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // --- Main Render ---
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="student applications table">
        <TableHead>
          <TableRow>
            {/* Consider defining headers in an array for easier management */}
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
              const isProcessing = processingState[applicant.id] ?? {
                accepting: false,
                rejecting: false,
              };
              const isDisabled =
                isProcessing.accepting || isProcessing.rejecting;

              return (
                <TableRow
                  key={applicant.id}
                  hover // Add hover effect
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
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ minWidth: "80px", position: "relative" }} // Added relative for positioning spinner
                        onClick={() => handleAccept(applicant.id)}
                        disabled={isDisabled}
                      >
                        {isProcessing.accepting ? (
                          <CircularProgress
                            size={20}
                            color="inherit"
                            sx={{ position: "absolute" }}
                          /> // Position spinner absolutely inside button
                        ) : (
                          "Accept"
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{ minWidth: "80px", position: "relative" }}
                        onClick={() => handleReject(applicant.id)}
                        disabled={isDisabled}
                      >
                        {isProcessing.rejecting ? (
                          <CircularProgress
                            size={20}
                            color="inherit"
                            sx={{ position: "absolute" }}
                          />
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
                <Typography variant="body1" sx={{ p: 2 }}>
                  No pending applications found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* --- Dialogs & Snackbar --- */}
      <DetailsDialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        applicant={selectedApplicant}
        // Pass necessary props like onViewFile if DetailsDialog requires them
      />

      <Dialog
        open={openSectionDialog}
        onClose={handleCloseSectionDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Assign Section</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Select a section for student{" "}
            <strong>
              {selectedApplicant
                ? `${selectedApplicant.firstName} ${selectedApplicant.lastName}`
                : ""}
            </strong>
            .
          </DialogContentText>

          {/* Display Error Alert within Dialog Content if sections fail to load */}
          {isSectionsError && !isLoadingSections && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading sections:{" "}
              {sectionsError instanceof Error
                ? sectionsError.message
                : "Unknown error"}
            </Alert>
          )}

          <FormControl fullWidth variant="outlined">
            <InputLabel id="section-select-label">Section</InputLabel>
            <Select<string> // Explicitly type Select value as string
              labelId="section-select-label"
              value={selectedSectionId}
              label="Section"
              onChange={handleSectionChange}
              disabled={
                isLoadingSections || isSectionsError || sections.length === 0
              }
            >
              {/* Loading State */}
              {isLoadingSections && (
                <MenuItem disabled value="">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <em>Loading sections...</em>
                  </Box>
                </MenuItem>
              )}
              {/* Empty/Error State (after loading) */}
              {!isLoadingSections && sections.length === 0 && (
                <MenuItem disabled value="">
                  <em>
                    {isSectionsError
                      ? "Error loading sections"
                      : "No sections available"}
                  </em>
                </MenuItem>
              )}
              {/* Options */}
              {!isLoadingSections &&
                sections.length > 0 &&
                sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
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
            sx={{ minWidth: "140px", position: "relative" }} // Ensure button size consistency
            disabled={
              !selectedSectionId || // Must select a section
              isLoadingSections || // Cannot accept while sections loading
              updateStudentMutation.isLoading || // Cannot accept during mutations
              acceptMutation.isLoading
            }
          >
            {updateStudentMutation.isLoading || acceptMutation.isLoading ? (
              <CircularProgress
                size={24}
                color="inherit"
                sx={{ position: "absolute" }}
              />
            ) : (
              "Accept & Assign"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Common position
      >
        {/* Wrapping Alert for onClose prop */}
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
};

export default StudentApplicationsTab;
