import { axiosInstance } from "..";

export const getTeacherRegistrationLinkById = async (id: string) => {
  const response = await axiosInstance.get(`registration-link/teacher/${id}`);
  return response.data;
};
