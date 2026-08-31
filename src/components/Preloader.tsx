"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { eventConfig } from "@/lib/config";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2600);
    document.body.style.overflow = "hidden";
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  const initials = `${eventConfig.couple.bride[0]}${eventConfig.couple.groom[0]}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "var(--color-background)" }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[color:var(--color-primary)]/50"
          >
            <motion.div
              className="absolute inset-0 rounded-full border border-[color:var(--color-primary)]/30"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="font-display gold-text text-4xl">{initials}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 text-sm tracking-[0.35em] text-[color:var(--color-text)]/60 uppercase"
          >
            Sizi bekliyoruz
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
