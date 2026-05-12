"use client";

import { useEffect } from "react";
import { getBalance } from "../api/balanceApi";
import { useBalanceStore } from "../store/balanceStore";

export const useBalance = () => {
  const balance = useBalanceStore((s) => s.balance);
  const isLoading = useBalanceStore((s) => s.isLoading);
  const error = useBalanceStore((s) => s.error);
  const setBalance = useBalanceStore((s) => s.setBalance);
  const setIsLoading = useBalanceStore((s) => s.setIsLoading);
  const setError = useBalanceStore((s) => s.setError);

  useEffect(() => {
    setIsLoading(true);
    getBalance()
      .then((data) => {
        setBalance(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { balance, isLoading, error };
};
