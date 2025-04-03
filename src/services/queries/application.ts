/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  acceptStudentApplication,
  acceptTeacherApplication,
  getTeacherApplications,
  rejectStudentApplication,
  rejectTeacherApplication,
} from "../../api/index";
import { ApplicationResponse, StudentApplicationResponse } from "../../types";

export const useApplications = (): UseQueryResult<
  ApplicationResponse,
  Error
> => {
  return useQuery<ApplicationResponse, Error>({
    queryKey: ["teacherApplications"],
    queryFn: getTeacherApplications,
  });
};

export const useAcceptTeacherApplication = (): UseMutationResult<
  ApplicationResponse,
  Error,
  number,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<ApplicationResponse, Error, number, unknown>({
    mutationFn: (id: number) => acceptTeacherApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherApplications"] });
    },
    onError: (error: Error): void => {
      console.error("Error accepting teacher application:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    },
    onMutate: async (id: number): Promise<void> => {
      // optional: perform some actions before the mutation occurs.
    },
    onSettled: async (
      data: ApplicationResponse | undefined,
      error: Error | null,
      variables: number,
      context: unknown
    ): Promise<void> => {
      // optional: perform some actions after the mutation occurs.
      if (error) {
        console.log({ errorInMutation: error });
      }
    },
  });
};

export const useRejectTeacherApplication = (): UseMutationResult<
  ApplicationResponse,
  Error,
  number,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<ApplicationResponse, Error, number, unknown>({
    mutationFn: (id: number) => rejectTeacherApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherApplications"] });
    },
    onError: (error: Error): void => {
      console.error("Error rejecting teacher application:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    },
    onMutate: async (id: number): Promise<void> => {
      // optional: perform some actions before the mutation occurs.
    },
    onSettled: async (
      data: ApplicationResponse | undefined,
      error: Error | null,
      variables: number,
      context: unknown
    ): Promise<void> => {
      // optional: perform some actions after the mutation occurs.
      if (error) {
        console.log({ errorInMutation: error });
      }
    },
  });
};

export const useAcceptStudentApplication = (): UseMutationResult<
  StudentApplicationResponse,
  Error,
  number,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<StudentApplicationResponse, Error, number, unknown>({
    mutationFn: (id: number) => acceptStudentApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentApplications"] });
    },
    onError: (error: Error): void => {
      console.error("Error accepting student application:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    },
    onMutate: async (id: number): Promise<void> => {
      // optional: perform some actions before the mutation occurs.
    },
    onSettled: async (
      data: StudentApplicationResponse | undefined,
      error: Error | null,
      variables: number,
      context: unknown
    ): Promise<void> => {
      // optional: perform some actions after the mutation occurs.
      if (error) {
        console.log({ errorInMutation: error });
      }
    },
  });
};

export const useRejectStudentApplication = (): UseMutationResult<
  StudentApplicationResponse,
  Error,
  number,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<StudentApplicationResponse, Error, number, unknown>({
    mutationFn: (id: number) => rejectStudentApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentApplications"] });
    },
    onError: (error: Error): void => {
      console.error("Error rejecting student application:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    },
    onMutate: async (id: number): Promise<void> => {
      // optional: perform some actions before the mutation occurs.
    },
    onSettled: async (
      _data: StudentApplicationResponse | undefined,
      error: Error | null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _variables: number,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _context: unknown
    ): Promise<void> => {
      // optional: perform some actions after the mutation occurs.
      if (error) {
        console.log({ errorInMutation: error });
      }
    },
  });
};
