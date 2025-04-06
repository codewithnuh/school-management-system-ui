import axios from "axios";
import { axiosInstance } from "../api";

// Base URL for API calls
const API_URL = process.env.REACT_APP_API_URL || "";

// Interfaces
interface Class {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
}

interface TimetableResponse {
  success: boolean;
  data: unknown;
  error: string | null;
  message: string;
  statusCode: number;
  timestamp: string;
}

// Get all classes
export const getClasses = async (): Promise<Class[]> => {
  try {
    const response = await axiosInstance.get("classes");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

// Get sections for a class
export const getSections = async (classId: number): Promise<Section[]> => {
  try {
    const response = await axios.get<TimetableResponse>(
      `${API_URL}/api/classes/${classId}/sections`
    );
    return response.data.data as  || [];
  } catch (error) {
    console.error(`Error fetching sections for class ${classId}:`, error);
    throw error;
  }
};

// Generate timetables for a class
export const generateTimetables = async (classId: number): Promise<void> => {
  try {
    await axios.post<TimetableResponse>(
      `${API_URL}/api/timetables/generate/${classId}`
    );
  } catch (error) {
    console.error(`Error generating timetables for class ${classId}:`, error);
    throw error;
  }
};

// Get timetable for a section
export const getSectionTimetable = async (sectionId: number) => {
  try {
    const response = await axios.get<TimetableResponse>(
      `${API_URL}/api/timetables/section/${sectionId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching timetable for section ${sectionId}:`, error);
    throw error;
  }
};

// Timetable service object
const timetableService = {
  getClasses,
  getSections,
  generateTimetables,
  getSectionTimetable,
};

export default timetableService;
