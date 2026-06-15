"use client";

import { create } from "zustand";
import { Notification } from "@fin/api-client";
import { NOTIFICATIONS } from "@/mocks/notifications";

/**
 * Стор уведомлений на время сессии. Изначально засеян моками, новые
 * уведомления (приходящие в случайные моменты) добавляются сверху и
 * показываются тостом.
 */
type NotificationState = {
  items: Notification[];
  toast: Notification | null;
  push: (n: Notification) => void;
  dismissToast: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  items: NOTIFICATIONS,
  toast: null,
  push: (n) => set((s) => ({ items: [n, ...s.items], toast: n })),
  dismissToast: () => set({ toast: null }),
}));
