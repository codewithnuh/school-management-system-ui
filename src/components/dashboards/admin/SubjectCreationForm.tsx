/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/SubjectManagement.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  styled,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Import your Zod schema and types
import {
  SubjectCreationSchema,
  SubjectCreationInputs,
} from "../../../schema/subject.schema";

// Import your TanStack Query hooks
import {
  useCreateSubject,
  useSubjects as useGetSubjects,
  useDeleteSubjectById as useDeleteSubject,
} from "../../../services/queries/subject"; // Adjust path as needed

// Import your custom dark theme
import { darkTheme } from "../../../theme/darkTheme"; // Adjust path as needed, assuming theme.ts

// Reusable styled component for the form container
const FormContainerPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 15,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(30, 30, 30, 0.92)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(15px)",
  color: theme.palette.text.primary,
  maxWidth: 600, // Limit width for better appearance
  margin: "auto", // Center the container
  mt: 4, // Top margin
}));

// Alert component for Snackbar
const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SubjectManagement: React.FC = () => {
  // --- IMPORTANT: Replace with actual schoolId from context/props/URL ---
  // For now, hardcode a schoolId. In a real app, this would come from the logged-in user's context,
  // or a URL parameter, etc.
  const SCHOOL_ID = 8; // Example school ID
  // ---------------------------------------------------------------------

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectCreationInputs>({
    resolver: zodResolver(SubjectCreationSchema),
    defaultValues: {
      name: "",
      description: "",
      schoolId: SCHOOL_ID, // Set the default school ID
    },
  });

  const {
    data: subjects,
    isLoading: isLoadingSubjects,
    isError: isErrorSubjects,
    error: subjectsError,
  } = useGetSubjects(SCHOOL_ID); // Fetch subjects for the specific school
  console.log(subjects);
  const createSubjectMutation = useCreateSubject();
  const deleteSubjectMutation = useDeleteSubject();

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  const onSubmit = (data: SubjectCreationInputs) => {
    try {
      console.log(data);
      createSubjectMutation.mutate(data, {
        onSuccess: () => {
          showToast("Subject created successfully!", "success");
          reset(); // Clear the form after successful submission
        },
        onError: (err: any) => {
          console.error("Subject creation error:", err);
          showToast(
            `Failed to create subject: ${err.message || "Unknown error"}`,
            "error"
          );
        },
      });
    } catch (error) {
      console.error("Form submission failed:", error);
      showToast("An unexpected error occurred during submission.", "error");
    }
  };

  const handleDelete = async (id: number, schoolId: number) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }
    try {
      await deleteSubjectMutation.mutateAsync(
        { id, schoolId },
        {
          onSuccess: () => {
            showToast("Subject deleted successfully!", "success");
          },
          onError: (err: any) => {
            console.error("Subject deletion error:", err);
            showToast(
              `Failed to delete subject: ${err.message || "Unknown error"}`,
              "error"
            );
          },
        }
      );
    } catch (error) {
      console.error("Deletion failed:", error);
      showToast("An unexpected error occurred during deletion.", "error");
    }
  };

  return (
    // Wrap your component with ThemeProvider and CssBaseline
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Applies base CSS for the theme */}
      <FormContainerPaper>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4, textAlign: "center", color: "primary.main" }}
        >
          Manage Subjects
        </Typography>

        {/* Create Subject Form */}
        <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
          Create New Subject
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Subject Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description (Optional)"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            {/* School ID is hidden as it's typically derived from context */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
                disabled={isSubmitting || createSubjectMutation.isPending}
                startIcon={<AddIcon />}
              >
                {isSubmitting || createSubjectMutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Subject"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Display Existing Subjects */}
        {/* <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
            Existing Subjects
          </Typography>

          {isLoadingSubjects && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {isErrorSubjects && (
            <Typography color="error" sx={{ textAlign: "center" }}>
              Error loading subjects:{" "}
              {subjectsError?.message || "Unknown error"}
            </Typography>
          )}

          {!isLoadingSubjects &&
            !isErrorSubjects &&
            subjects &&
            subjects.length === 0 && (
              <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "text.secondary", mt: 3 }}
              >
                No subjects found for this school. Create one above!
              </Typography>
            )}

          {!isLoadingSubjects &&
            !isErrorSubjects &&
            subjects &&
            subjects.length > 0 && (
              <List
                component={Paper}
                sx={{
                  maxHeight: 400, // Limit height for scrollability
                  overflow: "auto",
                  backgroundColor: "rgba(255, 255, 255, 0.04)", // Slight background for the list
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {subjects.map((subject) => (
                  <ListItem
                    key={subject.id}
                    divider
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={subject.name}
                      secondary={subject.description || "No description"}
                      primaryTypographyProps={{
                        color: "text.primary",
                        variant: "body1",
                      }}
                      secondaryTypographyProps={{
                        color: "text.secondary",
                        variant: "body2",
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                          handleDelete(subject.id, subject.schoolId)
                        }
                        disabled={deleteSubjectMutation.isPending}
                        color="error" // Use the error color from your theme
                      >
                        {deleteSubjectMutation.isPending &&
                        deleteSubjectMutation.variables?.id === subject.id ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
        </Box> */}

        {/* Toast Snackbar */}
        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </FormContainerPaper>
    </ThemeProvider>
  );
};

export default SubjectManagement;
