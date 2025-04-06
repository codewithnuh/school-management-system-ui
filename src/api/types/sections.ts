// Types for the Section API response

export interface Teacher {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string | null;
  email: string;
  phoneNo: string;
  entityType: string;
  password: string;
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
  applicationStatus: string;
  verificationDocument: string | null;
  cvPath: string | null;
  role: string;
  subjectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: number;
  name: string;
  maxStudents: number;
  periodsPerDay: number;
  periodLength: number;
  workingDays: string[];
  subjectIds: number[];
  description: string;
  createdAt: string;
  updatedAt: string;
  examId: number | null;
  classId: number | null;
}

export interface Section {
  id: number;
  name: string;
  classTeacherId: number;
  subjectTeachers: Record<string, number>;
  classId: number;
  createdAt: string;
  updatedAt: string;
  sectionId: number | null;
  examId: number | null;
  Teacher: Teacher;
  class: Class;
}

export interface SectionsApiResponse {
  success: boolean;
  data: Section[];
  error: string | null;
  message: string;
  statusCode: number;
  timestamp: string;
}
