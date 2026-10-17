# 05 — SEO, OpenGraph, Schema, Aksesibilitas, Performa & Checklist Final

## 1. Default Metadata — `src/lib/site.ts` (statis) + `lib/cms/defaults.ts`
```ts
// src/lib/site.ts  (nilai statis yang TIDAK dari API)
export const site = {
  name: "HRZenith",
  url: "https://hrzenith.id",               // PLACEHOLDER: domain asli; dipakai metadataBase, canonical, sitemap
  locale: "id_ID",
};
// Default title & description ada di DEFAULT_SITE_CONFIG.seo (lib/cms/defaults.ts):
//   metaTitle:       "HRZenith - Platform HRIS Enterprise untuk Skala Nasional & Global"   (65 karakter)
//   metaDescription: "Standar tertinggi pengelolaan SDM, audit trail perizinan berjenjang, dan integrasi kepatuhan korporasi."  (103 karakter)
```
Title dan description **default persis** seperti di atas (jangan diubah). Admin panel boleh menimpa (`07`), dengan batas 70 dan 200 karakter; rekomendasi pemilik: description ≤ 160.

## 2. Metadata Next.js (`src/app/layout.tsx`, dinamis, server)
```ts
import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import { getSiteConfig } from "@/lib/cms/get-site-config";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, branding } = await getSiteConfig();
  const og = seo.ogImageUrl ?? "/og-default";
  return {
    metadataBase: new URL(site.url),
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website", siteName: site.name, locale: site.locale, url: "/",
      title: seo.metaTitle, description: seo.metaDescription,
      images: [{ url: og, width: 1200, height: 630, alt: "HRZenith: alur persetujuan berjenjang dan audit trail" }],
    },
    twitter: { card: "summary_large_image", title: seo.metaTitle, description: seo.metaDescription, images: [og] },
    robots: { index: true, follow: true },
    icons: { icon: branding.faviconUrl },
  };
}
export async function generateViewport(): Promise<Viewport> {
  const { branding } = await getSiteConfig();
  return { themeColor: branding.primaryColor, width: "device-width", initialScale: 1 };
}
```
- `<html lang="id">` wajib; jangan menonaktifkan zoom.
- Wajib: `title`, `description`, `canonical`, `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, Twitter card.
- Tidak ada `export const revalidate` di layout/page (`07` §9).

## 3. OG Image Default (`src/app/og-default/route.tsx`)
- `ImageResponse` dari `next/og`, **1200×630**, `Content-Type: image/png`. Dipakai bila admin tidak mengisi gambar OG.
- Desain: latar `#1E3A8A` (hex boleh di berkas ini), wordmark HRZenith putih, headline `Tata kelola SDM yang dapat diaudit.` (Public Sans 700), satu baris `Perizinan berjenjang · Audit trail · Integrasi ERP`; kanan: kartu putih dengan **mini-diagram rantai persetujuan** (4 kotak `Staff → Spv → Manager → HRD Director` bergaris) dan tiga baris tabel audit (waktu, aktor, hash 8 hex dari test vector `04`). Tanpa gradien/glow/foto/logo asli.
- Font: simpan TTF di `src/assets/fonts/` dan baca lokal; **jangan fetch jaringan saat build**.
- Periksa `/og-default`: teks tidak terpotong, kontras terbaca.

## 4. Schema Markup (JSON-LD) — `src/lib/schema.ts` + `page.tsx`
Satu `@graph` lewat `<script type="application/ld+json">` (satu-satunya pengecualian sah `dangerouslySetInnerHTML`, dari objek terkontrol):
- `Organization` (name, url, `email` dari konfigurasi, `logo` bila `logoUrl` absolut `https`)
- `WebSite` (name, url, inLanguage `id-ID`)
- `SoftwareApplication` (name, `applicationCategory: "BusinessApplication"`, `operatingSystem: "Web"`, description, `featureList` = **seluruh sub-fitur 5 modul** (`AGENTS.md` §4), **tanpa `offers`**)
- `FAQPage` dibangun dari data FAQ yang sama dengan komponen

Tanpa `aggregateRating`/`review`.

## 5. Sitemap & Robots
- `sitemap.ts`: halaman utama (`lastModified`, `changeFrequency: "monthly"`, `priority: 1`). `robots.ts`: izinkan semua, tunjuk `sitemap`. Keduanya memakai `site.url` statis.

## 6. HTML Semantik
- Satu `<h1>`; heading berurutan (H2 di rel kiri tiap section). Landmark: `<header>`, `<nav aria-label="Utama">`, `<main>`, `<section aria-labelledby>`, `<footer>`.
- Tautan "Lewati ke konten" di paling atas. `next/link` untuk tautan internal.
- Tabel memakai `<table>`, `<caption>` (boleh `sr-only`), `<th scope>`; matriks edisi dan perbandingan tidak boleh berupa `div` murni.

## 7. Aksesibilitas (WCAG 2.2 AA)
- Kontras sesuai `02` §2: teks di atas brand = putih; warna brand dari admin lolos ≥ 4,5:1 (`07` §8).
- Semua interaksi keyboard; tab vertikal modul mengikuti pola WAI-ARIA tabs; diagram `ComplianceFlow` dapat dioperasikan dengan keyboard (setiap langkah `<button>`).
- Diagram dan peta: `role="img"` + judul/deskripsi atau alternatif teks (daftar langkah/tabel cabang). Dekoratif `aria-hidden`.
- Status dinamis `aria-live="polite"`; status tidak hanya warna (ikon + teks).
- Target sentuh ≥ 44×44px. Hormati `prefers-reduced-motion`.
- Wadah tabel yang bisa digulir horizontal memiliki `tabindex="0"` dan label.
- Teks hero dari API dapat panjang: uji dengan headline 120 karakter dan subheadline 320 karakter di 375px tanpa memecah layout.

## 8. Performa (Lighthouse ≥ 90 semua kategori)
- Server Components default; `"use client"` hanya untuk navbar mobile, tab, dan demo; `dynamic()` untuk demo selain Perizinan.
- Tanpa gambar raster; diagram SVG/JSX. Logo dari API: `<img>` dengan `width`/`height` eksplisit (komponen `BrandLogo`, satu-satunya pemakaian `<img>`).
- Font via `next/font` (`display: swap`), hanya weight yang dipakai.
- CLS < 0.05: dimensi pasti pada diagram, tabel, logo (`aspect-ratio`/`min-height`), tab panel.
- Tanpa `backdrop-filter`; animasi hanya `opacity`/warna.
- Skrip pelacakan hanya dimuat bila ID diisi (`afterInteractive`).
- `npm run build`, `npm run typecheck`, `npm test` bersih.

## 9. Checklist Final (agent wajib mencentang semua)

**Format & Konten**
- [ ] Terasa seperti landing page promosi enterprise (bukan dashboard); alur persuasi lengkap
- [ ] CTA `Jadwalkan Konsultasi` muncul ≥ 5×; tombol WhatsApp di hero dan melayang bekerja
- [ ] Teks Bahasa Indonesia; tanpa lorem ipsum / `href="#"` kosong
- [ ] Klien, studi kasus, angka, edisi, durasi, lencana, klaim keamanan: ditandai ilustratif/klaim di kode **dan** dilaporkan

**5 Modul Wajib (semua sub-fitur terlihat)**
- [ ] Perizinan: Multi-tier approval · Audit trail (hash chain, verifikasi) · Routing · SLA & eskalasi · Delegasi · Jenis izin · Sisa cuti
- [ ] Absensi: Fingerprint multi-cabang ke cloud · Zona waktu · Deduplikasi & antrean offline · Rekap nasional · Shift & libur nasional · Kanal mobile GPS
- [ ] Gaji: Audit trail payroll · Maker-checker · Slip terenkripsi · Kepatuhan pajak tahunan · Kalkulasi/PPh 21/BPJS · Reimbursement
- [ ] Library: Dokumen ISO · SK Direksi · Kebijakan kerahasiaan (konfirmasi baca) · Klasifikasi & akses · Versi · Masa berlaku
- [ ] Exam: Assessment pejabat struktural · KPI 360° · Anonimitas · Uji kompetensi + proctoring · Rekrutmen · Evaluasi kinerja

**Integritas Angka**
- [ ] `npm test` hijau: routing, hash chain (jalur default dan perubahan), sinkron/zona waktu, skor 360, rekonsiliasi pajak, slip, library, serta seluruh uji `lib/cms`
- [ ] Tidak ada angka hardcode di JSX yang seharusnya hasil hitung
- [ ] Verifikasi akhir `04` (7 butir) lolos

**Integrasi Admin Panel (`07`)**
- [ ] 4 kunci di `.env.example`; tanpa `NEXT_PUBLIC_`; `.env*.local` ter-ignore
- [ ] Semua bagian dinamis §3 punya default dan validasi; fallback per bidang
- [ ] Data API hanya di server (`server-only`); komponen klien tanpa impor `lib/cms`
- [ ] Tidak ada `export const revalidate`/`dynamic` di `src/app`; cache dari `REVALIDATE_SECONDS`
- [ ] Build sukses di 3 kondisi (tanpa env, API mati, mock valid)
- [ ] Warna brand dinamis mengubah tombol/aksen; warna tidak lolos kontras jatuh ke default
- [ ] Audit §14 bersih

**Desain & Anti-Slop**
- [ ] Semua warna dari token; konsisten dengan `02-design-system.md`
- [ ] Audit otomatis `06` §8 bersih; "uji anti-slop" terjawab
- [ ] Tanpa logo/lambang asli (negara, BUMN, bank, ISO, ERP); logo mitra buatan sendiri dan berlabel ilustratif
- [ ] Tanpa foto stok; setiap section punya diagram/tabel/demo

**SEO & OG**
- [ ] Title & description **default** persis sesuai §1
- [ ] `canonical`, `og:*`, `twitter:*` lengkap; `og:image` 1200×630 tampil (default `/og-default`)
- [ ] JSON-LD valid (Organization, WebSite, SoftwareApplication, FAQPage)
- [ ] `sitemap.xml` dan `robots.txt` tersedia

**Teknis**
- [ ] `typecheck`, `build`, `test` hijau; tanpa error console
- [ ] Responsif 375/768/1024/1440 tanpa scroll horizontal halaman
- [ ] Hover, focus-visible, reduced-motion di semua elemen interaktif
- [ ] Lighthouse ≥ 90 (Performance, Accessibility, Best Practices, SEO)

## 10. Format Laporan Akhir Agent
1. **Selesai**: daftar fitur/halaman/file penting.
2. **Integrasi admin panel** (`07` §15): asumsi kontrak API, hasil tiga kondisi build, bidang dinamis dan default, hasil uji cache.
3. **Asumsi**: domain/email/telepon/alamat/WhatsApp placeholder; klien, studi kasus, angka, edisi, durasi ilustratif; logo dan lencana buatan sendiri; CTA primer `Jadwalkan Konsultasi`.
4. **Penyederhanaan rumus** (slip/PPh 21) dari `04`.
5. **Skor**: hasil Lighthouse (atau alasan bila tak bisa dijalankan) + hasil `npm test`.
6. **Perlu keputusan pemilik**: kontrak API final dan kredensial; status sertifikasi ISO/IEC 27001 dan bukti; klaim teknis (AES-256, TLS 1.3, SSO, retensi, residensi data, integrasi fingerprint/ERP, hash chain); pernyataan perbandingan; edisi/SLA/durasi; logo mitra dan studi kasus asli; kebijakan pelacakan dan persetujuan; domain asli; halaman Privasi dan Syarat; konfirmasi rumus pajak dengan konsultan.
