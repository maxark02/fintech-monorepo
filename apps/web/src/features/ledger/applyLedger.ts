import { Balance, Card, Transaction } from "@fin/api-client";

// Объединяет сгенерированные транзакции с ручными (ledger), сортируя по дате.
export function mergeTransactions(
  base: Transaction[],
  extra: Transaction[],
): Transaction[] {
  return [...extra, ...base].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}

// Накладывает ledger на сгенерированный баланс: добавляет карты, ручные
// транзакции и корректирует общий баланс на их сумму (перевод уменьшает).
export function applyLedger(
  base: Balance,
  extraCards: Card[],
  extraTx: Transaction[],
): Balance {
  const delta = extraTx.reduce((s, t) => s + t.amount, 0);
  return {
    ...base,
    total: Math.max(0, base.total + delta),
    transactions: mergeTransactions(base.transactions, extraTx),
    cards: [...base.cards, ...extraCards],
  };
}
