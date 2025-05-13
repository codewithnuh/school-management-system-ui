import { useQuery } from "@tanstack/react-query";
import { getTeacherRegistrationLinkById } from "../../api/axios/registrationLinks";

export const useGetTeacherRegistrationLinkById = (id: string) => {
  return useQuery({
    queryKey: ["registrationLink", id], // 👈 Include ID in queryKey
    queryFn: () => getTeacherRegistrationLinkById(id),
    enabled: !!id, // Only fetch if id exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
