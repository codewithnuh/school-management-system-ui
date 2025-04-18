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
) => {
  const response = await axiosInstance.get<WeeklyTimetableResponse>(
    `/timetables/weekly/${classId}/${sectionId}`
  );
  return response.data;
};

// /weekly/:classId/:sectionId
export const fetchTimeTableOfATeacher = async (teacherId: number) => {
  const response = await axiosInstance.get(`/timetables/teacher/${teacherId}`);
  return response.data;
};
