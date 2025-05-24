import { useUser } from "../hooks/useUser";
export const useVerifyAdminSubscription = () => {
  const { data: adminData } = useUser();
  let subscriptionStatus: boolean;
  if (adminData!.data.user.isSubscriptionActive != true) {
    subscriptionStatus = false;
    return { subscriptionStatus };
  }
  return { subscriptionStatus: true };
};
