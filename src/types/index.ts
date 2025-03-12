// Application entity types
export type EntityType = "TEACHER" | "STUDENT";
export type Gender = "Male" | "Female" | "Other";
export type ApplicationStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Interview";
export type Role = "TEACHER" | "STUDENT" | "ADMIN";

// Application item interface
export interface Application {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
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

// Complete API response
export interface ApplicationResponse {
  success: boolean;
  data: ApplicationResponseData;
  error: string | null;
  message: string;
  statusCode: number;
  timestamp: string;
}
