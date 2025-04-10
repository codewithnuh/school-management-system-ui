import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { registerTeacher } from "../../api/axios/registerTeachers";
import { TeacherFormData } from "../../api/axios/registerTeachers";
import { queryClient } from "../../utils/queryClient";
/**
 * Hook for registering a new teacher using TanStack Query
 * @returns Mutation result object with mutate function and status indicators
 */
export const useRegisterTeacher = (): UseMutationResult<
  TeacherFormData,
  Error,
  TeacherFormData
> => {
  return useMutation({
    mutationFn: (formData: TeacherFormData) => registerTeacher(formData),
    onSuccess: () => {
      // Invalidate relevant queries to refetch data that might be affected
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error) => {
      // Error is already handled in the registerTeacher function
      // You can add additional error handling here if needed
      console.error("Teacher registration failed:", error);
    },
  });
};
