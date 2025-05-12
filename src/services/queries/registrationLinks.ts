import { useQuery } from "@tanstack/react-query";
import { getTeacherRegistrationLinkById } from "../../api/axios/registrationLinks";

export const useGetRegistrationLinkById = (id: string) => {
  return useQuery({
    queryKey: ["registrationLink"],
    queryFn: () => getTeacherRegistrationLinkById(id),
  });
};
