"use client";

import { NavIcon } from "../../../app/dashboard/_components/nav-icon";
import { useBalance } from "../hooks/useBalance";
import { Skeleton } from "@fin/ui";
import { NumberPopIn } from "../../../app/dashboard/_components/NumberPopIn";

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
    <div className="rounded-2xl p-6 bg-[#1c1c22]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-white/60 text-sm">Total Balance</span>
        <button className="text-white/60">
          <NavIcon name="eye" className="w-5 h-5" />
        </button>
      </div>

      <p className="text-white text-4xl font-bold mb-4">
        {!balance ? (
          <Skeleton className="w-32 h-10" />
        ) : (
          <NumberPopIn value={`₩${balance.total.toLocaleString("ko-KR")}`} />
        )}
      </p>

      <div className="flex items-center border-t border-white/20 pt-4">
        <div className="flex-1">
          <p className="text-white/60 text-xs mb-1">Income</p>
          <p className="text-white font-semibold text-sm">
            {!balance ? (
              <Skeleton className="w-15 h-5" />
            ) : (
              <NumberPopIn value={`₩${totalIncome.toLocaleString("ko-KR")}`} />
            )}
          </p>
        </div>
        <div className="w-px h-8 bg-white/20 mx-4"></div>
        <div className="flex-1">
          <p className="text-white/60 text-xs mb-1">Expenses</p>
          <p className="text-white font-semibold text-sm">
            {!balance ? (
              <Skeleton className="w-15 h-5" />
            ) : (
              <NumberPopIn value={`₩${totalExpense.toLocaleString("ko-KR")}`} />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
