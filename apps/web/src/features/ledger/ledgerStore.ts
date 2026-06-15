"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Card, Transaction } from "@fin/api-client";

/**
 * «Ledger» — слой пользовательских изменений поверх детерминированно
 * сгенерированных данных аккаунта. Хранится в localStorage, ключ по userId:
 *  - добавленные вручную карты;
 *  - ручные транзакции (например, переводы), которые уменьшают баланс.
 *
 * Сгенерированные данные остаются неизменными, а здесь лежат «мутации».
 */
type LedgerState = {
  cardsByUser: Record<string, Card[]>;
  txByUser: Record<string, Transaction[]>;
  addCard: (userId: string, card: Card) => void;
  addTransaction: (userId: string, tx: Transaction) => void;
};

export const useLedgerStore = create<LedgerState>()(
  persist(
    (set) => ({
      cardsByUser: {},
      txByUser: {},

      addCard: (userId, card) =>
        set((s) => ({
          cardsByUser: {
            ...s.cardsByUser,
            [userId]: [...(s.cardsByUser[userId] ?? []), card],
          },
        })),

      addTransaction: (userId, tx) =>
        set((s) => ({
          txByUser: {
            ...s.txByUser,
            [userId]: [...(s.txByUser[userId] ?? []), tx],
          },
        })),
    }),
    { name: "ledger-storage" },
  ),
);
