import { useAuthStore } from "../store/authStore";
import { login as loginApi, register as registerApi } from "../api/authApi";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const setUser = useAuthStore.getState().setUser;
  const logout = useAuthStore.getState().logout;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const user = await loginApi(email, password);
    setUser(user);
    router.push("/dashboard/balance");
  };

  const handleRegister = async (username: string, email: string) => {
    const user = await registerApi(username, email);
    setUser(user);
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
