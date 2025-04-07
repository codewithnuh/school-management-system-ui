import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade,
  Chip,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useClasses } from "../services/queries/classes";
import { useGenerateTimeTable } from "../services/queries/timeTable";
import Link from "@mui/material/Link";
// Define interfaces for type safety
interface Class {
  id: number;
  name: string;
}

const TimetableGenerator: React.FC = () => {
  const theme = useTheme();
  const [selectedClass, setSelectedClass] = useState<number | "">("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Query for classes
  const { data: classes = [], isLoading: classesLoading } = useClasses();

  // Query for timetable generation
  const timetableQuery = useGenerateTimeTable(
    selectedClass ? Number(selectedClass) : 0
  );
  // Handle class selection
  const handleClassChange = (event: SelectChangeEvent) => {
    const classId = event.target.value;
    setSelectedClass(classId === "" ? "" : Number(classId));
    setSuccessMessage(null); // Clear any previous success message
  };

  // Handle timetable generation
  const handleGenerateTimetableClick = () => {
    if (selectedClass) {
      setIsGenerating(true);
      timetableQuery
        .refetch()
        .then(() => {
          setSuccessMessage(
            `Timetable for the selected class has been generated successfully!`
          );
          setIsGenerating(false);
        })
        .catch(() => {
          setIsGenerating(false);
        });
    }
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Find the selected class object for display
  const selectedClassObj = classes.find((c) => c.id === selectedClass);

  // Check if data is available
  const hasData =
    timetableQuery.data && Object.keys(timetableQuery.data).length > 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundImage: `linear-gradient(to right, ${alpha(
            theme.palette.primary.light,
            0.1
          )}, ${alpha(theme.palette.primary.light, 0.05)})`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <CalendarTodayIcon
            sx={{
              fontSize: 40,
              mr: 2,
              color: theme.palette.primary.main,
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Timetable Generator
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Card variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="textSecondary">
              Generate Class Timetables
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Select a class from the dropdown and click the generate button to
              create a timetable for all sections of that class.
            </Typography>

            <Grid container spacing={3} alignItems="center" sx={{ mt: 1 }}>
              {/* Class Selection */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  disabled={classesLoading || isGenerating}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <InputLabel id="class-select-label">Class</InputLabel>
                  <Select
                    labelId="class-select-label"
                    id="class-select"
                    value={selectedClass.toString()}
                    label="Class"
                    onChange={handleClassChange}
                  >
                    <MenuItem value="">
                      <em>Select a class</em>
                    </MenuItem>
                    {classes.map((cls: Class) => (
                      <MenuItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleGenerateTimetableClick}
                  disabled={
                    !selectedClass || isGenerating || timetableQuery.isFetching
                  }
                  startIcon={
                    isGenerating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <RefreshIcon />
                    )
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: 2,
                    background: theme.palette.primary.main,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                    },
                  }}
                >
                  {isGenerating ? "Generating..." : "Generate Timetable"}
                </Button>
              </Grid>
              <Button>
                <Link>View Generated TimeTable</Link>
              </Button>
            </Grid>

            {hasData && (
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Chip
                  icon={<CheckCircleOutlineIcon />}
                  label="Timetable data available"
                  color="success"
                  variant="outlined"
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Loading Indicator */}
        {(classesLoading || timetableQuery.isFetching) && !isGenerating && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error Message */}
        {timetableQuery.isError && (
          <Fade in={true}>
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              Failed to generate timetable. Please try again.
              {timetableQuery.error instanceof Error && (
                <Typography variant="body2" mt={1}>
                  Error: {timetableQuery.error.message}
                </Typography>
              )}
            </Alert>
          </Fade>
        )}

        {/* Success Message */}
        {successMessage && (
          <Fade in={!!successMessage}>
            <Alert
              severity="success"
              sx={{
                mt: 2,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              {successMessage}
            </Alert>
          </Fade>
        )}

        {/* Data Summary */}
        {hasData && (
          <Card
            variant="outlined"
            sx={{
              mt: 3,
              borderRadius: 2,
              borderColor: theme.palette.success.main,
              bgcolor: alpha(theme.palette.success.light, 0.05),
            }}
          >
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Timetable Data Summary
              </Typography>
              <Typography variant="body2">
                Timetable has been successfully generated. The data includes
                schedule information for all sections in the selected class.
              </Typography>

              <Box mt={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Data Preview:
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: alpha(theme.palette.background.default, 0.7),
                    borderRadius: 1,
                    overflowX: "auto",
                    fontSize: "0.75rem",
                  }}
                >
                  {JSON.stringify(timetableQuery.data, null, 2).substring(
                    0,
                    200
                  )}
                  ...
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Selection Summary */}
        {selectedClassObj && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              bgcolor: alpha(theme.palette.info.light, 0.1),
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Selected: {selectedClassObj.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Click the Generate Timetable button to create schedules for all
              sections in this class.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TimetableGenerator;
