import { axiosInstance } from "..";

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const sendOtp = async (
  email: string,
  entityType: "ADMIN" | "TEACHER" | "STUDENT"
) => {
  const response = await axiosInstance.post("/auth/forgot-password/initiate", {
    email,
    entityType,
  });
  return response.data;
};
export const verifyOtp = async (otp: string, newPassword: string) => {
  const response = await axiosInstance.post("/auth/forgot-password/reset", {
    otp,
    newPassword,
  });
  return response.data;
};
