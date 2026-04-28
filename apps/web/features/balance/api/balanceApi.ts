import { Balance } from "@fin/api-client";
import { MOCK_TRANSACTIONS } from "@/mocks/transactions";

const BASE_BALANCE = 0;

const totalIncome = MOCK_TRANSACTIONS.filter((t) => t.type === "income").reduce(
  (s, t) => s + t.amount,
  0,
);

const totalExpense = MOCK_TRANSACTIONS.filter(
  (t) => t.type === "expense",
).reduce((s, t) => s + t.amount, 0);

export const getBalance = async (): Promise<Balance> => {
  return {
    total: BASE_BALANCE + totalIncome - totalExpense,
    currency: "KRW",
    available: BASE_BALANCE,
    change: 0,
    changeAmount: 0,
    transactions: MOCK_TRANSACTIONS,
  };
};
