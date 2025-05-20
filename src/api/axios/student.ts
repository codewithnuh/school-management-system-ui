import { axiosInstance } from "..";
import { User } from "../../types/index";

export const fetchStudentById = async (id: number) => {
  const response = await axiosInstance.get(`user?id=${id}`);
  return response.data;
};

export const updateStudentById = async (id: number, data: User) => {
  // Add leading slash to ensure proper URL formation
  const response = await axiosInstance.put(`users/${id}`, data);
  return response.data;
};

export const getStudentsCount = async () => {
  const response = await axiosInstance.get("/users/users-count");
  return response.data;
};
