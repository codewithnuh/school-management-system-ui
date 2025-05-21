import { useQuery } from "@tanstack/react-query";
import {
  getAllAdmins,
  getSubscriptionVerifyStatus,
} from "../../api/axios/admin";

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
