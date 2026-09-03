import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isRevealed } from "@/lib/reveal";
import { getEventConfig } from "@/lib/event-config.server";

const BUCKET = "wedding-photos";

export async function GET(request: NextRequest) {
  const valid = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!valid) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const admin = supabaseAdmin();

  const [{ data: rsvps }, { data: guestbook }, { data: settings }, { data: photos, count: photoCount }, cfg] =
    await Promise.all([
      admin.from("rsvps").select("id, full_name, status, guest_count, note, created_at").order("created_at", { ascending: false }),
      admin.from("guestbook").select("id, full_name, message, created_at").order("created_at", { ascending: false }),
      admin.from("event_settings").select("manual_reveal_override").eq("id", 1).single(),
      admin
        .from("photos")
        .select("id, storage_path, uploader_name, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(60),
      getEventConfig(),
    ]);

  const photosWithUrls = (photos ?? []).map((p) => ({
    ...p,
    url: admin.storage.from(BUCKET).getPublicUrl(p.storage_path).data.publicUrl,
  }));

  return NextResponse.json({
    rsvps: rsvps ?? [],
    guestbook: guestbook ?? [],
    manualRevealOverride: settings?.manual_reveal_override ?? false,
    revealed: isRevealed(settings?.manual_reveal_override ?? false, cfg.weddingEndAt),
    // Panelde "otomatik olarak şu tarihte açılacak" metni config.ts'i değil,
    // gerçekten geçerli olan bitiş saatini göstersin.
    revealAt: cfg.weddingEndAt,
    photoCount: photoCount ?? 0,
    photos: photosWithUrls,
  });
}
