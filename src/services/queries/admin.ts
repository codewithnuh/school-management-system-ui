import { useQuery } from "@tanstack/react-query";
import { getSubscriptionVerifyStatus } from "../../api/axios/admin";

export const useGetSubscriptionStatus = (adminId: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: () => getSubscriptionVerifyStatus(adminId),
    enabled: enabled,
  });
};
