import axiosInstance from "../axiosInstance";
import { Class, CreateClassFormValues } from "../../types/class";

/**
 * API functions for class operations
 */

// Get all classes
export const fetchClasses = async () => {
  const response = await axiosInstance.get("/classes");
  return response.data["data"];
};

// Get a single class by ID
export const fetchClassById = async (id: number): Promise<Class> => {
  const response = await axiosInstance.get(`/classes/${id}`);
  return response.data.data;
};

// Create a new class
export const createClass = async (
  classData: CreateClassFormValues
): Promise<Class> => {
  const response = await axiosInstance.post("/classes", classData);
  return response.data;
};

// Update an existing class
export const updateClass = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<CreateClassFormValues>;
}): Promise<Class> => {
  const response = await axiosInstance.put(`/classes/${id}`, data);
  return response.data;
};

// Delete a class
export const deleteClass = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/classes/${id}`);
};

// Add these to your index.ts in the api folder for easier imports
