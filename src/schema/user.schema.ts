import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  placeOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNo: z
    .string()
    .min(10, { message: "Phone number must be between 10 and 15 digits" })
    .max(15, { message: "Phone number must be between 10 and 15 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
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
  previousSchool: z.string().optional(),
  previousGrade: z.string().optional(),
  previousMarks: z.string().optional(),
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
    .email({ message: "Please enter a valid email address" })
    .optional(),
  CNIC: z
    .string()
    .length(13, { message: "CNIC must be exactly 13 digits" })
    .regex(/^\d+$/, { message: "CNIC must contain only digits" }),
  classId: z.number({ required_error: "Class is required" }),
  sectionId: z.number({ required_error: "Section is required" }),
  enrollmentDate: z.string().min(1, { message: "Enrollment date is required" }),
  photo: z.string().optional(),
  transportation: z.string().optional(),
  extracurriculars: z.string().optional(),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  healthInsuranceInfo: z.string().optional(),
  doctorContact: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
