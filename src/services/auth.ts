// src/services/auth.ts
export type EntityType = "ADMIN" | "PARENT" | "STUDENT" | "TEACHER";

export const checkSession = async (): Promise<{
  isAuthenticated: boolean;
  user: any;
  role: EntityType | null;
}> => {
  try {
    const response = await fetch(
      // "https://school-management-system-production-366e.up.railway.app/api/v1/auth/session",
      "http://localhost:3000/api/v1/auth/session",
      {
        credentials: "include", // Include cookies for session verification
      }
    );

    if (!response.ok) {
      // Handle HTTP errors (e.g., 401 Unauthorized, 500 Server Error)
      if (response.status === 401) {
        // Session is invalid or expired (unauthorized)
        return { isAuthenticated: false, user: null, role: null };
      }
      throw new Error(`HTTP error! status: ${response.status}`); // Generic error for other non-OK responses
    }

    const data = await response.json();
    console.log(data);
    // console.log(data.success); // You can keep this for debugging if needed, or remove it
    return data; // Directly return the parsed JSON data
  } catch (error) {
    console.error("Error checking session:", error);
    // Return a default "not authenticated" state in case of network errors or exceptions
    return { isAuthenticated: false, user: null, role: null };
  }
};
