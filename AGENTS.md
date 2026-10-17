# AGENTS.md — HRZenith (Website 04)

> Dibaca PERTAMA oleh setiap AI agent. File ini memuat aturan wajib proyek (format, 5 modul, stack, kualitas). Folder ini berdiri sendiri; tidak ada aturan lintas-website.

## 1. Misi
Bangun **website landing page** (promosi produk, persuasif, fokus konversi dan showcase fitur) untuk **HRZenith**: platform HRIS enterprise untuk **BUMN, konglomerat multinasional, industri finansial, dan institusi pemerintahan** berskala nasional hingga global.

Bukan aplikasi internal. Mockup dan demo hanyalah alat peraga di dalam halaman.

Bintang halaman: **Perizinan multi-tier** (Staff → Supervisor → Manager → HRD Director) dengan **audit trail berantai-hash yang bisa diverifikasi langsung di halaman**. Hero menonjolkan keamanan informasi selaras ISO/IEC 27001, integrasi ERP, dan standardisasi alur birokrasi SDM.

Gaya: **Corporate Enterprise & High Compliance** (ala SAP/Workday): royal blue `#1E3A8A`, slate steel `#475569`, latar abu-abu terang formal, tabel komparasi, diagram alur audit, logo mitra enterprise. Detail: `docs/02-design-system.md`.

**Situs ini terhubung ke admin panel Laravel.** Sebagian kecil konten (branding, hero, WhatsApp, footer/kontak, SEO/pelacakan) dibaca dari API, **selalu dengan nilai cadangan (default) sehingga halaman tidak pernah rusak**. Aturan lengkap: `docs/07-admin-integration.md` (WAJIB dibaca).

## 2. Urutan Baca & Prioritas
1. `docs/01-brief.md`: konteks, audiens, tujuan konversi, tone
2. `docs/07-admin-integration.md`: integrasi admin panel Laravel, env, default, cache (arsitektur dasar; baca sebelum menulis kode)
3. `docs/06-anti-slop.md`: larangan "AI slop" dan klaim berlebihan (aturan keras)
4. `docs/02-design-system.md`: token, tipografi, layout, komponen, diagram, motion (SUMBER KEBENARAN visual)
5. `docs/04-modules.md`: hero, 5 modul, rumus & test vector
6. `docs/03-page-structure.md`: urutan section & copywriting
7. `docs/05-seo-og-quality.md`: metadata, OG, schema, aksesibilitas, performa, checklist, laporan

Prioritas jika konflik: `AGENTS.md` > `07-admin-integration` > `06-anti-slop` > `02-design-system` > `04-modules` > `03-page-structure` > `05-seo-og-quality` > `01-brief`.

## 3. Format Produk
- Alur persuasi: Hero (janji: keamanan, ERP, standardisasi) → referensi organisasi → kontrol keamanan & integrasi → alur audit compliance → modul → perbandingan → edisi → implementasi → studi kasus → FAQ → CTA.
- CTA utama berulang ≥ 5×: `Jadwalkan Konsultasi` (teks CTA hero dinamis dari API). Sekunder: `Minta Dokumen Keamanan`, tombol WhatsApp.
- Setiap klaim fitur didukung diagram, tabel, atau demo interaktif di halaman.

## 4. Lima Modul Wajib (semua sub-fitur harus terlihat)
| Modul | Peran di HRZenith | Sub-fitur WAJIB |
|---|---|---|
| 📑 **Perizinan** (bintang) | Pusat tata kelola & bukti audit | **Multi-tier approval (Staff → Spv → Manager → HRD Director)** · **Audit trail lengkap (hash chain)** · Routing menurut jenis & durasi · SLA & eskalasi otomatis · Delegasi · Cuti, izin sakit, dinas, lembur · Transparansi sisa cuti |
| 📍 **Absensi** | Data kehadiran nasional | **Sinkronisasi mesin fingerprint multi-cabang ke server cloud terpusat** · Normalisasi zona waktu WIB/WITA/WIT · Deduplikasi & antrean offline · Rekap kehadiran nasional real-time · Shift kerja & hari libur nasional · (kanal pelengkap: mobile GPS geofencing untuk dinas luar) |
| 💰 **Gaji** | Kontrol dan kepatuhan payroll | **Audit trail payroll (maker-checker)** · **Slip gaji terenkripsi kata sandi** · **Laporan kepatuhan pajak tahunan (1721-A1, rekonsiliasi)** · Kalkulasi otomatis · PPh 21 · BPJS · Reimbursement |
| 📚 **Library** | Repositori dokumen resmi | **Dokumen ISO** · **SK Direksi** · **Kebijakan kerahasiaan (konfirmasi baca)** · Klasifikasi & hak akses · Riwayat versi · Masa berlaku & review |
| 📝 **Exam** | Asesmen pejabat | **Assessment tahunan kompetensi pejabat struktural** · **Evaluasi KPI 360 derajat** · Uji kompetensi · Assessment rekrutmen · Evaluasi kinerja · Proctoring |

Aturan:
- Nama modul persis: Perizinan, Absensi, Gaji, Library, Exam. Urutan tampil: Perizinan dahulu (bintang).
- Ikon Lucide: `CalendarCheck`, `Fingerprint`, `Wallet`, `BookOpen`, `ClipboardCheck`.
- **Konten 5 modul dan demo interaktifnya ditulis langsung di komponen Next.js (hardcode), tidak diambil dari API.**

## 5. Tech Stack (WAJIB)
- **Next.js (App Router) + React + TypeScript**, **Tailwind CSS** (token dari CSS variables).
- **`lucide-react`** (stroke 1.5) untuk ikon UI. Pengecualian tunggal: `ui/WhatsAppIcon.tsx` (glyph WhatsApp inline SVG). Tidak memakai ikon merek lain (Lucide sedang meninggalkan ikon merek).
- Font `next/font/google`: **Public Sans** (judul + body), **Roboto Mono** (ID dokumen, hash, angka kode).
- `server-only` (paket kecil) untuk mengunci modul CMS di server. `vitest` (devDependency). `clsx`, `tailwind-merge` boleh.
- **Tanpa** framer-motion/GSAP/chart library/CMS SDK. Diagram = SVG/JSX; radar 360 digambar manual dengan SVG.
- Proyek mandiri dengan `package.json` sendiri. Skrip wajib: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`).

```
04-hrzenith/
├── AGENTS.md
├── docs/
├── .env.example                 # DI-COMMIT: 4 kunci + default (tanpa rahasia)
├── .env.local                   # TIDAK di-commit (.gitignore); diisi pemilik
├── package.json  next.config.ts  tsconfig.json  postcss.config.mjs  vitest.config.ts
├── scripts/mock-cms.mjs         # opsional: server tiruan Laravel untuk uji lokal (tanpa dependensi)
├── public/favicon.svg
└── src/
    ├── app/  layout.tsx  page.tsx  globals.css  og-default/route.tsx  sitemap.ts  robots.ts
    ├── components/
    │   ├── layout/    UtilityBar, Navbar, NavbarShell, Footer, WhatsAppFloat
    │   ├── sections/  Hero, PartnerStrip, Pillars, AuditFlow, Modules, Comparison, Editions,
    │   │              Roadmap, CaseStudies, Faq, FinalCta
    │   ├── modules/   ModuleTabs, PerizinanDemo, AbsensiDemo, GajiDemo, LibraryDemo, ExamDemo
    │   ├── diagrams/  ComplianceFlow, ErpHub, BranchMap, Radar360, PartnerLogo
    │   └── ui/        Button, Badge, Card, DataTable, StatusChip, Reveal, Logo, BrandLogo,
    │                  WhatsAppIcon, TrackingScripts
    └── lib/
        ├── site.ts  schema.ts  data.ts  format.ts
        ├── approval.ts  approval.test.ts        # routing persetujuan (fungsi murni)
        ├── audit.ts     audit.test.ts           # hash chain SHA-256
        ├── sync.ts      sync.test.ts            # ringkasan sinkron fingerprint + toWIB
        ├── score360.ts  score360.test.ts        # skor 360 + KPI + kategori
        ├── compliance.ts compliance.test.ts     # rekonsiliasi pajak tahunan
        ├── slip.ts      slip.test.ts            # slip gaji demo
        ├── library.ts   library.test.ts         # hak akses dokumen (canView) + filter
        └── cms/                                  # SERVER-ONLY (lihat docs/07)
            types.ts  defaults.ts  env.ts  validators.ts  normalize.ts  color.ts  endpoint.ts
            get-site-config.ts   *.test.ts
```
Komponen interaktif memakai `"use client"`; selebihnya Server Component. **Semua rumus/logika murni di `lib/`**, bukan di komponen. **Pengambilan data API hanya di server** (`lib/cms/get-site-config.ts`).

## 6. Aturan Mutlak
**DO**
- Warna statis lewat token; warna **brand** lewat variabel runtime dari admin panel dengan default `#1E3A8A` (`docs/07` §8).
- Konten **Bahasa Indonesia** formal. Istilah teknis (audit trail, maker-checker, SSO) boleh Inggris.
- Semua angka demo berasal dari `lib/*.ts` dan lolos test vector (`04`).
- Setiap klaim keamanan/kepatuhan memakai wording hati-hati: "selaras", "dirancang sesuai", "mengacu pada" sampai pemilik menyerahkan bukti (`06`).
- Tombol WhatsApp (hero dan melayang di pojok kanan bawah) memakai tautan dari API dengan fallback (`07` §11).
- Tandai semua yang ilustratif (klien, studi kasus, angka, klaim teknis, edisi, durasi) di kode **dan** laporan.

**DON'T**
- Semua larangan `docs/06-anti-slop.md`.
- Awalan `NEXT_PUBLIC_` pada variabel API/secret; mengambil data API dari komponen klien; `export const revalidate = <angka>` atau angka timer cache di page/layout.
- Logo/lambang asli: Garuda Pancasila, kementerian/lembaga, BUMN, bank, merek ERP, badge ISO/lembaga sertifikasi. Semua logo mitra dan lencana dibuat sendiri dan ditandai ilustratif.
- Mengklaim "tersertifikasi ISO 27001", kepatuhan regulasi spesifik, atau integrasi produk ERP tertentu tanpa bukti.
- Merender string dari API dengan `dangerouslySetInnerHTML` atau menyisipkan skrip mentah dari admin panel.

## 7. Kualitas Minimum
- `npm run typecheck`, `npm run build`, `npm test` semuanya **hijau** (kriteria selesai integrasi, `07` §14).
- Build sukses dalam 3 kondisi: (a) `.env.local` kosong, (b) `API_URL` tak terjangkau, (c) mock API valid.
- Lighthouse ≥ 90 (Performance, Accessibility, Best Practices, SEO).
- Responsif 375 / 768 / 1024 / 1440 tanpa scroll horizontal; WCAG 2.2 AA; hormati `prefers-reduced-motion`.
- SEO/OG lengkap, JSON-LD (`Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`), `sitemap`, `robots` (`05`).

## 8. Alur Kerja Agent
1. Baca semua docs → ringkas pemahaman dalam 5 baris.
2. `npx create-next-app` (TypeScript, Tailwind, App Router, `src/`); pasang `lucide-react`, `server-only`, `clsx`, `tailwind-merge`, `vitest`. **Hapus semua aset/halaman bawaan template.** Buat `.env.example`, pastikan `.env*.local` ada di `.gitignore`.
3. Tulis `lib/cms/*` (defaults, env, validators, normalize, color, getSiteConfig) + test. Jangan lanjut sebelum hijau (`07`).
4. Tulis `lib/approval.ts`, `audit.ts`, `sync.ts`, `score360.ts`, `compliance.ts`, `slip.ts` + test dari test vector `04`.
5. `globals.css` + tema Tailwind (token statis + variabel brand), `layout.tsx` (menyuntik tema, metadata dinamis, pelacakan).
6. Kerangka `page.tsx` + semua section; hero; diagram.
7. Lima modul (Perizinan dahulu).
8. SEO: metadata, `og-default`, JSON-LD, sitemap, robots.
9. Uji integrasi dengan `scripts/mock-cms.mjs`; uji fallback; audit anti-slop (`06` §8); `typecheck`, `build`, `test`; checklist `05` §9.
10. Laporkan sesuai `05` §10.

## 9. Definition of Done
`typecheck`, `build`, dan `test` hijau; build lolos tanpa env/dengan API mati; seluruh bagian dinamis punya default dan tervalidasi; tidak ada kredensial di bundel klien; lima modul lengkap dengan demo dan test vector; audit anti-slop bersih; metadata default persis sesuai `05` §1; item ilustratif dan klaim yang perlu dikonfirmasi dilaporkan.
