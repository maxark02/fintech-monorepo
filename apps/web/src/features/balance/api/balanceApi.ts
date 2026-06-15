import { Balance } from "@fin/api-client";
import { generateAccountData } from "@/lib/accountData";

export const getBalance = async (userId?: string | null): Promise<Balance> => {
  return generateAccountData(userId).balance;
};
