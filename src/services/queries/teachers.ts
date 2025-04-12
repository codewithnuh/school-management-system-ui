import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSingleTeacher } from "../../api/axios/teachers";
import { Teacher } from "../../types/teacher";
/**
 * Hook for fetching a single teacher
 * @param id The ID of the teacher to fetch
 * @returns A strongly-typed query result with the teacher data and status
 */
export const useTeachers = (id: number): UseQueryResult<Teacher, Error> => {
  return useQuery<Teacher, Error>({
    queryKey: ["teacher", id],
    queryFn: () => fetchSingleTeacher(id),
  });
};
