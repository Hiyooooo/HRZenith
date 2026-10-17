# 02 — Design System (SUMBER KEBENARAN VISUAL)

Gaya: **Corporate Enterprise & High Compliance** (ala SAP/Workday). Kokoh, rapat informasi, tenang. Kepercayaan datang dari struktur: grid disiplin, tabel, diagram alur, bahasa dokumen. Tanpa efek dekoratif.

## 1. Identitas (ringkas)
| Sumbu | Keputusan |
|---|---|
| Mode | Terang: kanvas abu-abu terang formal; pita royal blue untuk hero dan CTA; footer hampir hitam |
| Warna | Deep Royal Blue `#1E3A8A` (brand, **dapat diganti dari admin panel**), Slate Steel `#475569`, abu terang `#F3F4F6` |
| Font | Public Sans (judul + body) · Roboto Mono (ID, hash, kode) |
| Bentuk | Siku tegas: radius 4px, border 1px, tanpa bayangan, tabel berkepadatan tinggi |
| Layout | Grid 12 kolom; **anatomi section = rel kiri (judul bernomor, sticky) + konten kanan** |
| Visual | Tabel komparasi, diagram alur audit (swimlane), diagram hub integrasi ERP, peta cabang skematik, radar 360, logo mitra (fiktif) |
| Motion | Minimal: fade 150–200ms, sorot baris. Nol animasi looping |

## 2. Token Warna (`:root` di `src/app/globals.css`)
```css
:root {
  /* Brand: DEFAULT. Nilai runtime dari admin panel menimpanya (docs/07 §8) */
  --brand:       #1E3A8A;   /* royal blue: tombol, tautan, pita hero/CTA, aksen */
  --brand-hover: #1A3277;   /* turunan: campur 14% hitam */
  --brand-tint:  #EDEFF6;   /* turunan: campur 92% putih (latar sorot, badge) */
  --on-brand:    #FFFFFF;   /* SELALU putih di atas --brand (kontras 10,36:1 untuk default) */

  /* Permukaan */
  --canvas: #F3F4F6;        /* latar halaman (abu terang formal) */
  --paper:  #FFFFFF;        /* kartu, tabel, panel */
  --panel:  #E9ECF1;        /* header tabel, bar kontrol */
  --footer: #0B1220;        /* footer, tombol WhatsApp */
  --footer-2: #162033;      /* hover tombol WhatsApp, kolom footer */

  /* Garis */
  --line:    #D1D5DB;       /* pemisah, border kartu (dekoratif) */
  --line-2:  #9CA3AF;       /* garis diagram */
  --control: #6B7280;       /* border input/slider (4,83:1 putih; ≥3:1 untuk UI) */

  /* Teks */
  --ink:   #0F172A;         /* judul (16,22:1 di canvas) */
  --ink-2: #334155;         /* body (9,41:1 di canvas) */
  --steel: #475569;         /* meta, header tabel, ikon sekunder (7,58:1 putih; 6,89:1 canvas; 6,40:1 panel) */
  --on-footer:   #CBD5E1;   /* 12,61:1 di footer */
  --on-footer-2: #94A3B8;   /* 7,30:1 di footer */

  /* Status (selalu dengan ikon + teks) */
  --ok: #166534;     --ok-bg: #DCFCE7;       /* 6,49:1 */
  --warn: #92400E;   --warn-bg: #FEF3C7;     /* 6,37:1 */
  --danger: #991B1B; --danger-bg: #FEE2E2;   /* 6,80:1 */

  /* Pihak ketiga */
  --wa-green: #25D366;      /* HANYA glyph WhatsApp di atas --footer (9,44:1). Di atas putih gagal (1,98:1) */
}
```
**Aturan warna (keras)**
- Teks di atas `--brand` = `--on-brand` (putih), **tanpa teks abu/transparan** di atas brand (kontras harus dijamin walau warna brand diganti admin). Border/garis dekoratif di atas brand: `rgba(255,255,255,.28)`.
- Brand dipakai sebagai: tombol primer, tautan, indikator terpilih/aktif, pita hero dan CTA, kepala diagram. ≤ ±15% area layar. Sisanya netral.
- **Tanpa gradien sama sekali.** Tanpa ungu/pink/neon sebagai warna bawaan. (Admin boleh memilih brand lain selama lolos validasi kontras `07` §8; aturan "tanpa ungu" berlaku untuk default dan semua aset buatan agent.)
- Hex hanya di `globals.css`, `og-default/route.tsx`, dan `lib/cms/defaults.ts` (default brand). Komponen memakai utilitas token (`bg-brand`, `text-brand`, `bg-canvas`, `text-steel`, `border-line`, dst.).
- Status tidak pernah hanya warna: ikon (`Check`, `AlertTriangle`, `XCircle`, `Clock`) + teks.
- Verifikasi kontras dengan skrip saat selesai.

## 3. Tipografi
| Peran | Font | Desktop / Mobile | Weight | Tracking | LH |
|---|---|---|---|---|---|
| H1 hero | Public Sans | 44 / 30 px | 700 | -0.02em | 1.12 |
| H2 section (di rel kiri) | Public Sans | 28 / 24 px | 700 | -0.015em | 1.2 |
| H3 judul blok/modul | Public Sans | 20 / 18 px | 600 | -0.005em | 1.3 |
| Judul tabel/kartu | Public Sans | 15 px | 600 | 0 | 1.35 |
| Body | Public Sans | 16 px | 400 | 0 | 1.6 |
| Kecil / sel tabel | Public Sans | 14 px | 400/500 | 0 | 1.45 |
| Header tabel | Public Sans | 12 px uppercase | 700 | 0.06em | 1.2 |
| Nomor section, eyebrow | Roboto Mono | 12 px uppercase | 500 | 0.08em | 1.2 |
| ID dokumen, hash, kode | Roboto Mono | 13 px | 400 | 0 | 1.4 |

- `font-variant-numeric: tabular-nums` pada semua angka; kolom angka **rata kanan**.
- Heading rata kiri. H1 boleh sampai 4 baris di mobile; layout tidak boleh pecah (teks hero dari API bisa panjang; lihat `07` §6 batas karakter).
- `next/font`: Public Sans (400, 500, 600, 700), Roboto Mono (400, 500). `display: swap`.

## 4. Spacing, Radius, Layout
- Skala spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Container `max-width: 1240px`, gutter 24 (mobile) / 40 (≥1024).
- Section padding vertikal: 56 mobile / 88 desktop; antar section dipisah garis 1px `--line`.
- Radius: kartu/tombol/input **4px**, badge/chip **4px**, pil **hanya** tombol WhatsApp melayang dan titik status.
- **Anatomi section (`SectionShell`)**: ≥1024 grid 12 kolom: **rel kiri 3 kolom** (nomor Roboto Mono `1.0`, H2, 1–2 kalimat pengantar 14px steel; `position: sticky; top: 88px`) + **konten kanan 9 kolom**. <1024: rel menjadi blok di atas konten (tidak sticky).
- Hero, strip mitra, CTA, footer boleh melebar penuh sesuai spesifikasi `03`.
- Target sentuh ≥ 44×44px; tabel boleh padat (tinggi baris ≥ 44px pada elemen interaktif).

## 5. Komponen
**Tombol** (tinggi 44px, radius 4, teks 15px/600)
- Primer: bg `--brand`, teks `--on-brand`; hover `--brand-hover`.
- Sekunder: bg `--paper`, border 1.5px `--brand`, teks `--brand`; hover bg `--brand-tint`. Di atas pita brand: bg putih, teks `--brand`; sekunder: border putih 1.5px, teks putih, hover bg `rgba(255,255,255,.12)`.
- Tautan teks: `--brand` + underline 1px offset 3px.
- Fokus: `outline: 3px solid var(--ink); outline-offset: 2px;` (di atas brand: outline putih).
**Card**: bg `--paper`, border 1px `--line`, radius 4, **tanpa shadow**. Kepala kartu opsional: bg `--panel`, border bawah 1px `--line`, judul 15px/600.
**DataTable** (komponen utama)
- Wadah `overflow-x: auto` (satu-satunya tempat scroll horizontal; halaman tidak boleh scroll horizontal), `role="region"` + `aria-label` + `tabindex="0"`.
- Header: bg `--panel`, teks `--steel` 12px uppercase; sel 12×16; baris selang-seling `--paper`/`--canvas`; garis horizontal 1px `--line`; kolom pertama sticky di mobile.
- Markup `<table>` sungguhan dengan `<th scope>` dan `<caption>` (boleh `sr-only`).
**StatusChip**: persegi 4px, ikon 14px + teks 12px/600. Varian: `ok`, `warn`, `danger`, `neutral` (`--panel`/`--steel`), `info` (`--brand-tint`/`--brand`).
**Badge keamanan**: persegi panjang 4px, border 1px `--line`, ikon Lucide (`ShieldCheck`, `Lock`, `KeyRound`, `FileLock2`) + dua baris (judul 13px/600, keterangan 12px `--steel`). Bukan logo lembaga mana pun. Isi (data di `data.ts`, `confirmed: false`): `Selaras ISO/IEC 27001` · `Enkripsi AES-256` · `TLS 1.3` · `Dirancang sesuai UU PDP` · `SSO SAML/OIDC`. Komentar kode: `{/* KLAIM: ubah ke "Tersertifikasi" hanya bila sertifikat asli tersedia */}`.
**Input/select/slider (di demo)**: bg `--paper`, border 1.5px `--control`, radius 4, tinggi 44, label terlihat di atas; fokus ring 3px `--ink`. Segmented control untuk pilihan peran.
**Navbar**: `UtilityBar` 36px (bg `--panel`, 13px, tidak sticky): kiri `Platform HRIS Enterprise · Indonesia`, kanan `Dokumen Keamanan` + `Hubungi Sales` (mailto). Lalu navbar sticky 64px: bg `--paper`, border bawah 1px `--line`, logo kiri, tautan tengah, CTA primer kanan. Tanpa blur/transparansi. Mobile: `Menu`/`X`, panel penuh, focus trap, Esc menutup.
**Tabs vertikal (modul)**: `role="tablist"` `aria-orientation="vertical"` (≥1024) / horizontal scroll (mobile); tab aktif: border kiri 4px `--brand` + bg `--paper` + teks `--ink`; navigasi panah/Home/End.

## 6. Diagram & Visual (pengganti foto)
Halaman ini **tidak memakai foto stok**. Visual = diagram/SVG/JSX berkualitas tinggi:
- **`ComplianceFlow`**: swimlane 5 jalur (`Staff` · `Atasan` · `HRD` · `Sistem` · `Auditor`) × 8 langkah (`04` §Alur Audit). Kotak langkah 4px, garis penghubung 2px `--line-2`, panah segitiga solid, langkah terpilih diberi border `--brand` 2px + panel rincian di bawah ("Data dicatat"). <1024: daftar vertikal bernomor dengan label jalur. Tombol `Putar alur` menyorot langkah berurutan **sekali**.
- **`ErpHub`**: kotak tengah `HRZenith`, kiri sumber (Mesin fingerprint cabang, Portal karyawan), kanan target (`ERP Keuangan`, `ERP Manufaktur/Proyek`, `SSO / Identity Provider`, `Bank (file H2H)`, `Direktori (LDAP/AD)`), tiap garis berlabel protokol dengan chip (`REST API`, `SFTP/CSV`, `Webhook`, `SAML/OIDC`). **Nama produk ERP/bank tidak dipakai** (generik) sampai integrasi terverifikasi.
- **`BranchMap`**: **peta skematik** (bukan geografis akurat): 7 simpul cabang tersusun barat→timur di grid titik dengan label zona (WIB/WITA/WIT) dan garis ke simpul pusat `Server Cloud`; status simpul = ikon + teks. Beri catatan `Skematik, bukan peta`.
- **`Radar360`**: radar 5 sumbu SVG manual; 3–4 poligon (Atasan, Rekan, Bawahan, Diri) dengan pola garis berbeda (solid, putus, titik) selain warna; legenda teks.
- **`PartnerLogo`**: logo mitra **fiktif buatan sendiri**: glyph geometris sederhana (heksagon, tiga batang, cincin, segitiga bersusun, kuarter persegi, gelombang) + wordmark Public Sans 700; semua satu warna `--steel`; label `Ilustratif` di bawah strip. Dilarang meniru logo perusahaan/instansi nyata.
- **Ikon** hanya `lucide-react`, `strokeWidth={1.5}`, 16–24px, `currentColor`. Ikon tidak ditaruh di lingkaran berwarna.
- Semua SVG: `role="img"` + `<title>` bila bermakna, `aria-hidden` bila dekoratif; fill/stroke lewat token; tanpa gradien/filter/blur.
- Latar hero: bg `--brand` dengan pola grid SVG statis (`<pattern>` garis 1px, putih opasitas .08, kotak 32px). Tidak ada glow/gradien.

## 7. Motion (minimal)
- Durasi: 150ms (warna), 200ms (fade, akordeon), 300ms (geser panel tab). Easing `cubic-bezier(.2,0,0,1)`.
- Diizinkan: (a) fade-in sekali saat masuk viewport (`Reveal`, tanpa translate), (b) pergantian panel tab, (c) sorot baris yang baru ditambahkan (mis. entri audit baru: bg `--brand-tint` memudar 1 dtk, sekali), (d) `Putar alur` di diagram (berurutan sekali), (e) spinner tombol `Sinkronkan` (600ms, sekali).
- **Nol animasi looping/infinite.** Tanpa pulse, marquee, parallax.
- `prefers-reduced-motion: reduce`: matikan (a)–(e); tampilkan state akhir langsung.
- Hash SHA-256 dihitung sungguhan di browser (Web Crypto) saat demo, tanpa animasi "mengetik".

## 8. Tombol WhatsApp Melayang (`layout/WhatsAppFloat.tsx`)
- Server Component; tautan **berasal dari konfigurasi** (`07` §11), bukan dirakit dari nomor.
- `position: fixed; right: 20px; bottom: max(20px, env(safe-area-inset-bottom)); z-index: 50`.
- Kapsul: tinggi 48px, `border-radius: 999px`, padding `0 18px 0 14px`, glyph WhatsApp 22px `--wa-green` + teks `WhatsApp` (14px/600, putih) + sembunyikan kata "Konsultasi" di mobile; bg `--footer`, border 1px `rgba(255,255,255,.24)`, **tanpa shadow**. Hover: bg `--footer-2`. Fokus: outline putih 2px + offset (cek di atas pita brand dan putih).
- `target="_blank" rel="noopener noreferrer"`, `aria-label="Hubungi HRZenith melalui WhatsApp (tab baru)"`. Sembunyikan saat cetak. Beri padding bawah halaman 88px agar tidak menutup konten terakhir.
- `WhatsAppIcon.tsx`: glyph resmi WhatsApp inline SVG (`aria-hidden`); bila path tidak tersedia, fallback `MessageCircle` Lucide dan laporkan.
- Tombol WhatsApp di hero: sekunder, ikon + `Chat WhatsApp`, tautan sama dari konfigurasi.

## 9. Implementasi Tailwind + Next.js
- Token di `globals.css` persis §2. Tailwind v4: `@theme inline { --color-brand: var(--brand); --color-brand-hover: var(--brand-hover); --color-brand-tint: var(--brand-tint); --color-canvas: var(--canvas); --color-ink: var(--ink); --color-steel: var(--steel); ... }`. Tailwind v3: `theme.extend.colors` dengan nilai `var(...)`. Matikan palet bawaan agar warna tak resmi tidak terpakai.
- Variabel brand disuntikkan server-side pada `<html style>` (`07` §8) sehingga tema benar sejak render pertama.
- Font via `next/font/google` → `--font-sans`, `--font-mono`.
- `SectionShell.tsx` (rel kiri + konten), `DataTable.tsx`, `StatusChip.tsx` adalah komponen kunci; semua section memakainya.
