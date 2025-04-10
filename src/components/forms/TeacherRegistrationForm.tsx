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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function TeacherRegisterationForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<TeacherSchemaType>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      entityType: "TEACHER",
      role: "TEACHER",
      applicationStatus: ApplicationStatus.Pending,
      isVerified: false,
    },
  });

  const onSubmit = (data: TeacherSchemaType) => {
    console.log("Form submitted:", data);
  };

  const handleFileChange =
    (fieldName: keyof TeacherSchemaType) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setValue(fieldName, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Teacher Registration
      </Typography>

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
                            onChange={(date) => {
                              field.onChange(date);
                            }}
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
                        <FormHelperText>{errors.gender.message}</FormHelperText>
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Years of Experience"
                          fullWidth
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
                            onChange={(date) => {
                              field.onChange(date);
                            }}
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
                    <Controller
                      name="subjectId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Subject ID *"
                          fullWidth
                          error={!!errors.subjectId}
                          helperText={errors.subjectId?.message}
                        />
                      )}
                    />
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

            {/* File Uploads */}
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
                    >
                      Upload Photo
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange("photo")}
                      />
                    </Button>
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
                    >
                      Upload Document
                      <input
                        id="verification-doc-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        hidden
                        onChange={handleFileChange("verificationDocument")}
                      />
                    </Button>
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
                      color={errors.cvPath ? "error" : "primary"}
                    >
                      Upload CV
                      <input
                        id="cv-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        hidden
                        onChange={handleFileChange("cvPath")}
                        required
                      />
                    </Button>
                    {errors.cvPath && (
                      <FormHelperText error>
                        {errors.cvPath.message}
                      </FormHelperText>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Submit Application
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default TeacherRegisterationForm;
