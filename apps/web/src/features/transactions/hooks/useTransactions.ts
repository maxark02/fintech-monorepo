import { useEffect, useState } from "react";
import { Transaction } from "@fin/api-client";
import { getTransactions } from "../api/transactionApi";
import { useAuthStore } from "@/features/auth/store/authStore";

export const useTransactions = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getTransactions(userId)
      .then((transactions) => {
        setData(transactions);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [userId]);

  return { data, isLoading, error };
};
