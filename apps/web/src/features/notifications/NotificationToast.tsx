"use client";

import { useEffect, useState } from "react";
import { Notification } from "@fin/api-client";
import { useNotificationStore } from "./notificationStore";
import { NavIcon } from "#/app/dashboard/_components/nav-icon";
import type { IconName } from "#/app/dashboard/_components/nav-icon";

const ICON: Record<Notification["type"], { name: IconName; cls: string }> = {
  transaction: { name: "arrow-down-left", cls: "bg-green-500/15 text-green-500" },
  security: { name: "shield", cls: "bg-red-500/15 text-red-500" },
  promo: { name: "trending-up", cls: "bg-purple-500/15 text-purple-500" },
  system: { name: "bell", cls: "bg-blue-500/15 text-blue-500" },
};

export function NotificationToast() {
  const toast = useNotificationStore((s) => s.toast);
  const dismiss = useNotificationStore((s) => s.dismissToast);
  const [current, setCurrent] = useState<Notification | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setCurrent(toast);
    // Запускаем анимацию входа на следующий кадр
    requestAnimationFrame(() => setShown(true));
    const hide = setTimeout(() => setShown(false), 4000);
    const clear = setTimeout(() => dismiss(), 4400);
    return () => {
      clearTimeout(hide);
      clearTimeout(clear);
    };
  }, [toast, dismiss]);

  if (!current) return null;
  const icon = ICON[current.type];

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
      <div
        onClick={() => setShown(false)}
        className={`pointer-events-auto w-full max-w-sm bg-bg-card border border-slate-200 dark:border-white/10 shadow-xl rounded-2xl p-3 flex items-center gap-3 transition-all duration-300 ease-out ${
          shown ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${icon.cls}`}
        >
          <NavIcon name={icon.name} className="w-4.5 h-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-text-main font-semibold text-sm truncate">
            {current.title}
          </p>
          <p className="text-text-muted text-xs truncate">{current.message}</p>
        </div>
      </div>
    </div>
  );
}
