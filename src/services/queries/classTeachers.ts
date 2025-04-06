import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { ApiResponse } from "./subject";
/**
 * Teacher interface defining the structure of teacher data
 */
export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  subjectId: number;
  // Add other properties as needed
}

/**
 * Response structure from the teachers API
 */
export interface TeachersResponse {
  teachers: Teacher[];
  total: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Fetches all verified teachers from the API
 * @returns Promise with the teachers response data
 */
export const fetchVerifiedTeachers = async (): Promise<TeachersResponse> => {
  const response = await axiosInstance.get<ApiResponse<TeachersResponse>>(
    "teachers"
  );

  return response.data.data;
};

/**
 * Custom hook to fetch and manage teachers data
 * @returns Query result with teachers response data and status
 */
export const useTeachers = () => {
  return useQuery<TeachersResponse, Error>({
    queryKey: ["classTeachers"],
    queryFn: fetchVerifiedTeachers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
