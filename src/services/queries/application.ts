import { useQuery } from "@tanstack/react-query";
import { getTeacherApplications } from "../../api";

export const useApplications = () => {
  return useQuery({
    queryKey: ["teacherApplications"],
    queryFn: getTeacherApplications,
  });
};
