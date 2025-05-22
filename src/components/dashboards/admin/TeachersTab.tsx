import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TableHead,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useGetAllTeachers } from "../../../services/queries/teachers";
import { darkTheme } from "../../../theme/darkTheme";
import { ThemeProvider, styled } from "@mui/material/styles";

// Styled Components
const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
}));

export default function TeachersTab() {
  const navigate = useNavigate();
  const { data, isLoading, error, isError } = useGetAllTeachers();
  console.log(data);
  // Example toast state
  const [toast, setToast] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
          <Typography ml={2}>Loading teachers...</Typography>
        </Box>
      </Container>
    );
  }

  if (isError || !data?.data) {
    return (
      <Container maxWidth="lg">
        <Box mt={4}>
          <Alert severity="error">Failed to load teachers</Alert>
          <Button onClick={() => window.location.reload()} variant="contained">
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Teacher Management
        </Typography>

        <GlassCard elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NAME</TableCell>
                  <TableCell>EMAIL</TableCell>
                  <TableCell>IS VERIFIED </TableCell>
                  <TableCell align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.rows.map((teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell>
                      {teacher.firstName} {teacher.lastName}
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.isVerified ? "Yes" : "No"}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() =>
                          navigate(
                            `/dashboard/admin/teachers/view/${teacher.id}`
                          )
                        }
                        sx={{
                          color: "#fff",
                          mr: 1,
                          textTransform: "none",
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        sx={{ textTransform: "none" }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box mt={3} display="flex" justifyContent="center">
            <Typography variant="body2">
              Page {data.page} of {data.totalPages}
            </Typography>
            <Box ml={2}>
              <Button disabled={data.page <= 1}>Previous</Button>
              <Button disabled={data.page >= data.totalPages}>Next</Button>
            </Box>
          </Box>
        </GlassCard>

        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setToast({ ...toast, open: false })}
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
