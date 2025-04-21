import React from "react";
import { useUser } from "../../hooks/useUser";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Chip,
  Button,
  CircularProgress, // Added for loading state
} from "@mui/material";
import { format } from "date-fns"; // For formatting dates

const StudentProfile: React.FC = () => {
  // Fetch user data using the hook
  const { data: userResponse, isLoading, error } = useUser();

  // Handle loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading profile…</Typography>
      </Box>
    );
  }

  // Handle error state or missing data
  if (error || !userResponse || !userResponse.data || !userResponse.data.user) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        Failed to load user profile. Error:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </Typography>
    );
  }

  // Destructure user data and role
  // Assuming the structure is { data: { user: {...}, role: '...' } } based on the JSON
  const { user, role } = userResponse.data;

  // Destructure specific fields from the user object
  const {
    id,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    gender,
    email,
    phoneNo,
    entityType, // Displaying entityType might be useful
    emergencyContactName,
    emergencyContactNumber,
    address,
    CNIC,
    classId, // We might want to fetch class name based on this ID later
    enrollmentDate,
    photo, // For the avatar
    guardianName,
    guardianCNIC,
    guardianPhone,
  } = user;

  // Helper function to format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy"); // e.g., April 23, 2009
    } catch {
      return dateString; // Return original string if formatting fails
    }
  };

  // Construct full name
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2, mb: 4 }}>
      <Card elevation={3}>
        <CardContent>
          {/* Header Section */}
          <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Grid item>
              <Avatar
                src={photo || undefined} // Use photo URL if available
                sx={{ width: 80, height: 80, fontSize: "2rem" }}
              >
                {/* Fallback initials if no photo */}
                {!photo && firstName && lastName
                  ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                  : "S"}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" component="h1" gutterBottom>
                {fullName}
              </Typography>
              <Chip
                label={role || entityType || "Student"} // Display role or entityType
                size="small"
                color="primary"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" disabled>
                Edit Profile
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Basic Information Section */}
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Student ID
              </Typography>
              <Typography>{id || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography>{email || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Phone Number
              </Typography>
              <Typography>{phoneNo || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Gender
              </Typography>
              <Typography>{gender || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Date of Birth
              </Typography>
              <Typography>{formatDate(dateOfBirth)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                CNIC
              </Typography>
              <Typography>{CNIC || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Address
              </Typography>
              <Typography>{address || "N/A"}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Academic Information Section */}
          <Typography variant="h6" gutterBottom>
            Academic Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Class ID
              </Typography>
              <Typography>{classId || "N/A"}</Typography>
              {/* TODO: Fetch and display Class Name based on classId */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Enrollment Date
              </Typography>
              <Typography>{formatDate(enrollmentDate)}</Typography>
            </Grid>
            {/* Add Section ID if needed and available */}
            {/* <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Section ID
              </Typography>
              <Typography>{user.sectionId || 'N/A'}</Typography>
            </Grid> */}
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Guardian & Emergency Contact Section */}
          <Typography variant="h6" gutterBottom>
            Guardian & Emergency Contact
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Guardian Name
              </Typography>
              <Typography>{guardianName || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Guardian CNIC
              </Typography>
              <Typography>{guardianCNIC || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Guardian Phone
              </Typography>
              <Typography>{guardianPhone || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Emergency Contact Name
              </Typography>
              <Typography>{emergencyContactName || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Emergency Contact Number
              </Typography>
              <Typography>{emergencyContactNumber || "N/A"}</Typography>
            </Grid>
          </Grid>

          {/* Add other sections like Medical, Transportation etc. if needed */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentProfile;
