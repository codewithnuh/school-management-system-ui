import { axiosInstance } from "..";

export interface TeacherRegistrationLinkResponse {
  data: {
    id?: string;
    schoolId?: string | number | null;
    // Add other fields from your API response here
  };
  message?: string;
  success?: boolean;
}

/**
 * Fetches teacher registration link data by ID
 * @param id - Registration link ID
 * @returns Promise with registration link data
 */
export const getTeacherRegistrationLinkById = async (id: string): Promise<TeacherRegistrationLinkResponse> => {
  try {
    if (!id) throw new Error('Registration link ID is required');
    const response = await axiosInstance.get(`registration-link/teacher/${id}`);
    
    // Validate response
    if (!response.data) {
      throw new Error('Empty response from server');
    }
    
    return response.data;
  } catch (error: any) {
    // Return structured error response that won't break UI
    console.error(`Failed to fetch registration link (ID: ${id}):`, error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch registration link');
  }
};
