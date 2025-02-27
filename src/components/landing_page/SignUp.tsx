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
  InputLabel,
  Box,
  Divider,
  styled,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Dark theme with glassmorphism <button class="citation-flag" data-index="3"><button class="citation-flag" data-index="7">
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#bb86fc",
    },
    background: {
      default: "rgba(30, 30, 30, 0.95)",
      paper: "rgba(45, 45, 45, 0.85)",
    },
    text: {
      primary: "#e0e0e0",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "&:hover fieldset": {
              borderColor: "#bb86fc",
            },
          },
        },
      },
    },
  },
});

// Glassmorphism-styled Paper <button class="citation-flag" data-index="4">
const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(15px)",
}));

const StudentRegistrationForm = () => {
  const [formData, setFormData] = useState({
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles the change event for select input elements.
   *
   * @param event - The change event triggered by an input element.
   */
  const handleSelectChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    // Convert value to a number if the field name includes "Id", otherwise keep it as a string.
    const newValue = name.includes("Id") ? Number(value) || "" : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  /**
   * Handles the change event for date fields.
   *
   * @param date - The new date value.
   * @param field - The specific field in formData to update.
   */
  const handleDateChange = (date: string, field: string): void => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  /**
   * Handles the form submission.
   *
   * @param e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <GlassPaper>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ color: "#bb86fc" }}
            >
              Student Registration
            </Typography>

            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <Box mb={4}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#bb86fc", mb: 3 }}
                >
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
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dateOfBirth}
                      onChange={(date) => handleDateChange(date, "dateOfBirth")}
                      renderInput={(params) => (
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
                </Grid>
              </Box>

              {/* Contact Information */}
              <Box mb={4}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#bb86fc", mb: 3 }}
                >
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
                      inputProps={{ maxLength: 15 }}
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
                </Grid>
              </Box>

              {/* Academic Information */}
              <Box mb={4}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#bb86fc", mb: 3 }}
                >
                  Academic Information
                </Typography>
                <Grid container spacing={3}>
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
                </Grid>
              </Box>

              {/* Guardian Information */}
              <Box mb={4}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#bb86fc", mb: 3 }}
                >
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
                      name="guardianPhone"
                      label="Guardian Phone"
                      value={formData.guardianPhone}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Password */}
              <Box mb={4}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#bb86fc", mb: 3 }}
                >
                  Account Security
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
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

              <Box textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    px: 6,
                    py: 2,
                    borderRadius: 5,
                    bgcolor: "#bb86fc",
                    "&:hover": { bgcolor: "#9c59db" },
                  }}
                >
                  Register
                </Button>
              </Box>
            </form>
          </GlassPaper>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default StudentRegistrationForm;
