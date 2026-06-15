"use client";

import { useMemo, useState } from "react";
import { Transaction } from "@fin/api-client";
import { formatKRW } from "@/lib/format";
import { NavIcon } from "#/app/dashboard/_components/nav-icon";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => String(n).padStart(2, "0");

// Компактная сумма для ячейки: 12k / 1.2M
const compact = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1000
      ? `${Math.round(v / 1000)}k`
      : String(v);

export function SpendingCalendar({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based

  // Сколько потрачено (списано) в каждый день: сумма всех отрицательных сумм
  const spendByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of transactions) {
      if (t.amount < 0) map[t.date] = (map[t.date] ?? 0) + -t.amount;
    }
    return map;
  }, [transactions]);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate(),
  )}`;

  const monthKeys = Array.from(
    { length: daysInMonth },
    (_, i) => `${year}-${pad(month + 1)}-${pad(i + 1)}`,
  );
  const maxSpend = Math.max(1, ...monthKeys.map((k) => spendByDate[k] ?? 0));
  const monthTotal = monthKeys.reduce((s, k) => s + (spendByDate[k] ?? 0), 0);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-bg-card rounded-2xl p-4 transition-colors">
      {/* Навигация по месяцам */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-full bg-icon-bg flex items-center justify-center text-text-main hover:opacity-80 rotate-180"
        >
          <NavIcon name="chevron-right" className="w-4 h-4" />
        </button>
        <span className="text-text-main font-semibold text-sm">
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full bg-icon-bg flex items-center justify-center text-text-main hover:opacity-80"
        >
          <NavIcon name="chevron-right" className="w-4 h-4" />
        </button>
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-text-muted text-[10px] font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Сетка дней */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const key = `${year}-${pad(month + 1)}-${pad(day)}`;
          const spend = spendByDate[key] ?? 0;
          const intensity = spend > 0 ? 0.12 + (spend / maxSpend) * 0.5 : 0;
          const isToday = key === todayKey;
          return (
            <div
              key={key}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center px-0.5 ${
                isToday ? "ring-1 ring-accent" : ""
              }`}
              style={
                spend > 0
                  ? { backgroundColor: `rgba(239, 68, 68, ${intensity})` }
                  : undefined
              }
            >
              <span className="text-text-main text-[11px] leading-none">
                {day}
              </span>
              {spend > 0 && (
                <span className="text-red-300 text-[8px] leading-tight mt-0.5">
                  {compact(spend)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Итог за месяц */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-white/10">
        <span className="text-text-muted text-xs">Spent this month</span>
        <span className="text-text-main font-bold text-sm">
          ₩{formatKRW(monthTotal)}
        </span>
      </div>
    </div>
  );
}
