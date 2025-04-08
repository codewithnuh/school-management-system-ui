import { z } from "zod";

export const userSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  placeOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNo: z
    .string()
    .min(10, { message: "Phone number must be between 10 and 15 digits" })
    .max(15, { message: "Phone number must be between 10 and 15 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
  entityType: z.literal("STUDENT").optional(),
  emergencyContactName: z.string().min(1, {
    message: "Emergency contact name is required",
  }),
  emergencyContactNumber: z
    .string()
    .min(10, { message: "Contact number must be between 10 and 15 digits" })
    .max(15, { message: "Contact number must be between 10 and 15 digits" })
    .regex(/^\d+$/, { message: "Contact number must contain only digits" }),
  address: z.string().min(1, { message: "Address is required" }),
  currentAddress: z.string().optional(),
  studentId: z.string().optional(),
  previousSchool: z.string().optional(),
  previousGrade: z.string().optional(),
  previousMarks: z.string().optional(),
  isRegistered: z.boolean().optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
  guardianName: z.string().min(1, { message: "Guardian name is required" }),
  guardianCNIC: z
    .string()
    .length(13, { message: "CNIC must be exactly 13 digits" })
    .regex(/^\d+$/, { message: "CNIC must contain only digits" }),
  guardianPhone: z
    .string()
    .min(10, { message: "Phone number must be between 10 and 15 digits" })
    .max(15, { message: "Phone number must be between 10 and 15 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" })
    .optional(),
  guardianEmail: z
    .string()
    .email({ message: "Invalid email address" })
    .optional(),
  CNIC: z
    .string()
    .length(13, { message: "CNIC must be exactly 13 digits" })
    .regex(/^\d+$/, { message: "CNIC must contain only digits" }),
  classId: z.number({ required_error: "Class is required" }),
  sectionId: z.number({ required_error: "Section is required" }),
  uuid: z.string().uuid().optional(),
  enrollmentDate: z.string().min(1, { message: "Enrollment date is required" }),
  photo: z.string().optional(),
  transportation: z.string().optional(),
  extracurriculars: z.string().optional(),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  healthInsuranceInfo: z.string().optional(),
  doctorContact: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  parentId: z.number().optional(),
});

export type UserSchemaType = z.infer<typeof userSchema>;

// Additional specialized schemas can be derived from the main schema
export const userLoginSchema = userSchema.pick({
  email: true,
  password: true,
});

export const userUpdateSchema = userSchema.partial();

export const userBasicInfoSchema = userSchema.pick({
  firstName: true,
  middleName: true,
  lastName: true,
  email: true,
  phoneNo: true,
  gender: true,
  dateOfBirth: true,
});
