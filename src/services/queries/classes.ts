import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchClasses,
  fetchClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../../api/classes";
import { Class, CreateClassFormValues } from "../../types/class";

/**
 * Hook for fetching all classes
 */
export const useClasses = () => {
  return useQuery<Class[], Error>({
    queryKey: ["classes"],
    queryFn: fetchClasses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook for fetching a single class
 */
export const useClass = (id: number) => {
  return useQuery<Class, Error>({
    queryKey: ["classes", id],
    queryFn: () => fetchClassById(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for creating a new class
 */
export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newClass: CreateClassFormValues) => createClass(newClass),
    onSuccess: (data) => {
      // Invalidate and refetch classes queries after successful creation
      queryClient.invalidateQueries({ queryKey: ["classes"] });

      // Optionally add the new class to the cache directly
      queryClient.setQueryData(["classes", data.id], data);

      return data;
    },
  });
};

/**
 * Hook for updating a class
 */
export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateClassFormValues>;
    }) => updateClass({ id, data }),
    onSuccess: (updatedClass) => {
      // Update the cache with the updated class
      queryClient.setQueryData(["classes", updatedClass.id], updatedClass);

      // Invalidate the classes list query to refetch it
      queryClient.invalidateQueries({ queryKey: ["classes"] });

      return updatedClass;
    },
  });
};

/**
 * Hook for deleting a class
 */
export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteClass(id),
    onSuccess: (_, id) => {
      // Remove the deleted class from the cache
      queryClient.removeQueries({ queryKey: ["classes", id] });

      // Invalidate and refetch the classes list
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
