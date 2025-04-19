import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchStudentById, updateStudentById } from "../../api/axios/user";
import { User } from "../../types/index.ts";

export const useFetchStudentById = (id: number) => {
  return useQuery({
    queryKey: ["student", id], // Add query key for proper caching
    queryFn: () => fetchStudentById(id), // Use the fetchStudentById function from the API:fetchStudentById(id)
  });
};

export const useUpdateStudentById = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: User }) => {
      const response = await updateStudentById(id, data);
      return response.data;
    },
  });
};
