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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useFetchTimeTables } from "../../services/queries/timeTable";
import { useClasses as useFetchClasses } from "../../services/queries/classes";
import { useFetchAllSectionsOfAClass as useFetchSections } from "../../services/queries/section";
import { TimetablePeriod } from "../../api/types/timetables"; // Import the correct type for periods

// Interfaces for type safety
// Interface TimetablePeriod should be defined/imported from types based on API response

// Type for the data structure *after* grouping by day
interface GroupedTimetableData {
  [day: string]: TimetablePeriod[];
}

// Type for the final formatted row for the table
interface FormattedRow {
  periodNo: number;
  [day: string]: { subject: string; teacher: string; time: string } | number;
}

const TimetableView: React.FC = () => {
  // Theme for styling
  const theme = useTheme();

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
  } = useFetchSections(selectedClassId as number); // Cast is okay here if fetch hook handles invalid ID

  // Extract sections from class data when available
  useEffect(() => {
    if (
      classWithSections &&
      classWithSections?.sections &&
      Array.isArray(classWithSections.sections)
    ) {
      setAvailableSections(classWithSections.sections);
    } else {
      setAvailableSections([]);
    }
  }, [classWithSections]);

  // Fetch timetable data - expecting TimetablePeriod[] now
  const {
    data: timetablePeriods, // Renamed to reflect it's an array of periods
    isLoading: isLoadingTimetable,
    isError: isErrorTimetable, // Track errors from timetable fetch
    error: timetableError, // Access error details
  } = useFetchTimeTables(selectedClassId, selectedSectionId);

  // Log data and errors for debugging
  useEffect(() => {
    console.log("Raw Timetable Periods Data:", timetablePeriods);
    if (isErrorTimetable) {
      console.error("Error fetching timetable:", timetableError);
    }
  }, [timetablePeriods, isErrorTimetable, timetableError]);

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
    // Fetching is now handled by react-query's enabled flag
    // We just need to show the table section
    if (selectedClassId && selectedSectionId) {
      setShowTimetable(true);
    } else {
      console.warn("Please select both class and section.");
      // Optionally show a user message
    }
  };

  // Group raw periods by day
  const groupPeriodsByDay = (
    periods: TimetablePeriod[] | undefined
  ): GroupedTimetableData => {
    if (!periods || !Array.isArray(periods)) return {};

    const grouped: GroupedTimetableData = {};
    daysOfWeek.forEach((day) => (grouped[day] = [])); // Initialize each day with an empty array

    periods.forEach((period) => {
      if (grouped[period.dayOfWeek]) {
        grouped[period.dayOfWeek].push(period);
      } else {
        // Handle unexpected days if necessary
        console.warn(`Period found for unexpected day: ${period.dayOfWeek}`);
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

  // Check if raw data is available before trying to format
  const isTimetableDataAvailable = (): boolean => {
    return Array.isArray(timetablePeriods) && timetablePeriods.length > 0;
  };

  // Export PDF function (remains largely the same, ensure tableRef content is correct)
  const exportAsPDF = async () => {
    if (!tableRef.current) return;

    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
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

  // Group and format the data
  const groupedData = groupPeriodsByDay(timetablePeriods);
  const formattedData = formatGroupedDataForTable(groupedData);

  return (
    <Container maxWidth="xl">
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Class Timetable Viewer
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          mb={3}
        >
          {/* Class Selection */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="class-select-label">Class</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClassId}
              label="Class"
              onChange={handleClassChange}
              disabled={isLoadingClasses}
            >
              {isLoadingClasses ? (
                <MenuItem disabled>Loading classes...</MenuItem>
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
          <FormControl fullWidth variant="outlined">
            <InputLabel id="section-select-label">Section</InputLabel>
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
            sx={{ minWidth: "120px", height: "56px" }}
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
            ) : isTimetableDataAvailable() ? ( // Check if raw data arrived
              <>
                {/* Header and Export Button */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h5" color="primary">
                    {classes?.find((c) => c.id === selectedClassId)?.name} -{" "}
                    {
                      availableSections?.find((s) => s.id === selectedSectionId)
                        ?.name
                    }{" "}
                    Timetable
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={exportAsPDF}
                    disabled={formattedData.length === 0} // Disable if no data to export
                  >
                    Export as PDF
                  </Button>
                </Box>

                {/* Table */}
                <Box ref={tableRef} sx={{ overflowX: "auto" }}>
                  <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table aria-label="timetable">
                      <TableHead>
                        {/* ... Table Header Row ... */}
                        <TableRow
                          sx={{ backgroundColor: theme.palette.primary.main }}
                        >
                          <TableCell
                            sx={{
                              color: theme.palette.primary.contrastText,
                              fontWeight: "bold",
                            }}
                          >
                            Period
                          </TableCell>
                          {daysOfWeek.map((day) => (
                            <TableCell
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
                        {formattedData.map(
                          (
                            row // Use the finally formatted data
                          ) => (
                            <TableRow
                              key={row.periodNo}
                              sx={{
                                "&:nth-of-type(odd)": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                sx={{
                                  fontWeight: "bold",
                                  backgroundColor: theme.palette.primary.light,
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
                                  <TableCell
                                    key={`${row.periodNo}-${day}`}
                                    align="center"
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight="bold"
                                    >
                                      {dayData.subject || "-"}{" "}
                                      {/* Show dash if empty */}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      {dayData.teacher || "-"}{" "}
                                      {/* Show dash if empty */}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      {dayData.time || "-"}{" "}
                                      {/* Show dash if empty */}
                                    </Typography>
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            ) : (
              // Show appropriate message if error or no data
              <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
                {isErrorTimetable ? (
                  <>
                    <Typography variant="h6" color="error">
                      Error loading timetable data.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      {timetableError?.message || "An unknown error occurred."}{" "}
                      Please try again later.
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" color="textSecondary">
                      No timetable data available for the selected class and
                      section.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      Ensure a timetable has been generated and assigned for
                      this section.
                    </Typography>
                  </>
                )}
              </Paper>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TimetableView;
