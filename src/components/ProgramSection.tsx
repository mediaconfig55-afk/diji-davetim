"use client";

import { Clock } from "lucide-react";
import { eventConfig } from "@/lib/config";
import ScrollFade from "./ScrollFade";

export default function ProgramSection() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <ScrollFade className="mx-auto mb-14 max-w-lg text-center">
        <Clock className="mx-auto mb-4 text-[color:var(--color-primary)]" size={22} />
        <h2 className="font-display gold-text text-3xl sm:text-4xl">Gün Programı</h2>
      </ScrollFade>

      <div className="mx-auto max-w-xl">
        <div className="glass-card rounded-3xl px-6 py-8 sm:px-10">
          <ol className="relative border-l border-[color:var(--color-primary)]/30">
            {eventConfig.program.map((p, i) => (
              <ScrollFade key={p.time + p.title} delay={i * 0.1} y={20}>
                <li className="relative mb-8 pl-8 last:mb-0">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-[color:var(--color-primary)]" />
                  <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-primary)]">
                    {p.time}
                  </p>
                  <p className="mt-1 font-display text-lg text-[color:var(--color-text)]">{p.title}</p>
                  {p.description && (
                    <p className="mt-1 text-sm text-[color:var(--color-text)]/55">{p.description}</p>
                  )}
                </li>
              </ScrollFade>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
