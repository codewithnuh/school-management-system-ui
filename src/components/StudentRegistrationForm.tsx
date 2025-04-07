import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "@/schema/user.schema";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";

// Mock data for dropdowns
const mockClasses = [
  { id: 1, name: "Class 1" },
  { id: 2, name: "Class 2" },
  { id: 3, name: "Class 3" },
];

const mockSections = [
  { id: 1, name: "Section A" },
  { id: 2, name: "Section B" },
  { id: 3, name: "Section C" },
];

const StudentRegistrationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      gender: "Male",
      enrollmentDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      // In a real application, you would make an API call here
      console.log("Form data submitted:", data);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Student registered successfully!");
      // Reset form or redirect to another page
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: (keyof UserFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "firstName",
          "lastName",
          "dateOfBirth",
          "gender",
          "email",
          "phoneNo",
          "CNIC",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "address",
          "emergencyContactName",
          "emergencyContactNumber",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "guardianName",
          "guardianCNIC",
          "classId",
          "sectionId",
          "enrollmentDate",
        ];
        break;
      default:
        break;
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
    } else {
      toast.error("Please fix the errors before proceeding.");
    }
  };

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const FormNavigation = () => (
    <div className="flex justify-between mt-8">
      {step > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Previous
        </button>
      )}
      {step < totalSteps ? (
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
        >
          {isSubmitting ? "Registering..." : "Complete Registration"}
        </button>
      )}
    </div>
  );

  const FormProgress = () => (
    <div className="mb-8">
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="relative">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                step > index + 1
                  ? "bg-green-500"
                  : step === index + 1
                  ? "bg-blue-500"
                  : "bg-gray-300"
              } text-white font-medium`}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-xs text-center text-gray-500">
              {index === 0 && "Personal Info"}
              {index === 1 && "Contact Details"}
              {index === 2 && "Guardian & Class"}
              {index === 3 && "Additional Info"}
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-3">
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
        <div
          className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
          style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const InputField = ({
    name,
    label,
    type = "text",
    required = false,
    icon: Icon,
    placeholder = "",
  }: {
    name: keyof UserFormData;
    label: string;
    type?: string;
    required?: boolean;
    icon?: React.ComponentType;
    placeholder?: string;
  }) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name as any)}
          className={`block w-full px-4 py-2.5 ${
            Icon ? "pl-10" : ""
          } text-gray-900 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );

  const SelectField = ({
    name,
    label,
    options,
    required = false,
    icon: Icon,
  }: {
    name: keyof UserFormData;
    label: string;
    options: { id: number; name: string }[];
    required?: boolean;
    icon?: React.ComponentType;
  }) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <Controller
          name={name as any}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className={`block w-full px-4 py-2.5 ${
                Icon ? "pl-10" : ""
              } text-gray-900 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors[name] ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          )}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );

  return (
    <div className="px-4 py-8 mx-auto max-w-4xl">
      <div className="p-6 bg-white border rounded-lg shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-center text-gray-800">
          Student Registration
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Fill in the details to register a new student
        </p>

        <FormProgress />

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-gray-700">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="firstName"
                  label="First Name"
                  required
                  icon={FaUser}
                  placeholder="John"
                />
                <InputField
                  name="middleName"
                  label="Middle Name"
                  icon={FaUser}
                  placeholder="Lee"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="lastName"
                  label="Last Name"
                  required
                  icon={FaUser}
                  placeholder="Doe"
                />
                <InputField
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  required
                  icon={FaCalendarAlt}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  {["Male", "Female", "Other"].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        value={option}
                        {...register("gender")}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="email"
                  label="Email"
                  type="email"
                  required
                  icon={FaEnvelope}
                  placeholder="john.doe@example.com"
                />
                <InputField
                  name="phoneNo"
                  label="Phone Number"
                  required
                  icon={FaPhone}
                  placeholder="03xxxxxxxxx"
                />
              </div>

              <InputField
                name="CNIC"
                label="CNIC"
                required
                icon={FaIdCard}
                placeholder="1234567891234"
              />
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-gray-700">
                Contact Information
              </h2>

              <InputField
                name="address"
                label="Permanent Address"
                required
                icon={FaHome}
                placeholder="123 Main St, City, Country"
              />

              <InputField
                name="currentAddress"
                label="Current Address (if different)"
                icon={FaHome}
                placeholder="123 Main St, City, Country"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="emergencyContactName"
                  label="Emergency Contact Name"
                  required
                  icon={FaUser}
                  placeholder="Jane Doe"
                />
                <InputField
                  name="emergencyContactNumber"
                  label="Emergency Contact Number"
                  required
                  icon={FaPhone}
                  placeholder="03xxxxxxxxx"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="placeOfBirth"
                  label="Place of Birth"
                  placeholder="City, Country"
                />
                <InputField
                  name="nationality"
                  label="Nationality"
                  placeholder="Pakistani"
                />
              </div>
            </div>
          )}

          {/* Step 3: Guardian & Class Information */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-gray-700">
                Guardian & Class Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="guardianName"
                  label="Guardian Name"
                  required
                  icon={FaUser}
                  placeholder="Jane Doe"
                />
                <InputField
                  name="guardianCNIC"
                  label="Guardian CNIC"
                  required
                  icon={FaIdCard}
                  placeholder="1234567891234"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="guardianPhone"
                  label="Guardian Phone"
                  icon={FaPhone}
                  placeholder="03xxxxxxxxx"
                />
                <InputField
                  name="guardianEmail"
                  label="Guardian Email"
                  type="email"
                  icon={FaEnvelope}
                  placeholder="parent@example.com"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectField
                  name="classId"
                  label="Class"
                  options={mockClasses}
                  required
                />
                <SelectField
                  name="sectionId"
                  label="Section"
                  options={mockSections}
                  required
                />
              </div>

              <InputField
                name="enrollmentDate"
                label="Enrollment Date"
                type="date"
                required
                icon={FaCalendarAlt}
              />
            </div>
          )}

          {/* Step 4: Additional Information */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-gray-700">
                Additional Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="previousSchool"
                  label="Previous School"
                  placeholder="ABC School"
                />
                <InputField
                  name="previousGrade"
                  label="Previous Grade/Class"
                  placeholder="Grade 5"
                />
              </div>

              <InputField
                name="previousMarks"
                label="Previous Academic Performance"
                placeholder="90% in last annual exams"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="transportation"
                  label="Transportation Requirement"
                  placeholder="School bus / Private vehicle / None"
                />
                <InputField
                  name="extracurriculars"
                  label="Extracurricular Interests"
                  placeholder="Sports, Music, etc."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="medicalConditions"
                  label="Medical Conditions"
                  placeholder="Any medical conditions"
                />
                <InputField
                  name="allergies"
                  label="Allergies"
                  placeholder="Any allergies"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  name="healthInsuranceInfo"
                  label="Health Insurance Information"
                  placeholder="Insurance provider and policy number"
                />
                <InputField
                  name="doctorContact"
                  label="Family Doctor Contact"
                  placeholder="Doctor's name and contact information"
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="mb-2 text-sm font-medium text-blue-800">
                  Form Completion
                </h3>
                <p className="text-sm text-blue-700">
                  Please review all information before submitting. By submitting
                  this form, you confirm that all provided information is
                  correct.
                </p>
              </div>
            </div>
          )}

          <FormNavigation />
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;
