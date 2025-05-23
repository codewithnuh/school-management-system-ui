// Application entity types
export type EntityType = "TEACHER" | "STUDENT" | "ADMIN" | "OWNER";
export type Gender = "Male" | "Female" | "Other";
export type ApplicationStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Interview";
export type Role = "TEACHER" | "STUDENT" | "ADMIN" | "OWNER";

// Application item interface
export interface Application {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  classId?: number;
  gender: Gender;
  nationality: string | null;
  email: string;
  phoneNo: string;
  entityType: EntityType;
  address: string;
  currentAddress: string | null;
  cnic: string;
  highestQualification: string;
  specialization: string | null;
  experienceYears: number | null;
  joiningDate: string;
  photo: string | null;
  emergencyContactName: string;
  emergencyContactNumber: string;
  isVerified: boolean;
  applicationStatus: ApplicationStatus;
  role: Role;
  cvPath: string | null;
  verificationDocument: string | null;
  isRegistered?: boolean;
  subjectId: number;
  createdAt: string;
  updatedAt: string;
}

// Pagination data
export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Application response data
export interface ApplicationResponseData extends PaginationData {
  teachers: Application[];
}
export interface StudentApplicationResponseData extends PaginationData {
  data: Application[];
}
// Complete API response
export interface ApplicationResponse {
  success: boolean;
  data: ApplicationResponseData;
  error: string | null;
  message: string;
  statusCode: number;
  timestamp: string;
}
export interface StudentApplicationResponse {
  success: boolean;
  data: StudentApplicationResponseData;
  error: string | null;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface User {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  placeOfBirth: string;
  nationality: string;
  email: string;
  phoneNo: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  address: string;
  studentId: string;
  previousSchool?: string;
  previousGrade?: string;
  previousMarks?: number;
  isRegistered: boolean;
  guardianName: string;
  guardianCNIC: string;
  guardianPhone: string;
  guardianEmail: string;
  CNIC: string;
  class: string;
  enrollmentDate: Date;
  uuid: string;
  medicalConditions?: string;
  allergies?: string;
  photo?: string;
  transportation?: string;
  extracurriculars?: string;
  healthInsuranceInfo?: string;
  doctorContact?: string;
  password?: string;
  sectionId: number | null;
}
