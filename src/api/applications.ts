import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Application } from "../types";

// Response types for better type safety
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface ApplicationsResponse {
  applications: Application[];
}

interface ApplicationActionResponse {
  success: boolean;
  message: string;
  application?: Application;
}

/**
 * API client for teacher applications
 */
class TeacherApplicationsApi {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3000/api/v1") {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(
          `✅ API Response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        console.error("❌ Response Error:", this.formatError(error));
        return Promise.reject(error);
      }
    );
  }

  /**
   * Format error for consistent error handling
   */
  private formatError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const message = axiosError.response?.data || axiosError.message;
      return `API Error (${status}): ${message}`;
    }
    return error instanceof Error ? error.message : "Unknown error occurred";
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: unknown, fallbackMessage: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          fallbackMessage
      );
    }
    throw new Error(error instanceof Error ? error.message : fallbackMessage);
  }

  /**
   * Make a request with consistent error handling
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client(config);
      return response.data;
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to ${config.method || "make"} request to ${config.url}`
      );
    }
  }

  /**
   * Fetch all teacher applications
   */
  async fetchTeacherApplications(): Promise<Application[]> {
    console.log("Fetching teacher applications...");
    try {
      const response = await this.request<ApiResponse<ApplicationsResponse>>({
        method: "get",
        url: "/teachers",
      });

      console.log(`Retrieved ${response.data} teacher applications`);
      return response.data.applications;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch teacher applications");
    }
  }

  /**
   * Accept a teacher application
   */
  async acceptTeacherApplication(
    teacherId: number
  ): Promise<ApplicationActionResponse> {
    console.log(`Accepting teacher application with ID: ${teacherId}`);
    try {
      return await this.request<ApplicationActionResponse>({
        method: "post",
        url: `/accept-teacher-application`,
        params: { id: teacherId },
      });
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to accept teacher application with ID: ${teacherId}`
      );
    }
  }

  /**
   * Reject a teacher application
   */
  async rejectTeacherApplication(
    teacherId: number
  ): Promise<ApplicationActionResponse> {
    console.log(`Rejecting teacher application with ID: ${teacherId}`);
    try {
      return await this.request<ApplicationActionResponse>({
        method: "post",
        url: `/reject-teacher-application`,
        params: { id: teacherId },
      });
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to reject teacher application with ID: ${teacherId}`
      );
    }
  }

  /**
   * Schedule an interview for a teacher application
   */
  async scheduleInterviewTeacherApplication(
    teacherId: number
  ): Promise<ApplicationActionResponse> {
    console.log(
      `Scheduling interview for teacher application with ID: ${teacherId}`
    );
    try {
      return await this.request<ApplicationActionResponse>({
        method: "post",
        url: `/schedule-interview-teacher-application`,
        params: { id: teacherId },
      });
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to schedule interview for teacher application with ID: ${teacherId}`
      );
    }
  }
}

// Create and export a singleton instance
const teacherApplicationsApi = new TeacherApplicationsApi();

// Export individual methods for direct use
export const {
  fetchTeacherApplications,
  acceptTeacherApplication,
  rejectTeacherApplication,
  scheduleInterviewTeacherApplication,
} = teacherApplicationsApi;

// Also export the API instance for more advanced usage
export default teacherApplicationsApi;
