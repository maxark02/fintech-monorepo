"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const updateUserStore = useAuthStore((s) => s.updateUser);
  const storeIsAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeUser = useAuthStore((s) => s.user);

  const logoutFromStore = useAuthStore((s) => s.logout);

  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data?.user) {
        setUser({
          username:
            data.user.user_metadata.username ||
            data.user.email?.split("@")[0] ||
            "User",
          email: data.user.email || email,
        });
        router.push("/dashboard/balance");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (username: string, email: string) => {
    try {
      setUser({ username, email });
      router.push("/dashboard/balance");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Выходим из Supabase
    logoutFromStore(); // Чистим Zustand стор (теперь без ошибок!)
    router.push("/login"); // Перенаправляем на логин
  };

  // 1. Метод обязательно должен быть объявлен внутри хука:
  const handleUpdateProfile = async (updates: {
    username?: string;
    password?: string;
    avatarUrl?: string;
  }) => {
    try {
      const supabaseAttributes: any = {};
      if (updates.password) supabaseAttributes.password = updates.password;
      if (updates.username || updates.avatarUrl) {
        supabaseAttributes.data = {};
        if (updates.username)
          supabaseAttributes.data.username = updates.username;
        if (updates.avatarUrl)
          supabaseAttributes.data.avatar_url = updates.avatarUrl;
      }

      const { data, error } =
        await supabase.auth.updateUser(supabaseAttributes);
      if (error) throw error;

      if (data?.user) {
        updateUserStore({
          username: data.user.user_metadata.username || updates.username,
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Update profile failed:", error);
      return { success: false, error };
    }
  };

  // 2. ВАЖНО: Метод ДОЛЖЕН БЫТЬ внутри этого return объекта, иначе TS его не увидит!
  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile, // 🌟 Убедитесь, что эта строка на месте
    isAuthenticated: isHydrated ? storeIsAuthenticated : false,
    user: isHydrated ? storeUser : null,
  };
};
