import { z } from "zod";

export const CreateClassSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Class name is required"),
  description: z.string().optional(),
  maxStudents: z.number().min(1, "Max students must be at least 1"),
  periodsPerDay: z.number().min(1).max(10),
  periodLength: z.number().min(30).max(60),
  schoolId: z.number(),
  workingDays: z
    .array(
      z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ])
    )
    .min(1, "At least one working day is required"),
  subjectIds: z.array(z.number()).min(1, "At least one subject is required"),
  sections: z.array(
    z.object({
      name: z.string().length(1, "Section name must be a single character"),
      maxStudents: z
        .number()
        .min(1, "Max students per section must be at least 1"),
      classTeacherId: z
        .number()
        .positive("Class teacher ID must be a positive number"),
      subjectTeachers: z.record(z.string(), z.number()), // { subjectId: teacherId }
    })
  ),
});
