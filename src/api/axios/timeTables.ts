import { axiosInstance } from "..";
import { TimetableGenerationResponse } from "../types/timetables";

export const generateTimeTableOfAClass = async (
  classId: number
): Promise<TimetableGenerationResponse["data"]> => {
  const response = await axiosInstance.post<TimetableGenerationResponse>(
    `/timetables/generate/${classId}`
  );
  return response.data.data;
};
