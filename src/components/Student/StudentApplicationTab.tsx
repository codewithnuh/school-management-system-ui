import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  useGetAllApplications,
  useUpdateApplication,
} from "../../services/queries/applications";
import { useFetchAllSectionsOfAClass } from "../../services/queries/section"; // Import from section.ts
import { useUpdateStudentById } from "../../services/queries/student";
import { toast } from "react-toastify";

interface Section {
  id: string;
  name: string;
}

const StudentApplicationTab = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch applications
  const { data: applications, isLoading, refetch } = useGetAllApplications();

  // Update application mutation
  const updateApplicationMutation = useUpdateApplication();

  // Update student mutation
  const updateStudentMutation = useUpdateStudentById();

  // Fetch sections by class ID when a student is selected
  const { data: sectionsData, isLoading: sectionsLoading } =
    useFetchAllSectionsOfAClass(
      selectedStudent?.classId ? Number(selectedStudent.classId) : 0
    );

  // Update sections state when sectionsData changes
  useEffect(() => {
    if (sectionsData) {
      setSections(sectionsData);
    }
  }, [sectionsData]);

  // Handle opening the dialog for accepting application
  const handleAcceptClick = (student: any) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setSelectedSectionId("");
  };

  // Handle section change
  const handleSectionChange = (event: any) => {
    setSelectedSectionId(event.target.value);
  };

  // Submit accept application with section update
  const handleAcceptApplication = async () => {
    if (!selectedStudent || !selectedSectionId) {
      toast.error("Please select a section before accepting the application");
      return;
    }

    setLoading(true);
    try {
      // First, update the student with the selected section
      await updateStudentMutation.mutateAsync({
        id: selectedStudent.id,
        data: {
          sectionId: selectedSectionId,
          // Include other necessary student fields here
          status: "active",
        },
      });

      // Then, update the application status to 'accepted'
      await updateApplicationMutation.mutateAsync({
        id: selectedStudent.applicationId,
        data: { status: "accepted" },
      });

      toast.success(
        "Student application accepted and section assigned successfully"
      );
      refetch(); // Refresh the applications list
      handleCloseDialog();
    } catch (error) {
      console.error("Error accepting application:", error);
      toast.error("Failed to accept student application");
    } finally {
      setLoading(false);
    }
  };

  // Handle reject application
  const handleRejectApplication = async (applicationId: string) => {
    try {
      await updateApplicationMutation.mutateAsync({
        id: applicationId,
        data: { status: "rejected" },
      });
      toast.success("Application rejected successfully");
      refetch();
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    }
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "className", headerName: "Class", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAcceptClick(params.row)}
            disabled={
              params.row.status === "accepted" ||
              params.row.status === "rejected"
            }
            sx={{ mr: 1 }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRejectApplication(params.row.applicationId)}
            disabled={
              params.row.status === "accepted" ||
              params.row.status === "rejected"
            }
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  // Transform applications data for DataGrid
  const rows =
    applications?.map((app: any) => ({
      id: app.student?.id || app.id,
      applicationId: app.id,
      name: app.student?.user?.name || "N/A",
      email: app.student?.user?.email || "N/A",
      className: app.student?.class?.name || "N/A",
      classId: app.student?.classId || "",
      status: app.status,
    })) || [];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Student Applications
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        loading={isLoading}
        autoHeight
      />

      {/* Dialog for Section Selection */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Assign Section</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select a section for this student before accepting the
            application.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="section-select-label">Section</InputLabel>
            <Select
              labelId="section-select-label"
              value={selectedSectionId}
              label="Section"
              onChange={handleSectionChange}
              disabled={sectionsLoading}
            >
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleAcceptApplication}
            variant="contained"
            color="primary"
            disabled={!selectedSectionId || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Accept & Assign"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentApplicationTab;
