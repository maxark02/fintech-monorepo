import { useEffect, useState } from "react";
import { Transaction } from "@fin/api-client";
import { getTransactions } from "../api/transactionApi";

export const useTransactions = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTransactions()
      .then((transactions) => {
        setData(transactions);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, error };
};
