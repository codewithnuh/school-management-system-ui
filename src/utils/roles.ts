// src/utils/roles.ts
export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export const allowedRoles = {
  dashboard: [Role.ADMIN],
  teachers: [Role.TEACHER],
  students: [Role.STUDENT],
};
