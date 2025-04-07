import { axiosInstance } from "..";
import {
  TimetableGenerationResponse,
  WeeklyTimetableResponse,
} from "../types/timetables";

export const generateTimeTableOfAClass = async (
  classId: number
): Promise<TimetableGenerationResponse["data"]> => {
  const response = await axiosInstance.post<TimetableGenerationResponse>(
    `/timetables/generate/${classId}`
  );
  return response.data.data;
};
export const fetchTimeTableOfSections = async (
  classId: number,
  sectionId: number
): Promise<WeeklyTimetableResponse["data"]> => {
  const response = await axiosInstance.get<WeeklyTimetableResponse>(
    `/timetables/weekly/${classId}/${sectionId}`
  );
  return response.data.data;
};

// /weekly/:classId/:sectionId
