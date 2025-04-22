import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStudentById, updateStudentById } from "../../api/axios/user";
import { User } from "../../types/index.ts";
import { queryClient } from "../../utils/queryClient.ts";

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
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries(["student", variables.id]);
      queryClient.invalidateQueries(["students"]);

      // If section assignment is part of the update, invalidate section-related queries
      if (variables.data.sectionId !== undefined) {
        queryClient.invalidateQueries(["sections"]);
      }
    },
  });
};
