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
          // Сохраняем аватарку при логине, если она есть
          avatarUrl: data.user.user_metadata.avatar_url || "",
        });
        router.push("/dashboard/balance");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (username: string, email: string) => {
    try {
      setUser({ username, email, avatarUrl: "" });
      router.push("/dashboard/balance");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logoutFromStore();
    router.push("/login");
  };

  // ОБНОВЛЕННЫЙ МЕТОД:
  const handleUpdateProfile = async (updates: {
    username?: string;
    password?: string;
    avatarUrl?: string;
  }) => {
    try {
      // 🌟 ШАГ 1: Принудительно "прогреваем" сессию.
      // getSession() заглянет в хранилище и установит токены в заголовки клиента.
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.warn("Session missing in getSession, trying to refresh...");
        // Пробуем жестко восстановить сессию пользователя
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error("Auth session missing! Please re-login.");
        }
      }

      const supabaseAttributes: any = {};
      if (updates.password) supabaseAttributes.password = updates.password;

      if (updates.username || updates.avatarUrl) {
        supabaseAttributes.data = {};
        if (updates.username)
          supabaseAttributes.data.username = updates.username;
        if (updates.avatarUrl)
          supabaseAttributes.data.avatar_url = updates.avatarUrl; // Supabase любит snake_case
      }

      // 🌟 ШАГ 2: Теперь вызываем обновление, когда клиент точно знает токен
      const { data, error } =
        await supabase.auth.updateUser(supabaseAttributes);
      if (error) throw error;

      // 🌟 ШАГ 3: Обновляем Zustand стор актуальными данными
      if (data?.user) {
        updateUserStore({
          username: data.user.user_metadata.username || updates.username,
          // Добавляем сохранение аватарки в Zustand, чтобы профиль обновлялся визуально
          avatarUrl: data.user.user_metadata.avatar_url || updates.avatarUrl,
        });
      }
      return { success: true };
    } catch (error: any) {
      console.error("Update profile failed:", error);
      return { success: false, error: error.message || error };
    }
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    isAuthenticated: isHydrated ? storeIsAuthenticated : false,
    user: isHydrated ? storeUser : null,
    // На всякий случай прокидываем сам инстанс supabase для страницы настроек
    supabase,
  };
};
