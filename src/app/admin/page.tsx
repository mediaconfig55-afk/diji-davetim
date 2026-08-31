"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import FloatingBackground from "@/components/FloatingBackground";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Giriş başarısız.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <FloatingBackground />
      <div className="glass-card w-full max-w-sm rounded-3xl px-8 py-10 text-center">
        <Lock className="mx-auto mb-4 text-[color:var(--color-primary)]" size={24} />
        <h1 className="font-display gold-text text-2xl">Yönetim Paneli</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-[color:var(--color-text)]/35 focus:border-[color:var(--color-primary)]"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[linear-gradient(120deg,var(--color-primary),var(--color-primary-dark))] py-3 text-sm font-medium text-[#1a1420] transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
