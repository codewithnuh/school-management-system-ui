import { axiosInstance } from "..";
import { SectionsApiResponse } from "../types/sections";

export const fetchSectionsOfAClass = async (
  classId: number
): Promise<SectionsApiResponse["data"]> => {
  const response = await axiosInstance.get<SectionsApiResponse>(
    `/classes/${classId}`
  );
  return response.data.data;
};

export const fetchSectionsByTeacherId = async (
  teacherId: number,
  classId: number
) => {
  const response = await axiosInstance.get(
    `/sections/teacher/section/${teacherId}/${classId}`
  );
  return response.data;
};
