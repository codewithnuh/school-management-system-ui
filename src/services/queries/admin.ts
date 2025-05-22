import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllAdmins,
  getSubscriptionVerifyStatus,
  updateAdminById,
} from "../../api/axios/admin";
import { Admin } from "../../components/dashboards/owner/OwnerDashboardAdmins";

export const useGetSubscriptionStatus = (adminId: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: () => getSubscriptionVerifyStatus(adminId),
    enabled: enabled,
  });
};
export const useGetAllAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: () => getAllAdmins(),
  });
};

export const useUpdateAdminById = () => {
  return useMutation({
    mutationKey: ["admins"],
    mutationFn: ({ adminId, data }: { adminId: number; data: Admin }) =>
      updateAdminById(adminId, data),
  });
};
