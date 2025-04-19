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
} from "@mui/material";
import {
  Download as DownloadIcon,
  CalendarToday as CalendarTodayIcon,
  School as SchoolIcon,
  Subject as SubjectIcon,
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

// Interface for a single timetable entry from the API
export interface TimetableEntry {
  id: number;
  dayOfWeek: Weekday;
  periodNumber: number;
  startTime: string; // e.g., "08:00"
  endTime: string; // e.g., "08:45"
  subject: { id: number; name: string; description?: string };
  class: { id: number; name: string };
  section: { id: number; name: string };
  // Add teacher info if available and needed for display
  // teacher?: { id: number; firstName: string; lastName: string };
}

// --- Styled Components ---
const TimetableWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  // Consider adding background color based on theme here if needed
}));

const TimetableHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const CenteredContent = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 32, // Equivalent to theme.spacing(4) * 8
  minHeight: "200px", // Ensure it has some height
});

// --- Utility Functions ---

/**
 * Formats a 24-hour time string (HH:mm) to 12-hour format (h:mm a).
 * @param timeString - The time string in "HH:mm" format.
 * @returns The formatted time string (e.g., "8:00 AM").
 */
const formatTo12Hour = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(":");
    const date = parse(`${hours}:${minutes}`, "HH:mm", new Date());
    return format(date, "h:mm a");
  } catch (error) {
    console.error("Error formatting time:", timeString, error);
    return timeString; // Return original string on error
  }
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
  const classId = studentInfo!.classId;
  const sectionId = studentInfo!.sectionId;

  // 2. Fetch Timetable Data (only if user data is available)
  const {
    data: timetableEntries, // Renamed from 'data'
    isLoading: isLoadingTimetable,
    isError: isErrorTimetable,
    error: timetableError,
  } = useFetchTimeTables(classId, sectionId);
  console.log({ timetableEntries, classId, sectionId });
  // 3. Process Timetable Data
  const { timetableByDay, sortedTimeSlots } = useMemo(() => {
    // Expecting timetableEntries to be the array directly based on useFetchTimeTables usage
    const entries = timetableEntries; // Assuming the hook returns the array directly

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return {
        timetableByDay: {} as Record<Weekday, Record<number, TimetableEntry>>,
        sortedTimeSlots: [] as string[],
      };
    }

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
      } else {
        console.warn(
          "Timetable entry found for unexpected day:",
          entry.dayOfWeek
        );
      }
    });

    // Sort time slots chronologically based on start time
    const sortedSlots = Array.from(uniqueTimeSlots).sort((a, b) => {
      const startTimeA = a.split("-")[0];
      const startTimeB = b.split("-")[0];
      return startTimeA.localeCompare(startTimeB);
    });

    return { timetableByDay: timetableMap, sortedTimeSlots: sortedSlots };
  }, [timetableEntries]); // Dependency is the raw fetched data

  // 4. PDF Export Handler
  const handleExportPDF = useCallback(() => {
    if (
      !timetableEntries ||
      timetableEntries.length === 0 ||
      !classId ||
      !sectionId
    )
      return;

    // Generate title and filename based on student's class/section
    const title = `Timetable - Class ${classId} / Section ${sectionId}`; // Use IDs for simplicity, or fetch names if needed
    const filename = `timetable_class_${classId}_section_${sectionId}.pdf`;

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
          // Find the entry for this specific day and time slot
          const entry = Object.values(timetableByDay[day] || {}).find(
            (e) => `${e.startTime}-${e.endTime}` === slot
          );

          if (!entry) return ""; // Empty cell for free periods

          // Format cell content
          return {
            text: [
              { text: `${entry.subject.name}\n`, bold: true },
              // Add teacher name if available and desired:
              // { text: `Teacher: ${entry.teacher?.firstName || 'N/A'}\n` },
              { text: `Class: ${entry.class.name}\n` },
              { text: `Section: ${entry.section.name}` },
            ],
            // Add styling if needed (e.g., fontSize, alignment)
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
            widths: ["auto", ...Array(sortedTimeSlots.length).fill("*")], // Adjust widths as needed
            body: pdfTableBody,
          },
          layout: "lightHorizontalLines", // Optional: adds nice table lines
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
  }, [timetableEntries, sortedTimeSlots, timetableByDay, classId, sectionId]); // Dependencies for the callback

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
  if (!timetableEntries || timetableEntries.length === 0) {
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
          {/* Optionally display class/section:
           <Typography variant="h6" component="span" sx={{ ml: 1, color: 'text.secondary' }}>
             (Class {classId} - Section {sectionId})
           </Typography>
          */}
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExportPDF}
          disabled={!timetableEntries || timetableEntries.length === 0} // Disable if no data
        >
          Export PDF
        </Button>
      </TimetableHeader>

      <Divider sx={{ mb: 3 }} />

      <TableContainer
        component={Paper}
        elevation={3} // Add some elevation
        sx={{
          backgroundColor: isDarkMode
            ? theme.palette.background.paper // Use theme background in dark mode
            : undefined, // Use default Paper background in light mode
          overflow: "auto", // Ensure horizontal scroll on smaller screens
        }}
      >
        <Table sx={{ minWidth: 800 }} aria-label="student timetable">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDarkMode
                  ? theme.palette.grey[800] // Darker header for dark mode
                  : theme.palette.primary.light, // Lighter primary for light mode
              }}
            >
              {/* Day/Time Header Cell */}
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode
                    ? theme.palette.common.white
                    : theme.palette.primary.contrastText,
                  position: "sticky", // Make Day/Time sticky
                  left: 0, // Stick to the left
                  zIndex: 1, // Ensure it's above other cells
                  backgroundColor: isDarkMode // Match row background
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
                      minWidth: 150, // Ensure columns have reasonable width
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
                hover // Add hover effect
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.action.hover, // Subtle alternating row color
                  },
                }}
              >
                {/* Day Cell (Sticky) */}
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: "bold",
                    position: "sticky", // Make Day cell sticky
                    left: 0, // Stick to the left
                    zIndex: 1, // Ensure it's above other cells
                    // Match alternating row background color:
                    backgroundColor:
                      (theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : theme.palette.common.white) + "!important", // Use important to override hover/odd styles
                    "&:nth-of-type(odd)": {
                      // Need to re-apply for odd rows
                      backgroundColor:
                        theme.palette.action.hover + "!important",
                    },
                  }}
                >
                  {day}
                </TableCell>

                {/* Period Data Cells */}
                {sortedTimeSlots.map((slot, index) => {
                  // Find the entry for this specific day and time slot
                  const entry = Object.values(timetableByDay[day] || {}).find(
                    (e) => `${e.startTime}-${e.endTime}` === slot
                  );

                  return (
                    <TableCell
                      key={`${day}-period-${index}`}
                      align="center"
                      sx={{ padding: 1.5 }} // Consistent padding
                    >
                      {entry ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5, // Add small gap between elements
                          }}
                        >
                          <Tooltip
                            title={
                              entry.subject.description || entry.subject.name
                            }
                            arrow
                          >
                            <Chip
                              icon={<SubjectIcon fontSize="small" />}
                              label={entry.subject.name}
                              color="primary" // Use primary color for subject
                              size="small"
                              sx={{ fontWeight: "medium" }}
                            />
                          </Tooltip>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "text.secondary", // Use secondary text color
                            }}
                          >
                            <SchoolIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                            <Typography variant="caption">
                              {/* Display Class/Section from entry */}
                              {`Cls: ${entry.class.name} / Sec: ${entry.section.name}`}
                            </Typography>
                          </Box>
                          {/* Add Teacher info if needed */}
                          {/*
                          <Typography variant="caption" color="text.secondary">
                            Teacher: {entry.teacher?.firstName || 'N/A'}
                          </Typography>
                          */}
                        </Box>
                      ) : (
                        // Display for Free Period
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
