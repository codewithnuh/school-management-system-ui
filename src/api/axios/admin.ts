import { axiosInstance } from "..";

export const getSubscriptionVerifyStatus = async (adminId: number) => {
  const response = await axiosInstance.get(
    `/admins/verify-subscription/${adminId}`
  );
  return response.data;
};
