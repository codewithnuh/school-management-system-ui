import React, { useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tooltip,
  Divider,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import SubjectIcon from "@mui/icons-material/Subject";
import { useFetchTeacherTimeTable } from "../../services/queries/timeTable";
import { generatePDF } from "../../utils/pdfUtils";

// Days of the week
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Type definitions
interface TimetableEntry {
  id: number;
  timetableId: number;
  sectionId: number;
  classId: number;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: {
    id: number;
    name: string;
    description: string;
  };
  subjectId: number;
  teacherId: number;
  section: {
    id: number;
    name: string;
    classId: number;
    classTeacherId: number;
    subjectTeachers: Record<string, number>;
    class?: {
      id: number;
      name: string;
      maxStudents: number;
      description: string;
    };
  };
  class: {
    id: number;
    name: string;
    maxStudents: number;
    description: string;
    periodLength: number;
    periodsPerDay: number;
    workingDays: string[];
  };
}

interface TimeTableProps {
  teacherId: number;
  teacherName?: string;
}

const TeacherTimetable: React.FC<TimeTableProps> = ({
  teacherId,
  teacherName,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const {
    data: apiResponse,
    isLoading,
    error,
    isError,
  } = useFetchTeacherTimeTable(teacherId);

  // Process timetable data into a structured format by day and period
  const { structuredTimetable, allPeriods } = useMemo(() => {
    if (!apiResponse?.data) {
      return { structuredTimetable: {}, allPeriods: [] };
    }

    const timetable: Record<string, Record<number, TimetableEntry>> = {};
    const periodsSet = new Set<string>();

    // Initialize the timetable structure with empty slots
    weekdays.forEach((day) => {
      timetable[day] = {};
    });

    // Extract unique time periods and fill in the timetable
    apiResponse.data.forEach((entry) => {
      const timeSlot = `${entry.startTime} - ${entry.endTime}`;
      periodsSet.add(timeSlot);

      if (entry.dayOfWeek && timetable[entry.dayOfWeek]) {
        timetable[entry.dayOfWeek][entry.periodNumber] = entry;
      }
    });

    // Convert periods set to array and sort by start time
    const allPeriods = Array.from(periodsSet).sort((a, b) => {
      const timeA = a.split(" - ")[0];
      const timeB = b.split(" - ")[0];
      return timeA.localeCompare(timeB);
    });

    return { structuredTimetable: timetable, allPeriods };
  }, [apiResponse]);

  // Format time to 12-hour format with AM/PM
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hoursNum = parseInt(hours, 10);
    const period = hoursNum >= 12 ? "PM" : "AM";
    const hours12 = hoursNum % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  };

  // Handle PDF export
  const handleExportPDF = () => {
    if (!apiResponse?.data) return;

    const teacherNameDisplay = teacherName || `Teacher ID: ${teacherId}`;
    const title = `Timetable for ${teacherNameDisplay}`;

    // Define the document structure for the PDF
    const docDefinition = {
      content: [
        { text: title, style: "header" },
        { text: "Weekly Schedule", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: Array(allPeriods.length + 1).fill("*"),
            body: [
              [
                "Day/Time",
                ...allPeriods.map((period) => {
                  const [start, end] = period.split(" - ");
                  return `${formatTime(start)}-${formatTime(end)}`;
                }),
              ],
              ...weekdays.map((day) => [
                day,
                ...allPeriods.map((period) => {
                  // Find the entry that matches this day and time period
                  const entry = Object.values(
                    structuredTimetable[day] || {}
                  ).find((e) => `${e.startTime} - ${e.endTime}` === period);

                  if (!entry) return "";

                  return {
                    text: [
                      { text: `${entry.subject.name}\n`, bold: true },
                      { text: `Class: ${entry.class.name}\n` },
                      { text: `Section: ${entry.section.name}` },
                    ],
                  };
                }),
              ]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
      },
    };

    // Generate and download the PDF
    generatePDF(docDefinition, `teacher_timetable_${teacherId}.pdf`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading timetable:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </Alert>
    );
  }

  // Empty state
  if (!apiResponse?.data || apiResponse.data.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No timetable available for this teacher. The timetable may not have been
        generated yet.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 2, background: "black" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CalendarTodayIcon
            sx={{ mr: 1, color: theme.palette.primary.main }}
          />
          <Typography variant="h5" component="h2">
            {teacherName
              ? `${teacherName}'s Timetable`
              : `Teacher Timetable (ID: ${teacherId})`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExportPDF}
        >
          Export PDF
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflow: "auto",
          backgroundColor: isDarkMode
            ? theme.palette.background.paper
            : undefined,
          boxShadow: 3,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="teacher timetable">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDarkMode
                  ? theme.palette.background.default
                  : theme.palette.primary.light,
              }}
            >
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
                }}
              >
                Day/Time
              </TableCell>
              {allPeriods.map((period, index) => {
                const [start, end] = period.split(" - ");
                return (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: isDarkMode
                        ? theme.palette.primary.light
                        : theme.palette.primary.dark,
                    }}
                  >
                    {`Period ${index + 1}`}
                    <Typography variant="caption" display="block">
                      {`${formatTime(start)} - ${formatTime(end)}`}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {weekdays.map((day) => (
              <TableRow
                key={day}
                hover
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: isDarkMode
                      ? theme.palette.action.hover
                      : theme.palette.grey[50],
                  },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.text.primary,
                  }}
                >
                  {day}
                </TableCell>
                {allPeriods.map((period, periodIndex) => {
                  // Find the entry that matches this day and time period
                  const entry = Object.values(
                    structuredTimetable[day] || {}
                  ).find((e) => `${e.startTime} - ${e.endTime}` === period);

                  return (
                    <TableCell
                      key={periodIndex}
                      align="center"
                      sx={{
                        transition: "all 0.3s",
                        border: entry
                          ? `1px solid ${theme.palette.divider}`
                          : undefined,
                        padding: 1.5,
                      }}
                    >
                      {entry ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: 1,
                            borderRadius: 1,
                            backgroundColor: isDarkMode
                              ? theme.palette.primary.dark
                              : theme.palette.primary.light,
                            transition: "all 0.3s",
                            "&:hover": {
                              boxShadow: 2,
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          <Tooltip
                            title={
                              entry.subject.description || entry.subject.name
                            }
                            arrow
                          >
                            <Chip
                              icon={<SubjectIcon />}
                              label={entry.subject.name}
                              color="primary"
                              sx={{
                                mb: 1,
                                width: "100%",
                                fontWeight: "bold",
                              }}
                            />
                          </Tooltip>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" fontWeight="medium">
                              {`Class ${entry.class.name}`}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{
                              color: isDarkMode
                                ? theme.palette.grey[300]
                                : theme.palette.text.secondary,
                            }}
                          >
                            Section {entry.section.name}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontStyle: "italic",
                          }}
                        >
                          Free Period
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeacherTimetable;
