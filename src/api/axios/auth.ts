import { axiosInstance } from "..";

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
