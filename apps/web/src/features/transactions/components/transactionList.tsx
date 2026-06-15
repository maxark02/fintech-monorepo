"use client";

import { Transaction } from "@fin/api-client";
import { formatKRW } from "@/lib/format";

type TransactionListProps = {
  transactions: Transaction[];
};

// Заголовок для группы: «Today» / «Yesterday» / «Sun, 15 June»
function formatDateHeader(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

// Группируем уже отсортированные (свежие сверху) транзакции по дате,
// сохраняя порядок: одинаковые даты подряд попадают в одну группу.
function groupByDate(transactions: Transaction[]) {
  const groups: { date: string; items: Transaction[] }[] = [];
  for (const t of transactions) {
    const last = groups[groups.length - 1];
    if (last && last.date === t.date) last.items.push(t);
    else groups.push({ date: t.date, items: [t] });
  }
  return groups;
}

export function TransactionList({ transactions }: TransactionListProps) {
  const groups = groupByDate(transactions);

  if (groups.length === 0) {
    return (
      <p className="text-text-muted text-sm text-center py-8">
        No transactions yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.date} className="space-y-2">
          {/* Заголовок даты — отдельное выделение для каждой новой даты */}
          <div className="sticky top-0 z-10 flex items-center gap-3 py-1 bg-bg-app/80 backdrop-blur-sm">
            <span className="text-text-muted text-xs font-semibold uppercase tracking-wide">
              {formatDateHeader(group.date)}
            </span>
            <span className="text-text-muted/50 text-[10px]">{group.date}</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Все транзакции этой даты — в одном столбце/блоке */}
          <div className="bg-bg-card rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-white/5 transition-colors">
            {group.items.map((transaction) => (
              <div
                key={transaction.id}
                className="px-4 py-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-icon-bg flex items-center justify-center text-base shrink-0">
                  {transaction.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-main font-medium text-sm truncate">
                    {transaction.title}
                  </p>
                  <p className="text-text-muted text-xs truncate">
                    {transaction.category} · {transaction.merchant}
                  </p>
                </div>
                <p
                  className={`font-semibold text-sm shrink-0 ${
                    transaction.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {`${transaction.type === "income" ? "+" : "-"}₩${formatKRW(
                    transaction.amount,
                  )}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
