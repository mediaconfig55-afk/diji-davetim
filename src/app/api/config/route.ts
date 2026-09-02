import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { eventConfig } from "@/lib/config";

export async function GET() {
  const admin = supabaseAdmin();

  // Veritabanından event_config'i getir
  const { data: dbConfig, error } = await admin
    .from("event_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !dbConfig) {
    // Fallback: config.ts'deki default değerler kullan
    return NextResponse.json({
      bride_name: eventConfig.couple.bride,
      groom_name: eventConfig.couple.groom,
      bride_father: eventConfig.parents.bride.father,
      bride_mother: eventConfig.parents.bride.mother,
      groom_father: eventConfig.parents.groom.father,
      groom_mother: eventConfig.parents.groom.mother,
      event_date: eventConfig.date,
      event_end_at: eventConfig.weddingEndAt,
      venue_name: eventConfig.venue.name,
      venue_address: eventConfig.venue.address,
      welcome_title: eventConfig.welcomeTitle,
      welcome_message: eventConfig.welcomeMessage,
    });
  }

  // DB'deki config'i dön, boş olanlar için fallback kullan
  return NextResponse.json({
    bride_name: dbConfig.bride_name || eventConfig.couple.bride,
    groom_name: dbConfig.groom_name || eventConfig.couple.groom,
    bride_father: dbConfig.bride_father || eventConfig.parents.bride.father,
    bride_mother: dbConfig.bride_mother || eventConfig.parents.bride.mother,
    groom_father: dbConfig.groom_father || eventConfig.parents.groom.father,
    groom_mother: dbConfig.groom_mother || eventConfig.parents.groom.mother,
    event_date: dbConfig.event_date || eventConfig.date,
    event_end_at: dbConfig.event_end_at || eventConfig.weddingEndAt,
    venue_name: dbConfig.venue_name || eventConfig.venue.name,
    venue_address: dbConfig.venue_address || eventConfig.venue.address,
    welcome_title: dbConfig.welcome_title || eventConfig.welcomeTitle,
    welcome_message: dbConfig.welcome_message || eventConfig.welcomeMessage,
  });
}
