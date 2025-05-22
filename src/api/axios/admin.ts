import { axiosInstance } from "..";
import { Admin } from "../../components/dashboards/owner/OwnerDashboardAdmins";

export const getSubscriptionVerifyStatus = async (adminId: number) => {
  const response = await axiosInstance.get(
    `/admins/verify-subscription/${adminId}`
  );
  return response.data;
};

export const getAllAdmins = async () => {
  const response = await axiosInstance.get("/admins");
  return response.data;
};
export const updateAdminById = async (adminId: number, data: Admin) => {
  const response = await axiosInstance.put(`admins?adminId=${adminId}`, data);
  return response.data;
};
