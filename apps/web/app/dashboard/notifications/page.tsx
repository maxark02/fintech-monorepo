"use client";

import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { PageHeader } from "#/app/dashboard/_components/PageHeader";

export default function NotificationsPage() {
  const { notifications, isLoading } = useNotifications();

  return (
    <div className="space-y-4">
      <PageHeader title="Notifications" />
      <h3 className="flex items-center justify-center">Notifications</h3>

      {isLoading ? (
        <p className="text-white/50 text-sm text-center">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-white/50 text-sm text-center">
          No notifications yet
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-[#1c1c22] rounded-2xl p-4">
              <p className="text-white font-medium text-sm">
                {notification.title}
              </p>
              <p className="text-white/50 text-xs mt-1">
                {notification.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
