import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { eventConfig, eventTypeLabels } from "@/lib/config";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const label = eventTypeLabels[eventConfig.eventType];
const title = `${eventConfig.couple.bride} & ${eventConfig.couple.groom} — ${label.title}`;

export const metadata: Metadata = {
  title,
  description: eventConfig.welcomeMessage,
  openGraph: {
    title,
    description: eventConfig.welcomeMessage,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const { theme } = eventConfig;
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      style={
        {
          "--color-primary": theme.primary,
          "--color-primary-dark": theme.primaryDark,
          "--color-background": theme.background,
          "--color-surface": theme.surface,
          "--color-text": theme.textLight,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
