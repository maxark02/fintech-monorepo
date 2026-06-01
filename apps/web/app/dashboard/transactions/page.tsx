"use client";

import { PageHeader } from "../_components/PageHeader";
import { NavIcon } from "../_components/nav-icon";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { TransactionList } from "@/features/transactions/";
import { useState } from "react";
import { Skeleton } from "@fin/ui";
import { NumberPopIn } from "../_components/NumberPopIn";

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions();
  const totalIncome = (data ?? [])
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = (data ?? [])
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filterTabs: Array<{
    label: string;
    value: "all" | "income" | "expense";
  }> = [
    { label: "All", value: "all" },
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
  ];

  const filteredTransaction = data?.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <PageHeader
        title="Transactions"
        rightElement={
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
            <NavIcon name="plus" className="w-5 h-5" />
          </button>
        }
      />

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
          <NavIcon name="search" className="w-4.5 h-4.5" />
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full bg-[#1c1c22] text-white placeholder-white/40 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none border border-transparent focus:border-white/10"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.value
                ? "bg-[#3b5bdb] text-white"
                : "bg-[#1c1c22] text-white/60 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1c1c22] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
              <NavIcon
                name="arrow-down-left"
                className="w-4 h-4 text-green-500"
              />
            </div>
            <span className="text-white/50 text-xs">Income</span>
          </div>
          <p className="text-white font-bold text-base">
            {isLoading ? (
              <Skeleton className="w-20 h-5" />
            ) : (
              <NumberPopIn value={totalIncome.toLocaleString("ko-KR")} />
            )}
          </p>
        </div>
        <div className="bg-[#1c1c22] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center">
              <NavIcon name="arrow-up-right" className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-white/50 text-xs">Expense</span>
          </div>
          <p className="text-white font-bold text-base">
            {isLoading ? (
              <Skeleton className="w-20 h-5" />
            ) : (
              <NumberPopIn value={totalExpense.toLocaleString("ko-KR")} />
            )}
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList transactions={filteredTransaction ?? []} />
    </div>
  );
}
