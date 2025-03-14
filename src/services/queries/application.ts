import { useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptTeacherApplication,
  getTeacherApplications,
} from "../../api/index";
import { ApplicationResponse } from "../../types";
import { queryClient } from "../../utils/queryClient";

export const useApplications = () => {
  return useQuery<ApplicationResponse>({
    queryKey: ["teacherApplications"],
    queryFn: getTeacherApplications,
  });
};
export const useAcceptTeacherApplication = () => {
  return useMutation<ApplicationResponse, Error, number>({
    mutationFn: (id: number) => acceptTeacherApplication(id),
    onSuccess: () => {
      // Invalidate queries that might be affected by this change
      queryClient.invalidateQueries({ queryKey: ["teacherApplications"] });
    },
  });
};
