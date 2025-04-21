import { axiosInstance } from "..";
import { UserFormData } from "../../components/forms/UserRegistrationForm";

/**
 * Register a new student with the provided form data
 * @param formData - The student registration form data
 * @returns A promise that resolves with the API response
 */
export const registerStudent = async (formData: UserFormData): Promise<any> => {
  try {
    // Format the data as needed for the API
    const payload = {
      ...formData,
      // Adding required fields that are missing according to server validation
      entityType: "STUDENT", // Server requires this field with value 'STUDENT'
      studentId: formData.CNIC || `STD-${Date.now()}`, // Using CNIC as studentId or generating a temporary one

      // Convert string dates to proper format if needed
      dateOfBirth: formData.dateOfBirth
        ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
        : "",
      enrollmentDate: formData.enrollmentDate
        ? new Date(formData.enrollmentDate).toISOString().split("T")[0]
        : "",
    };

    // Make the API call
    const response = await axiosInstance.post("/users/register", payload);
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
