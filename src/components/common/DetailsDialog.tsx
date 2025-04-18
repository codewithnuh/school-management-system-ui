import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Application } from "../../types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// Remove date-fns import and use native JavaScript Date API
// import { format } from "date-fns";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Divider from "@mui/material/Divider";

interface DetailsDialogProps {
  open: boolean;
  onClose: () => void;
  applicant: Application | null;
  onViewFile?: (
    url: string | null,
    type: "pdf" | "image",
    title: string
  ) => void;
}

const DetailsDialog: React.FC<DetailsDialogProps> = ({
  open,
  onClose,
  applicant,
  onViewFile,
}) => {
  if (!applicant) {
    return null;
  }

  // Replace date-fns format function with native JavaScript date formatting
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }

      // Use Intl.DateTimeFormat for browser-native formatting
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "default";
      case "Accepted":
        return "success";
      case "Rejected":
        return "error";
      case "Interview":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Applicant Details
        <Chip
          label={applicant.applicationStatus}
          color={getStatusColor(applicant.applicationStatus) as any}
          size="small"
          sx={{ ml: 2 }}
        />
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Personal Information Section */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box mr={2}>
                {applicant.photo ? (
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={applicant.photo}
                      alt={`${applicant.firstName} ${applicant.lastName}`}
                      sx={{ width: 100, height: 100, cursor: "pointer" }}
                      onClick={() =>
                        onViewFile &&
                        onViewFile(
                          applicant.photo,
                          "image",
                          `${applicant.firstName} ${applicant.lastName} - Photo`
                        )
                      }
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                      }}
                      onClick={() =>
                        onViewFile &&
                        onViewFile(
                          applicant.photo,
                          "image",
                          `${applicant.firstName} ${applicant.lastName} - Photo`
                        )
                      }
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Avatar sx={{ width: 100, height: 100 }}>
                    {applicant.firstName.charAt(0)}
                  </Avatar>
                )}
              </Box>
              <Box>
                <Typography variant="h5" component="h2">
                  {`${applicant.firstName} ${
                    applicant.middleName ? applicant.middleName + " " : ""
                  }${applicant.lastName}`}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {applicant.role} - {applicant.entityType}
                </Typography>
                <Typography variant="body2">{`ID: ${applicant.id}`}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(applicant.dateOfBirth)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Gender
                    </Typography>
                    <Typography variant="body1">{applicant.gender}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Nationality
                    </Typography>
                    <Typography variant="body1">
                      {applicant.nationality || "Not specified"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      CNIC
                    </Typography>
                    <Typography variant="body1">{applicant.cnic}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{applicant.email}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">{applicant.phoneNo}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Address
                    </Typography>
                    <Typography variant="body1">{applicant.address}</Typography>
                  </Grid>
                  {applicant.currentAddress && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Current Address
                      </Typography>
                      <Typography variant="body1">
                        {applicant.currentAddress}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Professional Information
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Highest Qualification
                    </Typography>
                    <Typography variant="body1">
                      {applicant.highestQualification}
                    </Typography>
                  </Grid>
                  {applicant.specialization && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Specialization
                      </Typography>
                      <Typography variant="body1">
                        {applicant.specialization}
                      </Typography>
                    </Grid>
                  )}
                  {applicant.experienceYears !== null && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Years of Experience
                      </Typography>
                      <Typography variant="body1">
                        {applicant.experienceYears} years
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Joining Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(applicant.joiningDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emergency Contact
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {applicant.emergencyContactName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {applicant.emergencyContactNumber}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Documents */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Documents
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px dashed #ccc",
                        borderRadius: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        CV / Resume
                      </Typography>
                      {applicant.cvPath ? (
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            onViewFile &&
                            onViewFile(
                              applicant.cvPath,
                              "pdf",
                              `${applicant.firstName} ${applicant.lastName} - CV`
                            )
                          }
                        >
                          View CV
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No CV uploaded
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px dashed #ccc",
                        borderRadius: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        Verification Document
                      </Typography>
                      {applicant.verificationDocument ? (
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            onViewFile &&
                            onViewFile(
                              applicant.verificationDocument,
                              "pdf",
                              `${applicant.firstName} ${applicant.lastName} - Verification Document`
                            )
                          }
                        >
                          View Document
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No verification document
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Verified
                    </Typography>
                    <Typography variant="body1">
                      {applicant.isVerified ? "Yes" : "No"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Registered
                    </Typography>
                    <Typography variant="body1">
                      {applicant.isRegistered ? "Yes" : "No"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Created
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(applicant.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Updated
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(applicant.updatedAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsDialog;
