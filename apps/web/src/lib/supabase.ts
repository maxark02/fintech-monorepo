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
  : createClient(supabaseUrl as string, supabaseAnonKey as string);
