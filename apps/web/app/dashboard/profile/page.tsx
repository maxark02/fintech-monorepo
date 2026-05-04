import Link from "next/link";
import { PageHeader } from "../_components/PageHeader";
import { NavIcon } from "../_components/nav-icon";

const menuItems = [
  {
    icon: "credit-card" as const,
    label: "Payment Methods",
    description: "Manage cards and accounts",
    href: "/dashboard/cards",
  },
  {
    icon: "shield" as const,
    label: "Security",
    description: "Password, 2FA, biometrics",
    href: "/dashboard/settings",
  },
  {
    icon: "bell" as const,
    label: "Notifications",
    description: "Push, email, SMS",
    href: "/dashboard/settings",
  },
];

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Profile"
        rightElement={
          <button className="text-[#3b5bdb] text-sm font-semibold">Edit</button>
        }
      />

      {/* Profile Card */}
      <div className="bg-[#1c1c22] rounded-2xl p-5">
        <div className="flex flex-col items-center mb-5">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full bg-[#3b5bdb] flex items-center justify-center text-white font-bold text-xl">
              MX
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#3b5bdb] flex items-center justify-center">
              <NavIcon name="camera" className="w-3 h-3 text-white" />
            </div>
          </div>
          <h2 className="text-white font-bold text-lg">MrXlebka</h2>
          <p className="text-white/50 text-sm">maxark02@email.com</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-white/10">
          <div className="flex flex-col items-center py-2">
            <span className="text-white font-bold text-base">₽2.4M</span>
            <span className="text-white/50 text-xs mt-0.5">Total Balance</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <span className="text-white font-bold text-base">3</span>
            <span className="text-white/50 text-xs mt-0.5">Cards</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <span className="text-white font-bold text-base">127</span>
            <span className="text-white/50 text-xs mt-0.5">Transactions</span>
          </div>
        </div>
      </div>

      {/* Account Level */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #1a1040 0%, #2d1b69 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs">Account Level</span>
          <div className="w-9 h-9 rounded-xl bg-[#3b5bdb] flex items-center justify-center">
            <NavIcon name="shield" className="w-5 h-5 text-white" />
          </div>
        </div>

        <p className="text-white font-bold text-xl mb-4">Premium Member</p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs">Level Progress</span>
          <span className="text-white text-xs font-medium">75%</span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-[#1f1a35] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: "75%",
              background: "linear-gradient(to right, #3b5bdb, #a855f7)",
            }}
          ></div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-[#1c1c22] rounded-2xl px-4 py-4 flex items-center gap-4 hover:bg-[#252530] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#252530] flex items-center justify-center text-white/70 shrink-0">
              <NavIcon name={item.icon} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{item.label}</p>
              <p className="text-white/50 text-xs">{item.description}</p>
            </div>
            <NavIcon
              name="chevron-right"
              className="w-4 h-4 text-white/30 shrink-0"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
