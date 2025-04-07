import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchTimeTableOfSections,
  generateTimeTableOfAClass,
} from "../../api/axios/timeTables";
import {
  TimetableGenerationResponse,
  WeeklyTimetableResponse,
} from "../../api/types/timetables";

export const useGenerateTimeTable = (
  classId: number
): UseQueryResult<TimetableGenerationResponse["data"], Error> => {
  return useQuery<TimetableGenerationResponse["data"], Error>({
    queryKey: ["timeTable", classId],
    queryFn: async () => {
      const response = await generateTimeTableOfAClass(classId);
      return response;
    },
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
export const useFetchTimeTables = (
  classId: number,
  sectionId: number
): UseQueryResult<WeeklyTimetableResponse["data"], Error> => {
  return useQuery<WeeklyTimetableResponse["data"], Error>({
    queryKey: ["timeTable", classId],
    queryFn: async () => {
      const response = await fetchTimeTableOfSections(classId, sectionId);
      return response;
    },
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
