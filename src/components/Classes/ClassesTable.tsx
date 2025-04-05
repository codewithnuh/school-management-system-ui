import React, { useState } from "react";
import type { ClassData } from "../../types/class";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import { useClasses } from "../../services/queries/classes";
import { useNavigate } from "react-router";

const ClassesTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const { data } = useClasses();
  const classesData = data ? data : [];
  const navigate = useNavigate();
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClass = (classId: number) => {
    // This will be replaced with actual navigation in the future
    console.log(`Navigate to edit page for class ${classId}`);
    // Example implementation:
    navigate(`/dashboard/admin/classes/edit/${classId}`);
    // navigate(`/classes/edit/${classId}`);
  };

  const handleViewDetails = (classData: ClassData) => {
    setSelectedClass(classData);
  };

  const handleCloseDetails = () => {
    setSelectedClass(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Classes Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View and manage all classes in the school system. Click on edit to
        modify class details.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Class Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Max Students</TableCell>
                    <TableCell>Period Day</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classesData &&
                    classesData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell>{row.description}</TableCell>

                          <TableCell>{row.maxStudents}</TableCell>
                          <TableCell>{row.periodLength}</TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewDetails(row)}
                                  color="info"
                                >
                                  <InfoIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Class">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClass(row.id)}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={classesData!.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>

        {selectedClass && (
          <Card sx={{ minWidth: 300, maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedClass.name}
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Description
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedClass.description}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Period Length
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedClass.periodLength}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Periods Per Day
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedClass.periodsPerDay}
              </Typography>
              <Box
                sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCloseDetails}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditClass(selectedClass.id)}
                >
                  Edit Class
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default ClassesTable;
