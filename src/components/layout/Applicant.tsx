import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import DetailsDialog from "../common/DetailsDialog";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Application } from "../../types";
import {
  useAcceptTeacherApplication,
  useRejectTeacherApplication,
} from "../../services/queries/application";
import TablePagination from "@mui/material/TablePagination";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Chip, Grid } from "@mui/material";

interface ApplicantListProps {
  applicants: Application[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

// Updated File viewer component that handles any URL-based file
const FileViewer = ({
  fileUrl,
  open,
  onClose,
  title,
}: {
  fileUrl: string | null;
  open: boolean;
  onClose: () => void;
  title: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (open && fileUrl) {
      setLoading(true);
      setError(null);

      // Try to determine if the URL is an image
      const checkIfImage = (url: string) => {
        // First check by extension
        const extension = url.split(".").pop()?.toLowerCase();
        if (
          ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || "")
        ) {
          setIsImage(true);
          return;
        }

        // If no extension or not recognized, we'll try to load as an image
        const img = new Image();
        img.onload = () => {
          setIsImage(true);
        };
        img.onerror = () => {
          setIsImage(false);
        };
        img.src = url;
      };

      checkIfImage(fileUrl);
    }
  }, [open, fileUrl]);

  if (!fileUrl) return null;

  const handleLoadComplete = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(
      "Failed to load the document. Please try downloading it or opening in a new tab."
    );
  };

  // Encode URL to handle special characters
  const encodedUrl = encodeURI(fileUrl);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="file-viewer-dialog"
    >
      <DialogTitle id="file-viewer-dialog">
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
              flexDirection: "column",
              py: 2,
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Loading document...</Typography>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
            }}
          >
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                component="a"
                href={fileUrl}
                target="_blank"
                startIcon={<OpenInNewIcon />}
              >
                Open in New Tab
              </Button>
              <Button
                variant="outlined"
                component="a"
                href={fileUrl}
                download
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
            </Box>
          </Box>
        )}

        {isImage ? (
          // For images
          <Box
            sx={{
              justifyContent: "center",
              display: loading || error ? "none" : "flex",
            }}
          >
            <img
              src={encodedUrl}
              alt={title}
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
              onLoad={handleLoadComplete}
              onError={handleError}
            />
          </Box>
        ) : (
          // For PDFs and other documents
          <Box
            sx={{
              height: "70vh",
              width: "100%",
              display: loading || error ? "none" : "block",
            }}
          >
            {/* Multiple approaches to display PDFs */}

            {/* Approach 1: Google Docs Viewer */}
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                fileUrl
              )}&embedded=true`}
              width="100%"
              height="100%"
              title="PDF Document"
              onLoad={handleLoadComplete}
              onError={() => {
                // If Google Docs viewer fails, we'll try direct embedding
                console.log(
                  "Google Docs viewer failed, trying direct embedding"
                );
              }}
              style={{ border: "none" }}
            />

            {/* Approach 2: Direct embedding with toolbar */}
            <iframe
              src={`${encodedUrl}#toolbar=1&navpanes=1&view=FitH`}
              width="100%"
              height="100%"
              title="PDF Document - Direct"
              onLoad={handleLoadComplete}
              onError={handleError}
              style={{ display: "none", border: "none" }}
            />

            {/* Approach 3: Fallback using object tag */}
            <object
              data={encodedUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{ display: "none" }}
            >
              <Typography align="center">
                Your browser doesn't support embedded PDFs.
                <Button
                  component="a"
                  href={fileUrl}
                  target="_blank"
                  sx={{ ml: 1 }}
                >
                  Click here to view the PDF
                </Button>
              </Typography>
            </object>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          component="a"
          href={fileUrl}
          download
          startIcon={<DownloadIcon />}
        >
          Download
        </Button>
        <Button
          component="a"
          href={fileUrl}
          target="_blank"
          color="primary"
          startIcon={<OpenInNewIcon />}
        >
          Open in New Tab
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ApplicantList: React.FC<ApplicantListProps> = ({
  applicants,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  // Ensure pagination values are valid to prevent NaN issues
  const validTotal = Number.isFinite(total) && total >= 0 ? total : 0;
  const validPage = Number.isFinite(page) && page >= 0 ? page : 0;
  const validLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  const unRegisteredTeachers = applicants.filter(
    (applicant) => applicant.applicationStatus !== "Accepted"
  );
 

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // File viewer state
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<{
    url: string | null;
    title: string;
  }>({ url: null, title: "" });

  const { mutate: acceptTeacher, isPending: isAcceptLoading } =
    useAcceptTeacherApplication();
  const { mutate: rejectTeacher, isPending: isRejectLoading } =
    useRejectTeacherApplication();

  const handleOpenDetails = (applicant: Application) => {
    setSelectedApplicant(applicant);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedApplicant(null);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAccept = (id: number) => {
    acceptTeacher(id, {
      onSuccess: () => {
        showSnackbar("Application accepted successfully!", "success");
      },
      onError: (err) => {
        console.log(err);
        showSnackbar(
          `Error accepting application: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
          "error"
        );
      },
    });
  };

  const handleReject = (id: number) => {
    rejectTeacher(id, {
      onSuccess: () => {
        showSnackbar("Application rejected successfully!", "success");
      },
      onError: (err) => {
        showSnackbar(
          `Error rejecting application: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
          "error"
        );
      },
    });
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (newPage >= 0) {
      onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    if (newLimit > 0) {
      onLimitChange(newLimit);
      onPageChange(0); // Reset to first page when changing rows per page
    }
  };

  // Function to open the file viewer - now without needing to specify type
  const openFileViewer = (url: string | null, title: string) => {
    if (!url) {
      showSnackbar("No file available to view", "error");
      return;
    }
    setCurrentFile({ url, title });
    setFileViewerOpen(true);
  };

  // Function to get status chip color
  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "default";
      case "Accepted":
        return "success";
      case "Rejected":
        return "error";
      case "Interview":
        return "info";
      default:
        return "default";
    }
  };

  // Direct document open in new tab
  const openDocumentInNewTab = (url: string | null) => {
    if (!url) {
      showSnackbar("No file available to view", "error");
      return;
    }
    window.open(url, "_blank");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-label="applicants table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Photo</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>CV</TableCell>
                <TableCell>Verification</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unRegisteredTeachers.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {`${applicant.firstName} ${applicant.lastName}`}
                  </TableCell>
                  <TableCell>
                    {applicant.photo ? (
                      <Avatar
                        src={applicant.photo}
                        alt={`${applicant.firstName} ${applicant.lastName}`}
                        sx={{ cursor: "pointer", width: 40, height: 40 }}
                        onClick={() =>
                          openFileViewer(
                            applicant.photo,
                            `${applicant.firstName} ${applicant.lastName} - Photo`
                          )
                        }
                      />
                    ) : (
                      <Avatar sx={{ width: 40, height: 40 }}>
                        {applicant.firstName.charAt(0)}
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>{applicant.phoneNo}</TableCell>
                  <TableCell>
                    <Chip
                      label={applicant.applicationStatus}
                      color={
                        getStatusChipColor(applicant.applicationStatus) as any
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {applicant.cvPath ? (
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            openFileViewer(
                              applicant.cvPath,
                              `${applicant.firstName} ${applicant.lastName} - CV`
                            )
                          }
                          size="small"
                          title="View in app"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => openDocumentInNewTab(applicant.cvPath)}
                          size="small"
                          title="Open in new tab"
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {applicant.verificationDocument ? (
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            openFileViewer(
                              applicant.verificationDocument,
                              `${applicant.firstName} ${applicant.lastName} - Verification Document`
                            )
                          }
                          size="small"
                          title="View in app"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            openDocumentInNewTab(applicant.verificationDocument)
                          }
                          size="small"
                          title="Open in new tab"
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleOpenDetails(applicant)}
                      variant="outlined"
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleAccept(applicant.id)}
                          disabled={isAcceptLoading}
                        >
                          Accept
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => handleReject(applicant.id)}
                          disabled={isRejectLoading}
                        >
                          Reject
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
              {unRegisteredTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No applicants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={validTotal}
          rowsPerPage={validLimit}
          page={validPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </Paper>

      {/* Details Dialog */}
      <DetailsDialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        applicant={selectedApplicant}
        onViewFile={(url, _type, title) => openFileViewer(url, title)}
      />

      {/* File Viewer */}
      <FileViewer
        fileUrl={currentFile.url}
        fileType={currentFile.type}
        open={fileViewerOpen}
        onClose={() => setFileViewerOpen(false)}
        title={currentFile.title}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApplicantList;
