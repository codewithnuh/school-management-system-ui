// Step 1: Create API Module (src/api/index.ts)
import axios from "axios";
import { ApplicationResponse } from "@/types/index";

const API_URL = "http://localhost:3000/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchApplications = async (
  entityType: "teacher" | "student" = "teacher"
) => {
  const response = await apiClient.get<ApplicationResponse>(
    `/teachers/applications` // Assuming separate endpoint for students
  );
  return response.data.data.items;
};

export const updateApplicationStatus = async (
  applicationId: number,
  newStatus: "approved" | "rejected"
) => {
  await apiClient.patch(
    `/teachers/applications/${applicationId}`,
    { applicationStatus: newStatus },
    { headers: { "Content-Type": "application/json" } }
  );
};
