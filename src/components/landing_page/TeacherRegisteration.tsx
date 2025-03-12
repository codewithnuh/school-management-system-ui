import { ChangeEvent, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid2,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from "@mui/material/styles";
import CloudUpload from "@mui/icons-material/CloudUpload";
import { Description } from "@mui/icons-material";
// Styled components for dark mode
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const FileInputContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const TeacherRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: null,
    gender: "",
    nationality: "",
    email: "",
    phoneNo: "",
    address: "",
    currentAddress: "",
    cnic: "",
    highestQualification: "",
    specialization: "",
    experienceYears: "",
    joiningDate: null,
    emergencyContactName: "",
    emergencyContactNumber: "",
    verificationDocument: null,
    cv: null,
    password: "",
    showPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Password strength calculation
    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleDateChange = (date: Date, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Form submitted successfully!");
    }, 2000);
  };

  const calculatePasswordStrength = (password: string | any[]) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <StyledPaper>
          <Typography variant="h4" align="center" gutterBottom>
            Teacher Registration
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <SectionTitle variant="h6">Personal Information</SectionTitle>
            <Grid2 container spacing={3}>
              <Grid2 columns={{ xs: 12, sm: 4 }}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 4 }}>
                <TextField
                  name="middleName"
                  label="Middle Name"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 4 }}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 4 }}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(date) => handleDateChange(date, "dateOfBirth")}
                  renderInput={(
                    params: JSX.IntrinsicAttributes & {
                      variant?: TextFieldVariants | undefined;
                    } & Omit<
                        | OutlinedTextFieldProps
                        | FilledTextFieldProps
                        | StandardTextFieldProps,
                        "variant"
                      >
                  ) => <TextField {...params} fullWidth />}
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 4 }}>
                <TextField
                  name="nationality"
                  label="Nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid2>
            </Grid2>

            {/* Contact Information */}
            <SectionTitle variant="h6">Contact Information</SectionTitle>
            <Grid2 container spacing={3}>
              <Grid2 columns={{ xs: 12, sm: 4 }}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 6 }}>
                <TextField
                  name="phoneNo"
                  label="Phone Number"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  fullWidth
                  inputProps={{ maxLength: 15 }}
                  required
                />
              </Grid2>
              <Grid2 columns={{ xs: 12 }}>
                <TextField
                  name="address"
                  label="Permanent Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={2}
                  required
                />
              </Grid2>
              <Grid2 columns={{ xs: 12 }}>
                <TextField
                  name="currentAddress"
                  label="Current Address"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid2>
            </Grid2>

            {/* Professional Information */}
            <SectionTitle variant="h6">Professional Information</SectionTitle>
            <Grid2 container spacing={3}>
              <Grid2 columns={{ xs: 12 }}>
                <TextField
                  name="highestQualification"
                  label="Highest Qualification"
                  value={formData.highestQualification}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 6 }}>
                <TextField
                  name="specialization"
                  label="Specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 6 }}>
                <TextField
                  name="experienceYears"
                  label="Years of Experience"
                  type="number"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Joining Date"
                  value={formData.joiningDate}
                  onChange={(date) => handleDateChange(date, "joiningDate")}
                  renderInput={(
                    params: JSX.IntrinsicAttributes & {
                      variant?: TextFieldVariants | undefined;
                    } & Omit<
                        | OutlinedTextFieldProps
                        | FilledTextFieldProps
                        | StandardTextFieldProps,
                        "variant"
                      >
                  ) => <TextField {...params} fullWidth />}
                />
              </Grid2>
            </Grid2>

            {/* CNIC and Emergency Contact */}
            <SectionTitle variant="h6">Verification & Security</SectionTitle>
            <Grid2 container spacing={3}>
              <Grid2 columns={{ xs: 12, sm: 6 }}>
                <TextField
                  name="cnic"
                  label="CNIC (13 digits)"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  fullWidth
                  inputProps={{ maxLength: 13 }}
                  required
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 6 }}>
                <TextField
                  name="emergencyContactName"
                  label="Emergency Contact Name"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid2>
              <Grid2 columns={{ xs: 12, sm: 6 }}>
                <TextField
                  name="emergencyContactNumber"
                  label="Emergency Contact Number"
                  value={formData.emergencyContactNumber}
                  onChange={handleInputChange}
                  fullWidth
                  inputProps={{ maxLength: 15 }}
                  required
                />
              </Grid2>
            </Grid2>

            {/* File Uploads */}
            <SectionTitle variant="h6">Document Upload</SectionTitle>
            <FileInputContainer>
              <input
                type="file"
                id="verificationDocument"
                onChange={(e) => handleFileChange(e, "verificationDocument")}
                hidden
              />
              <label htmlFor="verificationDocument">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  startIcon={<CloudUpload />}
                >
                  Upload Verification Document
                </Button>
              </label>
              <input
                type="file"
                id="cv"
                onChange={(e) => handleFileChange(e, "cv")}
                hidden
              />
              <label htmlFor="cv">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  startIcon={<Description />}
                >
                  Upload CV
                </Button>
              </label>
            </FileInputContainer>

            {/* Password */}
            <SectionTitle variant="h6">Account Security</SectionTitle>
            <Grid2 container spacing={3}>
              <Grid2 columns={{ xs: 12 }}>
                <TextField
                  name="password"
                  label="Password"
                  type={formData.showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              showPassword: !prev.showPassword,
                            }))
                          }
                        >
                          {formData.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={
                      passwordStrength < 50
                        ? "error"
                        : passwordStrength < 75
                        ? "warning"
                        : "success"
                    }
                  />
                </Box>
              </Grid2>
            </Grid2>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={
                  loading && <CircularProgress size={20} color="inherit" />
                }
              >
                {loading ? "Submitting..." : "Register Teacher"}
              </Button>
            </Box>
          </form>
        </StyledPaper>
      </Container>
    </LocalizationProvider>
  );
};

export default TeacherRegistrationForm;
