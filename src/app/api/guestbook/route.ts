import { NextRequest, NextResponse } from "next/server";
import { supabaseBrowser } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, message } = body;

    if (!full_name || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Client-side insert (anon key via RLS)
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.from("guestbook").insert({
      full_name,
      message,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
