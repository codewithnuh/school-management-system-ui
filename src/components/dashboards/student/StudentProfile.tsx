// src/components/UserProfile.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";

// Icons for better UX
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CakeIcon from "@mui/icons-material/Cake";
import PublicIcon from "@mui/icons-material/Public";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import { Emergency as EmergencyContactIcon } from "@mui/icons-material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Import your TanStack Query hook
import { useGetUserById } from "../services/queries/user"; // Adjust path as needed

// Import your custom dark theme
import { darkTheme } from "../../../theme/darkTheme";

// Reusable styled component for the profile container
const ProfileContainerPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 15,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(30, 30, 30, 0.92)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(15px)",
  color: theme.palette.text.primary,
  maxWidth: 900, // Slightly wider for more content
  margin: "auto", // Center the container
  mt: 4, // Top margin
  mb: 4, // Bottom margin
}));

// Alert component for Snackbar
const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StudentProfile: React.FC = () => {
  // --- IMPORTANT: Replace with actual userId from context/props/URL ---
  // For now, hardcode a userId. In a real app, this would come from the logged-in user's context,
  // or a URL parameter, etc.
  const USER_ID = 101; // Example user ID
  // ---------------------------------------------------------------------

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetUserById(USER_ID);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: darkTheme.palette.background.default,
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2, color: "text.secondary" }}>
            Loading user profile...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (isError) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ProfileContainerPaper>
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Profile
          </Typography>
          <Typography color="error.light">
            Failed to fetch user data: {error?.message || "Unknown error."}
          </Typography>
        </ProfileContainerPaper>
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ProfileContainerPaper>
          <Typography variant="h6" color="warning" gutterBottom>
            User Not Found
          </Typography>
          <Typography color="text.secondary">
            The profile for the specified user ID could not be found.
          </Typography>
        </ProfileContainerPaper>
      </ThemeProvider>
    );
  }

  // Helper to format date strings
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  };


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Applies base CSS for the theme */}
      <ProfileContainerPaper>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            alt={`${user.firstName} ${user.lastName}`}
            src={user.photo || "https://via.placeholder.com/150/0d0d0d/FFFFFF?text=User"}
            sx={{
              width: 120,
              height: 120,
              margin: "0 auto",
              border: "3px solid",
              borderColor: "primary.main",
              mb: 2,
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {user.firstName} {user.middleName} {user.lastName}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8 }}>
            {user.entityType} ID: {user.studentId || user.id}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {user.schoolCode}
          </Typography>
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

        <Grid container spacing={4}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.light" }}>
              Personal Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon> <CakeIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Date of Birth" secondary={formatDate(user.dateOfBirth)} />
              </ListItem>
              <ListItem>
                <ListItemIcon> <PersonIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Gender" secondary={user.gender} />
              </ListItem>
              <ListItem>
                <ListItemIcon> <PublicIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Nationality" secondary={user.nationality || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemIcon> <BadgeIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="CNIC" secondary={user.CNIC} />
              </ListItem>
              <ListItem>
                <ListItemIcon> <CalendarTodayIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Enrollment Date" secondary={formatDate(user.enrollmentDate)} />
              </ListItem>
              {user.placeOfBirth && (
                <ListItem>
                  <ListItemIcon> <HomeIcon color="secondary" /> </ListItemIcon>
                  <ListItemText primary="Place of Birth" secondary={user.placeOfBirth} />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.light" }}>
              Contact Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon> <EmailIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Email" secondary={user.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon> <PhoneIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Phone Number" secondary={user.phoneNo} />
              </ListItem>
              <ListItem>
                <ListItemIcon> <HomeIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Permanent Address" secondary={user.address} />
              </ListItem>
              {user.currentAddress && (
                <ListItem>
                  <ListItemIcon> <HomeIcon color="secondary" /> </ListItemIcon>
                  <ListItemText primary="Current Address" secondary={user.currentAddress} />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* Guardian Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.light" }}>
              Guardian Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon> <PersonIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Guardian Name" secondary={user.guardianName} />
              </ListItem>
              <ListItem>
                <ListItemIcon> <BadgeIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Guardian CNIC" secondary={user.guardianCNIC} />
              </ListItem>
              {user.guardianPhone && (
                <ListItem>
                  <ListItemIcon> <PhoneIcon color="secondary" /> </ListItemIcon>
                  <ListItemText primary="Guardian Phone" secondary={user.guardianPhone} />
                </ListItem>
              )}
              {user.guardianEmail && (
                <ListItem>
                  <ListItemIcon> <EmailIcon color="secondary" /> </ListItemIcon>
                  <ListItemText primary="Guardian Email" secondary={user.guardianEmail} />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* Emergency Contact & Other */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.light" }}>
              Emergency & Health Info
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon> <EmergencyContactIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Emergency Contact" secondary={user.emergencyContactName} />
              </ListItem>
              <ListItem>
                <ListItemIcon> <PhoneIcon color="secondary" /> </ListItemIcon>
                <ListItemText primary="Emergency Number" secondary={user.emergencyContactNumber} />
              </ListItem>
              {user.medicalConditions && (
                <ListItem>
                  <ListItemIcon> <LocalHospitalIcon color="secondary" /> </ListItemIcon>
                  <ListItemText primary="Medical Conditions" secondary={user.medicalConditions} />
                </ListItem>
              )}
              {user.allergies && (
                <ListItem>
                  <ListItemIcon> <LocalHospitalIcon color="secondary" /> </ListItemIcon>
                  <ListItemText primary="Allergies" secondary={user.allergies} />
                </ListItem>
              )}
              {user.healthInsuranceInfo && (
                <ListItem>
                  <ListItemIcon> <LocalHospitalIcon color="secondary" /> </ListItemIcon>
                  <ListItemText primary="Health Insurance" secondary={user.healthInsuranceInfo} />
                </ListItem>
              )}
              {user.doctorContact && (
                <ListItem>
                  <ListItemIcon> <LocalHospitalIcon color="secondary" /> </ListItemIcon>
                  <ListItemText primary="Doctor Contact" secondary={user.doctorContact} />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* Academic & Other Info (if applicable to student type) */}
          {user.entityType === 'STUDENT' && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.light" }}>
                  Academic Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon> <SchoolIcon color="secondary" /> </ListItemIcon>
                    <ListItemText primary="Current Class ID" secondary={user.classId} />
                  </ListItem>
                  {user.sectionId && (
                    <ListItem>
                      <ListItemIcon> <SchoolIcon color="secondary" /> </ListItemIcon>
                      <ListItemText primary="Section ID" secondary={user.sectionId} />
                    </ListItem>
                  )}
                  {user.previousSchool && (
                    <ListItem>
                      <ListItemIcon> <SchoolIcon color="secondary" /> </ListItemIcon>
                      <ListItemText primary="Previous School" secondary={user.previousSchool} />
                    </ListItem>
                  )}
                  {user.previousGrade && (
                    <ListItem>
                      <ListItemIcon> <SchoolIcon color="secondary" /> </ListItemIcon>
                      <ListItemText primary="Previous Grade" secondary={user.previousGrade} />
                    </ListItem>
                  )}
                  {user.previousMarks && (
                    <ListItem>
                      <ListItemIcon> <SchoolIcon color="secondary" /> </ListItemIcon>
                      <ListItemText primary="Previous Marks" secondary={user.previousMarks} />
                    </ListItem>
                  )}
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.light" }}>
                  Additional Info
                </Typography>
                <List dense>
                  {user.transportation && (
                    <ListItem>
                      <ListItemIcon> <DriveEtaIcon color="secondary" /> </ListItemIcon>
                      <ListItemText primary="Transportation" secondary={user.transportation} />
                    </ListItem>
                  )}
                  {user.extracurriculars && (
                    <ListItem>
                      <ListItemIcon> <FitnessCenterIcon color="secondary" /> </ListItemIcon>
                      <ListItemText primary="Extracurriculars" secondary={user.extracurriculars} />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </>
          )}

        </Grid>

        {/* Toast Snackbar */}
        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </ProfileContainerPaper>
    </ThemeProvider>
  );
};

export default StudentProfile;