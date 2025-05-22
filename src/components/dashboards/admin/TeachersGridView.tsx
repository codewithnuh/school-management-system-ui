import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  useGetAllTeachers,
  useUpdateTeacherById,
} from "../../../services/queries/teachers";
import { useNavigate } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../../../theme/darkTheme";
import { styled } from "@mui/material/styles";
import { TeacherData } from "../../../api/axios/registerTeachers";

// Styled Components
const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
}));

export default function TeacherGridView() {
  const navigate = useNavigate();
  const { data: teachers, isLoading } = useGetAllTeachers();
  const [localTeachers, setLocalTeachers] = useState<TeacherData[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState<Record<number, boolean>>(
    {}
  );
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setToast({
      open: true,
      message,
      severity,
    });
  };
  const handleCloseToast = () => setToast({ ...toast, open: false });
  const updateTeacher = useUpdateTeacherById();
  console.log(localTeachers);
  useEffect(() => {
    if (teachers?.data) {
      setLocalTeachers(teachers.data.rows);
    }
  }, [teachers]);

  const handleFieldChange = (rowId: number, field: string, value: any) => {
    setLocalTeachers((prev) =>
      prev.map((t) => (t.id === rowId ? { ...t, [field]: value } : t))
    );
    setUnsavedChanges((prev) => ({
      ...prev,
      [rowId]: true,
    }));
  };

  const handleRowSave = (rowId: number) => {
    const updatedTeacher = localTeachers.find((t) => t.id === rowId);
    // Call API mutation here
    if (!updatedTeacher) return;
    console.log({ updatedTeacher });
    updateTeacher.mutate(
      {
        data: { ...updatedTeacher },
        id: updatedTeacher.id as number,
      },
      {
        onSuccess: () => {
          showSnackbar("Teacher updated successfully", "success");
        },
        onError: (err) => {
          showSnackbar("Error updating teacher", "error");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box textAlign="center" mt={6}>
          <CircularProgress />
          <Typography mt={2}>Loading all teachers...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          All Teachers
        </Typography>

        <GlassCard elevation={3}>
          <TableContainer component={Paper}>
            <Table>
              <thead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </thead>
              <tbody>
                {localTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <TextField
                        value={`${teacher.firstName || ""} ${
                          teacher.lastName || ""
                        }`}
                        onChange={(e) => {
                          const [first, last] = e.target.value.split(" ");
                          handleFieldChange(
                            teacher.id as number,
                            "firstName",
                            first
                          );
                          handleFieldChange(
                            teacher.id as number,
                            "lastName",
                            last
                          );
                        }}
                        fullWidth
                        size="small"
                        sx={{
                          ".MuiOutlinedInput-input": {
                            p: 0.5,
                            fontSize: "0.9rem",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={teacher.email || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            teacher.id as number,
                            "email",
                            e.target.value
                          )
                        }
                        fullWidth
                        size="small"
                        sx={{
                          ".MuiOutlinedInput-input": {
                            p: 0.5,
                            fontSize: "0.9rem",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={teacher.address || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            teacher.id as number,
                            "address",
                            e.target.value
                          )
                        }
                        fullWidth
                        size="small"
                        sx={{
                          ".MuiOutlinedInput-input": {
                            p: 0.5,
                            fontSize: "0.9rem",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={teacher.isVerified ? "Yes" : "No"}
                        onChange={(e) =>
                          handleFieldChange(
                            teacher.id as number,
                            "isVerified",
                            e.target.value === "Yes"
                          )
                        }
                        fullWidth
                        size="small"
                        sx={{
                          ".MuiOutlinedInput-input": {
                            p: 0.5,
                            fontSize: "0.9rem",
                          },
                        }}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() =>
                          navigate(`/dashboard/admin/teachers/${teacher.id}`)
                        }
                        sx={{ mr: 1, color: "#fff", textTransform: "none" }}
                      >
                        View Profile
                      </Button>
                      <Button
                        onClick={() => handleRowSave(teacher.id as number)}
                        disabled={
                          teacher.id === undefined
                            ? true
                            : !unsavedChanges[teacher.id]
                        }
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: "none" }}
                      >
                        {unsavedChanges[teacher.id as number]
                          ? "Save"
                          : "Saved"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </GlassCard>
        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={5000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
