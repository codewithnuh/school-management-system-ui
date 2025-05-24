// src/components/TeacherRegistrationForm.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
  styled,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSearchParams } from "react-router"; // Use react-router-dom for useSearchParams

// Import your UploadButton and styling for it
import { UploadButton } from "../../utils/uploadthing";

// Import your Zod schema and inferred type
import { teacherSchema, TeacherFormInputs } from "../../schema/teacher.schema"; // Adjust path as needed

// Import TanStack Query hooks for school and teacher registration mutation
import { useGetSchoolById } from "../../services/queries/school"; // Adjust path
import { useSubjects as useGetAllSubjects } from "../../services/queries/subject"; // Adjust path
import { useRegisterTeacher } from "../../services/queries/teacherRegistration"; // Adjust path
import { useGetTeacherRegistrationLinkById } from "../../services/queries/registrationLinks";

// Reusable styled component for the form container (similar to GlassCard)
const FormContainerPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 15,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(30, 30, 30, 0.92)", // Matches your paper background
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(15px)",
  color: theme.palette.text.primary,
}));

// Styled button for UploadThing to improve appearance
const UploadStyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.grey[800], // Darker background for distinction
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.grey[700],
  },
  textTransform: "none", // Prevent uppercase
  justifyContent: "flex-start", // Align text to the left
  paddingLeft: theme.spacing(2),
}));

// Alert component for Snackbar
const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TeacherRegistrationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const registrationLinkId = searchParams.get("registrationLinkId");

  // Fetch registration link data first
  const {
    data: registrationLinkResponse,
    isLoading: isLoadingLink,
    isError: isErrorLink,
  } = useGetTeacherRegistrationLinkById(registrationLinkId || ""); // Ensure non-null for the query key

  // Extract schoolId after registrationLinkData is available
  const schoolId = registrationLinkResponse?.data?.schoolId;

  // Fetch school data using the extracted schoolId
  const {
    data: schoolData,
    isLoading: isLoadingSchool,
    isError: isErrorSchool,
    error: schoolError,
  } = useGetSchoolById(schoolId as number, {
    enabled: !!schoolId, // Only enable this query if schoolId is available
  });

  const {
    data: subjectsData,
    isLoading: isLoadingSubjects,
    isError: isErrorSubjects,
    error: subjectsError,
  } = useGetAllSubjects(schoolId as number);

  // Mutation hook for teacher registration
  const registerTeacherMutation = useRegisterTeacher();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TeacherFormInputs>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      password: "",
      dateOfBirth: undefined,
      schoolId: undefined, // Initialize as undefined; set via useEffect
      subjectId: undefined,
      gender: undefined,
      nationality: "",
      email: "",
      entityType: "TEACHER",
      phoneNo: "",
      address: "",
      currentAddress: "",
      cnic: "",
      highestQualification: "",
      specialization: "",
      experienceYears: undefined,
      joiningDate: undefined,
      photo: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      verificationDocument: "",
      cvPath: "",
    },
  });

  // Set schoolId in form defaults once it's available from the registration link
  useEffect(() => {
    if (schoolId) {
      setValue("schoolId", schoolId);
    }
  }, [schoolId, setValue]);

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

  const onSubmit = async (data: TeacherFormInputs) => {
    try {
      console.log("Submitting form data:", data);
      await registerTeacherMutation.mutateAsync(data, {
        onSuccess: () => {
          showToast("Teacher registered successfully!", "success");
          reset();
        },
        onError: (err: any) => {
          console.error("Teacher registration error:", err);
          showToast(
            `Registration failed: ${err.message || "Unknown error"}`,
            "error"
          );
        },
      });
    } catch (error) {
      console.error("Form submission failed:", error);
      showToast("An unexpected error occurred during submission.", "error");
    }
  };

  // Render Loading/Error States for all necessary data
  if (isLoadingLink || isLoadingSchool || isLoadingSubjects) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Loading registration details...
        </Typography>
      </Box>
    );
  }

  if (isErrorLink) {
    return (
      <FormContainerPaper sx={{ m: 2 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Invalid Registration Link
        </Typography>
        <Typography color="error.light">
          The registration link provided is invalid or has expired. Please
          ensure you're using the correct link.
        </Typography>
      </FormContainerPaper>
    );
  }

  if (isErrorSchool || isErrorSubjects) {
    return (
      <FormContainerPaper sx={{ m: 2 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Data
        </Typography>
        <Typography color="error.light">
          Failed to fetch necessary data (School/Subjects). Please try again.
          <br />
          {schoolError?.message || subjectsError?.message || "Unknown error."}
        </Typography>
      </FormContainerPaper>
    );
  }

  const school = schoolData?.data; // Directly get the school data
  const subjects = subjectsData?.data || [];

  // If school data is not found even after successful fetch (e.g., empty data array)
  if (!school) {
    return (
      <FormContainerPaper sx={{ m: 2 }}>
        <Typography variant="h6" color="error" gutterBottom>
          School Not Found
        </Typography>
        <Typography color="error.light">
          The school associated with this registration link could not be found.
        </Typography>
      </FormContainerPaper>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormContainerPaper sx={{ maxWidth: 800, mx: "auto", my: 4 }}>
        {/* School Information Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            p: 2,
            backgroundColor: school.brandColor || "primary.dark", // Use school's brand color
            borderRadius: 2,
            color: "white", // Ensure text is visible
          }}
        >
          {school.logo && (
            <Box
              component="img"
              src={school.logo}
              alt={`${school.name} logo`}
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
                mb: 1,
                border: "2px solid white",
              }}
            />
          )}
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 1 }}>
            Join {school.name}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {school.description ||
              "Complete your registration to become a teacher at this esteemed institution."}
          </Typography>
        </Box>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 4, textAlign: "center", color: "primary.main" }}
        >
          Teacher Registration Form
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="middleName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Middle Name (Optional)"
                    variant="outlined"
                    fullWidth
                    error={!!errors.middleName}
                    helperText={errors.middleName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Date of Birth"
                    value={field.value || null}
                    onChange={(date) => field.onChange(date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      {...field}
                      label="Gender"
                      value={field.value || ""}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {errors.gender && (
                      <FormHelperText>{errors.gender?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nationality (Optional)"
                    variant="outlined"
                    fullWidth
                    error={!!errors.nationality}
                    helperText={errors.nationality?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phoneNo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    type="tel"
                    error={!!errors.phoneNo}
                    helperText={errors.phoneNo?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="cnic"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CNIC (13 digits)"
                    variant="outlined"
                    fullWidth
                    inputProps={{ maxLength: 13 }}
                    error={!!errors.cnic}
                    helperText={errors.cnic?.message}
                  />
                )}
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 1, color: "text.primary" }}
              >
                Address Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Permanent Address"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="currentAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Current Address (Optional)"
                    variant="outlined"
                    fullWidth
                    error={!!errors.currentAddress}
                    helperText={errors.currentAddress?.message}
                  />
                )}
              />
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 1, color: "text.primary" }}
              >
                Professional Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="subjectId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.subjectId}>
                    <InputLabel id="subject-label">Subject</InputLabel>
                    <Select
                      labelId="subject-label"
                      {...field}
                      label="Subject"
                      value={field.value || ""}
                    >
                      {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.subjectId && (
                      <FormHelperText>
                        {errors.subjectId?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="highestQualification"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Highest Qualification"
                    variant="outlined"
                    fullWidth
                    error={!!errors.highestQualification}
                    helperText={errors.highestQualification?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="specialization"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Specialization (Optional)"
                    variant="outlined"
                    fullWidth
                    error={!!errors.specialization}
                    helperText={errors.specialization?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="experienceYears"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Years of Experience (Optional)"
                    variant="outlined"
                    fullWidth
                    type="number"
                    inputProps={{ min: 0 }}
                    error={!!errors.experienceYears}
                    helperText={errors.experienceYears?.message}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      );
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="joiningDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Joining Date (Optional)"
                    value={field.value || null}
                    onChange={(date) => field.onChange(date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.joiningDate}
                        helperText={errors.joiningDate?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 1, color: "text.primary" }}
              >
                Emergency Contact
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContactName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Emergency Contact Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.emergencyContactName}
                    helperText={errors.emergencyContactName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContactNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Emergency Contact Number"
                    variant="outlined"
                    fullWidth
                    type="tel"
                    error={!!errors.emergencyContactNumber}
                    helperText={errors.emergencyContactNumber?.message}
                  />
                )}
              />
            </Grid>

            {/* Document Uploads */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 1, color: "text.primary" }}
              >
                Documents
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Upload Teacher Photo (Optional)
                </Typography>
                <UploadButton
                  endpoint="pdfUploader" // This should match an endpoint in your Uploadthing config on the backend
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      setValue("photo", res[0].url);
                      showToast("Photo uploaded successfully!", "success");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    showToast(`Photo upload failed: ${error.message}`, "error");
                  }}
                >
                  <UploadStyledButton
                    variant="contained"
                    component="span"
                    fullWidth
                  >
                    Click to Upload Photo
                  </UploadStyledButton>
                </UploadButton>
                {errors.photo && (
                  <FormHelperText error>{errors.photo?.message}</FormHelperText>
                )}
                {control._formValues.photo && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Uploaded Photo:{" "}
                    <a
                      href={control._formValues.photo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Upload Verification Document (Optional)
                </Typography>
                <UploadButton
                  endpoint="pdfUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      setValue("verificationDocument", res[0].url);
                      showToast("Verification document uploaded!", "success");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    showToast(`Doc upload failed: ${error.message}`, "error");
                  }}
                >
                  <UploadStyledButton
                    variant="contained"
                    component="span"
                    fullWidth
                  >
                    Click to Upload Document
                  </UploadStyledButton>
                </UploadButton>
                {errors.verificationDocument && (
                  <FormHelperText error>
                    {errors.verificationDocument?.message}
                  </FormHelperText>
                )}
                {control._formValues.verificationDocument && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Uploaded Document:{" "}
                    <a
                      href={control._formValues.verificationDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Upload CV (Optional)
                </Typography>
                <UploadButton
                  endpoint="pdfUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      setValue("cvPath", res[0].url);
                      showToast("CV uploaded successfully!", "success");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    showToast(`CV upload failed: ${error.message}`, "error");
                  }}
                >
                  <UploadStyledButton
                    variant="contained"
                    component="span"
                    fullWidth
                  >
                    Click to Upload CV
                  </UploadStyledButton>
                </UploadButton>
                {errors.cvPath && (
                  <FormHelperText error>
                    {errors.cvPath?.message}
                  </FormHelperText>
                )}
                {control._formValues.cvPath && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Uploaded CV:{" "}
                    <a
                      href={control._formValues.cvPath}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, py: 1.5 }}
                disabled={isSubmitting || registerTeacherMutation.isPending}
              >
                {isSubmitting || registerTeacherMutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register Teacher"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>

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
      </FormContainerPaper>
    </LocalizationProvider>
  );
};

export default TeacherRegistrationForm;
