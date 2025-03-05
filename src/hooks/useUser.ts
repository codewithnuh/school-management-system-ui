// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface User {
  id: string;
  role: "ADMIN" | "TEACHER" | "PARENT" | "STUDENT";
  // ...other user properties
}

const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/auth/session",
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user");
  }
};

export const useUser = () => {
  return useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    // Optionally configure caching/stale times as needed,
    staleTime: 1000 * 60 * 5, // 5 minutes,
    retry: false, // Do not retry on error (e.g., unauthenticated),
  });
};
