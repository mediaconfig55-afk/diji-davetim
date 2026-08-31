"use client";

import { Heart } from "lucide-react";
import { eventConfig } from "@/lib/config";
import ScrollFade from "./ScrollFade";
import TiltCard from "./TiltCard";

export default function ParentsSection() {
  const { parents, couple } = eventConfig;

  const cards = [
    { title: `${couple.bride}'in Ailesi`, father: parents.bride.father, mother: parents.bride.mother },
    { title: `${couple.groom}'in Ailesi`, father: parents.groom.father, mother: parents.groom.mother },
  ];

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <ScrollFade className="mx-auto mb-14 max-w-lg text-center">
        <Heart className="mx-auto mb-4 text-[color:var(--color-primary)]" size={22} />
        <h2 className="font-display gold-text text-3xl sm:text-4xl">Aileler</h2>
      </ScrollFade>

      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        {cards.map((c, i) => (
          <ScrollFade key={c.title} delay={i * 0.15}>
            <TiltCard className="px-8 py-10 text-center">
              <p className="font-display gold-text text-xl">{c.title}</p>
              <div className="mt-6 space-y-2 text-sm text-[color:var(--color-text)]/70">
                <p>{c.father}</p>
                <p>{c.mother}</p>
              </div>
            </TiltCard>
          </ScrollFade>
        ))}
      </div>
    </section>
  );
}
