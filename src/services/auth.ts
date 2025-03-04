// src/services/auth.ts
export type EntityType = "ADMIN" | "PARENT" | "STUDENT" | "TEACHER";

export interface SessionData {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    entityType: EntityType;
    // Add any other user properties here
  } | null;
  role: string | null; // Or more specific type if applicable
}

export const checkSession = async (): Promise<SessionData> => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/auth/session", // Using localhost for dev
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { isAuthenticated: false, user: null, role: null };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate the structure of the data to match SessionData
    if (
      !data ||
      typeof data.isAuthenticated !== "boolean" ||
      (data.user !== null && typeof data.user !== "object") ||
      (data.role !== null && typeof data.role !== "string")
    ) {
      throw new Error("Invalid session data format received from server.");
    }
    console.log(data);

    return data as SessionData; // Cast data to SessionData type
  } catch (error) {
    console.error("Error checking session:", error);
    return { isAuthenticated: false, user: null, role: null };
  }
};
