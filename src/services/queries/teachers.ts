import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchAllSubjectsOfATeacher,
  fetchSingleTeacher,
} from "../../api/axios/teachers";
import { Teacher } from "../../types/teacher";
import {
  createStudentRegistrationLink,
  createTeacher,
  createTeacherRegistrationLink,
  deleteStudentRegistrationLink,
  deleteTeacherRegistrationLink,
  getStudentRegistrationLink,
  getTeacherRegistrationLink,
  TeacherData,
} from "../../api/axios/registerTeachers";
/**
 * Hook for fetching a single teacher
 * @param id The ID of the teacher to fetch
 * @returns A strongly-typed query result with the teacher data and status
 */
export const useTeachers = (id: number): UseQueryResult<Teacher, Error> => {
  return useQuery<Teacher, Error>({
    queryKey: ["teacher", id],
    queryFn: () => fetchSingleTeacher(id),
  });
};

export const useTeacherSections = (teacherId: number, subjectId: number) => {
  return useQuery<Teacher, Error>({
    queryKey: ["teacherSections", teacherId, subjectId],
    queryFn: () => fetchAllSubjectsOfATeacher(teacherId, subjectId),
  });
};
export const useGetSingleTeacher = (teacherId: number) => {
  return useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: () => fetchSingleTeacher(teacherId),
  });
};

export const useCreateTeacher = () => {
  return useMutation({
    mutationFn: (data: TeacherData) => createTeacher(data),
    mutationKey: ["teacher"],
  });
};

export const useCreateTeacherRegistrationLink = () => {
  return useMutation({
    mutationFn: createTeacherRegistrationLink,
  });
};
export const useCreateStudentRegistrationLink = () => {
  return useMutation({
    mutationFn: createStudentRegistrationLink,
  });
};
export const useGetTeacherRegistrationLink = () => {
  return useQuery({
    queryKey: ["teacherRegistrationLink"],
    queryFn: getTeacherRegistrationLink,
  });
};
export const useGetStudentRegistrationLink = () => {
  return useQuery({
    queryKey: ["studentRegistrationLink"],
    queryFn: getStudentRegistrationLink,
  });
};
export const useDeleteStudentRegistrationLink = () => {
  return useMutation({
    mutationFn: deleteStudentRegistrationLink,
  });
};
export const useDeleteTeacherRegistrationLink = () => {
  return useMutation({
    mutationFn: deleteTeacherRegistrationLink,
  });
};
