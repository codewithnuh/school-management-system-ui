import { z } from "zod";
import { axiosInstance } from "..";
import { teacherSchema } from "../../schema/teacher.schema";
import axios from "axios";

/**
 * Register a new student with the provided form data
 * @param formData - The student registration form data
 * @returns A promise that resolves with the API response
 */
export type TeacherFormData = z.infer<typeof teacherSchema>;
export const registerTeacher = async (
  formData: TeacherFormData
): Promise<unknown> => {
  try {
    // Format the data as needed for the API
    const payload = {
      ...formData,
      // Adding required fields that are missing according to server validation
      entityType: "TEACHER", // Server requires this field with value 'STUDENT'
      studentId: formData.cnic || `STD-${Date.now()}`, // Using CNIC as studentId or generating a temporary one

      // Convert string dates to proper format if needed
      dateOfBirth: formData.dateOfBirth
        ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
        : "",
    };

    // Debug: Log the payload being sent
    console.log(
      "Sending registration payload:",
      JSON.stringify(payload, null, 2)
    );

    // Make the API call
    const response = await axiosInstance.post("teachers/register", payload);
    return response.data;
  } catch (error: any) {
    // Enhanced error logging
    console.error("Registration API error details:", {
      error,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Handle and transform error for better client-side error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const serverError = error.response.data;
      console.error("Server error details:", serverError);
      throw new Error(
        serverError.message ||
          `Server error: ${error.response.status}` ||
          "Failed to register student"
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error(
        "No response from server. Please check your network connection."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error: ${error.message || "Unknown error occurred"}`);
    }
  }
};

export type TeacherData = z.infer<typeof teacherSchema>;

export const createTeacher = async (data: TeacherData) => {
  const response = axiosInstance.post("teachers", { ...data });
  return response;
};
export const createTeacherRegistrationLink = async () => {
  const response = await axiosInstance.post("registration-link/teacher");
  return response.data;
};
export const createStudentRegistrationLink = async () => {
  const response = await axiosInstance.post("registration-link/student");
  return response.data;
};

export const getTeacherRegistrationLink = async () => {
  const response = await axiosInstance.get("registration-link/teacher");
  return response.data;
};
export const getStudentRegistrationLink = async () => {
  const response = await axiosInstance.get("registration-link/student");
  return response.data;
};
export const deleteStudentRegistrationLink = async () => {
  const response = await axiosInstance.delete("registration-link/student");
  return response.data;
};
export const deleteTeacherRegistrationLink = async () => {
  const response = await axiosInstance.delete("registration-link/teacher");
  return response.data;
};
