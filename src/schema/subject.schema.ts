// src/schema/subject.schema.ts
import { z } from "zod";

// Zod schema for validation (for creation)
export const SubjectCreationSchema = z.object({
  name: z
    .string()
    .min(1, "Subject name cannot be empty")
    .max(100, "Subject name cannot exceed 100 characters"),
  description: z.string().optional().nullable(),
  schoolId: z.number({
    required_error: "School ID is required",
    invalid_type_error: "School ID must be a number",
  }),
});

// Zod schema for a full Subject (including ID for display/delete)
export const SubjectSchema = SubjectCreationSchema.extend({
  id: z.number(), // ID is required for existing subjects
});

// Type inference from Zod schemas
export type SubjectCreationInputs = z.infer<typeof SubjectCreationSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
