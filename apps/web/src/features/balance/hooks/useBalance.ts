"use client";

import { useEffect, useMemo, useState } from "react";
import { Balance } from "@fin/api-client";
import { getBalance } from "../api/balanceApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useLedgerStore } from "@/features/ledger/ledgerStore";
import { applyLedger } from "@/features/ledger/applyLedger";

export const useBalance = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const extraCards = useLedgerStore((s) =>
    userId ? s.cardsByUser[userId] : undefined,
  );
  const extraTx = useLedgerStore((s) =>
    userId ? s.txByUser[userId] : undefined,
  );

  const [base, setBase] = useState<Balance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getBalance(userId)
      .then((data) => {
        setBase(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [userId]);

  // Накладываем ledger (добавленные карты + переводы) реактивно
  const balance = useMemo(
    () => (base ? applyLedger(base, extraCards ?? [], extraTx ?? []) : null),
    [base, extraCards, extraTx],
  );

  return { balance, isLoading, error };
};
