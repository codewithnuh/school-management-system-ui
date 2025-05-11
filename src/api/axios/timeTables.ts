import { axiosInstance } from "..";
import {
  TimetableGenerationResponse,
  WeeklyTimetableResponse,
} from "../types/timetables";

export const generateTimeTableOfAClass = async (
  classId: number
) => {
  const response = await axiosInstance.post(
    `timetables/generate/${classId}`
  );
  return response.data;
};

export const fetchTimeTableOfSections = async (
  classId: number,
  sectionId: number
): Promise<WeeklyTimetableResponse> => {
  // Ensure we're using valid IDs
  if (!classId || !sectionId || isNaN(classId) || isNaN(sectionId)) {
    throw new Error("Valid class ID and section ID are required");
  }

  // Add leading slash to URL path to ensure proper routing
  const response = await axiosInstance.get<WeeklyTimetableResponse>(
    `timetables/weekly/${classId}/${sectionId}`
  );
  return response.data;
};

// /weekly/:classId/:sectionId
export const fetchTimeTableOfATeacher = async (teacherId: number) => {
  const response = await axiosInstance.get(`timetables/teacher/${teacherId}`);
  return response.data;
};
