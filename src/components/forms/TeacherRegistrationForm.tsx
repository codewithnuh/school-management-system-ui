import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  teacherSchema,
  TeacherSchemaType,
  Gender,
  ApplicationStatus,
} from "../../schema/teacher.schema";

/**
 * TeacherRegistrationForm Component
 *
 * A form for registering new teachers in the school management system.
 * Uses React Hook Form with Zod validation and Material UI components.
 */
const TeacherRegistrationForm = () => {
  // State for tracking form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with React Hook Form and Zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeacherSchemaType>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      entityType: "TEACHER",
      role: "TEACHER",

      applicationStatus: ApplicationStatus.Pending,
      isVerified: false,
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: new Date().toISOString(),
      gender: Gender.Male, // or Gender.Other
      nationality: "",
      cnic: "",
      email: "",
      phoneNo: "",
      address: "",
      currentAddress: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      highestQualification: "",
      specialization: "",
      experienceYears: 0,
      joiningDate: new Date().toISOString(),
      subjectId: 1, // as explained before
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: TeacherSchemaType) => {
    setIsSubmitting(true);
    try {
      // Log form data to console as per requirements
      console.log("Teacher Registration Form Data:", data);

      // In a real app, you would send this data to an API
      // await teacherApi.register(data);

      // Reset form after successful submission
      reset();
      // Optionally show success message or redirect
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle errors (could show error toast/message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Teacher Registration Form
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Personal Information
              </Typography>
            </Grid>

            {/* First Name */}
            <Grid item xs={12} sm={4}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    required
                  />
                )}
              />
            </Grid>

            {/* Middle Name */}
            <Grid item xs={12} sm={4}>
              <Controller
                name="middleName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Middle Name"
                    error={!!errors.middleName}
                    helperText={errors.middleName?.message}
                  />
                )}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={4}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    required
                  />
                )}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Date of Birth"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.dateOfBirth,
                          helperText: errors.dateOfBirth?.message,
                          required: true,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <FormControl error={!!errors.gender} required>
                <FormLabel id="gender-label">Gender</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row aria-labelledby="gender-label">
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
                  <FormHelperText>{errors.gender.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Nationality */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nationality"
                    error={!!errors.nationality}
                    helperText={errors.nationality?.message}
                  />
                )}
              />
            </Grid>

            {/* CNIC */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="cnic"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="CNIC (13 digits)"
                    error={!!errors.cnic}
                    helperText={errors.cnic?.message}
                    required
                    inputProps={{ maxLength: 13 }}
                  />
                )}
              />
            </Grid>

            {/* Contact Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                Contact Information
              </Typography>
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    required
                  />
                )}
              />
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="phoneNo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    error={!!errors.phoneNo}
                    helperText={errors.phoneNo?.message}
                    required
                  />
                )}
              />
            </Grid>

            {/* Permanent Address */}
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Permanent Address"
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    required
                  />
                )}
              />
            </Grid>

            {/* Current Address */}
            <Grid item xs={12}>
              <Controller
                name="currentAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Current Address (if different from permanent)"
                    multiline
                    rows={2}
                    error={!!errors.currentAddress}
                    helperText={errors.currentAddress?.message}
                  />
                )}
              />
            </Grid>

            {/* Emergency Contact Section */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                Emergency Contact
              </Typography>
            </Grid>

            {/* Emergency Contact Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContactName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Emergency Contact Name"
                    error={!!errors.emergencyContactName}
                    helperText={errors.emergencyContactName?.message}
                    required
                  />
                )}
              />
            </Grid>

            {/* Emergency Contact Number */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContactNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Emergency Contact Number"
                    error={!!errors.emergencyContactNumber}
                    helperText={errors.emergencyContactNumber?.message}
                    required
                  />
                )}
              />
            </Grid>

            {/* Professional Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                Professional Information
              </Typography>
            </Grid>

            {/* Highest Qualification */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="highestQualification"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Highest Qualification"
                    error={!!errors.highestQualification}
                    helperText={errors.highestQualification?.message}
                    required
                  />
                )}
              />
            </Grid>

            {/* Specialization */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="specialization"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Specialization"
                    error={!!errors.specialization}
                    helperText={errors.specialization?.message}
                  />
                )}
              />
            </Grid>

            {/* Experience Years */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="experienceYears"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    error={!!errors.experienceYears}
                    helperText={errors.experienceYears?.message}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value, 10) : ""
                      )
                    }
                  />
                )}
              />
            </Grid>

            {/* Joining Date */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="joiningDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Joining Date"
                      value={
                        field.value === null ? undefined : new Date(field.value)
                      }
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.joiningDate,
                          helperText: errors.joiningDate?.message,
                          required: true,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Subject ID */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="subjectId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    value={1}
                    label="Subject"
                    error={!!errors.subjectId}
                    helperText={errors.subjectId?.message}
                    required
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  >
                    {/* Replace with actual subjects from your API */}
                    <MenuItem value={1}>Mathematics</MenuItem>
                    <MenuItem value={2}>Science</MenuItem>
                    <MenuItem value={3}>English</MenuItem>
                    <MenuItem value={4}>History</MenuItem>
                    <MenuItem value={5}>Computer Science</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type="password"
                    error={!!errors.password}
                    helperText={
                      errors.password?.message || "Minimum 8 characters"
                    }
                    required
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
                sx={{ height: 56 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default TeacherRegistrationForm;
