import { axiosInstance } from "..";
import { SectionsApiResponse } from "../types/sections";

export const fetchSectionsOfAClass = async (classId: number) => {
  const response = await axiosInstance.get<SectionsApiResponse>(
    `/sections/class/${classId}`
  );
  return response.data;
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
