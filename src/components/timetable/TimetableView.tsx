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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Queries and Types
import { useFetchTimeTables } from "../../services/queries/timeTable";
import { useClasses as useFetchClasses } from "../../services/queries/classes";
import { useFetchAllSectionsOfAClass as useFetchSections } from "../../services/queries/section";
import { TimetablePeriod } from "../../api/types/timetables";

// Interfaces
interface GroupedTimetableData {
  [day: string]: TimetablePeriod[];
}

interface FormattedRow {
  periodNo: number;
  [day: string]: { subject: string; teacher: string; time: string } | number;
}

const TimetableView: React.FC = () => {
  const theme = useTheme();
  const tableRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedClassId, setSelectedClassId] = useState<number | "">("");
  const [selectedSectionId, setSelectedSectionId] = useState<number | "">("");
  const [showTimetable, setShowTimetable] = useState<boolean>(false);
  const [availableSections, setAvailableSections] = useState<any[]>([]);

  // Fetch data
  const {
    data: classesResponse,
    isLoading: isLoadingClasses,
    isError: isErrorClasses,
    error: classesError,
    refetch: refetchClasses,
  } = useFetchClasses();
  console.log(classesResponse);
  const {
    data: classWithSections,
    isLoading: isLoadingSections,
    isError: isErrorSections,
    error: sectionsError,
  } = useFetchSections(selectedClassId as number);

  const {
    data: timetableData,
    isLoading: isLoadingTimetable,
    isError: isErrorTimetable,
    error: timetableError,
  } = useFetchTimeTables(
    selectedClassId as number,
    selectedSectionId as number
  );
  console.log({ timetableData });
  // Extract classes safely
  const classes = classesResponse?.data || [];

  // Load sections when class changes
  useEffect(() => {
    if (classWithSections && Array.isArray(classWithSections.data)) {
      setAvailableSections(classWithSections.data);
    } else {
      setAvailableSections([]);
    }
  }, [classWithSections]);

  // Handle class selection change
  const handleClassChange = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value;
    setSelectedClassId(value === "" ? "" : Number(value));
    setSelectedSectionId(""); // Reset section when class changes
    setShowTimetable(false); // Hide timetable
  };

  // Handle section selection change
  const handleSectionChange = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value;
    setSelectedSectionId(value === "" ? "" : Number(value));
    setShowTimetable(false);
  };

  // Handle view timetable button click
  const handleViewTimetable = () => {
    if (
      selectedClassId &&
      selectedSectionId &&
      typeof selectedClassId === "number" &&
      typeof selectedSectionId === "number"
    ) {
      setShowTimetable(true);
    } else {
      console.warn("Please select both class and section.");
    }
  };

  // Get timetable entries from response
  const getTimetableEntries = (): TimetablePeriod[] => {
    if (
      timetableData &&
      timetableData.data &&
      Array.isArray(timetableData.data.timetableEntries)
    ) {
      return timetableData.data.timetableEntries;
    }
    return [];
  };

  // Group periods by day
  const groupPeriodsByDay = (
    periods: TimetablePeriod[] | undefined
  ): GroupedTimetableData => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const grouped: GroupedTimetableData = {};
    daysOfWeek.forEach((day) => (grouped[day] = []));

    if (!periods || !Array.isArray(periods)) return grouped;

    periods.forEach((period) => {
      if (period && period.dayOfWeek && grouped[period.dayOfWeek]) {
        grouped[period.dayOfWeek].push(period);
      }
    });

    // Sort each day by period number
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => a.periodNumber - b.periodNumber);
    });

    return grouped;
  };

  // Format grouped data for table
  const formatGroupedDataForTable = (
    groupedData: GroupedTimetableData
  ): FormattedRow[] => {
    const periodMap = new Map<number, FormattedRow>();
    let maxPeriod = 0;

    Object.keys(groupedData).forEach((day) => {
      groupedData[day].forEach((period) => {
        maxPeriod = Math.max(maxPeriod, period.periodNumber);
        if (!periodMap.has(period.periodNumber)) {
          const newRow: FormattedRow = { periodNo: period.periodNumber };
          Object.keys(groupedData).forEach((d) => {
            newRow[d] = { subject: "", teacher: "", time: "" };
          });
          periodMap.set(period.periodNumber, newRow);
        }

        const row = periodMap.get(period.periodNumber)!;
        row[period.dayOfWeek] = {
          subject: period.subject?.name || "N/A",
          teacher: period.teacher
            ? `${period.teacher.firstName} ${period.teacher.lastName}`
            : "N/A",
          time: `${period.startTime || "??"} - ${period.endTime || "??"}`,
        };
      });
    });

    for (let i = 1; i <= maxPeriod; i++) {
      if (!periodMap.has(i)) {
        const newRow: FormattedRow = { periodNo: i };
        Object.keys(groupedData).forEach((d) => {
          newRow[d] = { subject: "", teacher: "", time: "" };
        });
        periodMap.set(i, newRow);
      }
    }

    return Array.from(periodMap.values()).sort(
      (a, b) => a.periodNo - b.periodNo
    );
  };

  // Check if timetable data is available
  const isTimetableDataAvailable = (): boolean => {
    const entries = getTimetableEntries();
    return Array.isArray(entries) && entries.length > 0;
  };

  // Export timetable as PDF
  const exportAsPDF = async () => {
    if (!tableRef.current) return;
    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
      });

      const className =
        classes.find((c) => c.id === selectedClassId)?.name || "Class";
      const sectionName =
        availableSections.find((s) => s.id === selectedSectionId)?.name ||
        "Section";

      pdf.setFontSize(16);
      pdf.text(`Timetable: ${className} - ${sectionName}`, 14, 15);
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 28;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 14, 30, pdfWidth, pdfHeight);
      pdf.save(`Timetable_${className}_${sectionName}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to generate PDF.");
    }
  };

  // Group and format data
  const timetableEntries = getTimetableEntries();
  const groupedData = groupPeriodsByDay(timetableEntries);
  const formattedData = formatGroupedDataForTable(groupedData);
  const daysOfWeek = Object.keys(groupedData);

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
              displayEmpty
              sx={{
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              {isLoadingClasses ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading classes...
                </MenuItem>
              ) : null}

              {isErrorClasses ? (
                <MenuItem disabled>
                  Failed to load classes:{" "}
                  {classesError instanceof Error
                    ? classesError.message
                    : "Unknown error"}
                </MenuItem>
              ) : null}

              {!isLoadingClasses &&
                !isErrorClasses &&
                classes.map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </MenuItem>
                ))}

              {!isLoadingClasses && !isErrorClasses && classes.length === 0 && (
                <MenuItem disabled>No classes found</MenuItem>
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
              disabled={!selectedClassId || isLoadingSections}
            >
              {!selectedClassId ? (
                <MenuItem disabled>Select a class first</MenuItem>
              ) : isLoadingSections ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading sections...
                </MenuItem>
              ) : isErrorSections ? (
                <MenuItem disabled>
                  Error loading sections:{" "}
                  {sectionsError instanceof Error
                    ? sectionsError.message
                    : "Unknown error"}
                </MenuItem>
              ) : availableSections.length === 0 ? (
                <MenuItem disabled>No sections found</MenuItem>
              ) : (
                availableSections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* View Timetable Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewTimetable}
            disabled={
              !selectedClassId || !selectedSectionId || isLoadingTimetable
            }
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
        {showTimetable && (
          <Box mt={4}>
            {isLoadingTimetable ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : isErrorTimetable ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="h6">Error loading timetable</Typography>
                <Typography variant="body2">
                  {timetableError instanceof Error
                    ? timetableError.message
                    : "Failed to load timetable data. Please try again."}
                </Typography>
                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  Ensure the class and section exist and have an assigned
                  timetable.
                </Typography>
              </Alert>
            ) : isTimetableDataAvailable() ? (
              <>
                {/* Header + Export Button */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h5" color="primary">
                    {classes.find((c) => c.id === selectedClassId)?.name ||
                      "Class"}{" "}
                    -{" "}
                    {availableSections.find((s) => s.id === selectedSectionId)
                      ?.name || "Section"}{" "}
                    Timetable
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={exportAsPDF}
                    disabled={formattedData.length === 0}
                  >
                    Export as PDF
                  </Button>
                </Box>

                {/* Table */}
                <Box ref={tableRef} sx={{ overflowX: "auto" }}>
                  <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table aria-label="timetable">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                          }}
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
                        {formattedData.length > 0 ? (
                          formattedData.map((row) => (
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
                                      {dayData.subject || "-"}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      {dayData.teacher || "-"}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {dayData.time || "-"}
                                    </Typography>
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))
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
              <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                  No timetable data available for the selected class and
                  section.
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Ensure a timetable has been generated and assigned for this
                  section.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TimetableView;
