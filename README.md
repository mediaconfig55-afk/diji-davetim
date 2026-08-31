# Dijital Davetiye

Düğün, kına ve sünnet gibi özel günler için yeniden kullanılabilir, tek sayfalık dijital davetiye
sitesi. Next.js 16 (App Router), Tailwind CSS v4, Framer Motion ve Supabase ile yapıldı.

- Karşılama animasyonu, cam efektli aile kartları, program zaman çizelgesi, canlı geri sayım
- Katılım bildirimi (RSVP), anı defteri, IBAN hediye kartları — hepsi Supabase'e kaydediliyor
- QR kodla anı fotoğrafı yükleme; galeri etkinlik bitene kadar kilitli
- Şifreli yönetim paneli (`/admin`): RSVP/anı defteri listeleri, fotoğraf havuzunu manuel açma, QR indirme

## Kurulum

```bash
npm install
cp .env.example .env.local   # değerleri doldur
npm run dev
```

Yeni bir etkinlik için ne yapman gerektiği (Supabase kurulumu, `config.ts` düzenleme, deploy) dahil
tüm detaylar için [CLAUDE.md](CLAUDE.md) dosyasına bak.
