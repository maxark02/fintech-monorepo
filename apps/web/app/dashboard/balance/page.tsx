"use client";

import { useState } from "react";
import Link from "next/link";
import { Skeleton } from "@fin/ui";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { BalanceCard } from "@/features/balance";
import { NumberPopIn } from "#/app/dashboard/_components/NumberPopIn";
import { NavIcon } from "../_components/nav-icon";

import SalesItem from "@/features/sales/components/SalesItem";
import { useSales } from "@/features/sales/hooks/useSales";

export const dynamic = "force-dynamic";

const DEFAULT_WATCHLIST = ["AAPL", "TSLA", "NVDA", "BTC"];

export default function BalancePage() {
  const { user, isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);

  const { salesData, isLoading, error } = useSales(DEFAULT_WATCHLIST, 15000);

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
    // 🌟 ИЗМЕНЕНО: Добавили text-text-main, чтобы дефолтный цвет текста на странице наследовался из темы
    <div className="space-y-6 max-w-2xl mx-auto pb-24 px-4 md:px-0 text-text-main">
      {/* Шапка: Аватарка и приветствие */}
      <div className="flex items-center justify-between mb-2">
        <div className="relative flex items-center gap-3">
          <Link href="/dashboard/profile">
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

          <p className="text-xs font-medium">
            Welcome back, <br />
            <NumberPopIn value={username} />
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/settings">
            {/* 🌟 ИЗМЕНЕНО: Заменили bg-[#1c1c22] на bg-bg-card. Текст теперь управляется темой. Добавлен hover-эффект через прозрачность */}
            <button className="w-9 h-9 rounded-full bg-bg-card flex items-center justify-center text-current hover:opacity-80 transition-opacity">
              <NavIcon name="settings" className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Банковское меню (Баланс) */}
      <BalanceCard />

      {/* Кнопки действий (Перевод / Карты) */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/transfer" className="w-full">
          <div className="flex flex-col items-center">
            {/* 🌟 ИЗМЕНЕНО: Заменили bg-[#1c1c22] на bg-bg-card, а hover:bg-[#2c2c35] на hover:opacity-90 */}
            <button className="w-full h-14 rounded-2xl bg-bg-card flex items-center justify-center hover:opacity-90 transition-opacity">
              <NavIcon name="arrow-up-right" className="w-6 h-6 text-red-500" />
            </button>
          </div>
        </Link>
        <Link href="/dashboard/cards" className="w-full">
          <div className="flex flex-col items-center">
            {/* 🌟 ИЗМЕНЕНО: Заменили bg-[#1c1c22] на bg-bg-card, убрали хардкод ховера */}
            <button className="w-full h-14 rounded-2xl bg-bg-card flex items-center justify-center hover:opacity-90 transition-opacity">
              <NavIcon name="card" className="w-6 h-6 text-blue-400" />
            </button>
          </div>
        </Link>
      </div>

      {/* БЛОК АКЦИЙ (MARKET WATCH) В САМОМ НИЗУ */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center px-1">
          {/* 🌟 ИЗМЕНЕНО: Заменили text-white на text-text-main (в светлой теме заголовок будет темным, в темной — белым) */}
          <h3 className="text-base font-bold text-text-main tracking-tight">
            Market Watch
          </h3>
          <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-semibold">
            Live updates
          </span>
        </div>

        {/* 🌟 ИЗМЕНЕНО: Главный контейнер списка акций теперь использует bg-bg-card вместо bg-[#1c1c22] */}
        <div className="bg-bg-card rounded-3xl p-5 space-y-1 shadow-lg">
          {/* Состояние скелетона при первой загрузке API */}
          {isLoading && (!salesData || salesData.length === 0) && (
            // 🌟 ИЗМЕНЕНО: Заменили text-muted-foreground (старый класс Tailwind) на ваш text-text-muted
            <div className="text-sm text-text-muted py-2 px-1 animate-pulse">
              Loading stock quotes...
            </div>
          )}

          {/* Состояние ошибки */}
          {error && (
            <div className="text-xs text-red-400 py-2 px-1 text-center">
              Failed to refresh market data.
            </div>
          )}

          {/* Рендерим карточки акций */}
          {!isLoading &&
            salesData &&
            salesData.map((stock) => (
              <SalesItem key={stock.ticker} item={stock} />
            ))}
        </div>
      </div>
    </div>
  );
}
