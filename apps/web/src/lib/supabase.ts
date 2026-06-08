import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isMissingEnv =
  !supabaseUrl || !supabaseUrl.startsWith("http") || !supabaseAnonKey;

export const supabase = isMissingEnv
  ? (new Proxy(
      {},
      {
        get: () => () => {
          console.warn(
            "Supabase метод вызван во время статической сборки без ENV переменных.",
          );
          return Promise.resolve({ data: null, error: null });
        },
      },
    ) as any)
  : createClient(supabaseUrl as string, supabaseAnonKey as string, {
      // 🌟 Добавляем явные настройки для удержания сессии на клиенте
      auth: {
        persistSession: true, // Говорим Supabase сохранять сессию в браузере
        autoRefreshToken: true, // Автоматически обновлять истекающие токены
        detectSessionInUrl: true, // Нужно для авторизации через соцсети/ссылки
        storage:
          typeof window !== "undefined" ? window.localStorage : undefined, // Явно указываем localStorage для браузера
      },
    });
