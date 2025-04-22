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
export const useFetchAllSectionsOfAClass = (classId: number) => {
  return useQuery({
    queryKey: ["sections", classId],
    queryFn: () => fetchSectionsOfAClass(classId),
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
