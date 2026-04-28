import { useEffect } from "react";
import { getBalance } from "../api/balanceApi";
import { useBalanceStore } from "../store/balanceStore";

export const useBalance = () => {
  const { balance, isLoading, error } = useBalanceStore();
  const { setBalance, setIsLoading, setError } = useBalanceStore();

  useEffect(() => {
    getBalance()
      .then((balance) => {
        setBalance(balance);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
        console.log(error);
      });
  }, []);
  return { balance, isLoading, error };
};
