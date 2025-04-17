import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useFetchTimeTables } from "../../services/queries/timeTable";
import { generatePDF } from "../../utils/pdfUtils";

// Days and periods
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = [
  "8:00 - 8:45",
  "8:45 - 9:30",
  "9:30 - 10:15",
  "10:15 - 11:00",
  "11:00 - 11:45",
  "11:45 - 12:30",
  "12:30 - 1:15",
  "1:15 - 2:00",
];

// Type definitions
interface TimeTablePeriod {
  id: number;
  day: string;
  periodNumber: number;
  subject: {
    id: number;
    name: string;
  };
  teacher: {
    id: number;
    name: string;
  };
}

interface ViewSectionTimetableProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  sectionId: number;
  className: string;
  sectionName: string;
}

const ViewSectionTimetable: React.FC<ViewSectionTimetableProps> = ({
  open,
  onClose,
  classId,
  sectionId,
  className,
  sectionName,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: timetableData,
    isLoading,
    error,
    isError,
  } = useFetchTimeTables(classId, sectionId);

  // Process timetable data into a structured format
  const structuredTimetable = useMemo(() => {
    if (!timetableData) return {};

    const timetable: Record<string, Record<number, TimeTablePeriod>> = {};

    // Initialize the timetable structure with empty slots
    weekdays.forEach((day) => {
      timetable[day] = {};
    });

    // Fill in the timetable with actual periods
    timetableData.forEach((period: TimeTablePeriod) => {
      if (timetable[period.day]) {
        timetable[period.day][period.periodNumber] = period;
      }
    });

    return timetable;
  }, [timetableData]);

  // Handle PDF export
  const handleExportPDF = () => {
    if (!timetableData) return;

    const title = `Class ${className} - Section ${sectionName} Timetable`;

    // Define the document structure for the PDF
    const docDefinition = {
      content: [
        { text: title, style: "header" },
        { text: "Weekly Schedule", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: Array(periods.length + 1).fill("*"),
            body: [
              ["Day/Time", ...periods],
              ...weekdays.map((day) => [
                day,
                ...periods.map((_, index) => {
                  const periodNum = index + 1;
                  const period = structuredTimetable[day]?.[periodNum];

                  if (!period) return "";

                  return {
                    text: [
                      { text: `${period.subject.name}\n`, bold: true },
                      { text: `Teacher: ${period.teacher.name}` },
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
    generatePDF(
      docDefinition,
      `timetable_class${classId}_section${sectionId}.pdf`
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      aria-labelledby="section-timetable-dialog"
    >
      <DialogTitle id="section-timetable-dialog">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Class {className} - Section {sectionName} Timetable
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ width: "100%", p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarTodayIcon sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                Weekly Schedule
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportPDF}
              disabled={isLoading || isError || !timetableData}
            >
              Export PDF
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Loading state */}
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error state */}
          {isError && (
            <Alert severity="error" sx={{ m: 2 }}>
              Error loading timetable:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </Alert>
          )}

          {/* Empty state */}
          {!isLoading &&
            !isError &&
            (!timetableData || timetableData.length === 0) && (
              <Alert severity="info" sx={{ m: 2 }}>
                No timetable available for this section. The timetable may not
                have been generated yet.
              </Alert>
            )}

          {/* Timetable display */}
          {!isLoading &&
            !isError &&
            timetableData &&
            timetableData.length > 0 && (
              <TableContainer
                component={Paper}
                sx={{ width: "100%", overflow: "auto" }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="section timetable">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Day/Time
                      </TableCell>
                      {periods.map((period, index) => (
                        <TableCell
                          key={index}
                          align="center"
                          sx={{ fontWeight: "bold" }}
                        >
                          {`Period ${index + 1}`}
                          <Typography variant="caption" display="block">
                            {period}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {weekdays.map((day) => (
                      <TableRow key={day} hover>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontWeight: "bold" }}
                        >
                          {day}
                        </TableCell>
                        {Array.from(
                          { length: periods.length },
                          (_, i) => i + 1
                        ).map((periodNum) => {
                          const period = structuredTimetable[day]?.[periodNum];

                          return (
                            <TableCell key={periodNum} align="center">
                              {period ? (
                                <Box>
                                  <Typography
                                    variant="body1"
                                    fontWeight="medium"
                                  >
                                    {period.subject.name}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    {period.teacher.name}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Free
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
            )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSectionTimetable;
