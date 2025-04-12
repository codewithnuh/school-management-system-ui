import { axiosInstance } from "..";

export const fetchSingleTeacher = async (id: number) => {
  const response = await axiosInstance.get(`/teachers/${id}`);
  return response.data;
};

export const fetchAllSubjectsOfATeacher = async (
  teacherId: number,
  subjectId: number
) => {
  const response = await axiosInstance.get(
    `/sections/teacher/section/${teacherId}/${subjectId}`
  );
  return response.data;
};
