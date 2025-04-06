import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { generateTimeTableOfAClass } from "../../api/axios/timeTables";
import { TimetableGenerationResponse } from "../../api/types/timetables";

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
