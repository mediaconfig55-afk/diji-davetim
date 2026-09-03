import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const valid = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!valid) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const admin = supabaseAdmin();
  const { data, error } = await admin.from("event_config").select("*").eq("id", 1).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || {});
}

export async function POST(request: NextRequest) {
  const valid = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!valid) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  // Gelen gövdeyi olduğu gibi yaymak yerine yalnızca düzenlenebilir sütunları
  // al — beklenmedik bir alan tüm upsert'i hataya düşürmesin.
  const EDITABLE_FIELDS = [
    "bride_name",
    "groom_name",
    "bride_father",
    "bride_mother",
    "groom_father",
    "groom_mother",
    "event_date",
    "event_end_at",
    "venue_name",
    "venue_address",
    "welcome_title",
    "welcome_message",
  ] as const;

  const payload: Record<string, unknown> = { id: 1, updated_at: new Date().toISOString() };
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      const value = body[field];
      payload[field] = typeof value === "string" && value.trim() === "" ? null : value;
    }
  }

  const admin = supabaseAdmin();
  const { error } = await admin.from("event_config").upsert(payload, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
