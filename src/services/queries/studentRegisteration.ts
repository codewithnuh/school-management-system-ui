import { useMutation } from "@tanstack/react-query";
import { registerStudent } from "../../api/axios/registerStudent";
import { UserFormData } from "../../components/forms/UserRegistrationForm";
import { queryClient } from "../../utils/queryClient";

export const useStudentRegisteration = () => {
  return useMutation({
    mutationFn: (formData: UserFormData) => registerStudent(formData),
    onSuccess: () => {
      // Invalidate and refetch classes queries after successful creation
      queryClient.invalidateQueries({ queryKey: ["studentRegistration"] });
    },
    onError: (error) => {
      console.error("Error accepting student registration:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    },
  });
};
