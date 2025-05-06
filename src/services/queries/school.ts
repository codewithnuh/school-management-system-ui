import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createSchool,
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
