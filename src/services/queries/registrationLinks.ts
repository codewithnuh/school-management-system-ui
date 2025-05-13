import { useQuery } from "@tanstack/react-query";
import { getTeacherRegistrationLinkById } from "../../api/axios/registrationLinks";

/**
 * Custom hook to fetch teacher registration link by id
 * @param id - The registration link ID
 * @returns Query result with enhanced error handling and default data
 */
export const useGetTeacherRegistrationLinkById = (id: string | null) => {
  return useQuery({
    queryKey: ["registrationLink", id],
    queryFn: () => getTeacherRegistrationLinkById(id || ''),
    enabled: !!id && id.length > 0, // Only fetch if id exists and is not empty
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3, // Increased retries for better reliability
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    // Provide default empty data structure to prevent undefined errors
    placeholderData: { data: { schoolId: null } },
  });
};
