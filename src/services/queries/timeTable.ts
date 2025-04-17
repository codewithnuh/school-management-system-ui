import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchTimeTableOfATeacher,
  fetchTimeTableOfSections,
  generateTimeTableOfAClass,
} from "../../api/axios/timeTables";
import {
  TimetableGenerationResponse,
  WeeklyTimetableResponse,
  WeeklyTimetableData, // Assuming this is the type for the array inside response.data
} from "../../api/types/timetables";

export const useGenerateTimeTable = (
  classId: number | "" // Allow empty string for initial state
): UseQueryResult<TimetableGenerationResponse["data"], Error> => {
  return useQuery<TimetableGenerationResponse["data"], Error>({
    queryKey: ["generateTimeTable", classId], // Use a distinct key
    queryFn: async () => {
      if (!classId) {
        throw new Error("Class ID is required to generate timetable.");
      }
      const response = await generateTimeTableOfAClass(classId);
      return response;
    },
    enabled: !!classId, // Correct: Generation depends only on classId
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Assuming WeeklyTimetableResponse["data"] is actually TimetablePeriod[] based on Bruno output
// If you have a specific type like TimetablePeriod[], use it.
// Let's assume WeeklyTimetableData represents the array TimetablePeriod[] for clarity
export const useFetchTimeTables = (
  classId: number | "",
  sectionId: number | ""
): UseQueryResult<WeeklyTimetableData, Error> => {
  // Use the correct type for the data array
  return useQuery<WeeklyTimetableData, Error>({
    queryKey: ["timeTable", classId, sectionId], // Include sectionId in the queryKey
    queryFn: async () => {
      // Ensure IDs are numbers before fetching
      if (typeof classId !== "number" || typeof sectionId !== "number") {
        throw new Error("Both Class ID and Section ID must be selected.");
        // Or return Promise.resolve([]); // Return empty array if preferred over throwing error
      }
      const response = await fetchTimeTableOfSections(classId, sectionId);
      return response; // Return the data array directly
    },
    // Fetch only when both classId and sectionId are valid numbers
    enabled:
      typeof classId === "number" &&
      typeof sectionId === "number" &&
      classId > 0 &&
      sectionId > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useFetchTeacherTimeTable = (teacherId: number) => {
  return useQuery({
    queryKey: ["teacherTimeTable", teacherId],
    queryFn: () => fetchTimeTableOfATeacher(teacherId),
  });
};
