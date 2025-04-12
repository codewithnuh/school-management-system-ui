import { axiosInstance } from "..";

export const fetchAllSubjects = () => {
  return axiosInstance.get("/subjects");
};
