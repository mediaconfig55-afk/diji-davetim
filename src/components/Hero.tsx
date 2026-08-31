"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { eventConfig, eventTypeLabels } from "@/lib/config";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.22, delayChildren: 2.8 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero() {
  const label = eventTypeLabels[eventConfig.eventType];
  const eventDate = new Date(eventConfig.date);
  const formattedDate = eventDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
        <motion.span
          variants={item}
          className="mb-6 text-xs uppercase tracking-[0.4em] text-[color:var(--color-text)]/55"
        >
          {formattedDate} · {eventConfig.venue.name}
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display gold-text text-5xl leading-tight sm:text-7xl md:text-8xl"
        >
          {eventConfig.couple.bride}
          <span className="mx-3 inline-block text-3xl sm:text-5xl align-middle text-[color:var(--color-text)]/40">
            &
          </span>
          {eventConfig.couple.groom}
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-xl text-base text-[color:var(--color-text)]/70 sm:text-lg">
          {label.occasion.charAt(0).toUpperCase() + label.occasion.slice(1)} hoş geldiniz
        </motion.p>

        <motion.p variants={item} className="mt-3 max-w-md text-sm text-[color:var(--color-text)]/50">
          {eventConfig.welcomeMessage}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-[color:var(--color-text)]/45"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Kaydır</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
