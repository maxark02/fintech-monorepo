"use client";
export const dynamic = "force-dynamic";

import { NavIcon } from "../_components/nav-icon";
import { BalanceCard } from "@/features/balance";
import Link from "next/link";
import { Skeleton } from "@fin/ui";
// 1. Импортируем ВАШ хук авторизации (проверьте этот путь к файлу!)
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function BalancePage() {
  // 2. Достаем данные из Zustand через ваш хук
  const { user, isAuthenticated } = useAuth();

  // 3. Берем username (безопасно, с фоллбэком на случай загрузки)
  const username = user?.username ?? "";
  const shortUsername = username ? username[0].toUpperCase() : "?";

  return (
    <div className="space-y-4 max-w-2xl mx-auto ">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#130e40] flex items-center justify-center text-white font-bold text-sm">
            <Link href="/dashboard/profile">{shortUsername}</Link>
          </div>
          <Link href="/dashboard/profile">
            <p className="text-white/50 text-xs">Welcome back,</p>

            {/* 4. Если Zustand еще не определил юзера, показываем скелетон */}
            {!isAuthenticated || !username ? (
              <Skeleton className="w-30 h-5 mt-1" />
            ) : (
              <div>
                <p className="text-white font-bold text-sm">{username}</p>
              </div>
            )}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/settings">
            <button className="w-9 h-9 rounded-full bg-[#1c1c22] flex items-center justify-center text-white">
              <NavIcon name="settings" className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      <BalanceCard />

      <div className="grid grid-cols-2">
        <div className="flex flex-col items-center">
          <button className="w-45 h-14 rounded-2xl bg-[#1c1c22] flex items-center justify-center">
            <NavIcon name="arrow-up-right" className="w-6 h-6 text-red-500" />
          </button>
        </div>
        <Link href="/dashboard/cards">
          <div className="flex flex-col items-center gap-2">
            <button className="w-45 h-14 rounded-2xl bg-[#1c1c22] flex items-center justify-center">
              <NavIcon name="card" className="w-6 h-6 text-blue-400" />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
