import { axiosInstance } from "..";
import { SectionsApiResponse } from "../types/sections";

export const fetchSectionsOfAClass = async (
  classId: number
): Promise<SectionsApiResponse["data"]> => {
  const response = await axiosInstance.get<SectionsApiResponse>(
    `/class/${classId}`
  );
  return response.data.data;
};
