import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import {
  login,
  logout,
  sendOtp,
  signUp,
  SignUpFormData,
  verifyOtp,
} from "../../api/axios/auth";
import { EntityType } from "../../types";

/**
 * Hook for handling user logout with TanStack Query
 * @returns Mutation object for logout functionality
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Invalidate and refetch any queries that might be affected by logout
      // For example, user data or authentication state
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Optionally clear the entire cache when user logs out
      // queryClient.clear();
    },
  });
};

/**
 * Custom hook for initiating password reset flow by sending OTP
 * @returns React Query mutation result for the password reset initiation
 */
export const useForgotPasswordInitiate = (): UseMutationResult<
  unknown,
  Error,
  { email: string; entityType: EntityType },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, entityType }) => sendOtp(email, entityType),
    onSuccess: (data) => {
      // Invalidate and refetch OTP-related queries after successful sending
      queryClient.invalidateQueries({ queryKey: ["sendOtp"] });
      return data;
    },
  });
};

/**
 * Custom hook for handling password reset functionality
 * @returns A mutation object for resetting password with OTP verification
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (params: { otp: string; newPassword: string }) =>
      verifyOtp(params.otp, params.newPassword),
  });
};

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignUpFormData) => signUp(data),
  });
};
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      entityType: string;
      password: string;
    }) => login(data),
  });
};
