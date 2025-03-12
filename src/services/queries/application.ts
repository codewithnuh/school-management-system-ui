import { useQuery } from "@tanstack/react-query";
import { getTeacherApplications } from "../../api/index";
import { ApplicationResponse } from "../../types";

export const useApplications = () => {
  return useQuery<ApplicationResponse>({
    queryKey: ["teacherApplications"],
    queryFn: getTeacherApplications,
  });
};
