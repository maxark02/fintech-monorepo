"use client";

import { useState } from "react";
import { PageHeader } from "../_components/PageHeader";
import { NavIcon, IconName } from "../_components/nav-icon";
import { useTheme } from "../../providers";

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors shrink-0 
        ${enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-white/20"}`}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full transition-transform shadow-sm 
          ${enabled ? "translate-x-[26px]" : "translate-x-[4px]"}`}
      />
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  // Улучшили видимость текста в обеих темах
  return (
    <p className="text-slate-500 dark:text-white/50 font-medium text-sm mb-2 px-1">
      {children}
    </p>
  );
}

export default function SettingsPage() {
  const { isDarkMode, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);

  const quickSettings = [
    {
      icon: "moon" as IconName,
      label: "Dark Mode",
      description: "Enable dark theme",
      enabled: isDarkMode,
      onToggle: toggleTheme,
    },
    {
      icon: "bell" as IconName,
      label: "Notifications",
      description: "Push notifications",
      enabled: notifications,
      onToggle: () => setNotifications(!notifications),
    },
    {
      icon: "lock" as IconName,
      label: "Biometric Login",
      description: "Use fingerprint or Face ID",
      enabled: biometric,
      onToggle: () => setBiometric(!biometric),
    },
  ];

  return (
    <div className="p-4 space-y-5">
      <PageHeader title="Settings" />

      {/* Пример использования новых семантических классов */}
      <div className="bg-bg-card rounded-2xl overflow-hidden divide-y divide-slate-300 dark:divide-white/5">
        {quickSettings.map((item) => (
          <div key={item.label} className="flex items-center gap-4 px-4 py-4">
            {/* Иконка использует bg-icon-bg */}
            <div className="w-10 h-10 rounded-full bg-icon-bg flex items-center justify-center shrink-0">
              <NavIcon name={item.icon} className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Заголовок и описание используют наши переменные */}
              <p className="text-text-main text-sm font-medium">{item.label}</p>
              <p className="text-text-muted text-xs">{item.description}</p>
            </div>

            <Toggle enabled={item.enabled} onToggle={item.onToggle} />
          </div>
        ))}
      </div>
    </div>
  );
}
