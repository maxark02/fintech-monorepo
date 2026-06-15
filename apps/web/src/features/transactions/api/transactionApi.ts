import { Transaction } from "@fin/api-client";
import { generateAccountData } from "@/lib/accountData";

export const getTransactions = async (
  userId?: string | null,
): Promise<Transaction[]> => {
  return generateAccountData(userId).transactions;
};
