"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Images } from "lucide-react";
import type { PhotoRecord } from "@/lib/types";
import FloatingBackground from "@/components/FloatingBackground";

export default function GalleryPage() {
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);

  useEffect(() => {
    fetch("/api/photos")
      .then((res) => (res.ok ? res.json() : { revealed: false, photos: [] }))
      .then((data) => {
        setRevealed(Boolean(data.revealed));
        setPhotos(data.photos ?? []);
      })
      .catch(() => {
        setRevealed(false);
        setPhotos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen px-6 py-16">
      <FloatingBackground />

      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[color:var(--color-text)]/60 hover:text-[color:var(--color-primary)]"
        >
          <ArrowLeft size={15} />
          Davetiyeye dön
        </Link>

        <div className="mb-10 text-center">
          <Images className="mx-auto mb-4 text-[color:var(--color-primary)]" size={24} />
          <h1 className="font-display gold-text text-3xl sm:text-4xl">Anı Galerisi</h1>
        </div>

        {loading && <p className="text-center text-sm text-[color:var(--color-text)]/50">Yükleniyor…</p>}

        {!loading && !revealed && (
          <div className="glass-card mx-auto max-w-md rounded-3xl px-8 py-12 text-center">
            <Lock className="mx-auto mb-4 text-[color:var(--color-primary)]" size={26} />
            <p className="font-display text-lg text-[color:var(--color-text)]">Galeri henüz kapalı</p>
            <p className="mt-2 text-sm text-[color:var(--color-text)]/55">
              Fotoğraf havuzu, etkinlik sona erdikten sonra herkese açılacak. O ana kadar
              fotoğraflar gizli tutuluyor.
            </p>
          </div>
        )}

        {!loading && revealed && photos.length === 0 && (
          <p className="text-center text-sm text-[color:var(--color-text)]/50">
            Henüz havuzda fotoğraf yok.
          </p>
        )}

        {!loading && revealed && photos.length > 0 && (
          <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
            {photos.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 9) * 0.04, duration: 0.5 }}
                className="overflow-hidden rounded-2xl border border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.uploader_name ?? "Düğün fotoğrafı"} className="w-full" loading="lazy" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
