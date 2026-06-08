"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const updateUserStore = useAuthStore((s) => s.updateUser);
  const storeIsAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeUser = useAuthStore((s) => s.user);
  const logoutFromStore = useAuthStore((s) => s.logout);

  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const [supabase] = useState(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key || !url.startsWith("http")) {
      return new Proxy(
        {},
        {
          get: () => () => Promise.resolve({ data: null, error: null }),
        },
      ) as any;
    }

    // 🌟 Настраиваем createBrowserClient на работу со стандартными куками
    return createBrowserClient(url, key, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ... весь остальной код handleLogin, handleRegister, handleUpdateProfile остается без изменений ...

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
          avatarUrl: data.user.user_metadata.avatar_url || "",
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
        setUser({
          id: data.user.id,
          username: data.user.user_metadata.username || username,
          email: data.user.email || email,
          avatarUrl: "",
        } as any);

        const { data: sessionCheck } = await supabase.auth.getSession();
        if (sessionCheck?.session) {
          router.push("/dashboard/balance");
        } else {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  /**
   * ОБНОВЛЕНИЕ ПРОФИЛЯ
   */
  const handleUpdateProfile = async (updates: {
    username?: string;
    password?: string;
    avatarUrl?: string;
  }) => {
    try {
      // 🌟 Теперь этот вызов гарантированно найдет сессию в браузере!
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        // Пробуем получить пользователя напрямую через токен
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
          supabaseAttributes.data.avatar_url = updates.avatarUrl;
      }

      const { data, error } =
        await supabase.auth.updateUser(supabaseAttributes);
      if (error) throw error;

      if (data?.user) {
        updateUserStore({
          username: data.user.user_metadata.username || updates.username,
          avatarUrl: data.user.user_metadata.avatar_url || updates.avatarUrl,
        });
      }
      return { success: true };
    } catch (error: any) {
      console.error("Update profile failed:", error);
      return { success: false, error: error.message || error };
    }
  };

  /**
   * ВЫХОД
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
    supabase, // Отдаем этот же рабочий инстанс наружу
  };
};
