"use client";

import { NavIcon } from "../../../../app/dashboard/_components/nav-icon";
import { useBalance } from "@/features/balance/hooks/useBalance";
import { Skeleton } from "@fin/ui";
import { NumberPopIn } from "../../../../app/dashboard/_components/NumberPopIn";
import { formatKRW } from "@/lib/format";

export function BalanceCard() {
  const { balance } = useBalance();

  const totalIncome =
    balance?.transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0) ?? 0;

  const totalExpense =
    balance?.transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0) ?? 0;

  return (
    // 🌟 ИЗМЕНЕНО: Заменили bg-[#1c1c22] на bg-bg-card. Теперь фон карточки адаптивный.
    <div className="rounded-2xl p-6 bg-bg-card transition-colors">
      <div className="flex items-center justify-between mb-1">
        {/* 🌟 ИЗМЕНЕНО: Заменили text-white/60 на text-text-muted для второстепенного текста */}
        <span className="text-text-muted text-sm">Total Balance</span>
        {/* 🌟 ИЗМЕНЕНО: Заменили цвет кнопки на text-text-muted */}
        <button className="text-text-muted hover:opacity-80 transition-opacity">
          <NavIcon name="eye" className="w-5 h-5" />
        </button>
      </div>

      {/* 🌟 ИЗМЕНЕНО: Заменили text-white на text-text-main для основного жирного баланса */}
      <p className="text-text-main text-4xl font-bold mb-4">
        {!balance ? (
          <Skeleton className="w-32 h-10" />
        ) : (
          <NumberPopIn value={`₩${formatKRW(balance.total)}`} />
        )}
      </p>

      {/* 🌟 ИЗМЕНЕНО: Заменили border-white/20 на адаптивную границу border-slate-300 dark:border-white/10 */}
      <div className="flex items-center border-t border-slate-300 dark:border-white/10 pt-4">
        <div className="flex-1">
          {/* 🌟 ИЗМЕНЕНО: Заменили text-white/60 на text-text-muted */}
          <p className="text-text-muted text-xs mb-1">Income</p>
          {/* 🌟 ИЗМЕНЕНО: Заменили text-white на text-text-main */}
          <p className="text-text-main font-semibold text-sm">
            {!balance ? (
              <Skeleton className="w-15 h-5" />
            ) : (
              <NumberPopIn value={`₩${formatKRW(totalIncome)}`} />
            )}
          </p>
        </div>

        {/* 🌟 ИЗМЕНЕНО: Разделительная линия теперь тоже адаптивная (bg-slate-300 в светлой, белый с прозрачностью в темной) */}
        <div className="w-px h-8 bg-slate-300 dark:bg-white/10 mx-4"></div>

        <div className="flex-1">
          {/* 🌟 ИЗМЕНЕНО: Заменили text-white/60 на text-text-muted */}
          <p className="text-text-muted text-xs mb-1">Expenses</p>
          {/* 🌟 ИЗМЕНЕНО: Заменили text-white на text-text-main */}
          <p className="text-text-main font-semibold text-sm">
            {!balance ? (
              <Skeleton className="w-15 h-5" />
            ) : (
              <NumberPopIn value={`₩${formatKRW(totalExpense)}`} />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
