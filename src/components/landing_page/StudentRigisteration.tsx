import type React from "react";
import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel, // Fixed typo <button class="citation-flag" data-index="7">
  Box,
  Divider,
  TextFieldProps,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers"; // Correct import <button class="citation-flag" data-index="9">
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Dayjs adapter <button class="citation-flag" data-index="9">

interface StudentFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: "Male" | "Female" | "Other";
  placeOfBirth: string;
  nationality: string;
  email: string;
  phoneNo: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  address: string;
  currentAddress: string;
  studentId: string;
  previousSchool: string;
  previousGrade: string;
  previousMarks: string;
  password: string;
  guardianName: string;
  guardianCNIC: string;
  guardianPhone: string;
  guardianEmail: string;
  CNIC: string;
  classId: number | "";
  sectionId: number | "";
  enrollmentDate: Date | null; // Fixed typo <button class="citation-flag" data-index="7">
  photo: string;
  transportation: string;
  extracurriculars: string;
  medicalConditions: string;
  allergies: string;
  healthInsuranceInfo: string;
  doctorContact: string;
}

const initialFormData: StudentFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: null,
  gender: "Male",
  placeOfBirth: "",
  nationality: "",
  email: "",
  phoneNo: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  address: "",
  currentAddress: "",
  studentId: "",
  previousSchool: "",
  previousGrade: "",
  previousMarks: "",
  password: "",
  guardianName: "",
  guardianCNIC: "",
  guardianPhone: "",
  guardianEmail: "",
  CNIC: "",
  classId: "",
  sectionId: "",
  enrollmentDate: null,
  photo: "",
  transportation: "",
  extracurriculars: "",
  medicalConditions: "",
  allergies: "",
  healthInsuranceInfo: "",
  doctorContact: "",
};

const StudentRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const { name, value } = event.target;
    let newValue: string | number = value;
    if ((name === "classId" || name === "sectionId") && value !== "") {
      newValue = Number(value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleDateChange = (
    date: Date | null,
    fieldName: keyof StudentFormData
  ) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Student Registration Form
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="middleName"
                    label="Middle Name"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DatePicker<Date>
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(date: Date | null) =>
                      handleDateChange(date, "dateOfBirth")
                    }
                    renderInput={(params: TextFieldProps) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleSelectChange}
                      label="Gender"
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="placeOfBirth"
                    label="Place of Birth"
                    value={formData.placeOfBirth}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Contact Information */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phoneNo"
                    label="Phone Number"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="emergencyContactName"
                    label="Emergency Contact Name"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="emergencyContactNumber"
                    label="Emergency Contact Number"
                    value={formData.emergencyContactNumber}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Permanent Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="currentAddress"
                    label="Current Address"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Academic Information */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                Academic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="studentId"
                    label="Student ID"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Class</InputLabel>
                    <Select
                      name="classId"
                      value={formData.classId}
                      onChange={handleSelectChange}
                      label="Class"
                    >
                      <MenuItem value="">Select Class</MenuItem>
                      <MenuItem value={1}>Class A</MenuItem>
                      <MenuItem value={2}>Class B</MenuItem>
                      <MenuItem value={3}>Class C</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Section</InputLabel>
                    <Select
                      name="sectionId"
                      value={formData.sectionId}
                      onChange={handleSelectChange}
                      label="Section"
                    >
                      <MenuItem value="">Select Section</MenuItem>
                      <MenuItem value={1}>Section 1</MenuItem>
                      <MenuItem value={2}>Section 2</MenuItem>
                      <MenuItem value={3}>Section 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DatePicker
                    label="Enrollment Date"
                    value={formData.enrollmentDate}
                    onChange={(date) =>
                      handleDateChange(date, "enrollmentDate")
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="previousSchool"
                    label="Previous School"
                    value={formData.previousSchool}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="previousGrade"
                    label="Previous Grade"
                    value={formData.previousGrade}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="previousMarks"
                    label="Previous Marks"
                    value={formData.previousMarks}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Guardian Information */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                Guardian Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="guardianName"
                    label="Guardian Name"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="guardianCNIC"
                    label="Guardian CNIC"
                    value={formData.guardianCNIC}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="guardianPhone"
                    label="Guardian Phone"
                    value={formData.guardianPhone}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="guardianEmail"
                    label="Guardian Email"
                    value={formData.guardianEmail}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Additional Information */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="CNIC"
                    label="Student CNIC"
                    value={formData.CNIC}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="photo"
                    label="Photo URL"
                    value={formData.photo}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="transportation"
                    label="Transportation Details"
                    value={formData.transportation}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="extracurriculars"
                    label="Extracurricular Activities"
                    value={formData.extracurriculars}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="medicalConditions"
                    label="Medical Conditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="allergies"
                    label="Allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="healthInsuranceInfo"
                    label="Health Insurance Info"
                    value={formData.healthInsuranceInfo}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="doctorContact"
                    label="Doctor Contact"
                    value={formData.doctorContact}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Password */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </Box>

            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default StudentRegistrationForm;
