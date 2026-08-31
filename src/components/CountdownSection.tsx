"use client";

import { useEffect, useState } from "react";
import { Hourglass } from "lucide-react";
import { eventConfig } from "@/lib/config";
import ScrollFade from "./ScrollFade";

function getTimeLeft() {
  const diff = new Date(eventConfig.date).getTime() - Date.now();
  const clamped = Math.max(0, diff);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    over: diff <= 0,
  };
}

export default function CountdownSection() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Gün", value: time?.days },
    { label: "Saat", value: time?.hours },
    { label: "Dakika", value: time?.minutes },
    { label: "Saniye", value: time?.seconds },
  ];

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <ScrollFade className="mx-auto mb-14 max-w-lg text-center">
        <Hourglass className="mx-auto mb-4 text-[color:var(--color-primary)]" size={22} />
        <h2 className="font-display gold-text text-3xl sm:text-4xl">
          {time?.over ? "Bugün Büyük Gün!" : "Geri Sayım"}
        </h2>
      </ScrollFade>

      <ScrollFade className="mx-auto grid max-w-lg grid-cols-4 gap-3 sm:gap-4">
        {units.map((u) => (
          <div key={u.label} className="glass-card rounded-2xl px-2 py-5 text-center sm:px-4 sm:py-7">
            <p className="font-display gold-text text-3xl tabular-nums sm:text-4xl">
              {u.value !== undefined ? String(u.value).padStart(2, "0") : "--"}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text)]/50 sm:text-xs">
              {u.label}
            </p>
          </div>
        ))}
      </ScrollFade>
    </section>
  );
}
