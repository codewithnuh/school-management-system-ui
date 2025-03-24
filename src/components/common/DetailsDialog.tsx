import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#fff",
    },
  },
});

interface Applicant {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNo: string;
  address: string;
  applicationStatus: string;
  cnic: string;
  createdAt: string;
  currentAddress: string | null;
  emergencyContactName: string;
  emergencyContactNumber: string;
  entityType: string;
  experienceYears: number | null;
  gender: string;
  highestQualification: string;
  isVerified: boolean;
  joiningDate: string;
  nationality: string | null;
  photo: string | null;
  role: string;
  specialization: string | null;
  subjectId: number | null;
  updatedAt: string;
}

interface DetailsDialogProps {
  applicant: Applicant | null;
  open: boolean;
  onClose: () => void;
}

const DetailsDialog: React.FC<DetailsDialogProps> = ({
  applicant,
  open,
  onClose,
}) => {
  if (!applicant) {
    return null; // Don't render if no applicant is selected
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="details-dialog-title"
        aria-describedby="details-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="details-dialog-title">Applicant Details</DialogTitle>
        <DialogContent>
          <DialogContentText id="details-dialog-description">
            <strong>ID:</strong> {applicant.id}
          </DialogContentText>
          <DialogContentText>
            <strong>Name:</strong>{" "}
            {`${applicant.firstName} ${
              applicant.middleName ? applicant.middleName + " " : ""
            }${applicant.lastName}`}
          </DialogContentText>
          <DialogContentText>
            <strong>Date of Birth:</strong>{" "}
            {new Date(applicant.dateOfBirth).toLocaleDateString()}
          </DialogContentText>
          <DialogContentText>
            <strong>Email:</strong> {applicant.email}
          </DialogContentText>
          <DialogContentText>
            <strong>Phone:</strong> {applicant.phoneNo}
          </DialogContentText>
          <DialogContentText>
            <strong>Address:</strong> {applicant.address}
          </DialogContentText>
          <DialogContentText>
            <strong>Application Status:</strong> {applicant.applicationStatus}
          </DialogContentText>
          <DialogContentText>
            <strong>CNIC:</strong> {applicant.cnic}
          </DialogContentText>
          <DialogContentText>
            <strong>Created At:</strong>{" "}
            {new Date(applicant.createdAt).toLocaleString()}
          </DialogContentText>
          <DialogContentText>
            <strong>Current Address:</strong>{" "}
            {applicant.currentAddress || "N/A"}
          </DialogContentText>
          <DialogContentText>
            <strong>Emergency Contact Name:</strong>{" "}
            {applicant.emergencyContactName}
          </DialogContentText>
          <DialogContentText>
            <strong>Emergency Contact Number:</strong>{" "}
            {applicant.emergencyContactNumber}
          </DialogContentText>
          <DialogContentText>
            <strong>Entity Type:</strong> {applicant.entityType}
          </DialogContentText>
          <DialogContentText>
            <strong>Experience Years:</strong>{" "}
            {applicant.experienceYears || "N/A"}
          </DialogContentText>
          <DialogContentText>
            <strong>Gender:</strong> {applicant.gender}
          </DialogContentText>
          <DialogContentText>
            <strong>Highest Qualification:</strong>{" "}
            {applicant.highestQualification}
          </DialogContentText>
          <DialogContentText>
            <strong>Is Verified:</strong> {applicant.isVerified ? "Yes" : "No"}
          </DialogContentText>
          <DialogContentText>
            <strong>Joining Date:</strong>{" "}
            {new Date(applicant.joiningDate).toLocaleDateString()}
          </DialogContentText>
          <DialogContentText>
            <strong>Nationality:</strong> {applicant.nationality || "N/A"}
          </DialogContentText>
          <DialogContentText>
            <strong>Role:</strong> {applicant.role}
          </DialogContentText>
          <DialogContentText>
            <strong>Specialization:</strong> {applicant.specialization || "N/A"}
          </DialogContentText>
          <DialogContentText>
            <strong>Subject ID:</strong> {applicant.subjectId || "N/A"}
          </DialogContentText>
          <DialogContentText>
            <strong>Updated At:</strong>{" "}
            {new Date(applicant.updatedAt).toLocaleString()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default DetailsDialog;
