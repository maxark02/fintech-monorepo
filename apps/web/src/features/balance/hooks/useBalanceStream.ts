import { useEffect } from "react";
import { getBalance } from "../api/balanceApi";
import { useBalanceStore } from "../store/balanceStore";
import { useAuthStore } from "@/features/auth/store/authStore";

export const useBalanceStream = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const { setBalance, setIsLoading, setError } = useBalanceStore();

  useEffect(() => {
    const interval = setInterval(() => {
      getBalance(userId)
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
  }, [userId]);
};
