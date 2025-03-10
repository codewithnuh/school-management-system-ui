// src/components/ApplicationsPage.tsx
import * as React from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Stack,
  Button,
  List,
  ListItem,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  CircularProgress, // Import CircularProgress for loading state
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CheckCircle,
  Close,
  HourglassTop,
  Visibility,
} from "@mui/icons-material";
import { Application } from "../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import teacherApplicationsApi, {
  acceptTeacherApplication,
  rejectTeacherApplication,
  scheduleInterviewTeacherApplication,
  fetchTeacherApplications, // Import fetch API function
} from "../../api/applications";
// import { mockData } from "../../mock/data";
import { queryClient } from "../../utils/queryClient";

const glassStyle = {
  background: "rgba(0, 0, 0, 0.7)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: "2rem",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
};

const ApplicationCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  marginBottom: theme.spacing(3),
  transition: "transform 0.2s ease-in-out",
  "&:hover": { transform: "translateY(-2px)" },
}));

const StatusIcon = ({
  status,
}: {
  status: Application["applicationStatus"];
}) => {
  switch (status) {
    case "Accepted":
      return <CheckCircle sx={{ color: "green", fontSize: "24px" }} />;
    case "Rejected":
      return <Close sx={{ color: "red", fontSize: "24px" }} />;
    case "Interview":
      return <HourglassTop sx={{ color: "#FFA726", fontSize: "24px" }} />;
    case "Pending":
    default:
      return <HourglassTop sx={{ color: "orange", fontSize: "24px" }} />;
  }
};

function ApplicationDetailsModal({
  open,
  onClose,
  application,
}: {
  open: boolean;
  onClose: () => void;
  application: Application | null;
}) {
  if (!application) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Application Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Typography>
          <strong>First Name:</strong> {application.firstName}
        </Typography>
        <Typography>
          <strong>Middle Name:</strong> {application.middleName || "-"}
        </Typography>
        <Typography>
          <strong>Last Name:</strong> {application.lastName}
        </Typography>
        <Typography>
          <strong>Date of Birth:</strong> {application.dateOfBirth}
        </Typography>
        <Typography>
          <strong>Gender:</strong> {application.gender}
        </Typography>
        <Typography>
          <strong>Nationality:</strong> {application.nationality || "-"}
        </Typography>
        <Typography variant="h6" gutterBottom mt={2}>
          Contact Information
        </Typography>
        <Typography>
          <strong>Email:</strong> {application.email}
        </Typography>
        <Typography>
          <strong>Phone No:</strong> {application.phoneNo}
        </Typography>
        <Typography>
          <strong>Address:</strong> {application.address}
        </Typography>
        <Typography>
          <strong>Current Address:</strong> {application.currentAddress || "-"}
        </Typography>
        <Typography variant="h6" gutterBottom mt={2}>
          Application Details
        </Typography>
        <Typography>
          <strong>CNIC:</strong> {application.cnic}
        </Typography>
        <Typography>
          <strong>Highest Qualification:</strong>{" "}
          {application.highestQualification}
        </Typography>
        <Typography>
          <strong>Specialization:</strong> {application.specialization || "-"}
        </Typography>
        <Typography>
          <strong>Experience Years:</strong>{" "}
          {application.experienceYears || "0"}
        </Typography>
        <Typography>
          <strong>Joining Date:</strong> {application.joiningDate}
        </Typography>
        <Typography>
          <strong>Emergency Contact Name:</strong>{" "}
          {application.emergencyContactName}
        </Typography>
        <Typography>
          <strong>Emergency Contact Number:</strong>{" "}
          {application.emergencyContactNumber}
        </Typography>
        <Typography>
          <strong>Application Status:</strong> {application.applicationStatus}
        </Typography>
        <Typography>
          <strong>Role:</strong> {application.role}
        </Typography>
        <Typography>
          <strong>Subject ID:</strong> {application.subjectId}
        </Typography>
        <Typography>
          <strong>Created At:</strong> {application.createdAt}
        </Typography>
        <Typography>
          <strong>Updated At:</strong> {application.updatedAt}
        </Typography>
        {application.photo && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Photo
            </Typography>
            <img
              src={application.photo}
              alt="Applicant Photo"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ApplicationsPage() {
  const [selectedTab, setSelectedTab] = React.useState<
    Application["applicationStatus"] | "All"
  >("All");
  const theme = useTheme();
  const [selectedApplication, setSelectedApplication] =
    React.useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  // React Query Queries and Mutations
  const {
    data: teachersData,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
    error: applicationsError,
  } = useQuery({
    queryKey: ["teachers"], // Query key for fetching applications
    queryFn: teacherApplicationsApi.fetchTeacherApplications,
    //  Initial data from mockData for faster initial load, will be replaced by API data on success
    initialData: [],
    staleTime: 60 * 1000, // 1 minute -  adjust as needed, how often data should be considered stale
  });

  const acceptApplicationMutation = useMutation({
    mutationFn: acceptTeacherApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setSnackbarMessage("Application accepted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    },
    onError: (error: Error) => {
      setSnackbarMessage(error.message || "Failed to accept application.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });

  const rejectApplicationMutation = useMutation({
    mutationFn: rejectTeacherApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setSnackbarMessage("Application rejected successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    },
    onError: (error: Error) => {
      setSnackbarMessage(error.message || "Failed to reject application.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });

  const interviewApplicationMutation = useMutation({
    mutationFn: scheduleInterviewTeacherApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setSnackbarMessage("Interview scheduled successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    },
    onError: (error: Error) => {
      setSnackbarMessage(error.message || "Failed to schedule interview.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });

  const handleStatusChange = async (
    teacherId: number,
    newStatus: Application["applicationStatus"]
  ) => {
    try {
      if (newStatus === "Approved") {
        await acceptApplicationMutation.mutateAsync(teacherId);
      } else if (newStatus === "Rejected") {
        await rejectApplicationMutation.mutateAsync(teacherId);
      } else if (newStatus === "Interview") {
        await interviewApplicationMutation.mutateAsync(teacherId);
      }
    } catch (error) {
      // Errors are already handled within each mutation's onError callback, which sets snackbar
      console.error("Error changing application status:", error); // Optionally log here as well
    }
  };

  // Data filtering logic - now uses teachersData from React Query
  const filteredTeachers = React.useMemo(() => {
    console.log(teachersData);
    if (!teachersData) return []; // Return empty array if data is not yet loaded
    return teachersData.filter((teacher) => {
      if (teacher.isVerified) return false;
      if (selectedTab === "All") return true;
      return teacher.applicationStatus === selectedTab;
    });
  }, [teachersData, selectedTab]);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (isApplicationsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isApplicationsError) {
    return (
      <Box
        sx={{ ...glassStyle, minHeight: "100vh", p: 4, textAlign: "center" }}
      >
        <Typography variant="h6" color="error">
          Error loading applications: {applicationsError?.message}
        </Typography>
      </Box>
    );
  }
  console.log(teacherApplicationsApi.fetchTeacherApplications());
  return (
    <Box sx={{ ...glassStyle, minHeight: "100vh", p: 4 }}>
      <Typography
        variant="h4"
        color={theme.palette.primary.contrastText}
        sx={{ mb: 4 }}
      >
        Teacher Applications
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={(e, v) => setSelectedTab(v as any)}
        textColor="inherit"
        indicatorColor="secondary"
        sx={{
          "& .MuiTabs-indicator": { backgroundColor: "white" },
          mb: 4,
        }}
      >
        <Tab label="All" value="All" />
        <Tab label="Pending" value="Pending" />
        <Tab label="Accepted" value="Accepted" />
        <Tab label="Rejected" value="Rejected" />
        <Tab label="Interview" value="Interview" />
      </Tabs>

      <List sx={{ width: "100%" }}>
        {filteredTeachers.length === 0 && (
          <ListItem>
            <Typography>No applications found</Typography>
          </ListItem>
        )}
        {filteredTeachers.map((teacher) => (
          <ApplicationCard key={teacher.id}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  {teacher.firstName[0]}
                </Avatar>
              }
              title={`${teacher.firstName} ${teacher.lastName}`}
              subheader={`ID: ${teacher.id}`}
              titleTypographyProps={{ variant: "h6", color: "white" }}
              subheaderTypographyProps={{ color: "rgba(255,255,255,0.7)" }}
              action={
                <IconButton onClick={() => handleViewDetails(teacher)}>
                  <Visibility color="action" />
                </IconButton>
              }
            />
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <StatusIcon status={teacher.applicationStatus} />
                <Typography
                  variant="subtitle2"
                  color={
                    teacher.applicationStatus === "Accepted"
                      ? "green"
                      : teacher.applicationStatus === "Rejected"
                      ? "red"
                      : "#FFA726"
                  }
                >
                  {teacher.applicationStatus}
                </Typography>
              </Stack>

              {teacher.applicationStatus === "Pending" && (
                <Stack direction="row" spacing={2} mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleStatusChange(teacher.id, "Accepted")}
                    disabled={
                      acceptApplicationMutation.isPending ||
                      rejectApplicationMutation.isPending ||
                      interviewApplicationMutation.isPending
                    }
                  >
                    {acceptApplicationMutation.isPending
                      ? "Accepting..."
                      : "Accept"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusChange(teacher.id, "Rejected")}
                    disabled={
                      acceptApplicationMutation.isPending ||
                      rejectApplicationMutation.isPending ||
                      interviewApplicationMutation.isPending
                    }
                  >
                    {rejectApplicationMutation.isPending
                      ? "Rejecting..."
                      : "Reject"}
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleStatusChange(teacher.id, "Interview")}
                    disabled={
                      acceptApplicationMutation.isPending ||
                      rejectApplicationMutation.isPending ||
                      interviewApplicationMutation.isPending
                    }
                  >
                    {interviewApplicationMutation.isPending
                      ? "Scheduling..."
                      : "Schedule Interview"}
                  </Button>
                </Stack>
              )}

              <Typography mt={2} color="rgba(255,255,255,0.8)">
                <strong>Qualification:</strong>{" "}
                {teacher?.highestQualification || "-"}
                <br />
                <strong>Experience:</strong> {teacher?.experienceYears || "0"}{" "}
                years
                <br />
                <strong>Contact:</strong> {teacher.email}
                <br />
                <strong>Phone:</strong> {teacher.phoneNo}
              </Typography>
            </CardContent>
          </ApplicationCard>
        ))}
      </List>

      <ApplicationDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        application={selectedApplication}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
