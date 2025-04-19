/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptStudentApplication,
  getStudentApplications,
  rejectStudentApplication,
} from "../../api/index";
import { StudentApplicationResponse } from "../../types";
import { queryClient } from "../../utils/queryClient";

export const useStudentApplications = () => {
  return useQuery({
    queryKey: ["studentApplications"],
    queryFn: getStudentApplications,
  });
};

export const useAcceptStudentApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<StudentApplicationResponse, Error, number>({
    mutationFn: (id: number) => acceptStudentApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentApplications"] });
    },
    onError: (error) => {
      console.error("Error accepting student application:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    },
    onMutate: async (id) => {
      // optional: perform some actions before the mutation occurs.
    },
    onSettled: async (data, error, variables, context) => {
      // optional: perform some actions after the mutation occurs.
      if (error) {
        console.log({ errorInMutation: error });
      }
    },
  });
};

export const useRejectStudentApplication = () => {
  return useMutation<StudentApplicationResponse, Error, number>({
    mutationFn: (id: number) => rejectStudentApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentApplications"] });
    },
    onError: (error) => {
      console.error("Error rejecting student application:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    },
    onMutate: async (id) => {
      // optional: perform some actions before the mutation occurs.
    },
    onSettled: async (data, error, variables, context) => {
      // optional: perform some actions after the mutation occurs.
      if (error) {
        console.log({ errorInMutation: error });
      }
    },
  });
};
