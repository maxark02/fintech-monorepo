"use client";

import { useEffect, useMemo, useState } from "react";
import { Transaction } from "@fin/api-client";
import { getTransactions } from "../api/transactionApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useLedgerStore } from "@/features/ledger/ledgerStore";
import { mergeTransactions } from "@/features/ledger/applyLedger";

export const useTransactions = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const extraTx = useLedgerStore((s) =>
    userId ? s.txByUser[userId] : undefined,
  );

  const [base, setBase] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getTransactions(userId)
      .then((transactions) => {
        setBase(transactions);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [userId]);

  // Ручные транзакции (переводы) добавляются и пересортировываются реактивно
  const data = useMemo(
    () => mergeTransactions(base, extraTx ?? []),
    [base, extraTx],
  );

  return { data, isLoading, error };
};
