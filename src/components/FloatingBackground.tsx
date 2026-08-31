"use client";

import { useEffect, useState } from "react";

const SPARKLE_COUNT = 22;

interface Sparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  slow: boolean;
}

export default function FloatingBackground() {
  // Rastgele parçacık konumları sadece client'ta üretilir; SSR/CSR
  // hidrasyon uyuşmazlığı yaşamamak için ilk render'da boş bırakılır.
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 4,
        slow: i % 2 === 0,
      }))
    );
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(185,139,86,0.16), transparent 45%), radial-gradient(circle at 80% 75%, rgba(185,139,86,0.12), transparent 45%), var(--color-background)",
        }}
      />
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={`absolute rounded-full bg-[color:var(--color-primary)] animate-sparkle ${
            s.slow ? "animate-float-slow" : "animate-float-slower"
          }`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}
