"use client";
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Snackbar,
  Alert,
  styled,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { QrCode, Delete, ContentCopy } from "@mui/icons-material";
import { saveAs } from "file-saver";

// Theme & Components
import { darkTheme } from "../../../theme/darkTheme";
import { ThemeProvider } from "@mui/material/styles";

// Hooks
import {
  useGetTeacherRegistrationLink,
  useGetStudentRegistrationLink,
  useCreateTeacherRegistrationLink,
  useCreateStudentRegistrationLink,
  useDeleteTeacherRegistrationLink,
  useDeleteStudentRegistrationLink,
} from "../../../services/queries/teachers";
import { useUser } from "../../../hooks/useUser";
import { useGetSchoolAdminId } from "../../../services/queries/school";

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
}));

const LinkCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  background: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
}));

export default function RegistrationLinksPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: teacherLinkData,
    isLoading: isTeacherLoading,
    isError: isTeacherError,
    error: teacherError,
    refetch: teacherLinkRefetch,
  } = useGetTeacherRegistrationLink();
  console.log({ teacherLinkData });
  const {
    data: studentLinkData,
    isLoading: isStudentLoading,
    isError: isStudentError,
    error: studentError,
  } = useGetStudentRegistrationLink();
  console.log(studentLinkData);

  const createTeacherLinkMutation = useCreateTeacherRegistrationLink();
  const createStudentLinkMutation = useCreateStudentRegistrationLink();

  const deleteTeacherLinkMutation = useDeleteTeacherRegistrationLink();
  const deleteStudentLinkMutation = useDeleteStudentRegistrationLink();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const handleCloseToast = () => setToast({ ...toast, open: false });

  // Get adminId and schoolId from context/hooks
  const { data: userData } = useUser();
  const adminId = userData?.data.user.id;

  const { data: schoolData } = useGetSchoolAdminId(
    adminId as number,
    !!adminId
  );
  const schoolId = schoolData?.data.id;

  // Extract current links
  const teacherLink = teacherLinkData?.data?.[0];
  const studentLink = studentLinkData?.data?.[0];

  // --- Generate Teacher Link ---
  const handleGenerateTeacherLink = async () => {
    if (!adminId || !schoolId) {
      showSnackbar("Admin or School ID missing", "error");
      return;
    }

    try {
      createTeacherLinkMutation.mutate();
      teacherLinkRefetch();

      showSnackbar("Teacher registration link generated.", "success");
    } catch (err: any) {
      showSnackbar(err.message || "Failed to generate teacher link.", "error");
    }
  };

  // --- Generate Student Link ---
  const handleGenerateStudentLink = async () => {
    try {
      await createStudentLinkMutation.mutateAsync();
      showSnackbar("Student registration link generated.", "success");
    } catch (err: any) {
      showSnackbar(err.message || "Failed to generate student link.", "error");
    }
  };

  // --- Delete Teacher Link ---
  const handleDeleteTeacherLink = async () => {
    if (!teacherLink?.id) return;

    try {
      await deleteTeacherLinkMutation.mutateAsync();
      showSnackbar("Teacher registration link deleted.", "info");
    } catch (err: any) {
      showSnackbar(
        err.message || "Failed to delete teacher registration link.",
        "error"
      );
    }
  };

  // --- Delete Student Link ---
  const handleDeleteStudentLink = async () => {
    if (!studentLink?.id) return;

    try {
      await deleteStudentLinkMutation.mutateAsync();
      showSnackbar("Student registration link deleted.", "info");
    } catch (err: any) {
      showSnackbar(
        err.message || "Failed to delete student registration link.",
        "error"
      );
    }
  };

  // --- Copy to Clipboard ---
  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    showSnackbar("Link copied to clipboard!", "success");
  };

  // --- Download QR Code ---
  const downloadQRCode = async (
    qrCodeUrl: string | undefined,
    type: "TEACHER" | "STUDENT"
  ) => {
    if (!qrCodeUrl) {
      showSnackbar("QR code not available.", "error");
      return;
    }

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      saveAs(blob, `registration-qr-${type.toLowerCase()}.png`);
    } catch (err: any) {
      showSnackbar("Failed to download QR code.", "error");
    }
  };

  // --- Toast Helper ---
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  // --- Render Section Component ---
  const renderRegistrationSection = (
    title: string,
    linkData: typeof teacherLink | typeof studentLink,
    isLoading: boolean,
    isError: boolean,
    errorMessage: string | undefined,
    onGenerate: () => void,
    onDelete: () => void,
    type: "TEACHER" | "STUDENT"
  ) => {
    const hasLink = linkData?.url && linkData.url !== "";
    const qrCodeUrl = linkData?.qrCode ? linkData.qrCode : null;

    return (
      <GlassCard>
        <Typography variant="h6" gutterBottom>
          {title} Registration
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress size={24} />
            <Typography ml={2}>
              Fetching {title.toLowerCase()} link...
            </Typography>
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage ||
              `Failed to load ${title.toLowerCase()} registration link.`}
          </Alert>
        ) : hasLink ? (
          <LinkCard>
            <CardContent>
              {/* Link URL */}
              <TextField
                label={`${title} Registration Link`}
                value={linkData.url}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={() => copyToClipboard(linkData.url)}
                      sx={{ mr: -1 }}
                    >
                      Copy
                    </Button>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                  },
                }}
              />

              {/* Actions + QR Code */}
              <Box
                display="flex"
                flexDirection={isMobile ? "column-reverse" : "row"}
                justifyContent="space-between"
                alignItems={isMobile ? "flex-start" : "center"}
              >
                <Box maxWidth={240} mt={isMobile ? 2 : 0}>
                  <Button
                    startIcon={<QrCode />}
                    color="info"
                    fullWidth
                    variant="contained"
                    onClick={() => downloadQRCode(linkData.qrCode, type)}
                    disabled={!qrCodeUrl}
                  >
                    Download QR Code
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    color="error"
                    fullWidth
                    variant="contained"
                    onClick={onDelete}
                    sx={{ mt: 1 }}
                  >
                    Delete Link
                  </Button>
                </Box>

                {/* QR Preview */}
                {qrCodeUrl && (
                  <Box
                    component="img"
                    src={qrCodeUrl}
                    alt="QR Code"
                    width={100}
                    height={100}
                    sx={{
                      border: "1px solid #333",
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>

              {/* Expiry Info */}
              {linkData.expiresAt && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  mt={2}
                  display="block"
                >
                  Expires at: {new Date(linkData.expiresAt).toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </LinkCard>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={onGenerate}
            fullWidth
            startIcon={
              createTeacherLinkMutation.isPending ||
              createStudentLinkMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <ContentCopy />
              )
            }
            disabled={
              createTeacherLinkMutation.isPending ||
              createStudentLinkMutation.isPending
            }
          >
            {createTeacherLinkMutation.isPending ||
            createStudentLinkMutation.isPending
              ? "Generating..."
              : `Generate ${title} Link`}
          </Button>
        )}
      </GlassCard>
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Registration Links
        </Typography>

        <Grid container spacing={4}>
          {/* Teacher Section */}
          <Grid item xs={12} md={6}>
            {renderRegistrationSection(
              "Teacher",
              teacherLink,
              isTeacherLoading,
              isTeacherError,
              teacherError?.message,
              handleGenerateTeacherLink,
              handleDeleteTeacherLink,
              "TEACHER"
            )}
          </Grid>

          {/* Student Section */}
          <Grid item xs={12} md={6}>
            {renderRegistrationSection(
              "Student",
              studentLink,
              isStudentLoading,
              isStudentError,
              studentError?.message,
              handleGenerateStudentLink,
              handleDeleteStudentLink,
              "STUDENT"
            )}
          </Grid>
        </Grid>

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
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
