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
