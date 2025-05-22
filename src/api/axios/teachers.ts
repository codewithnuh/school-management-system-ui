import { axiosInstance } from "..";
import { TeacherData } from "./registerTeachers";

export const fetchSingleTeacher = async (id: number) => {
  const response = await axiosInstance.get(`/teachers/${id}`);
  return response.data;
};

export const fetchAllSubjectsOfATeacher = async (
  teacherId: number,
  subjectId: number
) => {
  const response = await axiosInstance.get(
    `sections/teacher/section/${teacherId}/${subjectId}`
  );
  return response.data;
};

export const getTeachersCount = async () => {
  const response = await axiosInstance.get("teachers/teachers-count");
  return response.data;
};

export const getAllTeachers = async () => {
  const response = await axiosInstance.get("teachers");
  return response.data;
};

export const updateTeacher = async (id: number, data: TeacherData) => {
  const response = await axiosInstance.put(`/teachers?teacherId=${id}`, data);
  return response.data;
};
