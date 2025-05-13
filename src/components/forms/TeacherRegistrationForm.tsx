"use client";
import type React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  teacherSchema,
  TeacherSchemaType,
  ApplicationStatus,
  Gender,
} from "../../schema";
// Material UI imports
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  InputLabel,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { uploadDirect } from "@uploadcare/upload-client";
import { useState } from "react";
import { useRegisterTeacher } from "../../services/queries/teacherRegistration";
import { useSubjects } from "../../services/queries/subject";
import { useSearchParams } from "react-router";
// Import your dark theme
import { darkTheme } from "../../theme/darkTheme";
import SchoolHeader from "../headers/SchoolHeader";
import { ThemeProvider } from "@emotion/react";
import { useGetSchoolById } from "../../services/queries/school";
import { useGetTeacherRegistrationLinkById } from "../../services/queries/registrationLinks";

// Define the public key for Uploadcare
const UPLOADCARE_PUBLIC_KEY = "39d5faf5f775c673cb85"; // Replace with env var in production

// Interface for the file upload states
interface FileUploads {
  cvPath: string;
  photo: string;
  verificationDocument: string;
}

// Interface for the loading states during file uploads
interface FileUploadingStates {
  cvPath: boolean;
  photo: boolean;
  verificationDocument: boolean;
}

// Mock school data - replace this with real API call if needed

function TeacherRegistrationForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<TeacherSchemaType>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      entityType: "TEACHER",
      role: "TEACHER",
      applicationStatus: ApplicationStatus.Pending,
      isVerified: false,
    },
  });

  // Fetch subjects data
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const registerTeacherMutation = useRegisterTeacher();
  const [params] = useSearchParams();
  const registrationLinkId = params.get("registrationLinkId");
  console.log(params.get("registrationLinkId"));
  // First, fetch registration link
  const {
    data: registrationLinkData,
    isLoading: isLoadingRegistrationLink,
    isError: isRegistrationLinkError,
  } = useGetTeacherRegistrationLinkById(registrationLinkId || "");

  // Get schoolId from registrationLinkData
  console.log(isRegistrationLinkError, registrationLinkData);
  const schoolId = registrationLinkData?.data?.schoolId;

  // Then fetch school based on that
  const {
    data: schoolData,
    isLoading: isLoadingSchool,
    isError: isSchoolError,
  } = useGetSchoolById(schoolId?.toString() || "");
  const school = schoolData.data;

  // State for uploaded file URLs
  const [files, setFiles] = useState<FileUploads>({
    cvPath: "",
    photo: "",
    verificationDocument: "",
  });

  // State for tracking file upload loading states
  const [isUploading, setIsUploading] = useState<FileUploadingStates>({
    cvPath: false,
    photo: false,
    verificationDocument: false,
  });

  // State for toast notification
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Handle toast close
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  // Handle form submission
  const onSubmit = async (data: TeacherSchemaType) => {
    try {
      // Combine form data with file URLs
      const fullData = {
        ...data,
        cvPath: files.cvPath,
        photo: files.photo,
        verificationDocument: files.verificationDocument,
      };
      registerTeacherMutation.mutate(fullData, {
        onSuccess: (response) => {
          // Show success toast when registration is successful
          setToast({
            open: true,
            message: "Teacher registration submitted successfully!",
            severity: "success",
          });
          // Reset form after successful submission
          reset();
          setFiles({
            cvPath: "",
            photo: "",
            verificationDocument: "",
          });
        },
        onError: (error) => {
          // Show error toast
          setToast({
            open: true,
            message:
              error.message || "Failed to register teacher. Please try again.",
            severity: "error",
          });
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error - show notification to user
      setToast({
        open: true,
        message: "Error submitting form. Please try again.",
        severity: "error",
      });
    }
  };

  // Handle file upload
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof FileUploads
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        // Set loading state for this specific field
        setIsUploading((prev) => ({
          ...prev,
          [fieldName]: true,
        }));
        // Upload file to Uploadcare
        const uploadedFile = await uploadDirect(file, {
          publicKey: UPLOADCARE_PUBLIC_KEY,
          store: "auto",
        });
        // Update file URL in state
        setFiles((prev) => ({
          ...prev,
          [fieldName]: uploadedFile.cdnUrl || "",
        }));
        // Set the value in the form
        setValue(fieldName as any, uploadedFile.cdnUrl || "");
      } catch (error) {
        console.error(`Error uploading ${fieldName}:`, error);
        // Handle error - show notification to user
        setToast({
          open: true,
          message: `Error uploading ${fieldName}. Please try again.`,
          severity: "error",
        });
      } finally {
        // Clear loading state
        setIsUploading((prev) => ({
          ...prev,
          [fieldName]: false,
        }));
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg">
        {/* School Header */}
        <SchoolHeader school={school} />

        {/* Registration Form */}
        <Card elevation={3}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={4}>
                {/* Personal Information */}
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name *"
                            fullWidth
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="middleName"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Middle Name" fullWidth />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name *"
                            fullWidth
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                          name="dateOfBirth"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              label="Date of Birth *"
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!errors.dateOfBirth,
                                  helperText: errors.dateOfBirth?.message,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl error={!!errors.gender} fullWidth>
                        <FormLabel id="gender-label">Gender *</FormLabel>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              aria-labelledby="gender-label"
                              row
                            >
                              <FormControlLabel
                                value={Gender.Male}
                                control={<Radio />}
                                label="Male"
                              />
                              <FormControlLabel
                                value={Gender.Female}
                                control={<Radio />}
                                label="Female"
                              />
                              <FormControlLabel
                                value={Gender.Other}
                                control={<Radio />}
                                label="Other"
                              />
                            </RadioGroup>
                          )}
                        />
                        {errors.gender && (
                          <FormHelperText>
                            {errors.gender.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Nationality" fullWidth />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="email"
                            label="Email *"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="phoneNo"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Phone Number *"
                            fullWidth
                            error={!!errors.phoneNo}
                            helperText={errors.phoneNo?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Permanent Address *"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="currentAddress"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Current Address"
                            fullWidth
                            multiline
                            rows={3}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="cnic"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="CNIC *"
                            fullWidth
                            error={!!errors.cnic}
                            helperText={errors.cnic?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="password"
                            label="Password *"
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Professional Information */}
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Professional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="highestQualification"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Highest Qualification *"
                            fullWidth
                            error={!!errors.highestQualification}
                            helperText={errors.highestQualification?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="specialization"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Specialization"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="experienceYears"
                        control={control}
                        render={({ field: { value, onChange, ...rest } }) => (
                          <TextField
                            {...rest}
                            type="number"
                            label="Years of Experience"
                            fullWidth
                            value={value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange(val === "" ? undefined : Number(val));
                            }}
                            inputProps={{ min: 0 }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                          name="joiningDate"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              label="Joining Date *"
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!errors.joiningDate,
                                  helperText: errors.joiningDate?.message,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.subjectId}>
                        <InputLabel id="subject-select-label">
                          Subject *
                        </InputLabel>
                        <Controller
                          name="subjectId"
                          control={control}
                          render={({ field: { value, onChange, ...rest } }) => (
                            <Select
                              labelId="subject-select-label"
                              id="subject-select"
                              value={value?.toString() || ""}
                              label="Subject *"
                              {...rest}
                              onChange={(e) => {
                                const val = e.target.value;
                                onChange(val === "" ? undefined : Number(val));
                              }}
                              disabled={subjectsLoading}
                            >
                              <MenuItem value="">
                                <em>Select a subject</em>
                              </MenuItem>
                              {subjects.map((subject) => (
                                <MenuItem
                                  key={subject.id}
                                  value={subject.id.toString()}
                                >
                                  {subject.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.subjectId && (
                          <FormHelperText>
                            {errors.subjectId.message}
                          </FormHelperText>
                        )}
                        {subjectsLoading && (
                          <Box display="flex" alignItems="center" mt={1}>
                            <CircularProgress size={16} />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              Loading subjects...
                            </Typography>
                          </Box>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="emergencyContactName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Emergency Contact Name *"
                            fullWidth
                            error={!!errors.emergencyContactName}
                            helperText={errors.emergencyContactName?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="emergencyContactNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Emergency Contact Number *"
                            fullWidth
                            error={!!errors.emergencyContactNumber}
                            helperText={errors.emergencyContactNumber?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* File Upload Section */}
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Documents
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <InputLabel htmlFor="photo-upload">
                        Profile Photo
                      </InputLabel>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mt: 1, height: 56, textTransform: "none" }}
                        disabled={isUploading.photo}
                        startIcon={
                          isUploading.photo ? (
                            <CircularProgress size={24} />
                          ) : null
                        }
                      >
                        {isUploading.photo
                          ? "Uploading..."
                          : files.photo
                          ? "Change Photo"
                          : "Upload Photo"}
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleFileChange(e, "photo")}
                        />
                      </Button>
                      {files.photo && (
                        <Box mt={1} sx={{ wordBreak: "break-all" }}>
                          <Typography variant="caption" color="success.main">
                            Uploaded successfully
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <InputLabel htmlFor="verification-doc-upload">
                        Verification Document
                      </InputLabel>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mt: 1, height: 56, textTransform: "none" }}
                        disabled={isUploading.verificationDocument}
                        startIcon={
                          isUploading.verificationDocument ? (
                            <CircularProgress size={24} />
                          ) : null
                        }
                      >
                        {isUploading.verificationDocument
                          ? "Uploading..."
                          : files.verificationDocument
                          ? "Change Document"
                          : "Upload Document"}
                        <input
                          id="verification-doc-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          hidden
                          onChange={(e) =>
                            handleFileChange(e, "verificationDocument")
                          }
                        />
                      </Button>
                      {files.verificationDocument && (
                        <Box mt={1} sx={{ wordBreak: "break-all" }}>
                          <Typography variant="caption" color="success.main">
                            Uploaded successfully
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <InputLabel htmlFor="cv-upload">CV/Resume *</InputLabel>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{
                          mt: 1,
                          height: 56,
                          textTransform: "none",
                        }}
                        color={errors.cvPath ? "error" : "primary"}
                        disabled={isUploading.cvPath}
                        startIcon={
                          isUploading.cvPath ? (
                            <CircularProgress size={24} />
                          ) : null
                        }
                      >
                        {isUploading.cvPath
                          ? "Uploading..."
                          : files.cvPath
                          ? "Change CV"
                          : "Upload CV"}
                        <input
                          id="cv-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          hidden
                          onChange={(e) => handleFileChange(e, "cvPath")}
                          required
                        />
                      </Button>
                      {errors.cvPath && (
                        <FormHelperText error>
                          {errors.cvPath.message}
                        </FormHelperText>
                      )}
                      {files.cvPath && !errors.cvPath && (
                        <Box mt={1} sx={{ wordBreak: "break-all" }}>
                          <Typography variant="caption" color="success.main">
                            Uploaded successfully
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Submit Button */}
              <Box mt={4} display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={
                    isSubmitting ||
                    isUploading.cvPath ||
                    isUploading.photo ||
                    isUploading.verificationDocument
                  }
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : null
                  }
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default TeacherRegistrationForm;
