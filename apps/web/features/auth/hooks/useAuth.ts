import { useAuthStore } from "../store/authStore";
import { login as loginApi, register as registerApi } from "../api/authApi";
import { useRouter } from "next/navigation";
import type { User } from "@fin/api-client";

export type AuthState = {
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  user: User | null;
};

export const useAuth = () => {
  const setUser = useAuthStore((state: AuthState) => state.setUser);
  const logout = useAuthStore((state: AuthState) => state.logout);
  const isAuthenticated = useAuthStore(
    (state: AuthState) => state.isAuthenticated,
  );
  const user = useAuthStore((state: AuthState) => state.user);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const loggedUser: User = await loginApi(email, password);
    setUser(loggedUser);
    router.push("/dashboard/balance");
  };

  const handleRegister = async (username: string, email: string) => {
    const registeredUser: User = await registerApi(username, email);
    setUser(registeredUser);
    router.push("/dashboard/balance");
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout,
    isAuthenticated,
    user,
  };
};
