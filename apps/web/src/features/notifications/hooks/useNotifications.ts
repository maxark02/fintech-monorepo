"use client";

import { useNotificationStore } from "../notificationStore";

export const useNotifications = () => {
  const notifications = useNotificationStore((s) => s.items);
  return { notifications, isLoading: false };
};
