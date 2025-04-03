import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateClassSchema } from "../../schema";
import { z } from "zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Slider,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
  Alert,
  Backdrop,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useSubjects } from "../../services/queries/subject";

// Mock data for teachers - replace with actual API calls
const MOCK_TEACHERS = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Robert Johnson" },
  { id: 4, name: "Emily Davis" },
  { id: 5, name: "Michael Wilson" },
];

// Type for our form
type CreateClassFormValues = z.infer<typeof CreateClassSchema>;

// Toast notification type
type ToastState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const CreateClassForm: React.FC = () => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch subjects from API
  const {
    data: subjects,
    isLoading: isLoadingSubjects,
    isError: isSubjectsError,
    error: subjectsError,
  } = useSubjects();
  console.log({ subjectsError });

  // Toast notification state
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
  });

  // Initialize form with default values
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateClassFormValues>({
    resolver: zodResolver(CreateClassSchema),
    defaultValues: {
      name: "",
      description: "",
      maxStudents: 30,
      periodsPerDay: 6,
      periodLength: 45,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      subjectIds: [],
      sections: [],
    },
  });

  // Field array for sections
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  // Add a default section if none exists
  useEffect(() => {
    if (sectionFields.length === 0) {
      appendSection({
        name: "A",
        maxStudents: 30,
        classTeacherId: 0,
        subjectTeachers: {},
      });
    }
  }, [appendSection, sectionFields.length]);

  // Watch for selected subjects to use in sections
  const selectedSubjectIds = watch("subjectIds");
  const selectedSubjects =
    subjects?.filter((subject) => selectedSubjectIds.includes(subject.id)) ||
    [];

  // Show toast notification
  const showToast = (message: string, severity: ToastState["severity"]) => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  // Close toast notification
  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Handle form submission
  const onSubmit = async (data: CreateClassFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Form data submitted:", data);

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the data to your API
      // await createClass(data);

      showToast("Class created successfully!", "success");

      // Optionally reset the form after successful submission
      // reset();
    } catch (error) {
      console.error("Error creating class:", error);
      showToast(
        `Failed to create class: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a new empty section
  const handleAddSection = () => {
    appendSection({
      name: String.fromCharCode(65 + sectionFields.length), // A, B, C, etc.
      maxStudents: 30,
      classTeacherId: 0,
      subjectTeachers: {},
    });
  };

  // Show error if subjects failed to load
  if (isSubjectsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load subjects:{" "}
          {subjectsError instanceof Error
            ? subjectsError.message
            : "Unknown error"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        p: 3,
      }}
    >
      {/* Backdrop loading overlay */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
          gap: 2,
        }}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6">Creating class...</Typography>
      </Backdrop>

      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
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

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[8],
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <SchoolIcon color="primary" fontSize="large" />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Create New Class
          </Typography>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom color="primary">
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Class Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="e.g., Grade 10"
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="maxStudents"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Maximum Students"
                  variant="outlined"
                  fullWidth
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  error={!!errors.maxStudents}
                  helperText={errors.maxStudents?.message}
                  disabled={isSubmitting}
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
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Brief description about this class"
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>

          {/* Schedule Settings */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" gutterBottom color="primary">
              Schedule Settings
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="periodsPerDay"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography gutterBottom>
                    Periods Per Day: {field.value}
                  </Typography>
                  <Slider
                    {...field}
                    min={1}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => field.onChange(value)}
                    disabled={isSubmitting}
                  />
                  {errors.periodsPerDay && (
                    <FormHelperText error>
                      {errors.periodsPerDay.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="periodLength"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography gutterBottom>
                    Period Length (minutes): {field.value}
                  </Typography>
                  <Slider
                    {...field}
                    min={30}
                    max={60}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => field.onChange(value)}
                    disabled={isSubmitting}
                  />
                  {errors.periodLength && (
                    <FormHelperText error>
                      {errors.periodLength.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="workingDays"
              control={control}
              render={({ field }) => (
                <FormControl
                  component="fieldset"
                  error={!!errors.workingDays}
                  fullWidth
                >
                  <Typography gutterBottom>Working Days</Typography>
                  <FormGroup row>
                    {DAYS_OF_WEEK.map((day) => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Checkbox
                            checked={field.value.includes(day)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, day]);
                              } else {
                                field.onChange(
                                  field.value.filter((d) => d !== day)
                                );
                              }
                            }}
                            disabled={isSubmitting}
                          />
                        }
                        label={day}
                      />
                    ))}
                  </FormGroup>
                  {errors.workingDays && (
                    <FormHelperText error>
                      {errors.workingDays.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Subjects */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" gutterBottom color="primary">
              Subjects
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="subjectIds"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.subjectIds}
                  variant="outlined"
                  disabled={isSubmitting || isLoadingSubjects}
                >
                  <InputLabel id="subjects-label">Subjects</InputLabel>
                  {isLoadingSubjects ? (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <CircularProgress size={24} sx={{ mr: 2 }} />
                      <Typography>Loading subjects...</Typography>
                    </Box>
                  ) : (
                    <Select
                      {...field}
                      labelId="subjects-label"
                      multiple
                      input={<OutlinedInput label="Subjects" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const subject = subjects?.find(
                              (s) => s.id === value
                            );
                            return (
                              <Chip
                                key={value}
                                label={subject?.name || value}
                                color="primary"
                                variant="outlined"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {subjects?.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  {errors.subjectIds && (
                    <FormHelperText>{errors.subjectIds.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Sections */}
          <Grid item xs={12} mt={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" color="primary">
                Sections
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddSection}
                disabled={isSubmitting}
              >
                Add Section
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            {sectionFields.length === 0 ? (
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                No sections added yet. Click "Add Section" to create a section.
              </Typography>
            ) : (
              sectionFields.map((section, index) => (
                <Card
                  key={section.id}
                  variant="outlined"
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6">
                        Section {section.name}
                      </Typography>
                      {index > 0 && (
                        <IconButton
                          color="error"
                          onClick={() => removeSection(index)}
                          disabled={isSubmitting}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name={`sections.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Section Name"
                              variant="outlined"
                              fullWidth
                              inputProps={{ maxLength: 1 }}
                              error={!!errors.sections?.[index]?.name}
                              helperText={
                                errors.sections?.[index]?.name?.message
                              }
                              disabled={isSubmitting}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Controller
                          name={`sections.${index}.maxStudents`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Max Students"
                              variant="outlined"
                              fullWidth
                              type="number"
                              InputProps={{
                                inputProps: { min: 1 },
                              }}
                              error={!!errors.sections?.[index]?.maxStudents}
                              helperText={
                                errors.sections?.[index]?.maxStudents?.message
                              }
                              disabled={isSubmitting}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Controller
                          name={`sections.${index}.classTeacherId`}
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              error={!!errors.sections?.[index]?.classTeacherId}
                              disabled={isSubmitting}
                            >
                              <InputLabel id={`class-teacher-label-${index}`}>
                                Class Teacher
                              </InputLabel>
                              <Select
                                {...field}
                                labelId={`class-teacher-label-${index}`}
                                label="Class Teacher"
                              >
                                {MOCK_TEACHERS.map((teacher) => (
                                  <MenuItem key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.sections?.[index]?.classTeacherId && (
                                <FormHelperText>
                                  {
                                    errors.sections?.[index]?.classTeacherId
                                      ?.message
                                  }
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Subject Teachers
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {isLoadingSubjects ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              my: 2,
                            }}
                          >
                            <CircularProgress size={24} sx={{ mr: 2 }} />
                            <Typography>Loading subjects...</Typography>
                          </Box>
                        ) : selectedSubjectIds.length > 0 ? (
                          <Grid container spacing={2}>
                            {selectedSubjects.map((subject) => (
                              <Grid item xs={12} md={6} key={subject.id}>
                                <Controller
                                  name={`sections.${index}.subjectTeachers.${subject.id}`}
                                  control={control}
                                  defaultValue={0}
                                  render={({ field }) => (
                                    <FormControl
                                      fullWidth
                                      disabled={isSubmitting}
                                    >
                                      <InputLabel
                                        id={`subject-teacher-label-${index}-${subject.id}`}
                                      >
                                        {subject.name} Teacher
                                      </InputLabel>
                                      <Select
                                        {...field}
                                        labelId={`subject-teacher-label-${index}-${subject.id}`}
                                        label={`${subject.name} Teacher`}
                                      >
                                        {MOCK_TEACHERS.map((teacher) => (
                                          <MenuItem
                                            key={teacher.id}
                                            value={teacher.id}
                                          >
                                            {teacher.name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  )}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Typography color="text.secondary">
                            Please select subjects first
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={isSubmitting || isLoadingSubjects}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              boxShadow: theme.shadows[4],
              "&:hover": {
                boxShadow: theme.shadows[8],
              },
            }}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Creating..." : "Create Class"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateClassForm;
