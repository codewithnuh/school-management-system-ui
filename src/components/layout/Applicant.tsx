import React, { useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import DetailsDialog from "../common/DetailsDialog";
import Alert from "@mui/material/Alert";
import { Application } from "../../types";
import Snackbar from "@mui/material/Snackbar";
import { useAcceptTeacherApplication } from "../../services/queries/application";

interface ApplicantListProps {
  applicants: Application[];
}

const ApplicantList: React.FC<ApplicantListProps> = ({ applicants }) => {
  const unRegisteredTeachers = applicants.filter(
    (applicant) => applicant.applicationStatus !== "Accepted"
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const {
    mutate: acceptTeacher,
    isLoading,
    isError,
    error,
  } = useAcceptTeacherApplication();

  const handleOpenDetails = (applicant: Application) => {
    setSelectedApplicant(applicant);
    setOpenDetailsDialog(true);
  };
  console.error(error);

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedApplicant(null);
  };

  const handleAccept = (id: number) => {
    acceptTeacher(id, {
      onSuccess: () => {
        setSnackbarMessage("Application accepted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      },
      onError: (err) => {
        setSnackbarMessage(
          `Error accepting application: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      },
    });
  };

  const handleReject = (id: number) => {
    try {
      // Implement reject logic here
      setSnackbarMessage("Application rejected!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(
        `Error rejecting application: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="applicants table">
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
          {unRegisteredTeachers.map((applicant) => (
            <TableRow
              key={applicant.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {applicant.firstName}
              </TableCell>
              <TableCell align="right">{applicant.email}</TableCell>
              <TableCell align="right">{applicant.phoneNo}</TableCell>
              <TableCell align="right">{applicant.address}</TableCell>
              <TableCell align="right">{applicant.applicationStatus}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  onClick={() => handleOpenDetails(applicant)}
                >
                  View
                </Button>
              </TableCell>
              <TableCell align="center" sx={{ display: "flex" }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ mr: 3 }}
                  onClick={() => handleAccept(applicant.id)}
                  disabled={isLoading}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => handleReject(applicant.id)}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {unRegisteredTeachers.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No applicants found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DetailsDialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        applicant={selectedApplicant}
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

export default ApplicantList;
