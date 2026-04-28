import { User } from "@fin/api-client";

export type AuthStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

export const useAuthStore = () => {
  return <AuthStore>{};
};
