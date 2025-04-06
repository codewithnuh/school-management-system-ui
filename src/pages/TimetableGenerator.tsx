import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { SelectChangeEvent } from "@mui/material/Select";
import TimetableView from "../components/timetable/TimetableView";

interface Class {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
}

interface Subject {
  id: number;
  name: string;
  description: string;
}

interface Period {
  id: number;
  timetableId: number;
  sectionId: number;
  classId: number;
  subjectId: number;
  teacherId: number;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: Subject;
  teacher: Teacher;
}

interface TimetableData {
  [day: string]: Period[];
}

const TimetableGenerator: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | "">("");
  const [selectedSection, setSelectedSection] = useState<number | "">("");
  const [timetableData, setTimetableData] = useState<TimetableData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("/api/classes");
        setClasses(response.data.data);
      } catch (err) {
        setError("Failed to fetch classes. Please try again later.");
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
  }, []);

  // Handle class selection
  const handleClassChange = async (event: SelectChangeEvent) => {
    const classId = event.target.value;
    setSelectedClass(classId === "" ? "" : Number(classId));
    setSelectedSection("");
    setTimetableData(null);

    if (classId !== "") {
      setLoading(true);
      try {
        // Generate timetables for all sections of the selected class
        await axios.post(`/api/timetables/generate/${classId}`);

        // Fetch available sections for the selected class
        const sectionsResponse = await axios.get(
          `/api/classes/${classId}/sections`
        );
        setSections(sectionsResponse.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to generate timetables. Please try again later.");
        console.error("Error generating timetables:", err);
        setLoading(false);
      }
    } else {
      setSections([]);
    }
  };

  // Handle section selection
  const handleSectionChange = async (event: SelectChangeEvent) => {
    const sectionId = event.target.value;
    setSelectedSection(sectionId === "" ? "" : Number(sectionId));

    if (sectionId !== "") {
      setLoading(true);
      try {
        // Fetch timetable for the selected section
        const response = await axios.get(
          `/api/timetables/section/${sectionId}`
        );
        setTimetableData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch timetable. Please try again later.");
        console.error("Error fetching timetable:", err);
        setLoading(false);
      }
    } else {
      setTimetableData(null);
    }
  };

  // Generate PDF of the timetable
  const generatePDF = () => {
    if (!timetableData || !selectedClass || !selectedSection) return;

    const selectedClassObj = classes.find((c) => c.id === selectedClass);
    const selectedSectionObj = sections.find((s) => s.id === selectedSection);

    if (!selectedClassObj || !selectedSectionObj) return;

    // Create new jsPDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(
      `${selectedClassObj.name} - Section ${selectedSectionObj.name} Timetable`,
      14,
      22
    );

    // Get weekdays from the timetable data
    const weekdays = Object.keys(timetableData);

    // Function to format time
    const formatTime = (time: string) => {
      return time.substring(0, 5);
    };

    // Process each day
    let yPos = 30;
    weekdays.forEach((day) => {
      // Add day header
      doc.setFontSize(14);
      doc.text(day, 14, yPos);
      yPos += 10;

      // Sort periods by periodNumber
      const sortedPeriods = [...timetableData[day]].sort(
        (a, b) => a.periodNumber - b.periodNumber
      );

      // Prepare table data
      const tableData = sortedPeriods.map((period) => [
        period.periodNumber.toString(),
        `${formatTime(period.startTime)} - ${formatTime(period.endTime)}`,
        period.subject.name,
        `${period.teacher.firstName} ${period.teacher.lastName}`,
      ]);

      // Add table
      (doc as any).autoTable({
        startY: yPos,
        head: [["Period", "Time", "Subject", "Teacher"]],
        body: tableData,
        margin: { top: 10, bottom: 10 },
        styles: { overflow: "linebreak" },
        headStyles: { fillColor: [75, 75, 75] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Add a new page if needed
      if (yPos > 250 && day !== weekdays[weekdays.length - 1]) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Save the PDF
    doc.save(
      `${selectedClassObj.name}_Section_${selectedSectionObj.name}_Timetable.pdf`
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timetable Generator
        </Typography>

        <Grid container spacing={3}>
          {/* Class Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
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
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Section Selection */}
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              disabled={!selectedClass || sections.length === 0}
            >
              <InputLabel id="section-select-label">Section</InputLabel>
              <Select
                labelId="section-select-label"
                id="section-select"
                value={selectedSection.toString()}
                label="Section"
                onChange={handleSectionChange}
              >
                <MenuItem value="">
                  <em>Select a section</em>
                </MenuItem>
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.id.toString()}>
                    {section.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading && (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography>Loading...</Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {timetableData && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button variant="contained" color="primary" onClick={generatePDF}>
                Download PDF
              </Button>
            </Box>

            <TimetableView timetableData={timetableData} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TimetableGenerator;
