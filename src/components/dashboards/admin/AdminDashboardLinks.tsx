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
} from "@mui/material";

import { QrCode, Delete } from "@mui/icons-material";
import { saveAs } from "file-saver";

// Import your dark theme
import { darkTheme } from "../../../theme/darkTheme";
import { ThemeProvider } from "@mui/material/styles";

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

// Mock school ID — replace with dynamic value from context or API
const SCHOOL_ID = 1;
const ADMIN_ID = 1;

const RegistrationLinksPage = () => {
  const [teacherLink, setTeacherLink] = useState<string>("");
  const [studentLink, setStudentLink] = useState<string>("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => setToast({ ...toast, open: false });

  // --- Generate mock link ---
  const generateMockLink = (type: "TEACHER" | "STUDENT") => {
    const baseUrl = "https://yourapp.com/register";
    const mockLinkId = Math.random().toString(36).substring(2, 10);
    const link = `${baseUrl}/${type.toLowerCase()}/${mockLinkId}`;
    return link;
  };

  // --- Handle Generate Click ---
  const handleGenerateLink = (type: "TEACHER" | "STUDENT") => {
    const generatedLink = generateMockLink(type);

    if (type === "TEACHER") {
      setTeacherLink(generatedLink);
    } else {
      setStudentLink(generatedLink);
    }

    setToast({
      open: true,
      message: `${type} link generated successfully.`,
      severity: "success",
    });
  };

  // --- Copy to Clipboard ---
  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    setToast({
      open: true,
      message: "Link copied to clipboard!",
      severity: "success",
    });
  };

  // --- Generate QR Code URL ---
  const getQRCodeUrl = (link: string) =>
    `https://quickchart.io/qr?text=${encodeURIComponent(link)}&size=200`;

  // --- Download QR Code ---
  const downloadQRCode = async (link: string, type: "TEACHER" | "STUDENT") => {
    const qrCodeUrl = getQRCodeUrl(link);
    const response = await fetch(qrCodeUrl);
    const blob = await response.blob();
    saveAs(blob, `registration-qr-${type.toLowerCase()}.png`);
  };

  // --- Delete Link ---
  const handleDeleteLink = (type: "TEACHER" | "STUDENT") => {
    if (type === "TEACHER") {
      setTeacherLink(""); // Clear teacher link
    } else {
      setStudentLink(""); // Clear student link
    }

    setToast({
      open: true,
      message: `${type} link deleted successfully.`,
      severity: "info",
    });
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
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Teacher Registration
              </Typography>

              {!teacherLink ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleGenerateLink("TEACHER")}
                  fullWidth
                >
                  Generate Teacher Link
                </Button>
              ) : (
                <LinkCard>
                  <CardContent>
                    <TextField
                      label="Teacher Registration Link"
                      value={teacherLink}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            onClick={() => copyToClipboard(teacherLink)}
                            sx={{ ml: 1 }}
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

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box maxWidth={240} mr={2}>
                        <Button
                          startIcon={<QrCode />}
                          color="info"
                          fullWidth
                          sx={{ mb: 1 }}
                          variant="contained"
                          onClick={() => downloadQRCode(teacherLink, "TEACHER")}
                        >
                          Download QR Code
                        </Button>
                        <Button
                          startIcon={<Delete />}
                          color="error"
                          fullWidth
                          variant="contained"
                          onClick={() => handleDeleteLink("TEACHER")}
                        >
                          Delete Link
                        </Button>
                      </Box>
                      <Box
                        component="img"
                        src={getQRCodeUrl(teacherLink)}
                        alt="QR Code"
                        width={100}
                      />
                    </Box>
                  </CardContent>
                </LinkCard>
              )}
            </GlassCard>
          </Grid>

          {/* Student Section */}
          <Grid item xs={12} md={6}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Student Registration
              </Typography>

              {!studentLink ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleGenerateLink("STUDENT")}
                  fullWidth
                >
                  Generate Student Link
                </Button>
              ) : (
                <LinkCard>
                  <CardContent>
                    <TextField
                      label="Student Registration Link"
                      value={studentLink}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            onClick={() => copyToClipboard(teacherLink)}
                            sx={{ ml: 1 }}
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

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box maxWidth={240} mr={2}>
                        <Button
                          startIcon={<QrCode />}
                          color="info"
                          fullWidth
                          sx={{ mb: 1 }}
                          variant="contained"
                          onClick={() => downloadQRCode(teacherLink, "TEACHER")}
                        >
                          Download QR Code
                        </Button>
                        <Button
                          startIcon={<Delete />}
                          color="error"
                          fullWidth
                          variant="contained"
                          onClick={() => handleDeleteLink("TEACHER")}
                        >
                          Delete Link
                        </Button>
                      </Box>
                      <Box
                        component="img"
                        src={getQRCodeUrl(teacherLink)}
                        alt="QR Code"
                        width={100}
                      />
                    </Box>
                  </CardContent>
                </LinkCard>
              )}
            </GlassCard>
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
};

export default RegistrationLinksPage;
