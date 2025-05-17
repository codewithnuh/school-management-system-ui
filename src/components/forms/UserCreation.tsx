import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RefreshIcon from "@mui/icons-material/Refresh";
import { z } from "zod";
import { useStudentRegistration } from "../../services/queries/studentRegistration";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Snackbar,
  Container,
} from "@mui/material";

import { useClasses } from "../../services/queries/classes";
import { useGetTeacherRegistrationLinkById } from "../../services/queries/registrationLinks";
import { useGetSchoolById } from "../../services/queries/school";
import SchoolHeader from "../headers/SchoolHeader";

// Define form schema using Zod
const userFormSchema = z.object({
  entityType: z.literal("STUDENT").default("STUDENT"),
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  placeOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNo: z.string().min(10).max(15).regex(/^\d+$/, {
    message: "Phone number must contain only digits",
  }),
  emergencyContactName: z
    .string()
    .min(1, { message: "Emergency contact name is required" }),
  emergencyContactNumber: z.string().min(10).max(15).regex(/^\d+$/, {
    message: "Contact number must contain only digits",
  }),
  address: z.string().min(1, { message: "Address is required" }),
  currentAddress: z.string().optional(),
  previousSchool: z.string().optional(),
  previousGrade: z.string().optional(),
  previousMarks: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional(),
  guardianName: z.string().min(1, { message: "Guardian name is required" }),
  guardianCNIC: z
    .string()
    .length(13, { message: "CNIC must be 13 digits" })
    .regex(/^\d+$/, {
      message: "CNIC must contain only digits",
    }),
  guardianPhone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits",
    })
    .optional(),
  guardianEmail: z
    .string()
    .email({ message: "Invalid email address" })
    .optional(),
  CNIC: z
    .string()
    .length(13, { message: "CNIC must be 13 digits" })
    .regex(/^\d+$/, {
      message: "CNIC must contain only digits",
    }),
  classId: z.number({ required_error: "Class is required" }),
  sectionId: z.number().optional(),
  schoolId: z.number().optional(),
  enrollmentDate: z.string().min(1, { message: "Enrollment date is required" }),
  photo: z.string().optional(),
  transportation: z.string().optional(),
  extracurriculars: z.string().optional(),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  healthInsuranceInfo: z.string().optional(),
  doctorContact: z.string().optional(),
});
export type UserFormData = z.infer<typeof userFormSchema>;

type AlertState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

const UserCreation = () => {
  const {
    data: schoolData,
    isLoading: isLoadingSchool,
    isError: isSchoolError,
    error: schoolError,
  } = useGetSchoolById(schoolId || "");

  const {
    data: classesData,
    isLoading: classIsLoading,
    isError: classIsError,
    error: classesIsError,
  } = useClasses();

  // Safely access data
  const school = schoolData?.data || null;

  // Safely access classes
  const CLASSES = classesData?.data || [];

  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const { mutate, isPending } = useStudentRegistration();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      gender: "Male",
      entityType: "STUDENT",
    },
  });

  const handleFormSubmit = (data: UserFormData) => {
    const formData = {
      ...data,
      entityType: "STUDENT",
      studentId: data.CNIC || `STD-${Date.now()}`,
    };
    mutate(formData, {
      onSuccess: () => {
        setAlert({
          open: true,
          message: "Student registered successfully!",
          severity: "success",
        });
        reset();
      },
      onError: (error) => {
        setAlert({
          open: true,
          message: `Registration failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          severity: "error",
        });
      },
    });
  };

  // Show loading state
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

  // Show error if registration link or school data failed
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

  // Show warning if registrationLinkId is missing or invalid
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

  // Show error if class data failed to load
  if (classIsError) {
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
            Failed to load class data:{" "}
            {classesIsError?.message || "Unknown error"}
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            startIcon={<RefreshIcon />}
          >
            Reload Page
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {/* School Header */}
        {school && <SchoolHeader school={school} />}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
          <Typography
            variant="h5"
            component="h2"
            textAlign={"center"}
            gutterBottom
          >
            Student Registration Form
          </Typography>
          <Typography
            textAlign={"center"}
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            Fields marked with * are required
          </Typography>
          <Divider sx={{ my: 3 }} />

          {/* Basic Info Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={4}>
              <Controller
                name="middleName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Middle Name"
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
                    label="Last Name *"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Birth *"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
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
                    <InputLabel id="gender-label">Gender *</InputLabel>
                    <Select {...field} labelId="gender-label" label="Gender *">
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    <FormHelperText>{errors.gender?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="placeOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Place of Birth"
                    fullWidth
                    error={!!errors.placeOfBirth}
                    helperText={errors.placeOfBirth?.message}
                  />
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
                    label="Nationality"
                    fullWidth
                    error={!!errors.nationality}
                    helperText={errors.nationality?.message}
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
                    label="Email *"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
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
                    rows={2}
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
                    label="Current Address (if different)"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.currentAddress}
                    helperText={errors.currentAddress?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Guardian Info Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Guardian Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="guardianName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Guardian Name *"
                    fullWidth
                    error={!!errors.guardianName}
                    helperText={errors.guardianName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="guardianCNIC"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Guardian CNIC *"
                    fullWidth
                    error={!!errors.guardianCNIC}
                    helperText={errors.guardianCNIC?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="guardianPhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Guardian Phone"
                    fullWidth
                    error={!!errors.guardianPhone}
                    helperText={errors.guardianPhone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="guardianEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Guardian Email"
                    type="email"
                    fullWidth
                    error={!!errors.guardianEmail}
                    helperText={errors.guardianEmail?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Academic Info Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Academic Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="CNIC"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Student CNIC *"
                    fullWidth
                    error={!!errors.CNIC}
                    helperText={errors.CNIC?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="enrollmentDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Enrollment Date *"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.enrollmentDate}
                    helperText={errors.enrollmentDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="classId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.classId}>
                    <InputLabel id="class-label">Class *</InputLabel>
                    <Select
                      {...field}
                      labelId="class-label"
                      label="Class *"
                      disabled={classIsLoading}
                    >
                      {classIsLoading ? (
                        <MenuItem value="">Loading classes...</MenuItem>
                      ) : classIsError ? (
                        <MenuItem value="">Failed to load classes</MenuItem>
                      ) : CLASSES.length === 0 ? (
                        <MenuItem value="">No classes available</MenuItem>
                      ) : (
                        CLASSES.map((classItem) => (
                          <MenuItem key={classItem.id} value={classItem.id}>
                            {classItem.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>{errors.classId?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="sectionId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.sectionId}>
                    <InputLabel id="section-label">Section</InputLabel>
                    <Select
                      {...field}
                      labelId="section-label"
                      label="Section"
                      disabled={classIsLoading}
                    >
                      <MenuItem value="">Select a section</MenuItem>
                    </Select>
                    <FormHelperText>{errors.sectionId?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="previousSchool"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Previous School"
                    fullWidth
                    error={!!errors.previousSchool}
                    helperText={errors.previousSchool?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="previousGrade"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Previous Grade"
                    fullWidth
                    error={!!errors.previousGrade}
                    helperText={errors.previousGrade?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="previousMarks"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Previous Marks"
                    fullWidth
                    error={!!errors.previousMarks}
                    helperText={errors.previousMarks?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Emergency Contact Info Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Emergency Contact Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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

          <Divider sx={{ my: 3 }} />

          {/* Additional Info Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="transportation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Transportation Details"
                    fullWidth
                    error={!!errors.transportation}
                    helperText={errors.transportation?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="extracurriculars"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Extracurricular Activities"
                    fullWidth
                    error={!!errors.extracurriculars}
                    helperText={errors.extracurriculars?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Medical Info Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Medical Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="medicalConditions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Medical Conditions"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.medicalConditions}
                    helperText={errors.medicalConditions?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="allergies"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Allergies"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.allergies}
                    helperText={errors.allergies?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="healthInsuranceInfo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Health Insurance Information"
                    fullWidth
                    error={!!errors.healthInsuranceInfo}
                    helperText={errors.healthInsuranceInfo?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="doctorContact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Doctor Contact"
                    fullWidth
                    error={!!errors.doctorContact}
                    helperText={errors.doctorContact?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Authentication Info Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Authentication
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isPending ? "Submitting..." : "Register Student"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Toast Notification */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          <AlertTitle>
            {alert.severity === "success"
              ? "Success"
              : alert.severity === "error"
              ? "Error"
              : "Info"}
          </AlertTitle>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserCreation;
