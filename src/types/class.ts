/**
 * Interface for Class data structure
 */
export interface Class {
  id: number;
  name: string;
  description: string;
  maxStudents: number;
  periodsPerDay: number;
  periodLength: number;
  workingDays: string[];
  subjectIds: number[];
  sections: Section[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface for Section data structure
 */
export interface Section {
  id?: number;
  name: string;
  maxStudents: number;
  classTeacherId: number;
  subjectTeachers: Record<string, number>; // Map of subjectId -> teacherId
}

/**
 * Type for Section without ID (used in form values)
 */
export type SectionFormValues = Omit<Section, "id">;

/**
 * Type for form values when creating a class
 */
export type CreateClassFormValues = Omit<
  Class,
  "id" | "createdAt" | "updatedAt"
> & {
  sections: SectionFormValues[];
};
