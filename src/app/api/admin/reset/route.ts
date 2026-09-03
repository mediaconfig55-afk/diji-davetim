import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase/server";

const BUCKET = "wedding-photos";

// Yeni bir etkinliğe hazırlanırken tüm katılımcı verilerini, anıları,
// fotoğrafları ve reveal ayarını tek seferde temizler. config.ts'deki
// isim/tarih/program bilgilerini bu route etkilemez — onu ayrıca elle
// güncelleyip push etmen gerekir.
export async function POST(request: NextRequest) {
  const valid = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!valid) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const admin = supabaseAdmin();

  // Storage list() tek çağrıda en fazla 1000 kayıt döner. Kalabalık bir
  // düğünde havuz bunu rahat aşabildiği için sayfalayarak hepsini sil,
  // yoksa fazlalık fotoğraflar bir sonraki etkinliğe taşınır.
  const PAGE_SIZE = 1000;
  let deletedPhotos = 0;

  for (;;) {
    const { data: objects, error: listError } = await admin.storage
      .from(BUCKET)
      .list("", { limit: PAGE_SIZE, offset: 0 });

    if (listError) {
      return NextResponse.json({ error: `Storage listelenemedi: ${listError.message}` }, { status: 500 });
    }
    if (!objects || objects.length === 0) break;

    const { error: removeError } = await admin.storage.from(BUCKET).remove(objects.map((o) => o.name));
    if (removeError) {
      return NextResponse.json({ error: `Fotoğraflar silinemedi: ${removeError.message}` }, { status: 500 });
    }

    deletedPhotos += objects.length;
    if (objects.length < PAGE_SIZE) break;
  }

  const results = await Promise.all([
    admin.from("photos").delete().not("id", "is", null),
    admin.from("guestbook").delete().not("id", "is", null),
    admin.from("rsvps").delete().not("id", "is", null),
    admin.from("event_settings").update({ manual_reveal_override: false }).eq("id", 1),
  ]);

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, deletedPhotos });
}
