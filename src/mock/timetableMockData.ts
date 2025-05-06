// Mock data for TimetableView component

import { TimetablePeriod } from "../../api/types/timetables"; // Adjust path if needed

// Define interfaces if they are not globally available or imported
interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  // Add other relevant teacher fields if needed
}

interface Subject {
  id: number;
  name: string;
  // Add other relevant subject fields if needed
}

// Mock Timetable Data Structure (matching what useFetchTimeTables might return, often nested under a 'data' key)
export const mockTimetableApiResponse = {
  success: true,
  data: {
    id: 1, // Timetable ID
    classId: 101, // Example Class ID
    sectionId: 201, // Example Section ID
    teacherId: 301, // Example Class Teacher ID (if applicable)
    periodsPerDay: 8, // Example periods per day
    // Mock Timetable Entries (Periods)
    timetableEntries: [
      // Monday
      {
        id: 1001,
        dayOfWeek: "Monday",
        periodNumber: 1,
        startTime: "08:00",
        endTime: "08:45",
        subject: { id: 1, name: "Mathematics" },
        teacher: { id: 301, firstName: "Alice", lastName: "Smith" },
        class: { id: 101, name: "Grade 9" }, // Added class info
        section: { id: 201, name: "A" }, // Added section info
      },
      {
        id: 1002,
        dayOfWeek: "Monday",
        periodNumber: 2,
        startTime: "08:45",
        endTime: "09:30",
        subject: { id: 2, name: "Physics" },
        teacher: { id: 302, firstName: "Bob", lastName: "Johnson" },
        class: { id: 101, name: "Grade 9" },
        section: { id: 201, name: "A" },
      },
      {
        id: 1003,
        dayOfWeek: "Monday",
        periodNumber: 3,
        startTime: "09:30",
        endTime: "10:15",
        subject: { id: 3, name: "English" },
        teacher: { id: 303, firstName: "Charlie", lastName: "Brown" },
        class: { id: 101, name: "Grade 9" },
        section: { id: 201, name: "A" },
      },
      // Tuesday
      {
        id: 1004,
        dayOfWeek: "Tuesday",
        periodNumber: 1,
        startTime: "08:00",
        endTime: "08:45",
        subject: { id: 4, name: "Chemistry" },
        teacher: { id: 304, firstName: "David", lastName: "Lee" },
        class: { id: 101, name: "Grade 9" },
        section: { id: 201, name: "A" },
      },
      {
        id: 1005,
        dayOfWeek: "Tuesday",
        periodNumber: 2,
        startTime: "08:45",
        endTime: "09:30",
        subject: { id: 1, name: "Mathematics" },
        teacher: { id: 301, firstName: "Alice", lastName: "Smith" },
        class: { id: 101, name: "Grade 9" },
        section: { id: 201, name: "A" },
      },
      // Wednesday
      {
        id: 1006,
        dayOfWeek: "Wednesday",
        periodNumber: 1,
        startTime: "08:00",
        endTime: "08:45",
        subject: { id: 2, name: "Physics" },
        teacher: { id: 302, firstName: "Bob", lastName: "Johnson" },
        class: { id: 101, name: "Grade 9" },
        section: { id: 201, name: "A" },
      },
      {
        id: 1007,
        dayOfWeek: "Wednesday",
        periodNumber: 4, // Example of a later period
        startTime: "10:15",
        endTime: "11:00",
        subject: { id: 5, name: "History" },
        teacher: { id: 305, firstName: "Eve", lastName: "Davis" },
        class: { id: 101, name: "Grade 9" },
        section: { id: 201, name: "A" },
      },
      // ... add more entries for other days and periods as needed
    ] as TimetablePeriod[], // Cast to ensure type correctness
  },
  message: "Timetable fetched successfully",
  error: null,
  statusCode: 200,
  timestamp: new Date().toISOString(),
};

// You can then use `mockTimetableApiResponse` in your tests or storybook
// For example, if using React Query, you might mock the query result:
// queryClient.setQueryData(['timeTables', 101, 201], mockTimetableApiResponse);

console.log("Mock Timetable Data:", mockTimetableApiResponse);

// Export it if you want to use it in other files
// export default mockTimetableApiResponse;
// export { mockTimetableApiResponse };
