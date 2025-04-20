import React, { useMemo, useCallback } from "react";
import { parse, format } from "date-fns";

// MUI Imports
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
  styled,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  Download as DownloadIcon,
  CalendarToday as CalendarTodayIcon,
  School as SchoolIcon,
  Subject as SubjectIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

// Custom Hooks & Services
import { useFetchTimeTables } from "../../services/queries/timeTable";
import { useUser } from "../../hooks/useUser";

// Utilities
import { generatePDF } from "../../utils/pdfUtils";

// Constants & Types
const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;
type Weekday = (typeof WEEKDAYS)[number];

// Updated interface to match the API response structure
export interface Teacher {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  photo: string | null;
  email: string;
  phoneNo: string;
  highestQualification: string;
  specialization: string | null;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
}

export interface Class {
  id: number;
  name: string;
  periodsPerDay: number;
  workingDays: Weekday[];
}

export interface Section {
  id: number;
  name: string;
  classId: number;
}

export interface TimetableEntry {
  id: number;
  dayOfWeek: Weekday;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: Subject;
  class: { id: number; name: string };
  section: { id: number; name: string };
  teacher: Teacher;
}

interface TimetableData {
  id: number;
  classId: number;
  sectionId: number;
  teacherId: number;
  periodsPerDay: number;
  timetableEntries: TimetableEntry[];
  class: Class;
  section: Section;
  teacher: Teacher;
}

interface TimetableResponse {
  success: boolean;
  data: TimetableData;
  error: string | null;
  message: string;
  statusCode: number;
  timestamp: string;
}

// --- Styled Components ---
const TimetableWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
}));

const TimetableHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const TimetableInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[100],
}));

const CenteredContent = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 32,
  minHeight: "200px",
});

const TeacherBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

// --- Utility Functions ---
const formatTo12Hour = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(":");
    const date = parse(`${hours}:${minutes}`, "HH:mm", new Date());
    return format(date, "h:mm a");
  } catch (error) {
    console.error("Error formatting time:", timeString, error);
    return timeString;
  }
};

const getTeacherFullName = (teacher: Teacher): string => {
  return `${teacher.firstName} ${
    teacher.middleName ? teacher.middleName + " " : ""
  }${teacher.lastName}`;
};

// --- Main Component ---
const StudentTimetable: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // 1. Fetch User Data
  const {
    data: userDataResponse,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: userError,
  } = useUser();

  // Extract student info safely
  const studentInfo = userDataResponse?.data?.user;
  const classId = studentInfo?.classId;
  const sectionId = studentInfo?.sectionId;

  // 2. Fetch Timetable Data (only if user data is available)
  const {
    data: timetableResponse,
    isLoading: isLoadingTimetable,
    isError: isErrorTimetable,
    error: timetableError,
  } = useFetchTimeTables(classId!, sectionId!, {
    enabled: !!classId && !!sectionId,
  });

  // 3. Process Timetable Data
  const { timetableByDay, sortedTimeSlots, timetableData } = useMemo(() => {
    if (!timetableResponse?.success || !timetableResponse.data) {
      return {
        timetableByDay: {} as Record<Weekday, Record<number, TimetableEntry>>,
        sortedTimeSlots: [] as string[],
        timetableData: null as TimetableData | null,
      };
    }

    const timetableData = timetableResponse.data;
    const entries = timetableData.timetableEntries || [];

    // Initialize map structure: { Monday: {}, Tuesday: {}, ... }
    const timetableMap: Record<Weekday, Record<number, TimetableEntry>> = {};
    WEEKDAYS.forEach((day) => {
      timetableMap[day] = {};
    });

    const uniqueTimeSlots = new Set<string>();

    // Populate the map and collect unique time slots
    entries.forEach((entry: TimetableEntry) => {
      if (timetableMap[entry.dayOfWeek]) {
        timetableMap[entry.dayOfWeek][entry.periodNumber] = entry;
        uniqueTimeSlots.add(`${entry.startTime}-${entry.endTime}`);
      }
    });

    // Sort time slots chronologically based on start time
    const sortedSlots = Array.from(uniqueTimeSlots).sort((a, b) => {
      const startTimeA = a.split("-")[0];
      const startTimeB = b.split("-")[0];
      return startTimeA.localeCompare(startTimeB);
    });

    return {
      timetableByDay: timetableMap,
      sortedTimeSlots: sortedSlots,
      timetableData,
    };
  }, [timetableResponse]);

  // 4. PDF Export Handler
  const handleExportPDF = useCallback(() => {
    if (!timetableData || timetableData.timetableEntries.length === 0) return;

    // Generate title and filename
    const className = timetableData.class.name;
    const sectionName = timetableData.section.name;
    const title = `Timetable - ${className} / Section ${sectionName}`;
    const filename = `timetable_${className.replace(
      /\s+/g,
      "_"
    )}_${sectionName}.pdf`;

    // Prepare table body for PDF
    const pdfTableBody = [
      // Header Row
      [
        { text: "Day/Time", bold: true },
        ...sortedTimeSlots.map((slot) => {
          const [start, end] = slot.split("-");
          return {
            text: `${formatTo12Hour(start)} - ${formatTo12Hour(end)}`,
            bold: true,
          };
        }),
      ],
      // Data Rows
      ...WEEKDAYS.map((day) => [
        { text: day, bold: true }, // Day column
        ...sortedTimeSlots.map((slot) => {
          const entry = Object.values(timetableByDay[day] || {}).find(
            (e) => `${e.startTime}-${e.endTime}` === slot
          );

          if (!entry) return ""; // Empty cell for free periods

          const teacher = entry.teacher;
          const teacherName = getTeacherFullName(teacher);

          // Format cell content
          return {
            text: [
              { text: `${entry.subject.name}\n`, bold: true },
              { text: `Teacher: ${teacherName}\n` },
              { text: `Class: ${entry.class.name}\n` },
              { text: `Section: ${entry.section.name}` },
            ],
          };
        }),
      ]),
    ];

    // Define PDF document structure
    const docDefinition = {
      content: [
        { text: title, style: "header" },
        { text: "Weekly Schedule", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", ...Array(sortedTimeSlots.length).fill("*")],
            body: pdfTableBody,
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10] as [number, number, number, number],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5] as [number, number, number, number],
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    // Generate and download the PDF
    generatePDF(docDefinition, filename);
  }, [timetableData, sortedTimeSlots, timetableByDay]);

  // --- Render Logic ---
  // Handle Loading States
  if (isLoadingUser) {
    return (
      <CenteredContent>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading user data...</Typography>
      </CenteredContent>
    );
  }

  // Handle User Error State
  if (isErrorUser) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading user data:{" "}
        {userError instanceof Error ? userError.message : "Unknown error"}
      </Alert>
    );
  }

  // Handle Missing User Info
  if (!studentInfo || !classId || !sectionId) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Could not retrieve student class/section information. Cannot display
        timetable.
      </Alert>
    );
  }

  // Handle Timetable Loading State (after user data is loaded)
  if (isLoadingTimetable) {
    return (
      <CenteredContent>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading timetable...</Typography>
      </CenteredContent>
    );
  }

  // Handle Timetable Error State
  if (isErrorTimetable) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading timetable:{" "}
        {timetableError instanceof Error
          ? timetableError.message
          : "Unknown error"}
      </Alert>
    );
  }

  // Handle No Timetable Data Available
  if (
    !timetableData ||
    !timetableData.timetableEntries ||
    timetableData.timetableEntries.length === 0
  ) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No timetable data is currently available for your class and section.
      </Alert>
    );
  }

  // Render the Timetable
  return (
    <TimetableWrapper>
      <TimetableHeader>
        <Box display="flex" alignItems="center">
          <CalendarTodayIcon
            sx={{ mr: 1, color: theme.palette.primary.main }}
          />
          <Typography variant="h5" component="h2">
            My Timetable
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
      </TimetableHeader>

      <TimetableInfo>
        <InfoBox>
          <SchoolIcon fontSize="small" />
          <Typography variant="body1">
            <strong>Class:</strong> {timetableData.class.name}
          </Typography>
        </InfoBox>

        <InfoBox>
          <SubjectIcon fontSize="small" />
          <Typography variant="body1">
            <strong>Section:</strong> {timetableData.section.name}
          </Typography>
        </InfoBox>

        <InfoBox>
          <PersonIcon fontSize="small" />
          <Typography variant="body1">
            <strong>Class Teacher:</strong>{" "}
            {getTeacherFullName(timetableData.teacher)}
          </Typography>
        </InfoBox>

        <InfoBox>
          <ScheduleIcon fontSize="small" />
          <Typography variant="body1">
            <strong>Periods per day:</strong> {timetableData.periodsPerDay}
          </Typography>
        </InfoBox>
      </TimetableInfo>

      <Divider sx={{ mb: 3 }} />

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          backgroundColor: isDarkMode
            ? theme.palette.background.paper
            : undefined,
          overflow: "auto",
        }}
      >
        <Table sx={{ minWidth: 800 }} aria-label="student timetable">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDarkMode
                  ? theme.palette.grey[800]
                  : theme.palette.primary.light,
              }}
            >
              {/* Day/Time Header Cell */}
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode
                    ? theme.palette.common.white
                    : theme.palette.primary.contrastText,
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  backgroundColor: isDarkMode
                    ? theme.palette.grey[800]
                    : theme.palette.primary.light,
                }}
              >
                Day / Time
              </TableCell>

              {/* Period Header Cells */}
              {sortedTimeSlots.map((slot, index) => {
                const [start, end] = slot.split("-");
                return (
                  <TableCell
                    key={`header-period-${index}`}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: isDarkMode
                        ? theme.palette.common.white
                        : theme.palette.primary.contrastText,
                      minWidth: 180,
                    }}
                  >
                    {`Period ${index + 1}`}
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{
                        color: isDarkMode
                          ? theme.palette.grey[300]
                          : theme.palette.primary.contrastText,
                      }}
                    >
                      {`${formatTo12Hour(start)} - ${formatTo12Hour(end)}`}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {WEEKDAYS.map((day) => (
              <TableRow
                key={day}
                hover
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {/* Day Cell (Sticky) */}
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: "bold",
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor:
                      (theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : theme.palette.common.white) + "!important",
                    "&:nth-of-type(odd)": {
                      backgroundColor:
                        theme.palette.action.hover + "!important",
                    },
                  }}
                >
                  {day}
                </TableCell>

                {/* Period Data Cells */}
                {sortedTimeSlots.map((slot, index) => {
                  const entry = Object.values(timetableByDay[day] || {}).find(
                    (e) => `${e.startTime}-${e.endTime}` === slot
                  );

                  return (
                    <TableCell
                      key={`${day}-period-${index}`}
                      align="center"
                      sx={{ padding: 1.5 }}
                    >
                      {entry ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Tooltip
                            title={entry.subject.description || ""}
                            arrow
                            placement="top"
                          >
                            <Chip
                              icon={<SubjectIcon fontSize="small" />}
                              label={entry.subject.name}
                              color="primary"
                              size="small"
                              sx={{ fontWeight: "medium" }}
                            />
                          </Tooltip>

                          <TeacherBox>
                            {entry.teacher.photo ? (
                              <Avatar
                                src={entry.teacher.photo}
                                alt={getTeacherFullName(entry.teacher)}
                                sx={{ width: 24, height: 24 }}
                              />
                            ) : (
                              <PersonIcon fontSize="small" color="action" />
                            )}
                            <Tooltip
                              title={`${getTeacherFullName(entry.teacher)} (${
                                entry.teacher.highestQualification
                              }${
                                entry.teacher.specialization
                                  ? ` in ${entry.teacher.specialization}`
                                  : ""
                              })`}
                              arrow
                              placement="top"
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "0.8rem" }}
                              >
                                {getTeacherFullName(entry.teacher)}
                              </Typography>
                            </Tooltip>
                          </TeacherBox>
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.disabled", fontStyle: "italic" }}
                        >
                          - Free -
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
    </TimetableWrapper>
  );
};

export default StudentTimetable;
