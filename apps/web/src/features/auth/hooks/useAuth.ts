"use client";

import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Импортируем ваш настроенный клиент Supabase (проверьте этот путь на всякий случай)
import { supabase } from "../../../lib/supabase";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const logoutStore = useAuthStore((s) => s.logout);
  const storeIsAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeUser = useAuthStore((s) => s.user);

  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 1. Логин напрямую через Supabase
  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        // Формируем объект юзера для вашего Zustand стора
        setUser({
          username: data.user.email?.split("@")[0] || "User",
          email: data.user.email || email,
        });
        router.push("/dashboard/balance");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // 2. Регистрация напрямую через Supabase
  const handleRegister = async (username: string, email: string) => {
    try {
      // Примечание: для полноценной регистрации в Supabase на продакшене нужен еще password,
      // но если у вас сейчас это заглушка, оставляем логику сохранения профиля
      setUser({ username, email });
      router.push("/dashboard/balance");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logoutStore();
    router.push("/login");
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: isHydrated ? storeIsAuthenticated : false,
    user: isHydrated ? storeUser : null,
  };
};
