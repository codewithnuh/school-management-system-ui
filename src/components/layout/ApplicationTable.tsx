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
import { useNavigate } from "react-router";

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  highestQualification: string;
  applicationStatus: string;
  phoneNo: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
}

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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

export default function ApplicationsTable() {
  const [teachers, setTeachers] = React.useState<Teacher[]>([
    // Mock data entries as before
    {
      id: 1,
      firstName: "Moses",
      lastName: "Doyle",
      email: "Lesley38@gmail.com",
      highestQualification: "Masters",
      applicationStatus: "Pending",
      phoneNo: "(941) 256-7774 x11268",
      address: "388 Becker Street",
      emergencyContactName: "William Schultz",
      emergencyContactNumber: "786-923-0380 x94863",
    },
    // Add more mock entries here...
  ]);

  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(
    null
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState("");

  // Pagination states
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
    setNewStatus(status);
    setConfirmOpen(true);
  };

  const confirmUpdate = () => {
    setConfirmOpen(false);
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === selectedTeacher?.id
          ? { ...t, applicationStatus: newStatus }
          : t
      )
    );
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
        <Box sx={style}>{/* Details content as before */}</Box>
      </Modal>
    </StyledTableContainer>
  );
}
