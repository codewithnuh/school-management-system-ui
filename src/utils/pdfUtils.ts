import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { TDocumentDefinitions } from "pdfmake/interfaces";

// Types
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
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: Subject;
  teacher: Teacher;
}

interface TimetableData {
  [day: string]: Period[];
}

/**
 * Generates a PDF document for a timetable
 * @param timetableData - The timetable data organized by days
 * @param className - The name of the class
 * @param sectionName - The name of the section
 * @returns void - Triggers PDF download
 */
export const generateTimetablePDF = (
  timetableData: TimetableData,
  className: string,
  sectionName: string
): void => {
  // Create new jsPDF instance
  const doc = new jsPDF();

  // Format document title
  const title = `${className} - Section ${sectionName} Timetable`;
  doc.setFontSize(16);
  doc.text(title, 14, 22);

  // Get weekdays from the timetable data
  const weekdays = Object.keys(timetableData);

  // Helper function to format time (remove seconds)
  const formatTime = (time: string): string => {
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

  // Add school information in footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("School Management System", 14, 280);
    doc.text(`Page ${i} of ${pageCount}`, 170, 280);
  }

  // Save the PDF
  doc.save(`${className}_Section_${sectionName}_Timetable.pdf`);
};

/**
 * Formats timetable data for display
 * @param timetableData - Raw timetable data
 * @returns Formatted timetable data
 */
export const formatTimetableData = (rawData: any): TimetableData => {
  const formattedData: TimetableData = {};

  if (!rawData) return formattedData;

  // Extract days from the data
  Object.keys(rawData).forEach((day) => {
    // Sort periods by periodNumber
    formattedData[day] = [...rawData[day]].sort(
      (a, b) => a.periodNumber - b.periodNumber
    );
  });

  return formattedData;
};

export default {
  generateTimetablePDF,
  formatTimetableData,
};
