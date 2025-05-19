"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../../../theme/darkTheme";

// Mock data — replace with real API calls
const mockAdmins = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subscriptionStatus: "active" as const,
    subscriptionType: "yearly" as const,
    schoolsCreated: 3,
    classes: 24,
    students: 300,
    teachers: 28,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    subscriptionStatus: "disabled" as const,
    subscriptionType: "monthly" as const,
    schoolsCreated: 1,
    classes: 9,
    students: 110,
    teachers: 12,
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    subscriptionStatus: "active" as const,
    subscriptionType: "monthly" as const,
    schoolsCreated: 2,
    classes: 16,
    students: 200,
    teachers: 18,
  },
  {
    id: 4,
    name: "Alice Johnson",
    email: "alice@example.com",
    subscriptionStatus: "active" as const,
    subscriptionType: "monthly" as const,
    schoolsCreated: 2,
    classes: 16,
    students: 200,
    teachers: 18,
  },
  {
    id: 5,
    name: "Alice Johnson",
    email: "alice@example.com",
    subscriptionStatus: "active" as const,
    subscriptionType: "monthly" as const,
    schoolsCreated: 2,
    classes: 16,
    students: 200,
    teachers: 18,
  },
  {
    id: 6,
    name: "Alice Johnson",
    email: "alice@example.com",
    subscriptionStatus: "active" as const,
    subscriptionType: "monthly" as const,
    schoolsCreated: 2,
    classes: 16,
    students: 200,
    teachers: 18,
  },
];

type Admin = {
  id: number;
  name: string;
  email: string;
  subscriptionStatus: "active" | "disabled";
  subscriptionType: "monthly" | "yearly";
  schoolsCreated: number;
  classes: number;
  students: number;
  teachers: number;
};

export default function OwnerDashboardAdmins() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const totalPages = Math.ceil(admins.length / pageSize);

  const paginatedAdmins = admins.slice((page - 1) * pageSize, page * pageSize);

  const handleToggleStatus = (id: number) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === id
          ? {
              ...admin,
              subscriptionStatus:
                admin.subscriptionStatus === "active" ? "disabled" : "active",
            }
          : admin
      )
    );
  };

  const handleChangeSubscriptionType = (
    id: number,
    newType: "monthly" | "yearly"
  ) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === id ? { ...admin, subscriptionType: newType } : admin
      )
    );
  };

  const openDetailsModal = (admin: Admin) => {
    setSelectedAdmin(admin);
  };

  const closeDetailsModal = () => {
    setSelectedAdmin(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Title */}
        <Typography variant="h4" gutterBottom textAlign="center">
          Admin Management Dashboard
        </Typography>

        {/* Admin Table */}
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="admins table">
            <TableBody>
              {paginatedAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell component="th" scope="row">
                    {admin.name}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel>Plan</InputLabel>
                      <Select
                        value={admin.subscriptionType}
                        label="Plan"
                        onChange={(e) =>
                          handleChangeSubscriptionType(
                            admin.id,
                            e.target.value as "monthly" | "yearly"
                          )
                        }
                        sx={{
                          color: "#fff",
                          "& .MuiSelect-select": {
                            padding: "8px",
                          },
                        }}
                      >
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={
                        admin.subscriptionStatus === "active"
                          ? "contained"
                          : "outlined"
                      }
                      color={
                        admin.subscriptionStatus === "active"
                          ? "success"
                          : "error"
                      }
                      onClick={() => handleToggleStatus(admin.id)}
                      fullWidth
                    >
                      {admin.subscriptionStatus === "active"
                        ? "Disable Subscription"
                        : "Enable Subscription"}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openDetailsModal(admin)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box mt={2} display="flex" justifyContent="center" gap={2}>
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            variant="outlined"
            color="primary"
          >
            Previous
          </Button>
          <Typography alignSelf="center">
            Page {page} of {totalPages || 1}
          </Typography>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            variant="outlined"
            color="primary"
          >
            Next
          </Button>
        </Box>

        {/* Details Modal */}
        <Dialog open={!!selectedAdmin} onClose={closeDetailsModal}>
          {selectedAdmin && (
            <>
              <DialogTitle>{selectedAdmin.name}'s Profile</DialogTitle>
              <DialogContent dividers>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Email:
                    </Typography>
                    <Typography>{selectedAdmin.email}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Schools Created:
                    </Typography>
                    <Typography>{selectedAdmin.schoolsCreated}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total Classes:
                    </Typography>
                    <Typography>{selectedAdmin.classes}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total Students:
                    </Typography>
                    <Typography>{selectedAdmin.students}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total Teachers:
                    </Typography>
                    <Typography>{selectedAdmin.teachers}</Typography>
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDetailsModal} color="primary">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
