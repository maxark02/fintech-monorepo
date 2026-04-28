"use client"

import { useState } from "react"
import { PageHeader } from "../_components/PageHeader"
import { NavIcon, IconName } from "../_components/nav-icon"

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex items-center w-12 h-6 rounded-full transition-colors shrink-0"
      style={{ backgroundColor: enabled ? "#3b5bdb" : "rgba(255,255,255,0.2)" }}
    >
      <span
        className="inline-block w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
        style={{ transform: enabled ? "translateX(26px)" : "translateX(4px)" }}
      />
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white/50 font-medium text-sm mb-2 px-1">{children}</p>
  )
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(true)

  const quickSettings = [
    {
      icon: "moon" as IconName,
      label: "Dark Mode",
      description: "Enable dark theme",
      enabled: darkMode,
      onToggle: () => setDarkMode(!darkMode),
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
  ]

  const accountItems: { icon: IconName; label: string }[] = [
    { icon: "credit-card", label: "Payment Methods" },
    { icon: "shield", label: "Security & Privacy" },
    { icon: "eye", label: "Data & Personalization" },
  ]

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" />

      {/* Quick Settings */}
      <div>
        <SectionLabel>Quick Settings</SectionLabel>
        <div className="bg-[#1c1c22] rounded-2xl overflow-hidden divide-y divide-white/5">
          {quickSettings.map((item) => (
            <div key={item.label} className="flex items-center gap-4 px-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#252530] flex items-center justify-center text-white/70 shrink-0">
                <NavIcon name={item.icon} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-white/50 text-xs">{item.description}</p>
              </div>
              <Toggle enabled={item.enabled} onToggle={item.onToggle} />
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div>
        <SectionLabel>Account</SectionLabel>
        <div className="space-y-2">
          {accountItems.map((item) => (
            <button
              key={item.label}
              className="w-full bg-[#1c1c22] rounded-2xl px-4 py-4 flex items-center gap-4 hover:bg-[#252530] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#252530] flex items-center justify-center text-white/70 shrink-0">
                <NavIcon name={item.icon} className="w-5 h-5" />
              </div>
              <p className="text-white text-sm font-medium flex-1 text-left">{item.label}</p>
              <NavIcon name="chevron-right" className="w-4 h-4 text-white/30 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div>
        <SectionLabel>Preferences</SectionLabel>
        <button className="w-full bg-[#1c1c22] rounded-2xl px-4 py-4 flex items-center gap-4 hover:bg-[#252530] transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#252530] flex items-center justify-center text-white/70 shrink-0">
            <NavIcon name="globe" className="w-5 h-5" />
          </div>
          <p className="text-white text-sm font-medium flex-1 text-left">Language & Region</p>
          <span className="text-white/50 text-xs mr-1">English (US)</span>
          <NavIcon name="chevron-right" className="w-4 h-4 text-white/30 shrink-0" />
        </button>
      </div>
    </div>
  )
}
