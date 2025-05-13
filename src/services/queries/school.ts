import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createSchool,
  getSchool,
  getSchoolByAdminID,
  SchoolFormData,
} from "../../api/axios/schools";
export const useGetSchoolAdminId = (adminId: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["school"],
    queryFn: () => getSchoolByAdminID(adminId),
    enabled: enabled,
  });
};
export const useCreateSchool = () => {
  return useMutation({
    mutationFn: (formData: SchoolFormData) => createSchool(formData),
  });
};
export const useGetSchoolById = (schoolId: string) => {
  return useQuery({
    queryKey: ["school", schoolId], // 👈 Include schoolId
    queryFn: () => getSchool(schoolId),
    enabled: !!schoolId, // Only fetch if schoolId exists
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
