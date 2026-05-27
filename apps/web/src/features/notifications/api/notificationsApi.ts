import { NOTIFICATIONS } from "@/mocks/notifications";
import { Notification } from "@fin/api-client";

export const getNotifications = async (): Promise<Notification[]> => {
  return NOTIFICATIONS;
};
