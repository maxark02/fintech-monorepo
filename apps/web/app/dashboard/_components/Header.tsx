"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard/balance": "Balance",
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/transactions": "Transactions",
  "/dashboard/notifications": "Notifications",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="flex items-center justify-between px-4 py-4 md:px-8 border-b border-white/10">
      {/* Логотип — только на десктопе (на мобильном его показывает Sidebar) */}

      <div className="flex items-center gap-3">
        <span className="text-white font-bold text-lg tracking-tight hidden md:block">
          FinApp
        </span>
        {/* На мобильном показываем заголовок текущей страницы */}
        <span className="text-white font-semibold text-base md:hidden">
          {title}
        </span>
      </div>

      {/* Аватар пользователя */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white text-sm font-medium">
          A
        </button>
      </div>
    </header>
  );
}
