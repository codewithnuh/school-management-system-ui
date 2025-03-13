// EnhancedApplicationsTable.tsx
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  styled,
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import { useApplications } from "../../services/queries/application";
import { Application, ApplicationStatus } from "../../types";

type Teacher = Application; // teacher will now extend the application interface

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
})) as typeof TableContainer;

export default function ApplicationsTable() {
  const { data } = useApplications();
  //removed console.log

  const [teachers, setTeachers] = React.useState<Teacher[]>([]); // Initialize as empty array
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(
    null
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<ApplicationStatus | "">(""); // set a literal type

  // Pagination states
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  React.useEffect(() => {
    if (data?.data?.teachers) {
      setTeachers(data.data.teachers);
    }
  }, [data?.data?.teachers]); // Update when the data changes

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = page * rowsPerPage;
  const currentItems = teachers.slice(indexOfFirstItem, indexOfLastItem);

  const handleStatusChange = (teacherId: number, status: string) => {
    setNewStatus(status as ApplicationStatus);
    setConfirmOpen(true);
    const selectedTeacher = teachers.find(
      (teacher) => teacher.id === teacherId
    );
    setSelectedTeacher(selectedTeacher || null);
  };

  const confirmUpdate = () => {
    setConfirmOpen(false);
    if (selectedTeacher && newStatus) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === selectedTeacher.id
            ? { ...t, applicationStatus: newStatus }
            : t
        )
      );
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "status-menu" : undefined;

  return (
    <StyledTableContainer component={Paper}>
      <Table aria-label="enhanced-applications-table">
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Qualification</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentItems.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.firstName}</TableCell>
              <TableCell>{teacher.lastName}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.highestQualification}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="edit status"
                  aria-controls={id}
                  aria-haspopup="true"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <Edit />
                </IconButton>
                <Menu
                  id={id}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem
                    onClick={() => handleStatusChange(teacher.id, "Pending")}
                  >
                    Pending
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleStatusChange(teacher.id, "Approved")}
                  >
                    Approved
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleStatusChange(teacher.id, "Rejected")}
                  >
                    Rejected
                  </MenuItem>
                </Menu>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {teacher.applicationStatus}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton
                  aria-label="view details"
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={teachers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          "& .MuiTablePagination-toolbar": {
            borderBottom: "1px solid rgba(0,0,0,0.12)",
            padding: 2,
          },
          "& .MuiTablePagination-select": {
            marginLeft: "auto",
          },
        }}
      />

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change the status to{" "}
            <strong>{newStatus}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmUpdate} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Modal */}
      <Modal open={!!selectedTeacher} onClose={() => setSelectedTeacher(null)}>
        <Box sx={style}>
          {selectedTeacher && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Teacher Details
              </Typography>
              <Typography variant="body1">
                First Name: {selectedTeacher.firstName}
              </Typography>
              <Typography variant="body1">
                Last Name: {selectedTeacher.lastName}
              </Typography>
              <Typography variant="body1">
                Email: {selectedTeacher.email}
              </Typography>
              <Typography variant="body1">
                Phone Number: {selectedTeacher.phoneNo}
              </Typography>
              <Typography variant="body1">
                Address: {selectedTeacher.address}
              </Typography>
              <Typography variant="body1">
                Emergency Contact Name: {selectedTeacher.emergencyContactName}
              </Typography>
              <Typography variant="body1">
                Emergency Contact Number:{" "}
                {selectedTeacher.emergencyContactNumber}
              </Typography>
              {/* Add more details here */}
            </Box>
          )}
        </Box>
      </Modal>
    </StyledTableContainer>
  );
}
