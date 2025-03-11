import axios from "axios";
import { Application } from "../types";
const BASE_URL = "http://localhost:3000/api/v1/";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
export const getTeacherApplications = async () => {
  return (await axiosInstance.get<Application[]>("teachers")).data;
};
