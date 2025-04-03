import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api";

// Define the Subject type based on the API response
export interface Subject {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Define the API response structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
  message: string;
  statusCode: number;
  timestamp: string;
}

/**
 * Fetches all subjects from the API
 * @returns Promise with the subjects data
 */
const fetchSubjects = async (): Promise<Subject[]> => {
  const response = await axiosInstance.get<ApiResponse<Subject[]>>(
    "/api/v1/subjects/"
  );

  return response.data.data;
};

/**
 * Custom hook to fetch and manage subjects data
 * @returns Query result with subjects data and status
 */
export const useSubjects = () => {
  return useQuery<Subject[], Error>({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Fetches a single subject by ID
 * @param id - The subject ID to fetch
 * @returns Promise with the subject data
 */
const fetchSubjectById = async (id: number): Promise<Subject> => {
  const response = await axiosInstance.get<ApiResponse<Subject>>(
    `/api/v1/subjects/${id}`
  );
  return response.data.data;
};

/**
 * Custom hook to fetch and manage a single subject's data
 * @param id - The subject ID to fetch
 * @returns Query result with subject data and status
 */
export const useSubject = (id: number) => {
  return useQuery<Subject, Error>({
    queryKey: ["subject", id],
    queryFn: () => fetchSubjectById(id),
    enabled: !!id, // Only run the query if an ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
