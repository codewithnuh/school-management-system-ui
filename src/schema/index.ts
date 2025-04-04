import { z } from "zod";

export const CreateClassSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Class name is required"),
  description: z.string().optional(),
  maxStudents: z.number().int().min(1, "Class must have at least 1 student"),
  periodsPerDay: z.number().int().min(1, "At least 1 period per day is required").max(10),
  periodLength: z.number().int().min(30, "Period length must be at least 30 minutes").max(60),
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
      name: z.string().min(1, "Section name is required"),
      maxStudents: z.number().int().min(1, "Section must have at least 1 student"),
      classTeacherId: z.number().int().positive("Class teacher ID must be a positive number"),
      subjectTeachers: z.record(z.string(), z.number()), // { subjectId: teacherId }
    })
  ).min(1, "At least one section is required"),
});

export type CreateClassFormValues = z.infer<typeof CreateClassSchema>;
