import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonkey = process.env.NEXT_PUBLIC_SUPABASE_ANONKEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonkey);
