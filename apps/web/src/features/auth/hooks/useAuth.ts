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

  // Ждем гидратации Zustand стора, чтобы не было конфликтов SSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  /**
   * ВХОД В АККАУНТ
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (data?.user) {
        setUser({
          id: data.user.id,
          username:
            data.user.user_metadata.username ||
            data.user.email?.split("@")[0] ||
            "User",
          email: data.user.email || email,
          avatarUrl:
            data.user.user_metadata.avatar_url ||
            data.user.user_metadata.avatarUrl ||
            "",
        } as any);

        router.push("/dashboard/balance");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  /**
   * РЕГИСТРАЦИЯ
   */
  const handleRegister = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            avatar_url: "",
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Записываем данные в Zustand
        setUser({
          id: data.user.id,
          username: data.user.user_metadata.username || username,
          email: data.user.email || email,
          avatarUrl: "",
        } as any);

        // Если Supabase сразу выдал сессию (Email confirmation выключен) — пускаем в систему
        const { data: sessionCheck } = await supabase.auth.getSession();
        if (sessionCheck?.session) {
          router.push("/dashboard/balance");
        } else {
          alert(
            "Регистрация успешна! Пожалуйста, проверьте почту для подтверждения аккаунта.",
          );
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  /**
   * ОБНОВЛЕНИЕ ПРОФИЛЯ (Без дубликатов и с правильным маппингом)
   */
  const handleUpdateProfile = async (updates: {
    username?: string;
    password?: string;
    avatarUrl?: string;
  }) => {
    try {
      // Шаг 1: Принудительно проверяем и обновляем сессию клиента перед запросом
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.warn("Session missing in getSession, trying getUser...");
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error("Auth session missing! Please re-login.");
        }
      }

      // Шаг 2: Формируем тело запроса для Supabase
      const supabaseAttributes: any = {};
      if (updates.password) supabaseAttributes.password = updates.password;

      if (updates.username || updates.avatarUrl) {
        supabaseAttributes.data = {};
        if (updates.username)
          supabaseAttributes.data.username = updates.username;
        if (updates.avatarUrl)
          supabaseAttributes.data.avatar_url = updates.avatarUrl; // Строго snake_case для базы
      }

      // Шаг 3: Отправляем апдейт в Supabase
      const { data, error } =
        await supabase.auth.updateUser(supabaseAttributes);
      if (error) throw error;

      // Шаг 4: Если всё ок, синхронизируем данные с локальным Zustand стором
      if (data?.user) {
        updateUserStore({
          username: data.user.user_metadata.username || updates.username,
          avatarUrl:
            data.user.user_metadata.avatar_url ||
            data.user.user_metadata.avatarUrl ||
            updates.avatarUrl,
        });
      }
      return { success: true };
    } catch (error: any) {
      console.error("Update profile failed:", error);
      return { success: false, error: error.message || error };
    }
  };

  /**
   * ВЫХОД ИЗ СИСТЕМЫ
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    logoutFromStore();
    router.push("/login");
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    isAuthenticated: isHydrated ? storeIsAuthenticated : false,
    user: isHydrated ? storeUser : null,
    supabase,
  };
};
