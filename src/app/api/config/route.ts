import { NextResponse } from "next/server";
import { getEventConfig } from "@/lib/event-config.server";

// Herkese açık okuma uçları — sadece davetiyede zaten görünen alanları döner.
// Çözümleme (DB > config.ts) tek yerde, src/lib/event-config.ts içinde yapılır.
export async function GET() {
  const cfg = await getEventConfig();

  return NextResponse.json({
    bride_name: cfg.bride,
    groom_name: cfg.groom,
    bride_father: cfg.parents.bride.father,
    bride_mother: cfg.parents.bride.mother,
    groom_father: cfg.parents.groom.father,
    groom_mother: cfg.parents.groom.mother,
    event_date: cfg.date,
    event_end_at: cfg.weddingEndAt,
    venue_name: cfg.venue.name,
    venue_address: cfg.venue.address,
    welcome_title: cfg.welcomeTitle,
    welcome_message: cfg.welcomeMessage,
  });
}
