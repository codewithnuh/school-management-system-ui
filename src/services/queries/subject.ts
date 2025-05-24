import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { SubjectCreationInputs } from "../../schema/subject.schema";
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
const fetchSubjects = async (schoolId: number): Promise<Subject[]> => {
  const response = await axiosInstance.get<ApiResponse<Subject[]>>(
    `subjects?${schoolId}`
  );

  return response.data.data;
};

/**
 * Custom hook to fetch and manage subjects data
 * @returns Query result with subjects data and status
 */
export const useSubjects = (schoolId: number) => {
  return useQuery<Subject[], Error>({
    queryKey: ["subjects"],
    queryFn: () => fetchSubjects(schoolId),
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
    `/subjects/${id}`
  );
  return response.data.data;
};
const deleteSubjectById = async (
  id: number,
  schoolId: number
): Promise<Subject> => {
  const response = await axiosInstance.delete(
    `subjects?id=${id}&schoolId=${schoolId}`
  );
  return response.data.data;
};
const createSubject = async (data: SubjectCreationInputs) => {
  const response = await axiosInstance.post("subjects", data);
  return response.data.data;
};
export const useCreateSubject = () => {
  return useMutation({
    mutationKey: ["subject"],
    mutationFn: (data: SubjectCreationInputs) => createSubject(data),
  });
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
export const useDeleteSubjectById = () => {
  return useMutation({
    mutationKey: ["Subject"],
    mutationFn: ({ id, schoolId }: { id: number; schoolId: number }) =>
      deleteSubjectById(id, schoolId),
  });
};
