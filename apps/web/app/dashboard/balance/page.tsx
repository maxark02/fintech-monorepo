"use client";
import { Camera } from "lucide-react";

export const dynamic = "force-dynamic";

import { NavIcon } from "../_components/nav-icon";
import { BalanceCard } from "@/features/balance";
import Link from "next/link";
import { Skeleton } from "@fin/ui";
// 1. Импортируем ВАШ хук авторизации (проверьте этот путь к файлу!)
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";
import { NumberPopIn } from "#/app/dashboard/_components/NumberPopIn";

export default function BalancePage() {
  // 2. Достаем данные из Zustand через ваш хук
  const { user, isAuthenticated } = useAuth();

  const [imageError, setImageError] = useState(false);

  // 3. Берем username (безопасно, с фоллбэком на случай загрузки)
  const username = user?.username ?? "";
  const shortUsername = username ? username[0].toUpperCase() : "?";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const fullAvatarUrl =
    user?.avatarUrl && supabaseUrl
      ? user.avatarUrl.startsWith("http")
        ? user.avatarUrl
        : `${supabaseUrl}/storage/v1/object/public/avatars/${user.avatarUrl}`
      : null;

  return (
    <div className="space-y-4 max-w-2xl mx-auto ">
      <div className="flex items-center justify-between mb-2">
        {/* 🌟 Добавили flex, items-center и отступ gap-3 между аватаркой и текстом */}
        <div className="relative flex items-center gap-3">
          <Link href="/dashboard/profile">
            {/* ДИНАМИЧЕСКАЯ АВАТАРКА */}
            {fullAvatarUrl && !imageError ? (
              <div className="w-10 h-10 rounded-full overflow-hidden ">
                <img
                  src={fullAvatarUrl}
                  alt={username}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-xs text-white"> {shortUsername}</span>
              </div>
            )}
          </Link>

          {/* Теперь текст будет аккуратно стоять справа от аватарки на той же линии */}
          <p className="text-xs font-medium">
            Welcome back, <br />
            <NumberPopIn value={username} />
          </p>
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
