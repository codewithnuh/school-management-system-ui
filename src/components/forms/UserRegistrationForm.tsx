import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
} from "@mui/material";
import { useStudentRegisteration } from "../../services/queries/studentRegisteration";

// Define form schema using Zod
const userFormSchema = z.object({
  // Required fields for backend validation
  entityType: z.literal("STUDENT").default("STUDENT"),
  studentId: z.string().optional(), // This will be generated during API call

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
    message:
      "Phone number must contain only digits and be between 10-15 characters",
  }),
  emergencyContactName: z
    .string()
    .min(1, { message: "Emergency contact name is required" }),
  emergencyContactNumber: z.string().min(10).max(15).regex(/^\d+$/, {
    message:
      "Contact number must contain only digits and be between 10-15 characters",
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
      message:
        "Phone number must contain only digits and be between 10-15 characters",
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
  sectionId: z.number({ required_error: "Section is required" }).optional(),
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

// Types for alert feedback
type AlertState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

// Mock data for classes and sections
const CLASSES = [
  { id: 1, name: "Class 1" },
  { id: 2, name: "Class 2" },
  { id: 3, name: "Class 3" },
  { id: 4, name: "Class 4" },
  { id: 5, name: "Class 5" },
];

const SECTIONS = [
  { id: 1, name: "Section A" },
  { id: 2, name: "Section B" },
  { id: 3, name: "Section C" },
];

const UserRegistrationForm = () => {
  const { mutate, isPending } = useStudentRegisteration();

  // State for alert snackbar
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "info",
  });

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      gender: "Male",
      entityType: "STUDENT", // Add this line
    },
  });

  // Handle closing the alert
  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Handle form submission
  const handleFormSubmit = (data: UserFormData) => {
    // Ensure required fields are included
    const formData = {
      ...data,
      entityType: "STUDENT",
      studentId: data.CNIC || `STD-${Date.now()}`, // Use CNIC or generate a temporary ID
    };

    mutate(formData, {
      onSuccess: () => {
        setAlert({
          open: true,
          message: "Student registered successfully!",
          severity: "success",
        });
        reset(); // Reset form on success
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

  // Form field groups for better organization
  const renderBasicInfoFields = () => (
    <>
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
    </>
  );

  const renderGuardianInfoFields = () => (
    <>
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
    </>
  );

  const renderAcademicInfoFields = () => (
    <>
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
                <Select {...field} labelId="class-label" label="Class *">
                  {CLASSES.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </MenuItem>
                  ))}
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
                <InputLabel id="section-label">Section *</InputLabel>
                <Select {...field} labelId="section-label" label="Section *">
                  {SECTIONS.map((section) => (
                    <MenuItem key={section.id} value={section.id}>
                      {section.name}
                    </MenuItem>
                  ))}
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
    </>
  );

  const renderEmergencyContactFields = () => (
    <>
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
    </>
  );

  const renderAdditionalInfoFields = () => (
    <>
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
    </>
  );

  const renderMedicalInfoFields = () => (
    <>
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
    </>
  );

  const renderAuthenticationFields = () => (
    <>
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
    </>
  );

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Student Registration Form
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Fields marked with * are required
          </Typography>

          <Divider sx={{ my: 3 }} />

          {renderBasicInfoFields()}
          <Divider sx={{ my: 3 }} />

          {renderGuardianInfoFields()}
          <Divider sx={{ my: 3 }} />

          {renderAcademicInfoFields()}
          <Divider sx={{ my: 3 }} />

          {renderEmergencyContactFields()}
          <Divider sx={{ my: 3 }} />

          {renderAdditionalInfoFields()}
          <Divider sx={{ my: 3 }} />

          {renderMedicalInfoFields()}
          <Divider sx={{ my: 3 }} />

          {renderAuthenticationFields()}

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

      {/* Snackbar for alerts */}
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
              : "Information"}
          </AlertTitle>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserRegistrationForm;
