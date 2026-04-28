import { useEffect, useState } from "react";
import { getBalance } from "../api/balanceApi";
import { useBalanceStore } from "../store/balanceStore";

export const useBalanceStream = () => {
  const { setBalance, setIsLoading, setError } = useBalanceStore();

  useEffect(() => {
    const interval = setInterval(() => {
      getBalance()
        .then((balance) => {
          setBalance(balance);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          console.log(error);
        });
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);
};
