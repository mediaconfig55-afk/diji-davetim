import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Tarayıcıda kullanılan, kısıtlı yetkili (anon) client.
// Sadece RLS politikalarının izin verdiği insert/select işlemleri yapılabilir.
export const supabaseBrowser = createClient(url, anonKey, {
  auth: { persistSession: false },
});
