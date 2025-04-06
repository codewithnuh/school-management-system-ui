import React from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

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

export interface TimetableData {
  [day: string]: Period[];
}

interface TimetableViewProps {
  timetableData: TimetableData;
}

const TimetableView: React.FC<TimetableViewProps> = ({ timetableData }) => {
  // Get all days in the timetable
  const days = Object.keys(timetableData);

  // Function to format time (remove seconds and ensure consistent format)
  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  // Sort periods by periodNumber for each day
  const sortedTimetable: TimetableData = {};
  Object.keys(timetableData).forEach((day) => {
    sortedTimetable[day] = [...timetableData[day]].sort(
      (a, b) => a.periodNumber - b.periodNumber
    );
  });

  return (
    <Box>
      {days.map((day) => (
        <Card key={day} variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {day}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "black" }}>
                    <TableCell width="10%">
                      <strong>Period</strong>
                    </TableCell>
                    <TableCell width="20%">
                      <strong>Time</strong>
                    </TableCell>
                    <TableCell width="35%">
                      <strong>Subject</strong>
                    </TableCell>
                    <TableCell width="35%">
                      <strong>Teacher</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTimetable[day].map((period) => (
                    <TableRow key={period.id} hover>
                      <TableCell>{period.periodNumber}</TableCell>
                      <TableCell>{`${formatTime(
                        period.startTime
                      )} - ${formatTime(period.endTime)}`}</TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {period.subject.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {period.subject.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{`${period.teacher.firstName} ${period.teacher.lastName}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default TimetableView;
