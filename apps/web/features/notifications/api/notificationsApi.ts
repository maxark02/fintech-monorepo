import { NOTIFICATIONS } from "@/mocks/notifications";
import { Notification } from "../../../../../packages/api-client/src";

export const getNotifications = async (): Promise<Notification[]> => {
  return NOTIFICATIONS;
};
