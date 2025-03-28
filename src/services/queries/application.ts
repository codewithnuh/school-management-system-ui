import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptTeacherApplication,
  getTeacherApplications,
  rejectTeacherApplication,
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
  const queryClient = useQueryClient();

  return useMutation<ApplicationResponse, Error, number>({
    mutationFn: (id: number) => acceptTeacherApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherApplications"] });
    },
    onError: (error) => {
      console.error("Error accepting teacher application:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    },
    onMutate: async (id) => {
      //optional: perform some actions before the mutation occurs.
    },
    onSettled: async (data, error, variables, context) => {
      //optional: perform some actions after the mutation occurs.
      if (error) {
        console.log({ errorInMutatiion: error });
      }
    },
  });
};
export const useRejectTeacherApplication = () => {
  return useMutation<ApplicationResponse, Error, number>({
    mutationFn: (id: number) => rejectTeacherApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherApplications"] });
    },
    onError: (error) => {
      console.error("Error rejecting teacher application:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    },
    onMutate: async (id) => {
      //optional: perform some actions before the mutation occurs.
    },
    onSettled: async (data, error, variables, context) => {
      //optional: perform some actions after the mutation occurs.
      if (error) {
        console.log({ errorInMutatiion: error });
      }
    },
  });
};
