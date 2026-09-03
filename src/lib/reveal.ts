// Fotoğraf havuzu iki koşuldan biri sağlanınca herkese açılır:
// 1) Etkinlik bitiş saati geçmiş olması (otomatik)
// 2) Admin panelinden manuel olarak açılmış olması (event_settings.manual_reveal_override)
//
// Bitiş saati parametre olarak alınır: admin panelinden düzenlenen değer
// (event_config.event_end_at) config.ts varsayılanını ezebilsin diye.
export function isTimeReached(endAt: string): boolean {
  const target = new Date(endAt).getTime();
  // Geçersiz bir tarih girilirse havuzu kazara herkese açmaktansa kapalı tut.
  if (Number.isNaN(target)) return false;
  return Date.now() >= target;
}

export function isRevealed(manualOverride: boolean, endAt: string): boolean {
  return manualOverride || isTimeReached(endAt);
}
