import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isRevealed } from "@/lib/reveal";
import { getEventConfig } from "@/lib/event-config.server";

const BUCKET = "wedding-photos";

export async function GET() {
  const admin = supabaseAdmin();

  const [{ data: settings }, cfg] = await Promise.all([
    admin.from("event_settings").select("manual_reveal_override").eq("id", 1).single(),
    getEventConfig(),
  ]);

  const revealed = isRevealed(settings?.manual_reveal_override ?? false, cfg.weddingEndAt);

  if (!revealed) {
    return NextResponse.json({ revealed: false, photos: [] });
  }

  const { data: photos, error } = await admin
    .from("photos")
    .select("id, storage_path, uploader_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ revealed: true, photos: [], error: error.message }, { status: 500 });
  }

  const withUrls = (photos ?? []).map((p) => ({
    ...p,
    url: admin.storage.from(BUCKET).getPublicUrl(p.storage_path).data.publicUrl,
  }));

  return NextResponse.json({ revealed: true, photos: withUrls });
}
