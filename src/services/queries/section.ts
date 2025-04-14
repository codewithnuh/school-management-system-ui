import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Section } from "../../api/types/sections";
import {
  fetchSectionsByTeacherId,
  fetchSectionsOfAClass,
} from "../../api/axios/sections";

/**
 * Custom hook to fetch all sections of a specific class.
 *
 * @param classId - The ID of the class for which to fetch sections.
 * @returns An object containing the query result data, loading state, and error.
 */
export const useFetchAllSectionsOfAClass = (
  classId: number
): UseQueryResult<Section[], Error> => {
  return useQuery<Section[], Error>({
    queryKey: ["sections", classId], // Include classId in the query key for better caching and invalidation
    queryFn: async () => {
      const response = await fetchSectionsOfAClass(classId);
      return response;
    },
    enabled: !!classId, // Only fetch if classId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    retry: 2, // Retry the request up to 2 times if it fails
  });
};

export const useFetchAllSectionsByTeacherId = (
  teacherId: number,
  classId: number
) => {
  useQuery({
    queryKey: ["teacherSections"],
    queryFn: async () => {
      await fetchSectionsByTeacherId(teacherId, classId);
    },
  });
};
