import { axiosInstance } from "..";

export const logout = async () => {
  const response = await axiosInstance.post("auth/logout");
  return response.data;
};

export const sendOtp = async (
  email: string,
  entityType: "ADMIN" | "TEACHER" | "STUDENT" | "OWNER"
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
export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const signUp = async (data: SignUpFormData) => {
  const response = await axiosInstance.post("auth/sign-up", {
    ...data,
  });
  return response.data;
};
export const login = async (data: {
  email: string;
  entityType: string;
  password: string;
}) => {
  const response = await axiosInstance.post("auth/login", {
    ...data,
  });
  return response.data;
};
export const studentLogin = async (data: {
  email: string;
  password: string;
  schoolCode: string;
}) => {
  const response = await axiosInstance.post("auth/login/user", {
    ...data,
  });
  return response.data;
};
export const teacherLogin = async (data: {
  email: string;
  password: string;
  schoolCode: string;
}) => {
  const response = await axiosInstance.post("auth/login/teacher", {
    ...data,
  });
  return response.data;
};
export const ownerLogin = async (data: { email: string; password: string }) => {
  const response = await axiosInstance.post("auth/owner/login", {
    ...data,
  });
  return response.data;
};
