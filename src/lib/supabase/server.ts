import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Sadece sunucu tarafında (API route / server action) kullanılır.
// service_role anahtarı RLS'i bypass eder, ASLA client'a gönderilmemeli.
export function supabaseAdmin() {
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY tanımlı değil. .env.local dosyasına Supabase panelinden aldığın service_role anahtarını ekle."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
