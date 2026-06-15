"use client";

import { PageHeader } from "#/app/dashboard/_components/PageHeader";
import { NavIcon } from "../_components/nav-icon";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { TransactionList } from "@/features/transactions/";
import { useState } from "react";
import { Skeleton } from "@fin/ui";
import { NumberPopIn } from "../_components/NumberPopIn";
import { formatKRW } from "@/lib/format";

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
          <button className="w-9 h-9 rounded-full bg-icon-bg flex items-center justify-center text-text-main">
            <NavIcon name="plus" className="w-5 h-5" />
          </button>
        }
      />

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
          <NavIcon name="search" className="w-4.5 h-4.5" />
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full bg-bg-card text-text-main placeholder-text-muted rounded-2xl pl-11 pr-4 py-3 text-sm outline-none border border-transparent focus:border-border transition-colors"
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
                ? "bg-accent text-white"
                : "bg-bg-card text-text-muted hover:text-text-main"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
              <NavIcon
                name="arrow-down-left"
                className="w-4 h-4 text-green-500"
              />
            </div>
            <span className="text-text-muted text-xs">Income</span>
          </div>
          <p className="text-text-main font-bold text-base">
            {isLoading ? (
              <Skeleton className="w-20 h-5" />
            ) : (
              <NumberPopIn value={`₩${formatKRW(totalIncome)}`} />
            )}
          </p>
        </div>
        <div className="bg-bg-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center">
              <NavIcon name="arrow-up-right" className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-text-muted text-xs">Expense</span>
          </div>
          <p className="text-text-main font-bold text-base">
            {isLoading ? (
              <Skeleton className="w-20 h-5" />
            ) : (
              <NumberPopIn value={`₩${formatKRW(totalExpense)}`} />
            )}
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList transactions={filteredTransaction ?? []} />
    </div>
  );
}
