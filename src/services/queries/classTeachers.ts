import { axiosInstance } from "../../api";
import { ApiResponse, Subject } from "./subject";

/**
 * Fetches all subjects from the API
 * @returns Promise with the subjects data
 */
export const fetchVerifiedTeachers = async (): Promise<Subject[]> => {
  const response = await axiosInstance.get<ApiResponse<Subject[]>>("teachers");

  return response.data.data;
};
