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
import { Application } from "../../types"; // Assuming you have Application type

const ApplicantList = ({ applicants }: { applicants: Application[] }) => {
  const unRegisteredTeachers = applicants.filter(
    (applicant) => applicant.applicationStatus !== "Accepted"
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);

  const handleOpenDetails = (applicant: Application) => {
    setSelectedApplicant(applicant);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
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
                >
                  Accept
                </Button>
                <Button variant="contained" color="warning" size="small">
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
    </TableContainer>
  );
};

export default ApplicantList;
