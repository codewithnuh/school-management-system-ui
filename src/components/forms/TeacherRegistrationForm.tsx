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
import { useCallback, useState } from "react";
import { useRegisterTeacher } from "../../services/queries/teacherRegistration";
import { useSubjects } from "../../services/queries/subject";
import { useSearchParams } from "react-router";
import RefreshIcon from "@mui/icons-material/Refresh";
// Import your dark theme
import { darkTheme } from "../../theme/darkTheme";
import SchoolHeader from "../headers/SchoolHeader";
import { ThemeProvider } from "@emotion/react";
import { useGetSchoolById } from "../../services/queries/school";
import { useGetTeacherRegistrationLinkById } from "../../services/queries/registrationLinks";
import { UploadButton } from "../../utils/uploadthing";

// Define the public key for Uploadcare
const UPLOADCARE_PUBLIC_KEY = import.meta.env
  .VITE_REACT_APP_UPLOADCARE_PUBLIC_KEY; // Replace with env var in production
interface FileUploads {
  cvPath: string;
  photo: string;
  verificationDocument: string;
}

interface FileUploadingStates {
  cvPath: boolean;
  photo: boolean;
  verificationDocument: boolean;
}

interface FileUploadErrors {
  cvPath: string | null;
  photo: string | null;
  verificationDocument: string | null;
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
  const [uploadErrors, setUploadErrors] = useState<FileUploadErrors>({
    cvPath: null,
    photo: null,
    verificationDocument: null,
  });
  // Get and validate the registration link ID parameter
  const [params] = useSearchParams();
  const registrationLinkId = params.get("registrationLinkId");

  // First, fetch registration link with improved error handling
  const {
    data: registrationLinkData,
    isLoading: isLoadingRegistrationLink,
    isError: isRegistrationLinkError,
    error: registrationLinkError,
  } = useGetTeacherRegistrationLinkById(registrationLinkId || "");
  console.log(registrationLinkData);
  // Get schoolId from registrationLinkData with safe access
  const schoolId = registrationLinkData?.data?.schoolId?.toString();

  // Then fetch school based on that schoolId
  const {
    data: schoolData,
    isLoading: isLoadingSchool,
    isError: isSchoolError,
    error: schoolError,
  } = useGetSchoolById(schoolId || "");

  // Safely access school data with fallback
  const school = schoolData?.data || null;

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
        schoolId: parseInt(schoolId as string),
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

  // Helper function to show toast notifications
  const showToast = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setToast({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  // Handle file upload
  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      fieldName: keyof FileUploads
    ) => {
      // Clear previous errors
      setUploadErrors((prev) => ({ ...prev, [fieldName]: null }));

      const files = e.target.files;
      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];

      // Validate file
      const isValid = validateFile(file, fieldName);
      if (!isValid.valid) {
        setUploadErrors((prev) => ({ ...prev, [fieldName]: isValid.message }));
        showToast(isValid.message, "error");
        return;
      }

      try {
        // Set loading state for this specific field
        setIsUploading((prev) => ({
          ...prev,
          [fieldName]: true,
        }));

        // Upload file to Uploadcare with timeout and retries
        const uploadedFile = await uploadWithRetry(file);

        if (!uploadedFile || !uploadedFile.cdnUrl) {
          throw new Error("Upload failed - no URL received");
        }

        // Update file URL in state
        setFiles((prev) => ({
          ...prev,
          [fieldName]: uploadedFile.cdnUrl || "",
        }));

        // Set the value in the form
        setValue(fieldName as any, uploadedFile.cdnUrl || "");

        // Show success message
        showToast(
          `${getFieldDisplayName(fieldName)} uploaded successfully!`,
          "success"
        );
      } catch (error: any) {
        console.error(`Error uploading ${fieldName}:`, error);

        // Set error state
        setUploadErrors((prev) => ({
          ...prev,
          [fieldName]:
            error.message ||
            `Error uploading ${getFieldDisplayName(fieldName)}`,
        }));

        // Handle error - show notification to user
        showToast(
          `Error uploading ${getFieldDisplayName(fieldName)}: ${
            error.message || "Please try again."
          }`,
          "error"
        );
      } finally {
        // Clear loading state
        setIsUploading((prev) => ({
          ...prev,
          [fieldName]: false,
        }));
      }
    },
    [setValue, showToast]
  );
  const getFieldDisplayName = (fieldName: keyof FileUploads): string => {
    switch (fieldName) {
      case "cvPath":
        return "CV/Resume";
      case "photo":
        return "Profile Photo";
      case "verificationDocument":
        return "Verification Document";
      default:
        return "File";
    }
  };

  // Helper function to validate files before upload
  const validateFile = (
    file: File,
    fieldName: keyof FileUploads
  ): { valid: boolean; message: string } => {
    // Check file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `File is too large. Maximum size is 10MB.`,
      };
    }

    // Validate file type based on field
    if (fieldName === "photo") {
      // Only allow image files
      if (!file.type.startsWith("image/")) {
        return {
          valid: false,
          message: "Please upload an image file (JPEG, PNG, etc.)",
        };
      }
    } else if (fieldName === "cvPath" || fieldName === "verificationDocument") {
      // Allow PDFs, Word docs, etc.
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        return {
          valid: false,
          message: "Please upload a PDF or Word document",
        };
      }
    }

    return { valid: true, message: "" };
  };

  // Helper function to upload with retries
  const uploadWithRetry = async (file: File, maxRetries = 3) => {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        return await uploadDirect(file, {
          publicKey: UPLOADCARE_PUBLIC_KEY,
          store: "auto",
          // Add cancelable Promise for better UX

          // Note: Removed 'onUploading' as it is not a valid property for 'DirectOptions'.
        });
      } catch (error) {
        retries++;
        console.warn(
          `Upload attempt ${retries} failed. ${
            maxRetries - retries
          } retries left.`
        );

        if (retries >= maxRetries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, retries))
        );
      }
    }

    throw new Error("Upload failed after maximum retries");
  };
  // Add loading state UI
  if (isLoadingRegistrationLink || isLoadingSchool) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading registration information...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Add error state UI
  if (isRegistrationLinkError || isSchoolError) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: 600 }}>
            {isRegistrationLinkError
              ? `Error loading registration link: ${
                  registrationLinkError?.message || "Unknown error"
                }`
              : `Error loading school information: ${
                  schoolError?.message || "Unknown error"
                }`}
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            startIcon={<RefreshIcon />}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  // Validate registration link exists
  if (!registrationLinkId || !registrationLinkData?.data) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <Alert
            severity="warning"
            sx={{ mb: 2, width: "100%", maxWidth: 600 }}
          >
            Invalid or expired registration link. Please contact your school
            administrator.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg">
        {/* School Header - with null check */}
        {school && <SchoolHeader school={school} />}

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
                  {/* Profile Photo Upload */}
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
                        color={uploadErrors.photo ? "error" : "primary"}
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
                      {uploadErrors.photo && (
                        <FormHelperText error>
                          {uploadErrors.photo}
                        </FormHelperText>
                      )}
                      {files.photo && !uploadErrors.photo && (
                        <Box mt={1} sx={{ wordBreak: "break-all" }}>
                          <Typography variant="caption" color="success.main">
                            Uploaded successfully
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Verification Document Upload */}
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
                        color={
                          uploadErrors.verificationDocument
                            ? "error"
                            : "primary"
                        }
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
                      {uploadErrors.verificationDocument && (
                        <FormHelperText error>
                          {uploadErrors.verificationDocument}
                        </FormHelperText>
                      )}
                      {files.verificationDocument &&
                        !uploadErrors.verificationDocument && (
                          <Box mt={1} sx={{ wordBreak: "break-all" }}>
                            <Typography variant="caption" color="success.main">
                              Uploaded successfully
                            </Typography>
                          </Box>
                        )}
                    </Box>
                  </Grid>

                  {/* CV/Resume Upload */}
                  <Grid item xs={12} md={4}>
                    <Box>
                      <InputLabel htmlFor="cv-upload">CV/Resume *</InputLabel>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mt: 1, height: 56, textTransform: "none" }}
                        disabled={isUploading.cvPath}
                        color={
                          errors.cvPath || uploadErrors.cvPath
                            ? "error"
                            : "primary"
                        }
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
                      {(errors.cvPath || uploadErrors.cvPath) && (
                        <FormHelperText error>
                          {errors.cvPath?.message || uploadErrors.cvPath}
                        </FormHelperText>
                      )}
                      {files.cvPath &&
                        !errors.cvPath &&
                        !uploadErrors.cvPath && (
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
                        color={uploadErrors.photo ? "error" : "primary"}
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
                      {uploadErrors.photo && (
                        <FormHelperText error>
                          {uploadErrors.photo}
                        </FormHelperText>
                      )}
                      {files.photo && !uploadErrors.photo && (
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
                        color={
                          uploadErrors.verificationDocument
                            ? "error"
                            : "primary"
                        }
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
                      {uploadErrors.verificationDocument && (
                        <FormHelperText error>
                          {uploadErrors.verificationDocument}
                        </FormHelperText>
                      )}
                      {files.verificationDocument &&
                        !uploadErrors.verificationDocument && (
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
                        sx={{ mt: 1, height: 56, textTransform: "none" }}
                        disabled={isUploading.cvPath}
                        color={
                          errors.cvPath || uploadErrors.cvPath
                            ? "error"
                            : "primary"
                        }
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
                          accept=".pdf"
                          hidden
                          onChange={(e) => handleFileChange(e, "cvPath")}
                          required
                        />
                      </Button>
                      {(errors.cvPath || uploadErrors.cvPath) && (
                        <FormHelperText error>
                          {errors.cvPath?.message || uploadErrors.cvPath}
                        </FormHelperText>
                      )}
                      {files.cvPath &&
                        !errors.cvPath &&
                        !uploadErrors.cvPath && (
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
                <Box>
                  <InputLabel htmlFor="photo-upload">Profile Photo</InputLabel>
                  <UploadButton
                    className="upload-btn"
                    endpoint={"pdfUploader"}
                    onUploadBegin={() => console.log("Upload started")}
                    onUploadError={(error) => {
                      alert("Upload failed: " + error.message);
                    }}
                    onClientUploadComplete={(file) => {
                      console.log(file, file[0]);
                      setFiles({ ...files, photo: file[0].url });
                      console.log({ files });
                      alert("Upload SuccessFUll");
                    }}
                  />
                </Box>
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
