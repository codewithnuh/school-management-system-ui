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

// Interfaces for type safety
interface TimetablePeriod {
  id: number;
  timetableId: number;
  sectionId: number;
  periodNumber: number; // Changed from periodNo
  dayOfWeek: string; // Changed from day
  startTime: string;
  endTime: string;
  classId: number;
  subjectId: number;
  teacherId: number;
  subject?: {
    id: number;
    name: string;
    description?: string;
  };
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
  };
  section?: {
    id: number;
    lastName: string;
    email?: string;
  };
}

interface TimetableData {
  [day: string]: TimetablePeriod[];
}

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
  const [availableSections, setAvailableSections] = useState<any[]>([]);

  // Reference for the table to export as PDF
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch classes for dropdown
  const { data: classes, isLoading: isLoadingClasses } = useFetchClasses();

  // Fetch sections based on selected class
  const {
    data: classWithSections,
    isLoading: isLoadingSections,
    isError,
  } = useFetchSections(selectedClassId as number);

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

  // Fetch timetable data when view button is clicked
  const { data: timetableData, isLoading: isLoadingTimetable } =
    useFetchTimeTables(selectedClassId as number, selectedSectionId as number);
  console.log(timetableData);
  // Days of the week
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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
    setShowTimetable(true);
  };

  // Format timetable data into a structured format for display
  const formatTimetableData = (): FormattedRow[] => {
    if (!timetableData || typeof timetableData !== "object") return [];

    // Create a map to store periods by periodNumber
    const periodMap = new Map<number, FormattedRow>();

    // Process each day and its periods
    Object.keys(timetableData).forEach((day) => {
      if (daysOfWeek.includes(day) && Array.isArray(timetableData[day])) {
        timetableData[day].forEach((period) => {
          const periodNumber = period.periodNumber;

          // Initialize row if it doesn't exist
          if (!periodMap.has(periodNumber)) {
            const newRow: FormattedRow = { periodNo: periodNumber };
            daysOfWeek.forEach((d) => {
              newRow[d] = { subject: "", teacher: "", time: "" };
            });
            periodMap.set(periodNumber, newRow);
          }

          // Add period data to the row
          const row = periodMap.get(periodNumber)!;
          row[day] = {
            subject: period.subject?.name || "",
            teacher: period.teacher
              ? `${period.teacher.firstName} ${period.teacher.lastName}`
              : "",
            time: `${period.startTime} - ${period.endTime}`,
          };
        });
      }
    });

    // Convert map to array and sort by period number
    return Array.from(periodMap.values()).sort(
      (a, b) => a.periodNo - b.periodNo
    );
  };

  // Check if timetable data is available and properly structured
  const isTimetableDataAvailable = (): boolean => {
    if (!timetableData) return false;

    // Check if it's an object with at least one day key
    return (
      typeof timetableData === "object" &&
      Object.keys(timetableData).some(
        (key) =>
          daysOfWeek.includes(key) &&
          Array.isArray(timetableData[key]) &&
          timetableData[key].length > 0
      )
    );
  };

  // Export the timetable as PDF
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
        "Section";

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
    }
  };

  // Format the timetable data
  const formattedData = formatTimetableData();

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
                (availableSections?.length === 0 && !isError)
              }
            >
              {!selectedClassId ? (
                <MenuItem disabled>Select a class first</MenuItem>
              ) : isLoadingSections ? (
                <MenuItem disabled>Loading sections...</MenuItem>
              ) : availableSections.length === 0 ? (
                <MenuItem disabled>
                  {isError ? "Error loading sections" : "No sections available"}
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
            onClick={handleViewTimetable}
            disabled={!selectedClassId || !selectedSectionId}
            sx={{ minWidth: "120px", height: "56px" }}
          >
            View Timetable
          </Button>
        </Box>

        {/* Timetable Display */}
        {showTimetable && (
          <Box mt={4}>
            {isLoadingTimetable ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : isTimetableDataAvailable() ? (
              <>
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
                  >
                    Export as PDF
                  </Button>
                </Box>

                <Box ref={tableRef} sx={{ overflowX: "auto" }}>
                  <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table aria-label="timetable">
                      <TableHead>
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
                        {formattedData.map((row) => (
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
                                  <Typography variant="body2" fontWeight="bold">
                                    {dayData.subject}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    {dayData.teacher}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="textSecondary"
                                  >
                                    {dayData.time}
                                  </Typography>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            ) : (
              <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6" color="error">
                  No timetable data available for the selected class and
                  section.
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Please try another class and section combination or generate a
                  timetable first.
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
