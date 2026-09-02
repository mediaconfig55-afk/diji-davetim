"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { AlertTriangle, Download, Edit2, LogOut, RefreshCw, ToggleLeft, ToggleRight, X } from "lucide-react";
import { eventConfig } from "@/lib/config";
import type { RsvpRecord, GuestbookRecord, PhotoRecord } from "@/lib/types";
import FloatingBackground from "@/components/FloatingBackground";

interface DashboardData {
  rsvps: RsvpRecord[];
  guestbook: GuestbookRecord[];
  manualRevealOverride: boolean;
  revealed: boolean;
  photoCount: number;
  photos: PhotoRecord[];
}

const statusLabels: Record<string, string> = {
  attending: "Katılıyor",
  not_attending: "Katılmıyor",
  undecided: "Belirsiz",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [qrCodes, setQrCodes] = useState<{ invite: string; upload: string } | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [editConfigOpen, setEditConfigOpen] = useState(false);
  const [configData, setConfigData] = useState({
    bride_name: "",
    groom_name: "",
    bride_father: "",
    bride_mother: "",
    groom_father: "",
    groom_mother: "",
    event_date: "",
    event_end_at: "",
    venue_name: "",
    venue_address: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/admin/data");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  async function loadConfigData() {
    const res = await fetch("/api/admin/event-config");
    if (res.ok) {
      const cfg = await res.json();
      setConfigData({
        bride_name: cfg.bride_name || "",
        groom_name: cfg.groom_name || "",
        bride_father: cfg.bride_father || "",
        bride_mother: cfg.bride_mother || "",
        groom_father: cfg.groom_father || "",
        groom_mother: cfg.groom_mother || "",
        event_date: cfg.event_date ? cfg.event_date.slice(0, 16) : "",
        event_end_at: cfg.event_end_at ? cfg.event_end_at.slice(0, 16) : "",
        venue_name: cfg.venue_name || "",
        venue_address: cfg.venue_address || "",
      });
    }
  }

  async function handleSaveConfig() {
    setEditLoading(true);
    setEditMessage(null);
    const res = await fetch("/api/admin/event-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(configData),
    });
    setEditLoading(false);

    if (res.ok) {
      setEditMessage("Etkinlik bilgileri kaydedildi. Sayfa yenilenirse yeni bilgiler görünür.");
      setTimeout(() => setEditConfigOpen(false), 2000);
    } else {
      const err = await res.json();
      setEditMessage(`Hata: ${err.error}`);
    }
  }

  useEffect(() => {
    loadData();
    loadConfigData();
    const base = eventConfig.siteUrl.replace(/\/$/, "");
    Promise.all([
      QRCode.toDataURL(base, { width: 480, margin: 1 }),
      QRCode.toDataURL(`${base}/upload`, { width: 480, margin: 1 }),
    ]).then(([invite, upload]) => setQrCodes({ invite, upload }));
  }, []);

  async function handleToggleReveal() {
    if (!data) return;
    setToggling(true);
    const next = !data.manualRevealOverride;
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manualRevealOverride: next }),
    });
    setToggling(false);
    if (res.ok) loadData();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  async function handleReset() {
    if (resetConfirmText !== "SIFIRLA") return;
    setResetting(true);
    setResetMessage(null);
    const res = await fetch("/api/admin/reset", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setResetting(false);

    if (res.ok) {
      setResetMessage(`Temizlendi: ${body.deletedPhotos ?? 0} fotoğraf, tüm RSVP ve anı kayıtları silindi.`);
      setResetOpen(false);
      setResetConfirmText("");
      loadData();
    } else {
      setResetMessage(`Hata: ${body.error ?? "bilinmeyen bir sorun oluştu."}`);
    }
  }

  const rsvpCounts = data?.rsvps.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      acc.totalGuests += r.status === "attending" ? r.guest_count : 0;
      return acc;
    },
    { attending: 0, not_attending: 0, undecided: 0, totalGuests: 0 } as Record<string, number>
  );

  return (
    <div className="relative min-h-screen px-6 py-12">
      <FloatingBackground />

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display gold-text text-2xl sm:text-3xl">Yönetim Paneli</h1>
          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs text-[color:var(--color-text)]/70 hover:border-[color:var(--color-primary)]/50"
            >
              <RefreshCw size={13} /> Yenile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs text-[color:var(--color-text)]/70 hover:border-red-400/50"
            >
              <LogOut size={13} /> Çıkış
            </button>
          </div>
        </div>

        {loading && <p className="text-sm text-[color:var(--color-text)]/50">Yükleniyor…</p>}

        {!loading && data && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: "Katılıyor", value: rsvpCounts?.attending ?? 0 },
                { label: "Katılmıyor", value: rsvpCounts?.not_attending ?? 0 },
                { label: "Belirsiz", value: rsvpCounts?.undecided ?? 0 },
                { label: "Toplam Kişi", value: rsvpCounts?.totalGuests ?? 0 },
                { label: "Fotoğraf", value: data.photoCount },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-2xl px-3 py-4 text-center">
                  <p className="font-display gold-text text-2xl">{s.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-[color:var(--color-text)]/50">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <section className="rounded-2xl border border-[color:var(--color-primary)]/25 bg-[color:var(--color-primary)]/5 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg text-[color:var(--color-text)]">Etkinlik Bilgilerini Düzenle</h2>
                  <p className="mt-1 text-xs text-[color:var(--color-text)]/55">
                    Gelin/damat isimleri, aile bilgileri, tarih ve mekan
                  </p>
                </div>
                {!editConfigOpen && (
                  <button
                    onClick={() => {
                      setEditConfigOpen(true);
                      loadConfigData();
                    }}
                    className="flex items-center gap-2 rounded-xl border border-[color:var(--color-primary)]/40 px-4 py-2 text-sm text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10"
                  >
                    <Edit2 size={16} /> Düzenle
                  </button>
                )}
              </div>

              {editConfigOpen && (
                <div className="mt-6 space-y-4 rounded-xl bg-white/5 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      value={configData.bride_name}
                      onChange={(e) => setConfigData({ ...configData, bride_name: e.target.value })}
                      placeholder="Gelin Adı"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-[color:var(--color-text)]/30 focus:border-[color:var(--color-primary)]"
                    />
                    <input
                      type="text"
                      value={configData.groom_name}
                      onChange={(e) => setConfigData({ ...configData, groom_name: e.target.value })}
                      placeholder="Damat Adı"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-[color:var(--color-text)]/30 focus:border-[color:var(--color-primary)]"
                    />
                    <input
                      type="text"
                      value={configData.bride_father}
                      onChange={(e) => setConfigData({ ...configData, bride_father: e.target.value })}
                      placeholder="Gelin Babası"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-[color:var(--color-text)]/30 focus:border-[color:var(--color-primary)]"
                    />
                    <input
                      type="text"
                      value={configData.bride_mother}
                      onChange={(e) => setConfigData({ ...configData, bride_mother: e.target.value })}
                      placeholder="Gelin Annesi"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-[color:var(--color-text)]/30 focus:border-[color:var(--color-primary)]"
                    />
                    <input
                      type="text"
                      value={configData.groom_father}
                      onChange={(e) => setConfigData({ ...configData, groom_father: e.target.value })}
                      placeholder="Damat Babası"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-[color:var(--color-text)]/30 focus:border-[color:var(--color-primary)]"
                    />
                    <input
                      type="text"
                      value={configData.groom_mother}
                      onChange={(e) => setConfigData({ ...configData, groom_mother: e.target.value })}
                      placeholder="Damat Annesi"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-[color:var(--color-text)]/30 focus:border-[color:var(--color-primary)]"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs text-[color:var(--color-text)]/50 mb-1">Düğün Tarihi ve Saati</label>
                      <input
                        type="datetime-local"
                        value={configData.event_date}
                        onChange={(e) => setConfigData({ ...configData, event_date: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[color:var(--color-text)]/50 mb-1">Düğün Bitişi Saati</label>
                      <input
                        type="datetime-local"
                        value={configData.event_end_at}
                        onChange={(e) => setConfigData({ ...configData, event_end_at: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--color-primary)]"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={configData.venue_name}
                    onChange={(e) => setConfigData({ ...configData, venue_name: e.target.value })}
                    placeholder="Mekan Adı (ör. Zümrüt Davet Salonu)"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-[color:var(--color-text)]/30 focus:border-[color:var(--color-primary)]"
                  />
                  <input
                    type="text"
                    value={configData.venue_address}
                    onChange={(e) => setConfigData({ ...configData, venue_address: e.target.value })}
                    placeholder="Mekan Adresi"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-[color:var(--color-text)]/30 focus:border-[color:var(--color-primary)]"
                  />

                  {editMessage && (
                    <p className="text-xs text-[color:var(--color-text)]/70">{editMessage}</p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveConfig}
                      disabled={editLoading}
                      className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-medium text-[#1a1420] hover:opacity-90 disabled:opacity-50"
                    >
                      {editLoading ? "Kaydediliyor…" : "Kaydet"}
                    </button>
                    <button
                      onClick={() => setEditConfigOpen(false)}
                      className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[color:var(--color-text)]/70"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              )}
            </section>

            <div className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-5">
              <div>
                <p className="text-sm text-[color:var(--color-text)]">Fotoğraf Havuzu — Misafirlere Görünürlük</p>
                <p className="mt-1 text-xs text-[color:var(--color-text)]/50">
                  {data.revealed
                    ? "Herkese açık: /gallery sayfasındaki tüm fotoğrafları artık misafirler de görebilir."
                    : `Şu an sadece sen görebiliyorsun. Otomatik olarak ${new Date(eventConfig.weddingEndAt).toLocaleString("tr-TR")} tarihinde herkese açılacak, veya aşağıdaki butonla şimdi açabilirsin.`}
                </p>
              </div>
              <button
                onClick={handleToggleReveal}
                disabled={toggling}
                className="flex items-center gap-2 rounded-xl border border-[color:var(--color-primary)]/40 px-4 py-2 text-sm text-[color:var(--color-primary)] transition hover:bg-[color:var(--color-primary)]/10 disabled:opacity-50"
              >
                {data.manualRevealOverride ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {data.manualRevealOverride ? "Herkese açık (kapatmak için tıkla)" : "Şimdi herkese aç"}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {qrCodes && (
                <>
                  <QrDownloadCard title="Davetiye QR" dataUrl={qrCodes.invite} filename="davetiye-qr.png" />
                  <QrDownloadCard title="Fotoğraf Yükleme QR" dataUrl={qrCodes.upload} filename="fotograf-qr.png" />
                </>
              )}
            </div>

            <section>
              <h2 className="mb-3 font-display text-lg text-[color:var(--color-text)]">
                Fotoğraf Havuzu — Sadece Sen Görüyorsun ({data.photoCount})
              </h2>
              {data.photos.length === 0 ? (
                <p className="text-sm text-[color:var(--color-text)]/40">Henüz fotoğraf yüklenmedi.</p>
              ) : (
                <div className="columns-2 gap-3 sm:columns-4 [&>*]:mb-3">
                  {data.photos.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={p.id}
                      src={p.url}
                      alt={p.uploader_name ?? "Anı fotoğrafı"}
                      className="w-full rounded-xl border border-white/10"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-3 font-display text-lg text-[color:var(--color-text)]">
                Katılım Bildirimleri ({data.rsvps.length})
              </h2>
              <div className="glass-card overflow-x-auto rounded-2xl">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-[color:var(--color-text)]/50">
                      <th className="px-4 py-3 font-normal">Ad Soyad</th>
                      <th className="px-4 py-3 font-normal">Durum</th>
                      <th className="px-4 py-3 font-normal">Kişi</th>
                      <th className="px-4 py-3 font-normal">Not</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rsvps.map((r) => (
                      <tr key={r.id} className="border-b border-white/5 last:border-0">
                        <td className="px-4 py-3">{r.full_name}</td>
                        <td className="px-4 py-3">{statusLabels[r.status]}</td>
                        <td className="px-4 py-3">{r.guest_count}</td>
                        <td className="px-4 py-3 text-[color:var(--color-text)]/60">{r.note ?? "—"}</td>
                      </tr>
                    ))}
                    {data.rsvps.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-[color:var(--color-text)]/40">
                          Henüz kayıt yok.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-display text-lg text-[color:var(--color-text)]">
                Anı Defteri ({data.guestbook.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.guestbook.map((g) => (
                  <div key={g.id} className="glass-card rounded-2xl px-5 py-4">
                    <p className="text-sm text-[color:var(--color-text)]/80">“{g.message}”</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-[color:var(--color-primary)]">
                      {g.full_name}
                    </p>
                  </div>
                ))}
                {data.guestbook.length === 0 && (
                  <p className="text-sm text-[color:var(--color-text)]/40">Henüz anı yok.</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-red-500/25 bg-red-500/5 px-6 py-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-red-400" size={18} />
                <div className="flex-1">
                  <h2 className="font-display text-lg text-[color:var(--color-text)]">
                    Yeni Etkinliğe Hazırlan
                  </h2>
                  <p className="mt-1 text-xs text-[color:var(--color-text)]/55">
                    Bu düğün bitip yeni bir etkinlik (başka bir düğün/kına/sünnet) için bu siteyi
                    yeniden kullanacaksan: önce burada <strong>Tüm Verileri Sıfırla</strong>'ya bas
                    (tüm RSVP'ler, anı defteri yazıları ve fotoğraflar kalıcı olarak silinir),
                    sonra <code className="rounded bg-white/10 px-1">src/lib/config.ts</code>{" "}
                    dosyasındaki isim/tarih/program/IBAN bilgilerini güncelleyip GitHub&apos;a push
                    et — site otomatik olarak yeni bilgilerle yayınlanır.
                  </p>

                  {!resetOpen && (
                    <button
                      onClick={() => setResetOpen(true)}
                      className="mt-4 rounded-xl border border-red-400/40 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                      Tüm Verileri Sıfırla
                    </button>
                  )}

                  {resetOpen && (
                    <div className="mt-4 space-y-3">
                      <p className="text-xs text-[color:var(--color-text)]/70">
                        Bu işlem geri alınamaz. Onaylamak için kutuya <strong>SIFIRLA</strong> yaz.
                      </p>
                      <input
                        value={resetConfirmText}
                        onChange={(e) => setResetConfirmText(e.target.value)}
                        placeholder="SIFIRLA"
                        className="w-full max-w-xs rounded-xl border border-red-400/30 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-[color:var(--color-text)]/30 focus:border-red-400"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleReset}
                          disabled={resetConfirmText !== "SIFIRLA" || resetting}
                          className="rounded-xl bg-red-500/80 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {resetting ? "Siliniyor…" : "Onayla ve Sil"}
                        </button>
                        <button
                          onClick={() => {
                            setResetOpen(false);
                            setResetConfirmText("");
                          }}
                          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-[color:var(--color-text)]/70"
                        >
                          Vazgeç
                        </button>
                      </div>
                    </div>
                  )}

                  {resetMessage && (
                    <p className="mt-3 text-xs text-[color:var(--color-text)]/70">{resetMessage}</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function QrDownloadCard({ title, dataUrl, filename }: { title: string; dataUrl: string; filename: string }) {
  return (
    <div className="glass-card flex items-center justify-between gap-4 rounded-2xl px-5 py-4">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl} alt={title} className="h-16 w-16 rounded-lg bg-white p-1" />
        <p className="text-sm text-[color:var(--color-text)]">{title}</p>
      </div>
      <a
        href={dataUrl}
        download={filename}
        className="flex items-center gap-2 rounded-lg border border-[color:var(--color-primary)]/40 px-3 py-2 text-xs text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10"
      >
        <Download size={13} /> İndir
      </a>
    </div>
  );
}
