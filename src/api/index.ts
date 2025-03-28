import axios from "axios";
import { ApplicationResponse } from "../types";

const BASE_URL = "http://localhost:3000/api/v1/";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getTeacherApplications = async () => {
  const response = await axiosInstance.get<ApplicationResponse>("teachers");
  return response.data;
};

export const acceptTeacherApplication = async (id: number) => {
  const response = await axiosInstance.post<ApplicationResponse>(
    `/teachers/accept-teacher-application?id=${id}`,
    { status: "Accepted" }
  );

  return response.data;
};

export const rejectTeacherApplication = async (id: number) => {
  const response = await axiosInstance.post<ApplicationResponse>(
    `/teachers/reject-teacher-application?id=${id}`,
    {
      status: "Rejected",
    }
  );
  return response.data;
};
