import { eventConfig } from "@/lib/config";

// Fotoğraf havuzu iki koşuldan biri sağlanınca herkese açılır:
// 1) Etkinlik bitiş saati geçmiş olması (otomatik)
// 2) Admin panelinden manuel olarak açılmış olması (event_settings.manual_reveal_override)
export function isTimeReached(): boolean {
  return Date.now() >= new Date(eventConfig.weddingEndAt).getTime();
}

export function isRevealed(manualOverride: boolean): boolean {
  return manualOverride || isTimeReached();
}
