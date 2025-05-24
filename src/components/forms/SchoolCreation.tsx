import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  styled,
  ThemeProvider,
  Snackbar,
  Alert,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { darkTheme } from "../../theme/darkTheme"; // your existing theme
import { uploadDirect } from "@uploadcare/upload-client";
import { useUser } from "../../hooks/useUser";
import {
  useCreateSchool,
  useGetSchoolAdminId,
} from "../../services/queries/school";
import { useNavigate } from "react-router";
import { useVerifyAdminSubscription } from "../../utils/verifyAdminAccountSubscription";

// Styled components
const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
}));

// Uploadcare Public Key
const UPLOADCARE_PUBLIC_KEY = import.meta.env
  .VITE_REACT_APP_UPLOADCARE_PUBLIC_KEY; // Replace with env var in production

const CreateSchool = () => {
  const [formData, setFormData] = useState({
    name: "",
    brandColor: "",
    description: "",
    logo: "https://codewithnuh.vercel.app",
  });
  const { data } = useUser();
  console.log(data);
  const navigate = useNavigate();
  const { data: userData } = useUser();

  // Redirect non-admins
  const adminId = userData?.data.role === "ADMIN" ? userData.data.user.id : "";
  useEffect(() => {
    if (!adminId) {
      navigate("/login");
    }
  }, [adminId, navigate]);

  // Fetch school data
  const {
    data: SchoolData,
    error,
    isLoading,
  } = useGetSchoolAdminId(adminId as number, !!adminId);
  if (SchoolData?.data != null) navigate("/dashboard/admin");
  const createSchoolMutation = useCreateSchool();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schoolCreated, setSchoolCreated] = useState(false);
  const { subscriptionStatus } = useVerifyAdminSubscription();
  if (subscriptionStatus == false) navigate("/dashboard/admin/activate");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setToast({
        open: true,
        message: "Invalid file type. Please upload a JPEG, PNG, or GIF.",
        severity: "error",
      });
      return;
    }

    setIsUploadingLogo(true);

    try {
      const uploadedFile = await uploadDirect(file, {
        publicKey: UPLOADCARE_PUBLIC_KEY,
        store: "auto",
      });

      const cdnUrl = uploadedFile.cdnUrl || "";
      setFormData((prev) => ({ ...prev, logo: cdnUrl }));
    } catch (error) {
      console.error("Error uploading logo:", error);
      setToast({
        open: true,
        message: "Failed to upload logo. Please try again.",
        severity: "error",
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    createSchoolMutation.mutate(
      { ...formData, adminId },
      {
        onSuccess: () => {
          setLoading(false);
          setSchoolCreated(true);
          setToast({
            open: true,
            message: "School created successfully!",
            severity: "success",
          });
        },
        onError: () => {
          setLoading(false);
          setSchoolCreated(false);
          setToast({
            open: true,
            message: "Failed to create School!",
            severity: "error",
          });
        },
      }
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <GlassPaper>
          <Typography variant="h4" align="center" gutterBottom>
            Create Your School
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* School Name */}
            <Box mb={3}>
              <TextField
                name="name"
                label="School Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Box>

            {/* Brand Color */}
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom>
                Brand Color
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  name="brandColor"
                  label="Brand Color"
                  value={formData.brandColor}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <input
                  type="color"
                  value={formData.brandColor || "#000000"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      brandColor: e.target.value,
                    }))
                  }
                  style={{
                    width: 50,
                    height: 50,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                  title="Pick Brand Color"
                />
              </Box>
            </Box>

            {/* Description */}
            <Box mb={3}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Box>

            {/* Logo Upload */}
            <Box mb={3}>
              <InputLabel htmlFor="logo-upload">Logo</InputLabel>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  mt: 1,
                  height: 56,
                  textTransform: "none",
                  justifyContent: "space-between",
                  pr: 2,
                  pl: 2,
                }}
                disabled={isUploadingLogo}
                startIcon={
                  isUploadingLogo ? <CircularProgress size={20} /> : undefined
                }
              >
                <span>
                  {isUploadingLogo
                    ? "Uploading..."
                    : formData.logo
                    ? "Change Logo"
                    : "Upload Logo"}
                </span>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoUpload}
                />
              </Button>

              {/* Success Message */}
              {formData.logo && !isUploadingLogo && (
                <Box mt={1}>
                  <Typography variant="caption" color="success.main">
                    Logo uploaded successfully
                  </Typography>
                </Box>
              )}

              {/* Preview Logo */}
              {formData.logo && (
                <Box mt={2} textAlign="center">
                  <img
                    src={`${formData.logo}?t=${Date.now()}`} // cache busting
                    alt="Logo Preview"
                    style={{
                      maxHeight: 100,
                      maxWidth: "100%",
                      objectFit: "contain",
                      borderRadius: 8,
                      border: "1px solid #333",
                    }}
                  />
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    onClick={handleRemoveLogo}
                    sx={{ mt: 1 }}
                  >
                    Remove Logo
                  </Button>
                </Box>
              )}
            </Box>

            {/* Submit Button */}
            <Box textAlign="center" mt={4}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || isUploadingLogo}
                sx={{
                  px: 5,
                  py: 1.5,
                  width: "100%",
                  borderRadius: 5,
                  backgroundColor: "#1c1c1c",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                {loading ? "Creating..." : "Create School"}
              </Button>
            </Box>
          </form>

          {/* Post Creation Info */}
          {schoolCreated && (
            <Box mt={4} textAlign="center">
              <Typography variant="body1" mb={2} color="success.main">
                Your school was created!
              </Typography>
              <Button
                variant="outlined"
                color="success"
                href="https://wa.me/919999999999"
                target="_blank"
              >
                Contact on WhatsApp for Admin Access
              </Button>
            </Box>
          )}
        </GlassPaper>

        {/* Toast Notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={5000}
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
};

export default CreateSchool;
