// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface User {
  data: {
    role: "ADMIN" | "TEACHER" | "PARENT" | "USER";
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      subjectId: number;
      schoolId?: number;
      classId?: number;
      sectionId?: number;
    };
  };

  // ...other user properties
}

// Fix for environment variables in production
// Use a fallback if environment variable is not defined
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api/"
    : "https://your-production-api-url.com/api/");

const API = `${API_BASE_URL}auth/session`;
const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await axios.get(API, {
      withCredentials: true,
    });

    // Validate response data structure
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format from auth/session endpoint");
    }

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user");
  }
};

export const useUser = () => {
  return useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Do not retry on error (e.g., unauthenticated)
    // Return empty data instead of error state to avoid cascading errors
    // useErrorBoundary: false,
  });
};
