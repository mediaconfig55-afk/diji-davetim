"use client";

import { useState } from "react";
import { Check, Copy, Gift } from "lucide-react";
import { eventConfig } from "@/lib/config";
import ScrollFade from "./ScrollFade";
import TiltCard from "./TiltCard";

export default function IbanSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleCopy(iban: string, index: number) {
    await navigator.clipboard.writeText(iban.replace(/\s+/g, ""));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex((cur) => (cur === index ? null : cur)), 2000);
  }

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <ScrollFade className="mx-auto mb-14 max-w-lg text-center">
        <Gift className="mx-auto mb-4 text-[color:var(--color-primary)]" size={22} />
        <h2 className="font-display gold-text text-3xl sm:text-4xl">Hediye</h2>
        <p className="mt-3 text-sm text-[color:var(--color-text)]/60">
          Bizzat gelemeseniz de dijital hediyenizi aşağıdaki hesaplara gönderebilirsiniz.
        </p>
      </ScrollFade>

      <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
        {eventConfig.ibans.map((card, i) => (
          <ScrollFade key={card.iban} delay={i * 0.15}>
            <TiltCard className="px-6 py-7">
              <p className="font-display text-lg text-[color:var(--color-text)]">{card.label}</p>
              <p className="mt-1 text-xs text-[color:var(--color-text)]/50">{card.bankName}</p>
              <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="font-mono text-xs tracking-wide text-[color:var(--color-text)]/85 sm:text-sm">
                  {card.iban}
                </span>
                <button
                  onClick={() => handleCopy(card.iban, i)}
                  className="ml-3 shrink-0 rounded-lg border border-[color:var(--color-primary)]/40 p-2 text-[color:var(--color-primary)] transition hover:bg-[color:var(--color-primary)]/10"
                  aria-label="IBAN'ı kopyala"
                >
                  {copiedIndex === i ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </TiltCard>
          </ScrollFade>
        ))}
      </div>
    </section>
  );
}
