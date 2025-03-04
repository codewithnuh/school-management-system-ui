// src/hooks/useSession.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Role } from "../utils/roles";

interface SessionData {
  data: {
    user: {
      id: string;
      name: string;
    };
    role: Role;
    isAuthenticated: boolean;
  };
}

const fetchSession = async (): Promise<SessionData> => {
  const response = await axios.get(
    "http://localhost:3000/api/v1/auth/session",
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  ); // Replace with your API endpoint

  return response.data;
};

export const useSession = () => {
  return useQuery<SessionData, Error>({
    queryKey: ["session"],
    queryFn: fetchSession,
    retry: false, // Don't retry if session verification fails
    staleTime: 1000 * 60 * 5, // Cache session for 5 minutes
  });
};
