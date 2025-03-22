import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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

interface ApplicantListProps {
  applicants: Applicant[];
}

const ApplicantList: React.FC<ApplicantListProps> = ({ applicants }) => {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [openDetails, setOpenDetails] = useState(false);
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const handleOpenDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleOpenUpdateStatus = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setOpenUpdateStatus(true);
  };

  const handleCloseUpdateStatus = () => {
    setOpenUpdateStatus(false);
  };

  const handleUpdateStatus = () => {
    if (selectedApplicant) {
      // Logic to update the status (e.g., API call)
      console.log(
        `Updating status of ${selectedApplicant.firstName} to ${newStatus}`
      );
      setOpenUpdateStatus(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell>{`${applicant.firstName} ${applicant.lastName}`}</TableCell>
                <TableCell>{applicant.email}</TableCell>
                <TableCell>{applicant.applicationStatus}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDetails(applicant)}>
                    Details
                  </Button>
                  <Button onClick={() => handleOpenUpdateStatus(applicant)}>
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Modal */}
      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Applicant Details</DialogTitle>
        <DialogContent>
          {selectedApplicant && (
            <>
              <DialogContentText>
                <strong>ID:</strong> {selectedApplicant.id}
              </DialogContentText>
              <DialogContentText>
                <strong>Name:</strong>{" "}
                {`${selectedApplicant.firstName} ${
                  selectedApplicant.middleName
                    ? selectedApplicant.middleName + " "
                    : ""
                }${selectedApplicant.lastName}`}
              </DialogContentText>
              <DialogContentText>
                <strong>Date of Birth:</strong>{" "}
                {new Date(selectedApplicant.dateOfBirth).toLocaleDateString()}
              </DialogContentText>
              <DialogContentText>
                <strong>Email:</strong> {selectedApplicant.email}
              </DialogContentText>
              <DialogContentText>
                <strong>Phone:</strong> {selectedApplicant.phoneNo}
              </DialogContentText>
              <DialogContentText>
                <strong>Address:</strong> {selectedApplicant.address}
              </DialogContentText>
              <DialogContentText>
                <strong>Application Status:</strong>{" "}
                {selectedApplicant.applicationStatus}
              </DialogContentText>
              <DialogContentText>
                <strong>CNIC:</strong> {selectedApplicant.cnic}
              </DialogContentText>
              <DialogContentText>
                <strong>Created At:</strong>{" "}
                {new Date(selectedApplicant.createdAt).toLocaleString()}
              </DialogContentText>
              <DialogContentText>
                <strong>Current Address:</strong>{" "}
                {selectedApplicant.currentAddress || "N/A"}
              </DialogContentText>
              <DialogContentText>
                <strong>Emergency Contact Name:</strong>{" "}
                {selectedApplicant.emergencyContactName}
              </DialogContentText>
              <DialogContentText>
                <strong>Emergency Contact Number:</strong>{" "}
                {selectedApplicant.emergencyContactNumber}
              </DialogContentText>
              <DialogContentText>
                <strong>Entity Type:</strong> {selectedApplicant.entityType}
              </DialogContentText>
              <DialogContentText>
                <strong>Experience Years:</strong>{" "}
                {selectedApplicant.experienceYears || "N/A"}
              </DialogContentText>
              <DialogContentText>
                <strong>Gender:</strong> {selectedApplicant.gender}
              </DialogContentText>
              <DialogContentText>
                <strong>Highest Qualification:</strong>{" "}
                {selectedApplicant.highestQualification}
              </DialogContentText>
              <DialogContentText>
                <strong>Is Verified:</strong>{" "}
                {selectedApplicant.isVerified ? "Yes" : "No"}
              </DialogContentText>
              <DialogContentText>
                <strong>Joining Date:</strong>{" "}
                {new Date(selectedApplicant.joiningDate).toLocaleDateString()}
              </DialogContentText>
              <DialogContentText>
                <strong>Nationality:</strong>{" "}
                {selectedApplicant.nationality || "N/A"}
              </DialogContentText>
              <DialogContentText>
                <strong>Role:</strong> {selectedApplicant.role}
              </DialogContentText>
              <DialogContentText>
                <strong>Specialization:</strong>{" "}
                {selectedApplicant.specialization || "N/A"}
              </DialogContentText>
              <DialogContentText>
                <strong>Subject ID:</strong>{" "}
                {selectedApplicant.subjectId || "N/A"}
              </DialogContentText>
              <DialogContentText>
                <strong>Updated At:</strong>{" "}
                {new Date(selectedApplicant.updatedAt).toLocaleString()}
              </DialogContentText>
              {/* Add other details here */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={openUpdateStatus} onClose={handleCloseUpdateStatus}>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value as string)}
            >
              <MenuItem value={"Pending"}>Pending</MenuItem>
              <MenuItem value={"Approved"}>Approved</MenuItem>
              <MenuItem value={"Rejected"}>Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateStatus}>Cancel</Button>
          <Button onClick={handleUpdateStatus}>Update</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ApplicantList;
