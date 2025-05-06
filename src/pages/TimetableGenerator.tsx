import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  styled,
  ThemeProvider,
  alpha,
} from "@mui/material";
// Removed useTheme import as we use darkTheme directly
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf"; // Corrected import
import html2canvas from "html2canvas";
import { useFetchTimeTables } from "../../services/queries/timeTable";
import { useClasses as useFetchClasses } from "../../services/queries/classes";
import { useFetchAllSectionsOfAClass as useFetchSections } from "../../services/queries/section";
import { TimetablePeriod } from "../../api/types/timetables"; // Import the correct type for periods

// Interfaces for type safety
import { darkTheme } from "../../theme/darkTheme"; // Import the dark theme

// Type for the data structure *after* grouping by day
interface GroupedTimetableData {
  [day: string]: TimetablePeriod[];
}

// Type for the final formatted row for the table
interface FormattedRow {
  periodNo: number;
  [day: string]: { subject: string; teacher: string; time: string } | number;
}

// Add an interface for the timetable response data
interface TimetableData {
  id: number;
  classId: number;
  sectionId: number;
  teacherId: number;
  periodsPerDay: number;
  timetableEntries: TimetablePeriod[];
  // Add other fields as necessary
}

// --- Glass-styled container ---
const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  color: theme.palette.text.primary,
}));

const TimetableView: React.FC = () => {
  const theme = darkTheme; // Use the imported dark theme directly

  // States for the selected class and section
  const [selectedClassId, setSelectedClassId] = useState<number | "">("");
  const [selectedSectionId, setSelectedSectionId] = useState<number | "">("");
  const [showTimetable, setShowTimetable] = useState<boolean>(false);
  const [availableSections, setAvailableSections] = useState<any[]>([]); // Consider typing this better if possible
  // Reference for the table to export as PDF
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch classes for dropdown
  const { data: classes, isLoading: isLoadingClasses } = useFetchClasses();

  // Fetch sections based on selected class
  const {
    data: classWithSections,
    isLoading: isLoadingSections,
    isError: isErrorSections, // Renamed for clarity
  } = useFetchSections(selectedClassId as number);

  // Extract sections from class data when available
  useEffect(() => {
    if (
      classWithSections &&
      classWithSections?.data &&
      Array.isArray(classWithSections.data)
    ) {
      setAvailableSections(classWithSections.data);
    } else {
      setAvailableSections([]);
    }
  }, [classWithSections]);

  // Fetch timetable data - expecting a TimetableData object now
  const {
    data: timetableData, // Renamed to reflect it's potentially a TimetableData object
    isLoading: isLoadingTimetable,
    isError: isErrorTimetable, // Track errors from timetable fetch
    error: timetableError, // Access error details
  } = useFetchTimeTables(
    selectedClassId as number,
    selectedSectionId as number
  );

  // Log data and errors for debugging
  useEffect(() => {
    console.log("Raw Timetable Data:", timetableData);
    if (isErrorTimetable) {
      console.error("Error fetching timetable:", timetableError);
    }
  }, [timetableData, isErrorTimetable, timetableError]);

  // Days of the week
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday", // Include Sunday if applicable
  ];

  // Handle class selection change
  const handleClassChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedClassId(event.target.value as number);
    setSelectedSectionId("");
    setShowTimetable(false);
  };

  // Handle section selection change
  const handleSectionChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedSectionId(event.target.value as number);
    setShowTimetable(false);
  };

  // Handle view timetable button click
  const handleViewTimetable = () => {
    // Validate inputs before proceeding
    if (
      selectedClassId &&
      selectedSectionId &&
      typeof selectedClassId === "number" &&
      typeof selectedSectionId === "number" &&
      selectedClassId > 0 &&
      selectedSectionId > 0
    ) {
      setShowTimetable(true);
    } else {
      console.warn("Please select both class and section.");
      // Optionally show a user message
    }
  };

  // Get timetable entries from the data structure
  const getTimetableEntries = (): TimetablePeriod[] => {
    if (!timetableData) return [];

    // Handle nested data structure properly
    // Assuming the API response structure is { success: boolean, data: TimetableData, ... }
    // or directly TimetableData
    const actualData = (timetableData as any)?.data || timetableData;

    if (actualData && Array.isArray(actualData.timetableEntries)) {
      return actualData.timetableEntries;
    }

    // Check if the data is directly an array of periods (less likely based on context)
    if (Array.isArray(actualData)) return actualData;

    console.warn(
      "Unable to extract timetable entries from response:",
      timetableData
    );
    return [];
  };

  // Group raw periods by day
  const groupPeriodsByDay = (
    periods: TimetablePeriod[] | undefined
  ): GroupedTimetableData => {
    if (!periods || !Array.isArray(periods)) return {};

    const grouped: GroupedTimetableData = {};
    daysOfWeek.forEach((day) => (grouped[day] = [])); // Initialize each day with an empty array

    periods.forEach((period) => {
      if (period && period.dayOfWeek && grouped[period.dayOfWeek]) {
        grouped[period.dayOfWeek].push(period);
      } else {
        // Handle unexpected days if necessary
        console.warn(
          `Period found for unexpected day or invalid format:`,
          period
        );
      }
    });

    // Sort periods within each day by periodNumber
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => a.periodNumber - b.periodNumber);
    });

    return grouped;
  };

  // Format grouped data for the table
  const formatGroupedDataForTable = (
    groupedData: GroupedTimetableData
  ): FormattedRow[] => {
    const periodMap = new Map<number, FormattedRow>();
    let maxPeriod = 0;

    Object.keys(groupedData).forEach((day) => {
      if (daysOfWeek.includes(day)) {
        groupedData[day].forEach((period) => {
          const periodNumber = period.periodNumber;
          maxPeriod = Math.max(maxPeriod, periodNumber); // Track highest period number

          if (!periodMap.has(periodNumber)) {
            const newRow: FormattedRow = { periodNo: periodNumber };
            // Initialize all days for this new period row
            daysOfWeek.forEach((d) => {
              newRow[d] = { subject: "", teacher: "", time: "" };
            });
            periodMap.set(periodNumber, newRow);
          }

          const row = periodMap.get(periodNumber)!;
          row[day] = {
            subject: period.subject?.name || "N/A",
            teacher: period.teacher
              ? `${period.teacher.firstName} ${period.teacher.lastName}`
              : "N/A",
            time: `${period.startTime || "??"} - ${period.endTime || "??"}`,
          };
        });
      }
    });

    // Ensure all periods up to maxPeriod exist, even if empty
    for (let i = 1; i <= maxPeriod; i++) {
      if (!periodMap.has(i)) {
        const newRow: FormattedRow = { periodNo: i };
        daysOfWeek.forEach((d) => {
          newRow[d] = { subject: "", teacher: "", time: "" };
        });
        periodMap.set(i, newRow);
      }
    }

    return Array.from(periodMap.values()).sort(
      (a, b) => a.periodNo - b.periodNo
    );
  };

  // Check if timetable data is available - updated to handle the nested structure
  const isTimetableDataAvailable = (): boolean => {
    const entries = getTimetableEntries();
    return Array.isArray(entries) && entries.length > 0;
  };

  // Export PDF function (remains largely the same, ensure tableRef content is correct)
  const exportAsPDF = async () => {
    if (!tableRef.current) return;

    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: null, // Make background transparent for PDF
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
      });

      // Get the class and section names
      const className =
        classes?.find((c) => c.id === selectedClassId)?.name || "Class";
      const sectionName =
        availableSections?.find((s) => s.id === selectedSectionId)?.name ||
        "Section"; // Ensure availableSections is populated

      // Add title
      pdf.setFontSize(16);
      pdf.text(`Timetable: ${className} - ${sectionName}`, 14, 15);

      // Add date
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

      // Calculate dimensions to maintain aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 28;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add the image
      pdf.addImage(imgData, "PNG", 14, 30, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save(`Timetable_${className}_${sectionName}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      // Optionally show an error message to the user
    }
  };

  // Group and format the data - using the updated method to get entries
  const timetableEntries = getTimetableEntries();
  const groupedData = groupPeriodsByDay(timetableEntries);
  const formattedData = formatGroupedDataForTable(groupedData);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <GlassCard>
          <Typography variant="h4" gutterBottom color="text.primary">
            Class Timetable Viewer
          </Typography>

          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
            mb={3}
          >
            {/* Class Selection */}
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiSelect-icon": { color: "text.secondary" },
                "& .MuiSelect-select": { color: theme.palette.text.primary },
              }}
            >
              <InputLabel id="class-select-label">Select Class</InputLabel>
              <Select
                labelId="class-select-label"
                id="class-select"
                value={selectedClassId}
                label="Class"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "rgba(30, 30, 46, 0.9)",
                      backdropFilter: "blur(5px)",
                      color: theme.palette.text.primary,
                      "& .MuiMenuItem-root": {
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.light,
                            0.1
                          ),
                        },
                        "&.Mui-selected": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2
                          ),
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.3
                            ),
                          },
                        },
                      },
                    },
                  },
                }}
                onChange={handleClassChange}
                disabled={isLoadingClasses}
              >
                {isLoadingClasses ? (
                  <MenuItem disabled>Loading classes...</MenuItem>
                ) : !classes || classes.length === 0 ? (
                  <MenuItem disabled>No classes available</MenuItem>
                ) : (
                  classes?.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Section Selection */}
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiSelect-icon": { color: "text.secondary" },
                "& .MuiSelect-select": { color: theme.palette.text.primary },
              }}
            >
              <InputLabel id="section-select-label">Select Section</InputLabel>
              <Select
                labelId="section-select-label"
                id="section-select"
                value={selectedSectionId}
                label="Section"
                onChange={handleSectionChange}
                disabled={
                  !selectedClassId ||
                  isLoadingSections ||
                  (availableSections?.length === 0 && !isErrorSections)
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "rgba(30, 30, 46, 0.9)",
                      backdropFilter: "blur(5px)",
                      color: theme.palette.text.primary,
                      "& .MuiMenuItem-root": {
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.light,
                            0.1
                          ),
                        },
                        "&.Mui-selected": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2
                          ),
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.3
                            ),
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {!selectedClassId ? (
                  <MenuItem disabled>Select a class first</MenuItem>
                ) : isLoadingSections ? (
                  <MenuItem disabled>Loading sections...</MenuItem>
                ) : availableSections.length === 0 ? (
                  <MenuItem disabled>
                    {isErrorSections
                      ? "Error loading sections"
                      : "No sections available"}
                  </MenuItem>
                ) : (
                  availableSections.map((section) => (
                    <MenuItem key={section.id} value={section.id}>
                      {section.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* View Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewTimetable} // Keep onClick to set showTimetable flag
              disabled={
                !selectedClassId || !selectedSectionId || isLoadingTimetable
              } // Disable if loading or selections missing
              sx={{
                minWidth: "120px",
                height: "56px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
              }}
            >
              {isLoadingTimetable ? (
                <CircularProgress size={24} />
              ) : (
                "View Timetable"
              )}
            </Button>
          </Box>

          {/* Timetable Display */}
          {showTimetable && ( // Only attempt to show if button was clicked
            <Box mt={4}>
              {isLoadingTimetable ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : isErrorTimetable ? (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    borderRadius: "12px",
                    bgcolor: "rgba(211, 47, 47, 0.1)",
                    color: theme.palette.error.light,
                    ".MuiAlert-icon": { color: theme.palette.error.main },
                  }}
                >
                  <Typography variant="h6">Error loading timetable</Typography>
                  <Typography variant="body2">
                    {timetableError instanceof Error
                      ? timetableError.message
                      : "Failed to load timetable data. Please try again."}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Ensure the class and section exist and have an assigned
                    timetable.
                  </Typography>
                </Alert>
              ) : isTimetableDataAvailable() ? ( // Check if raw data arrived
                <>
                  {/* Header and Export Button */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h5" color="text.primary">
                      {classes?.find((c) => c.id === selectedClassId)?.name} -{" "}
                      {
                        availableSections?.find(
                          (s) => s.id === selectedSectionId
                        )?.name
                      }{" "}
                      Timetable
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary" // Changed to primary for consistency, or choose another color
                      startIcon={<PictureAsPdfIcon />}
                      onClick={exportAsPDF}
                      disabled={formattedData.length === 0} // Disable if no data to export
                      sx={{
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
                        background: theme.palette.primary.main, // Use theme color
                      }}
                    >
                      Export as PDF
                    </Button>
                  </Box>

                  {/* Table */}
                  <Box ref={tableRef} sx={{ overflowX: "auto" }}>
                    <TableContainer
                      component={Paper}
                      sx={{
                        boxShadow: 3,
                        borderRadius: "12px",
                        background: alpha(theme.palette.background.paper, 0.7),
                      }}
                    >
                      <Table aria-label="timetable">
                        <TableHead>
                          {/* ... Table Header Row ... */}
                          <TableRow
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.primary.dark,
                                0.3
                              ),
                            }}
                          >
                            <TableCell // Period Header
                              sx={{
                                color: theme.palette.primary.contrastText,
                                fontWeight: "bold",
                              }}
                            >
                              Period
                            </TableCell>
                            {daysOfWeek.map((day) => (
                              <TableCell // Day Headers
                                key={day}
                                align="center"
                                sx={{
                                  color: theme.palette.primary.contrastText,
                                  fontWeight: "bold",
                                }}
                              >
                                {day}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formattedData.length > 0 ? (
                            formattedData.map(
                              (
                                row // Use the finally formatted data
                              ) => (
                                <TableRow // Data Rows
                                  key={row.periodNo}
                                  sx={{
                                    "&:nth-of-type(odd)": {
                                      backgroundColor: alpha(
                                        theme.palette.action.hover,
                                        0.1
                                      ),
                                    },
                                  }}
                                >
                                  <TableCell // Period Number Cell
                                    component="th"
                                    scope="row"
                                    sx={{
                                      fontWeight: "bold",
                                      backgroundColor: alpha(
                                        theme.palette.primary.dark,
                                        0.2
                                      ),
                                      color: theme.palette.primary.contrastText,
                                    }}
                                  >
                                    {row.periodNo}
                                  </TableCell>
                                  {daysOfWeek.map((day) => {
                                    // Type assertion is safe here due to formatting logic
                                    const dayData = row[day] as {
                                      subject: string;
                                      teacher: string;
                                      time: string;
                                    };
                                    return (
                                      // Data Cells
                                      <TableCell
                                        key={`${row.periodNo}-${day}`}
                                        align="center"
                                      >
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                          color="text.primary"
                                        >
                                          {dayData.subject || "-"}{" "}
                                          {/* Show dash if empty */}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          display="block"
                                          color="text.secondary"
                                        >
                                          {dayData.teacher || "-"}{" "}
                                          {/* Show dash if empty */}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="textSecondary"
                                          sx={{ fontSize: "0.7rem" }}
                                        >
                                          {dayData.time || "-"}{" "}
                                          {/* Show dash if empty */}
                                        </Typography>
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              )
                            )
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={daysOfWeek.length + 1}
                                align="center"
                              >
                                No periods found in the timetable
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </>
              ) : (
                // Show appropriate message if no data
                <GlassCard
                  elevation={1}
                  sx={{ p: 3, textAlign: "center", mt: 3 }}
                >
                  <Typography variant="h6" color="textSecondary">
                    No timetable data available for the selected class and
                    section.
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Ensure a timetable has been generated and assigned for this
                    section.
                  </Typography>
                </GlassCard>
              )}
            </Box>
          )}
        </GlassCard>
      </Container>
    </ThemeProvider>
  );
};

export default TimetableView;
