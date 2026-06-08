"use client";

import { NumberPopIn } from "#/app/dashboard/_components/NumberPopIn";

export const dynamic = "force-dynamic";

import {
  ArrowLeft,
  Camera,
  ChevronRight,
  LogOut,
  Shield,
  Bell,
  Globe,
  CreditCard,
  Users,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useBalance } from "@/features/balance/hooks/useBalance";
import { Skeleton } from "@fin/ui";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ProfilePage() {
  const menuItems = [
    {
      icon: CreditCard,
      label: "Payment Methods",
      description: "Manage cards and accounts",
      link: "/dashboard/cards",
    },
    {
      icon: Shield,
      label: "Security",
      description: "Password, 2FA, biometrics",
      link: "#",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Push, email, SMS",
      link: "#",
    },
    {
      icon: Globe,
      label: "Language & Region",
      description: "English, Russia",
      link: "#",
    },
    {
      icon: Users,
      label: "Referral Program",
      description: "Invite friends and earn",
      link: "#",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQ, Contact us",
      link: "#",
    },
  ];

  // Достаем данные и метод логаута из нашего Zustand-хука
  const { user, isAuthenticated, logout } = useAuth();
  const { balance, isLoading } = useBalance();

  const transactionCount = balance?.transactions?.length ?? 0;
  const cardCount = balance?.cards?.length ?? 0;

  // Безопасно вытаскиваем username из Zustand
  const username = user?.username ?? "User";
  const shortUsername = username ? username[0].toUpperCase() : "U";
  const email = user?.email ?? "user@example.com";

  return (
    <div className="dark text-foreground h-screen ">
      {/* Header */}
      <header className="sticky ">
        <div className="max-w-3xl mx-auto px-4 md:px-6 ">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/balance"
              className="w-10 h-10 rounded-full bg-accent hover:bg-accent/70 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1>Profile</h1>
            <Link
              href="/dashboard/settingsProfile"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Edit
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto md:px-6 py-6 pb-24 md:pb-6">
        {/* Profile Card */}
        <div className="bg-[#1c1c22] rounded-3xl p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">{shortUsername}</span>
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-background">
                <Camera size={14} className="text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl mb-1">
                {/* Заменили рушащий сборку session на проверку авторизации */}
                {!isAuthenticated ? (
                  <Skeleton className="w-24 h-5" />
                ) : (
                  <NumberPopIn value={username} />
                )}
              </h2>
              <span className="text-muted-foreground text-sm">
                <NumberPopIn value={email} />
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-xl mb-1 flex items-center justify-center gap-0.5">
                {isLoading ? (
                  "..."
                ) : (
                  <>
                    <span>₩</span>
                    {/* Передаем только число, либо уже отформатированное число без знака */}
                    <NumberPopIn
                      value={balance?.total.toLocaleString("ko-KR") ?? "0"}
                    />
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Total Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                <NumberPopIn value={String(cardCount)} />
              </div>
              <div className="text-sm text-muted-foreground">Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">
                <NumberPopIn value={String(transactionCount)} />
              </div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2 mb-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="flex items-center gap-4 bg-[#1c1c22] rounded-2xl p-4 hover:bg-accent/70 transition-colors"
            >
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center">
                <item.icon size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="mb-1">{item.label}</div>
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-600/10 border border-red-600/30 text-red-600 rounded-2xl py-4 hover:bg-red-600/20 transition-colors"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </main>
    </div>
  );
}
