import { axiosInstance } from "..";

export const getSchoolByAdminID = async (adminId: number) => {
  const response = await axiosInstance.get(`/schools/${adminId}`);
  return response.data;
};
export interface SchoolFormData {
  name: string;
  brandColor: string;
  adminId: number;
  logo: string;
}

export const createSchool = async (formData: SchoolFormData) => {
  const response = await axiosInstance.post("/schools", formData);
  return response.data;
};
export const getSchool = async (schoolId: string) => {
  const response = await axiosInstance.get(`/schools/schoolId/${schoolId}`);
  return response.data;
};
