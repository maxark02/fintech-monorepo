"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useAuthStore } from "@/features/auth/store/authStore";

/**
 * Сюда Google/Apple возвращают пользователя после OAuth.
 * Клиент Supabase с detectSessionInUrl сам обменяет код из URL на сессию,
 * мы ловим это событие, синхронизируем стор и уводим в дашборд.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key || !url.startsWith("http")) {
      setError("Supabase is not configured.");
      return;
    }

    const supabase = createBrowserClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    });

    const syncAndRedirect = (sessionUser: any) => {
      const meta = sessionUser.user_metadata ?? {};
      setUser({
        id: sessionUser.id,
        username:
          meta.username ||
          meta.full_name ||
          meta.name ||
          sessionUser.email?.split("@")[0] ||
          "User",
        email: sessionUser.email || "",
        avatarUrl: meta.avatar_url || meta.picture || "",
      } as any);
      router.replace("/dashboard/balance");
    };

    // detectSessionInUrl обменяет код и кинет событие SIGNED_IN
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) syncAndRedirect(session.user);
    });

    // Если сессия уже готова к моменту подписки
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) syncAndRedirect(data.session.user);
    });

    // Страховка от зависания
    const timeout = setTimeout(() => {
      setError("Could not complete sign-in. Please try again.");
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-app text-text-main p-4">
      <div className="text-center space-y-3">
        {error ? (
          <>
            <p className="text-red-500 text-sm">{error}</p>
            <a href="/login" className="text-accent text-sm hover:underline">
              Back to login
            </a>
          </>
        ) : (
          <>
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-text-muted/30 border-t-accent animate-spin" />
            <p className="text-text-muted text-sm">Signing you in…</p>
          </>
        )}
      </div>
    </div>
  );
}
