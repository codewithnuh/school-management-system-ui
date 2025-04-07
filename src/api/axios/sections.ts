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
