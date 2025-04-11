import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../api/axios/auth";

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
