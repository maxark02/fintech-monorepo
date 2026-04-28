import { Transaction } from "@fin/api-client";
import { MOCK_TRANSACTIONS } from "@/mocks/transactions";

const Transactions = [{ MOCK_TRANSACTIONS }];

export const getTransactions = async (): Promise<Transaction[]> => {
  return MOCK_TRANSACTIONS;
};
