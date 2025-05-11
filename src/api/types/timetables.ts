export interface TimetableGenerationResponse {
  success: boolean;
  data: TimetableGenerationData[];
  error: string | null;
  message: string;
  statusCode: number;
  timestamp: string;
}

interface TimetableGenerationData {
  id: number;
  classId: number;
  sectionId: number;
  periodsPerDay: number;
  periodsPerDayOverrides: Record<string, number>; // Or more specific type if known
  teacherId: number;
  updatedAt: string;
  createdAt: string;
}
interface TimetablePeriod {
  id: number;
  timetableId: number;
  sectionId: number;
  classId: number;
  subjectId: number;
  teacherId: number;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  timetable: {
    id: number;
    classId: number;
    sectionId: number;
    teacherId: number;
    periodsPerDay: number;
    periodsPerDayOverrides: Record<string, unknown>; // Assuming this is a flexible object
    breakStartTime: null | string;
    breakEndTime: null | string;
    createdAt: string;
    updatedAt: string;
    section: {
      id: number;
      name: string;
      classTeacherId: number;
      subjectTeachers: Record<string, number>; // Subject ID to Teacher ID mapping
      classId: number;
      createdAt: string;
      updatedAt: string;
      sectionId: null;
      examId: null;
    };
    class: {
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
      examId: null;
      classId: null;
    };
  };
  subject: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  teacher: {
    id: number;
    firstName: string;
    middleName: null | string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nationality: null | string;
    email: string;
    phoneNo: string;
    entityType: string;
    password: string;
    address: string;
    currentAddress: null | string;
    cnic: string;
    highestQualification: string;
    specialization: null | string;
    experienceYears: null | string;
    joiningDate: string;
    photo: null | string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    isVerified: boolean;
    applicationStatus: string;
    verificationDocument: null | string;
    cvPath: null | string;
    role: string;
    subjectId: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface WeeklyTimetableData {
  Monday: TimetablePeriod[];
  Tuesday: TimetablePeriod[];
  Wednesday: TimetablePeriod[];
  Thursday: TimetablePeriod[];
  Friday: TimetablePeriod[];
  [key: string]: TimetablePeriod[];
}

export interface WeeklyTimetableResponse {
  success: boolean;
  data: WeeklyTimetableData;
  error: null | Error; // You can replace 'any' with a more specific error type if needed
  message: string;
  statusCode: number;
  timestamp: string;
}
