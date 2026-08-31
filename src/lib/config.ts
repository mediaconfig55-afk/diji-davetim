// =========================================================================
// BU DOSYA HER YENİ ETKİNLİK İÇİN DEĞİŞTİRİLECEK TEK YERDİR.
// İsimler, tarih, program, IBAN, tema rengi vb. her şey burada.
// Kod tarafında başka hiçbir yeri değiştirmene gerek yok.
// =========================================================================

export type EventType = "wedding" | "kina" | "sunnet";

export interface ProgramItem {
  time: string; // "20:00"
  title: string;
  description?: string;
}

export interface IbanCard {
  label: string; // "Gelin - Ebru Yılmaz"
  bankName: string;
  iban: string; // "TR00 0000 0000 0000 0000 0000 00"
}

export const eventConfig = {
  // "wedding" | "kina" | "sunnet" — arayüzdeki metinler buna göre otomatik değişir
  eventType: "wedding" as EventType,

  couple: {
    // Düğün/kına için iki isim, sünnet için sadece "person" alanını doldurman yeterli
    bride: "Ebru",
    groom: "Murat",
  },

  parents: {
    bride: { father: "Ahmet Yılmaz", mother: "Fatma Yılmaz" },
    groom: { father: "Mehmet Kaya", mother: "Ayşe Kaya" },
  },

  welcomeTitle: "Düğünümüze Hoş Geldiniz",
  welcomeMessage:
    "Hayatımızın en özel gününde sevdiklerimizle birlikte olmaktan mutluluk duyarız. Sizi de aramızda görmekten onur duyarız.",

  // ISO 8601, saat dilimiyle birlikte (Türkiye: +03:00)
  date: "2026-09-15T20:00:00+03:00",
  // Etkinliğin bittiği saat — fotoğraf havuzu bu saatten sonra otomatik herkese açılır
  weddingEndAt: "2026-09-16T02:00:00+03:00",

  venue: {
    name: "Zümrüt Davet Salonu",
    address: "Örnek Mahallesi, Çiçek Caddesi No:12, İstanbul",
    mapUrl: "https://maps.google.com/?q=Zümrüt+Davet+Salonu",
  },

  program: [
    { time: "20:00", title: "Düğün Başlangıcı", description: "Konuk karşılama ve kokteyl" },
    { time: "20:30", title: "Pasta Kesimi" },
    { time: "21:00", title: "Takı Merasimi" },
    { time: "21:30", title: "İlk Dans" },
    { time: "22:00", title: "Eğlence ve Müzik" },
  ] as ProgramItem[],

  ibans: [
    { label: "Gelin - Ebru Yılmaz", bankName: "Örnek Bank", iban: "TR00 0000 0000 0000 0000 0000 00" },
    { label: "Damat - Murat Kaya", bankName: "Örnek Bank", iban: "TR11 1111 1111 1111 1111 1111 11" },
  ] as IbanCard[],

  // Sitenin canlı adresi — QR kodları ve WhatsApp paylaşım linki bunun üstüne kurulur
  siteUrl: "https://elif-kaan-davetiye.vercel.app",

  theme: {
    primary: "#b98b56", // altın/bronz vurgu
    primaryDark: "#8a6636",
    background: "#0f0b12", // koyu zemin (lüks/gece hissi)
    surface: "#1a1420",
    textLight: "#f7f1e8",
  },
};

export const eventTypeLabels: Record<EventType, { title: string; couple: string; occasion: string }> = {
  wedding: { title: "Düğün", couple: "Gelin & Damat", occasion: "düğünümüze" },
  kina: { title: "Kına Gecesi", couple: "Kına Sahibi", occasion: "kına gecemize" },
  sunnet: { title: "Sünnet Töreni", couple: "Sünnet Çocuğu", occasion: "sünnet törenimize" },
};
