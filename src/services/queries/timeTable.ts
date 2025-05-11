import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchTimeTableOfATeacher,
  fetchTimeTableOfSections,
  generateTimeTableOfAClass,
} from "../../api/axios/timeTables";
import {
  WeeklyTimetableData, // Assuming this is the type for the array inside response.data
} from "../../api/types/timetables";

export const useGenerateTimetableOfAClass = () => {
  return useMutation({
    mutationFn: (classId: number) => generateTimeTableOfAClass(classId),
  });
};

// Assuming WeeklyTimetableResponse["data"] is actually TimetablePeriod[] based on Bruno output
// If you have a specific type like TimetablePeriod[], use it.
// Let's assume WeeklyTimetableData represents the array TimetablePeriod[] for clarity
export const useFetchTimeTables = (classId: number, sectionId: number) => {
  // Use the correct type for the data array
  return useQuery<WeeklyTimetableData, Error>({
    queryKey: ["timeTable", classId, sectionId], // Include sectionId in the queryKey
    queryFn: async () => {
      const response = await fetchTimeTableOfSections(classId, sectionId);
      // Transform WeeklyTimetableResponse to WeeklyTimetableData
      return response;
    },
  });
};

export const useFetchTeacherTimeTable = (teacherId: number) => {
  return useQuery({
    queryKey: ["teacherTimeTable", teacherId],
    queryFn: () => fetchTimeTableOfATeacher(teacherId),
  });
};
