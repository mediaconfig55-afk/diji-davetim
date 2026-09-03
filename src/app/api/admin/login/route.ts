import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/admin-session";

// Basit, bellek içi deneme sınırı. Sunucu örneği yeniden başlayınca sıfırlanır
// ve birden fazla örnek çalışıyorsa her biri kendi sayacını tutar — yani mutlak
// bir koruma değil, kaba kuvvet denemesini pratikte anlamsız kılan bir yavaşlatma.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; firstAt: number }>();

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function tooManyAttempts(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string) {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: Date.now() });
    return;
  }
  entry.count += 1;
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);

  if (tooManyAttempts(key)) {
    return NextResponse.json(
      { error: "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : null;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD tanımlı değil. .env.local dosyasına bir şifre ekle." },
      { status: 500 }
    );
  }

  if (password !== expected) {
    recordFailure(key);
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  attempts.delete(key);

  const token = await createAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
