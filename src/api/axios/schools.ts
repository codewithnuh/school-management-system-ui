import { axiosInstance } from "..";

export interface SchoolData {
  id?: number | string;
  name?: string;
  brandColor?: string;
  logo?: string;
  // Add any other fields from your school data model
}

export interface SchoolResponse {
  data: SchoolData | null;
  message?: string;
  success?: boolean;
}

/**
 * Fetches school by admin ID
 */
export const getSchoolByAdminID = async (
  adminId: number
): Promise<SchoolResponse> => {
  try {
    if (!adminId) throw new Error("Admin ID is required");
    const response = await axiosInstance.get(`/schools/${adminId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Failed to fetch school by admin ID (${adminId}):`, error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch school data"
    );
  }
};
export interface SchoolFormData {
  name: string;
  brandColor: string;
  adminId: number;
  logo: string;
}

/**
 * Creates a new school
 */
export const createSchool = async (
  formData: SchoolFormData
): Promise<SchoolResponse> => {
  try {
    if (!formData.name || !formData.adminId)
      throw new Error("School name and admin ID are required");
    const response = await axiosInstance.post("/schools", formData);
    return response.data;
  } catch (error: any) {
    console.error("Failed to create school:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create school"
    );
  }
};
/**
 * Fetches school by school ID
 */
export const getSchoolById = async (
  schoolId: number
): Promise<SchoolResponse> => {
  try {
    if (!schoolId) throw new Error("School ID is required");
    const response = await axiosInstance.get(`/schools/schoolId/${schoolId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Failed to fetch school (ID: ${schoolId}):`, error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch school"
    );
  }
};
