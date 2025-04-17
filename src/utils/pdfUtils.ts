import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  TDocumentDefinitions,
  ContentTable,
  Content,
} from "pdfmake/interfaces";

// Initialize pdfMake
pdfMake.vfs = pdfFonts.vfs;

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
 * Helper function to format time (remove seconds)
 */
const formatTime = (time: string): string => {
  return time.substring(0, 5);
};

/**
 * Generate a PDF document from the provided definition and download it
 * @param docDefinition The PDF document definition
 * @param filename The file name for the downloaded PDF
 */
export const generatePDF = (
  docDefinition: TDocumentDefinitions,
  filename: string
): void => {
  // Create the PDF document
  const pdfDoc = pdfMake.createPdf(docDefinition);

  // Download the PDF
  pdfDoc.download(filename);
};

/**
 * Open the PDF in a new browser tab
 * @param docDefinition The PDF document definition
 */
export const openPDF = (docDefinition: TDocumentDefinitions): void => {
  const pdfDoc = pdfMake.createPdf(docDefinition);
  pdfDoc.open();
};

/**
 * Generates a PDF document for a timetable
 * @param timetableData - The timetable data organized by days
 * @param className - The name of the class
 * @param sectionName - The name of the section
 * @param download - Whether to download the PDF (true) or open in new tab (false)
 * @returns void - Triggers PDF download or opens in new tab
 */
export const generateTimetablePDF = (
  timetableData: TimetableData,
  className: string,
  sectionName: string,
  download: boolean = true
): void => {
  // Get weekdays from the timetable data
  const weekdays = Object.keys(timetableData);

  // Create document definition
  const docDefinition: TDocumentDefinitions = {
    content: [
      // Title
      {
        text: `${className} - Section ${sectionName} Timetable`,
        style: "header",
        margin: [0, 0, 0, 10],
      } as Content,

      // Days and tables
      ...weekdays.flatMap((day, index) => {
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

        // Create day section with table
        return [
          {
            text: day,
            style: "dayHeader",
            margin: [0, index > 0 ? 20 : 0, 0, 5],
          } as Content,
          {
            table: {
              headerRows: 1,
              widths: ["auto", "auto", "*", "auto"],
              body: [
                [
                  { text: "Period", style: "tableHeader" },
                  { text: "Time", style: "tableHeader" },
                  { text: "Subject", style: "tableHeader" },
                  { text: "Teacher", style: "tableHeader" },
                ],
                ...tableData,
              ],
            },
            layout: {
              fillColor: (rowIndex: number): string | null =>
                rowIndex % 2 === 0 ? "#f8f8f8" : null,
            },
          } as ContentTable,
        ] as Content[];
      }),
    ],
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          {
            text: "School Management System",
            margin: [40, 0],
            style: "footer",
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "right",
            margin: [0, 0, 40, 0],
            style: "footer",
          },
        ],
      };
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
      },
      dayHeader: {
        fontSize: 14,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fillColor: "#4b4b4b",
        color: "white",
      },
      footer: {
        fontSize: 9,
        color: "#666666",
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  // Generate the filename
  const filename = `${className}_Section_${sectionName}_Timetable.pdf`;

  // Download or open the PDF
  if (download) {
    generatePDF(docDefinition, filename);
  } else {
    openPDF(docDefinition);
  }
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
  generatePDF,
  openPDF,
};
