"use client";

import { Transaction } from "@fin/api-client";
import { NumberPopIn } from "../../../../app/dashboard/_components/NumberPopIn";

type TransactionListProps = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-bg-card rounded-2xl px-4 py-3 flex items-center gap-3 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <p className="text-text-main font-medium text-sm truncate">
              {transaction.title}
            </p>
            <p className="text-text-muted text-xs">
              {transaction.category} · {transaction.date}
            </p>
          </div>
          <p
            className={`font-semibold text-sm shrink-0 ${
              transaction.type === "income" ? "text-green-400" : "text-red-400"
            }`}
          >
            {`${transaction.type === "income" ? "+" : "-"}₩${Math.abs(transaction.amount).toLocaleString("ko-KR")}`}
          </p>
        </div>
      ))}
    </div>
  );
}
