import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateClassSchema } from "../../schema/index";
import { z } from "zod";

// Material UI imports
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
  Alert,
  Backdrop,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../../theme/darkTheme"; // Import your existing dark theme

// Query hooks
import { useSubjects } from "../../services/queries/subject";
import { useTeachers } from "../../services/queries/classTeachers";
import { useCreateClass } from "../../services/queries/classes";

// Types
type CreateClassFormValues = z.infer<typeof CreateClassSchema>;
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

  // Toast notification state
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch data
  const createClassMutation = useCreateClass();
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const { data: teachersData, isLoading: isLoadingTeachers } = useTeachers();

  const subjects = subjectsData || [];

  const teachers = teachersData?.rows || [];

  // Initialize react-hook-form
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
      schoolId: 8,
      sections: [],
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  // Auto-append default section if none exists
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

  // Watch values
  const selectedSubjectIds = watch("subjectIds");

  // Show toast
  const showToast = (
    message: string,
    severity: ToastState["severity"] = "success"
  ) => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Handle form submission
  const onSubmit = async (formData: CreateClassFormValues) => {
    console.log("Form submitted:", formData);
    setIsSubmitting(true);

    try {
      // Validate teacher-subject assignments
      let hasInvalidAssignments = false;

      formData.sections.forEach((section) => {
        Object.entries(section.subjectTeachers).forEach(
          ([subjectId, teacherId]) => {
            if (teacherId !== 0) {
              const numericSubjectId = parseInt(subjectId, 10);
              const teacherIsQualified = teachers.find(
                (t) => t.id === teacherId && t.subjectId === numericSubjectId
              );

              if (!teacherIsQualified) {
                hasInvalidAssignments = true;
                showToast(
                  `Section ${section.name}: Teacher not qualified for subject ID ${numericSubjectId}`,
                  "error"
                );
              }
            }
          }
        );
      });

      if (hasInvalidAssignments) {
        setIsSubmitting(false);
        return;
      }

      // Send to backend via mutation
      await createClassMutation.mutateAsync(formData);

      showToast("Class created successfully!", "success");
      reset(); // Reset form after success
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

  // Filter teachers by subject qualification
  const getQualifiedTeachers = (subjectId: number) =>
    teachers.filter((teacher) => teacher.subjectId === subjectId);

  // Add new section
  const handleAddSection = () => {
    const newSectionName = String.fromCharCode(65 + sectionFields.length);
    appendSection({
      name: newSectionName,
      maxStudents: 30,
      classTeacherId: 0,
      subjectTeachers: {},
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
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
        {/* Backdrop loader */}
        <Backdrop
          open={isSubmitting}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            flexDirection: "column",
            gap: 2,
            color: "#fff",
          }}
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

        {/* Main Card */}
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

          {/* Basic Info */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Class Name"
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
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { min: 1 } }}
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
                    multiline
                    rows={3}
                    fullWidth
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
                      onChange={(e, value) => field.onChange(value)}
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
                      onChange={(e, value) => field.onChange(value)}
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
                  <FormControl component="fieldset" fullWidth>
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
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
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {(selected as number[]).map((value) => {
                              const subject = subjects.find(
                                (s) => s.id === value
                              );
                              return (
                                <Chip
                                  key={value}
                                  label={subject?.name || `Subject ${value}`}
                                  color="primary"
                                  variant="outlined"
                                />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {subjects.map((subject) => (
                          <MenuItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    {errors.subjectIds && (
                      <FormHelperText>
                        {errors.subjectIds.message}
                      </FormHelperText>
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
                  No sections added yet. Click "Add Section" to begin.
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
                                type="number"
                                fullWidth
                                InputProps={{ inputProps: { min: 1 } }}
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
                                error={
                                  !!errors.sections?.[index]?.classTeacherId
                                }
                                disabled={isSubmitting || isLoadingTeachers}
                              >
                                <InputLabel id={`class-teacher-label-${index}`}>
                                  Class Teacher
                                </InputLabel>
                                {isLoadingTeachers ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mt: 2,
                                    }}
                                  >
                                    <CircularProgress
                                      size={24}
                                      sx={{ mr: 2 }}
                                    />
                                    <Typography>Loading teachers...</Typography>
                                  </Box>
                                ) : (
                                  <Select
                                    {...field}
                                    labelId={`class-teacher-label-${index}`}
                                    label="Class Teacher"
                                    value={field.value || 0}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  >
                                    <MenuItem value={0}>
                                      <em>Select a teacher</em>
                                    </MenuItem>
                                    {teachers.length > 0 ? (
                                      teachers.map((teacher) => (
                                        <MenuItem
                                          key={teacher.id}
                                          value={teacher.id}
                                        >
                                          {teacher.firstName} {teacher.lastName}
                                        </MenuItem>
                                      ))
                                    ) : (
                                      <MenuItem disabled>
                                        No teachers available
                                      </MenuItem>
                                    )}
                                  </Select>
                                )}
                                {errors.sections?.[index]?.classTeacherId && (
                                  <FormHelperText>
                                    {
                                      errors.sections[index].classTeacherId
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
                              {subjects
                                .filter((s) =>
                                  selectedSubjectIds.includes(s.id)
                                )
                                .map((subject) => (
                                  <Grid item xs={12} md={6} key={subject.id}>
                                    <Controller
                                      name={`sections.${index}.subjectTeachers.${subject.id}`}
                                      control={control}
                                      defaultValue={0}
                                      render={({ field }) => (
                                        <FormControl fullWidth>
                                          <InputLabel
                                            id={`subject-teacher-label-${index}-${subject.id}`}
                                          >
                                            {subject.name} Teacher
                                          </InputLabel>
                                          <Select
                                            {...field}
                                            labelId={`subject-teacher-label-${index}-${subject.id}`}
                                            label={`${subject.name} Teacher`}
                                            value={field.value || 0}
                                            onChange={(e) =>
                                              field.onChange(
                                                Number(e.target.value)
                                              )
                                            }
                                            disabled={isSubmitting}
                                          >
                                            <MenuItem value={0}>
                                              <em>Select a teacher</em>
                                            </MenuItem>
                                            {getQualifiedTeachers(subject.id)
                                              .length > 0 ? (
                                              getQualifiedTeachers(
                                                subject.id
                                              ).map((teacher) => (
                                                <MenuItem
                                                  key={teacher.id}
                                                  value={teacher.id}
                                                >
                                                  {teacher.firstName}{" "}
                                                  {teacher.lastName}
                                                </MenuItem>
                                              ))
                                            ) : (
                                              <MenuItem disabled>
                                                No qualified teachers found
                                              </MenuItem>
                                            )}
                                          </Select>
                                          <FormHelperText>
                                            Only teachers qualified to teach
                                            this subject are shown
                                          </FormHelperText>
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

          {/* Submit Button */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isLoadingSubjects || isLoadingTeachers}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                "&:hover": {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              {isSubmitting ? "Creating..." : "Create Class"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default CreateClassForm;
