import { z } from "zod";

// Define enums to match the Sequelize model
export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum ApplicationStatus {
  Pending = "Pending",
  Interview = "Interview",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

// Create the teacher schema with Zod
export const teacherSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z
    .string()
    .or(z.date())
    .refine(
      (val) => {
        const date = val instanceof Date ? val : new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Valid date of birth is required" }
    ),
  gender: z.nativeEnum(Gender, {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be Male, Female, or Other",
  }),
  nationality: z.string().optional(),
  email: z.string().email({ message: "Valid email address is required" }),
  phoneNo: z.string().min(10).max(15).regex(/^\d+$/, {
    message: "Phone number must contain 10-15 digits",
  }),
  entityType: z.literal("TEACHER").optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional(),
  address: z.string().min(1, { message: "Address is required" }),
  currentAddress: z.string().optional(),
  cnic: z
    .string()
    .length(13, { message: "CNIC must be exactly 13 digits" })
    .regex(/^\d+$/, {
      message: "CNIC must contain only digits",
    }),
  highestQualification: z
    .string()
    .min(1, { message: "Highest qualification is required" }),
  specialization: z.string().optional(),
  experienceYears: z.number().int().min(0).optional(),
  joiningDate: z
    .string()
    .or(z.date())
    .refine(
      (val) => {
        const date = val instanceof Date ? val : new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Valid joining date is required" }
    ),
  photo: z.string().optional(),
  emergencyContactName: z
    .string()
    .min(1, { message: "Emergency contact name is required" }),
  emergencyContactNumber: z.string().min(10).max(15).regex(/^\d+$/, {
    message: "Emergency contact number must contain 10-15 digits",
  }),
  isVerified: z.boolean().optional(),
  applicationStatus: z.nativeEnum(ApplicationStatus).optional(),
  verificationDocument: z.string().optional(),
  cvPath: z.string().optional(),
  schoolId: z.number(),
  role: z.literal("TEACHER").optional(),
  subjectId: z.number({ required_error: "Subject is required" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TeacherSchemaType = z.infer<typeof teacherSchema>;

// Additional specialized schemas derived from the main schema
export const teacherLoginSchema = teacherSchema.pick({
  email: true,
  password: true,
});

export const teacherUpdateSchema = teacherSchema.partial();

export const teacherBasicInfoSchema = teacherSchema.pick({
  firstName: true,
  middleName: true,
  lastName: true,
  email: true,
  phoneNo: true,
  gender: true,
  dateOfBirth: true,
});
