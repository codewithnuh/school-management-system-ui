import { axiosInstance } from "..";

export const fetchSingleTeacher = async (id: number) => {
  const response = await axiosInstance.get(`/teachers/${id}`);
  return response.data;
};
