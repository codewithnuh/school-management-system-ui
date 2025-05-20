import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createSchool,
  getSchool,
  getSchoolByAdminID,
  getSchoolById,
  getSchoolsCount,
  SchoolFormData,
  SchoolResponse,
} from "../../api/axios/schools";
/**
 * Custom hook to fetch school by admin ID
 */
export const useGetSchoolAdminId = (
  adminId: number | undefined,
  enabled = false
) => {
  return useQuery({
    queryKey: ["school", "admin", adminId],
    queryFn: () => getSchoolByAdminID(adminId || 0),
    enabled: enabled && !!adminId,
  });
};
/**
 * Custom hook to create a new school
 */
export const useCreateSchool = () => {
  return useMutation({
    mutationFn: (formData: SchoolFormData) => createSchool(formData),
  });
};
/**
 * Custom hook to fetch school by school ID
 * @param schoolId - The school ID
 * @returns Query result with enhanced error handling
 */
export const useGetSchoolById = (schoolId: number | null | undefined) => {
  return useQuery<SchoolResponse, Error>({
    queryKey: ["school", "id", schoolId],
    queryFn: () => getSchoolById(schoolId as number),
    enabled: !!schoolId, // Only fetch if schoolId exists and is not empty
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Provide default data structure to prevent undefined errors
    placeholderData: { data: null },
  });
};
export const useGetSchoolsCount = () => {
  return useQuery({
    queryKey: ["school"],
    queryFn: () => getSchoolsCount(),
  });
};
