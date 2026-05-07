"use client";

import { useEffect } from "react";
import { useState } from "react";
import { getBalance } from "../api/balanceApi";
import { useBalanceStore } from "../store/balanceStore";

export const useBalance = () => {
  const { balance, isLoading, error } = useBalanceStore();
  const { setBalance, setIsLoading, setError } = useBalanceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoading(true);
    console.log("fetching balance", balance);
    getBalance()
      .then((balance) => {
        console.log("getBalance loaded", balance);
        setBalance(balance);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("error", error);
        setError(error);
        setIsLoading(false);
        console.log(error);
      });
  }, [setBalance, setIsLoading, setError]);
  return { balance, isLoading, error, mounted };
};
