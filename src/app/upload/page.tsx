"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { eventConfig } from "@/lib/config";
import FloatingBackground from "@/components/FloatingBackground";

const BUCKET = "wedding-photos";

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles(selected);
    setError(null);
  }

  async function handleUpload() {
    if (files.length === 0) {
      setError("Lütfen en az bir fotoğraf seçin.");
      return;
    }
    setUploading(true);
    setError(null);
    let successCount = 0;

    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabaseBrowser.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

      if (uploadError) continue;

      const { error: insertError } = await supabaseBrowser.from("photos").insert({
        storage_path: path,
        uploader_name: uploaderName.trim() || null,
      });

      if (!insertError) successCount++;
    }

    setUploading(false);
    setUploadedCount((c) => c + successCount);
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";

    if (successCount === 0) {
      setError("Fotoğraflar yüklenemedi, lütfen tekrar deneyin.");
    }
  }

  return (
    <div className="relative min-h-screen px-6 py-16">
      <FloatingBackground />

      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[color:var(--color-text)]/60 hover:text-[color:var(--color-primary)]"
        >
          <ArrowLeft size={15} />
          Davetiyeye dön
        </Link>

        <div className="glass-card rounded-3xl px-6 py-8 text-center sm:px-10">
          <Camera className="mx-auto mb-4 text-[color:var(--color-primary)]" size={26} />
          <h1 className="font-display gold-text text-2xl">Anı Fotoğrafı Ekle</h1>
          <p className="mt-2 text-sm text-[color:var(--color-text)]/60">
            {eventConfig.couple.bride} & {eventConfig.couple.groom} için çektiğiniz fotoğrafları
            havuza ekleyin. Fotoğraflar gece bitene kadar sadece havuzda saklanır, kimse göremez.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleSelect}
            className="hidden"
            id="photo-input"
          />

          <label
            htmlFor="photo-input"
            className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[color:var(--color-primary)]/40 px-6 py-10 text-sm text-[color:var(--color-text)]/70 transition hover:border-[color:var(--color-primary)]"
          >
            <ImagePlus size={22} />
            {files.length > 0 ? `${files.length} fotoğraf seçildi` : "Fotoğraf çek veya seç"}
          </label>

          <input
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Adınız (opsiyonel)"
            className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-[color:var(--color-text)]/35 focus:border-[color:var(--color-primary)]"
          />

          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,var(--color-primary),var(--color-primary-dark))] py-3 text-sm font-medium text-[#1a1420] transition hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="animate-spin" size={16} /> : null}
            {uploading ? "Yükleniyor…" : "Havuza Ekle"}
          </button>

          {uploadedCount > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-[color:var(--color-primary)]"
            >
              <CheckCircle2 size={16} />
              {uploadedCount} fotoğraf havuza eklendi
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
