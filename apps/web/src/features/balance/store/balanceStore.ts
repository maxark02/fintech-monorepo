import { create } from "zustand";
import { Balance } from "@fin/api-client";

type BalanceStore = {
  balance: Balance | null;
  isLoading: boolean;
  error: string | null;

  setBalance: (balance: Balance) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useBalanceStore = create<BalanceStore>((set) => ({
  balance: null,
  isLoading: false,
  error: null,

  setBalance: (balance) => set({ balance }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
