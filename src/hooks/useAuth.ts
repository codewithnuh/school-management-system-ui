// src/hooks/useAuthCheck.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { checkSession, EntityType } from "../services/auth";

interface SessionResponse {
  isAuthenticated: boolean;
  user: any | null; // Be more specific if you have a User type
  role: EntityType | null;
}

interface UseAuthCheckResult {
  data: SessionResponse | undefined; // Return data directly
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
}

export const useAuthCheck = (): UseAuthCheckResult => {
  console.log("useAuthCheck - Hook started execution (Simplified)");

  const queryResult: UseQueryResult<SessionResponse, Error> = useQuery<
    SessionResponse,
    Error
  >({
    queryKey: ["session"],
    queryFn: checkSession,
    retry: false,
    staleTime: 60 * 1000,
    onSuccess: (data: SessionResponse) => {
      console.log("useAuthCheck - onSuccess Data (Simplified):", data);
    },
    onError: (error: Error) => {
      console.error("useAuthCheck - onError Error (Simplified):", error);
    },
  });

  console.log("useAuthCheck - useQuery Hook Result (Simplified):", queryResult); // Log queryResult

  return {
    data: queryResult.data, // Return the data object directly
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};
