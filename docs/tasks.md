# Task List — HRZenith (Website 04)

> Dokumen pelacak implementasi proyek **HRZenith** sesuai arahan [AGENTS.md](../AGENTS.md) dan seluruh spesifikasi di folder `docs/`. Setiap tugas wajib diverifikasi sebelum ditandai selesai `[x]`.

---

## Ringkasan Proyek
- **Produk**: Platform HRIS Enterprise untuk BUMN, konglomerat multinasional, industri finansial, dan institusi pemerintahan.
- **Bintang Halaman**: Perizinan multi-tier dengan audit trail berantai-hash SHA-256 yang dapat diverifikasi integritasnya langsung di browser.
- **Gaya Desain**: *Corporate Enterprise & High Compliance* (ala SAP/Workday) — kanvas abu terang formal (`#F3F4F6`), brand Royal Blue (`#1E3A8A`), font Public Sans + Roboto Mono, radius tegas 4px, tanpa gradien/glow/foto stok.
- **Integrasi**: Headless CMS Laravel 11 (`GET /api/v1/site/config` via header `X-Site-Id` & `X-Site-Secret`) dengan prinsip *zero-downtime fallback* dan ISR berbasis `REVALIDATE_SECONDS`.

---

## Fase 1: Setup Proyek, Dependensi, & Konfigurasi Dasar
Menginisialisasi proyek Next.js mandiri yang bersih dari sisa template bawaan.

- [x] **1.1 Inisialisasi Proyek Next.js**
  - Eksekusi `npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*"` di folder `04-hrzenith`.
  - Pasang dependensi wajib: `lucide-react`, `server-only`, `clsx`, `tailwind-merge`.
  - Pasang devDependencies pengujian: `vitest` (dan `@vitest/coverage-v8` jika diperlukan).
  - Berkas target: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`.

- [x] **1.2 Pembersihan Template Bawaan (Anti-Slop Cleanliness)**
  - Hapus aset bawaan: `public/next.svg`, `public/vercel.svg`, favicon bawaan Next.js.
  - Buat `public/favicon.svg` (ikon formal HRZenith bernuansa korporat).
  - Bersihkan `src/app/globals.css` dan `src/app/page.tsx` dari styling/komponen template default.
  - Hapus modul CSS bawaan jika ada (`page.module.css`).

- [x] **1.3 Konfigurasi Environment & Git**
  - Buat `.env.example` dengan 4 kunci: `API_URL`, `SITE_ID=04-hrzenith`, `SITE_SECRET=`, `REVALIDATE_SECONDS=300`.
  - Pastikan `.gitignore` memuat `.env*.local`.
  - Siapkan `package.json` dengan skrip wajib: `dev`, `build`, `start`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`).

- [x] **1.4 Konfigurasi Vitest & Testing Environment**
  - Buat `vitest.config.ts` dengan path alias `@/*` menunjuk ke `./src/*`.
  - Konfigurasi alias `server-only` ke stub modul kosong (`src/test/server-only-stub.ts`) agar unit test server-only dapat berjalan lancar.
  - Verifikasi: jalankan `npm test` untuk memastikan konfigurasi test runner bekerja.

---

## Fase 2: Fondasi Integrasi CMS Laravel (`src/lib/cms/`) & Unit Testing
Mengimplementasikan modul pembacaan konfigurasi admin panel Laravel secara server-only dengan fallback per-bidang dan validasi ketat (merujuk ke `docs/07-admin-integration.md`).

- [x] **2.1 Tipe Data & Nilai Cadangan (`types.ts` & `defaults.ts`)**
  - Buat `src/lib/cms/types.ts` mendefinisikan interface `SiteConfig` terstandarisasi.
  - Buat `src/lib/cms/defaults.ts` berisi `DEFAULT_SITE_CONFIG`, `DEFAULT_REVALIDATE_SECONDS = 300`, `API_TIMEOUT_MS = 4000`.
  - Sertakan penanda komentar placeholder pada data kontak/alamat dummy sesuai aturan.

- [x] **2.2 Pembacaan Environment & ISR Parser (`env.ts` + `env.test.ts`)**
  - Buat `readCmsEnv()` untuk membaca `API_URL`, `SITE_ID`, `SITE_SECRET`, `REVALIDATE_SECONDS`.
  - Buat fungsi murni `parseRevalidate(raw?: string): number` (hanya menerima bilangan bulat desimal 1–86400, selain itu fallback ke 300).
  - Tulis unit test `env.test.ts` untuk memverifikasi 11 test vector di `docs/07` §9.

- [x] **2.3 Validator Input API (`validators.ts`)**
  - Fungsi validasi: `isHexColor`, `isHttpsUrl`, `isWhatsAppUrl`, `isGaId`, `isPixelId`, `isEmail`, `isPhone`, `clampText`.
  - Tulis fungsi `resolveUrl(url, cleanApiUrl)` untuk menyelesaikan path relatif (`/path/to/asset.svg`) dan perbaikan domain localhost.

- [x] **2.4 Kalkulasi Tema Brand Dinamis (`color.ts` + `color.test.ts`)**
  - Buat fungsi murni `deriveBrand(hex)`:
    - Normalisasi hex 6 karakter huruf besar.
    - Hitung kontras luminansi WCAG terhadap putih (`#FFFFFF`).
    - Tolak warna dengan kontras < 4,5:1 (kembalikan `null` -> fallback ke default `#1E3A8A`).
    - Hitung warna turunan: `hover` (campur 14% hitam), `tint` (campur 92% putih).
  - Tulis unit test `color.test.ts` mencakup semua test vector di `docs/07` §8.

- [x] **2.5 Perakitan Request & Normalisasi Respons (`endpoint.ts`, `normalize.ts` + `normalize.test.ts`)**
  - `endpoint.ts`: Membangun URL `${cleanUrl}/api/v1/site/config` dan header `X-Site-Id`, `X-Site-Secret`, `Accept: application/json`.
  - `normalize.ts`: Memetakan payload API (baik di root maupun di dalam pembungkus `data`, snake_case maupun camelCase, array maupun objek social_links) dan menggabungkannya di atas `DEFAULT_SITE_CONFIG`.
  - Tulis unit test `normalize.test.ts` untuk memverifikasi fallback parsial, penolakan script tag, clamping teks, dan fallback WhatsApp URL.

- [x] **2.6 Modul Fetch Utama (`get-site-config.ts` + `get-site-config.test.ts`)**
  - Tambahkan `import "server-only";` di baris teratas.
  - Bungkus fungsi dalam `React.cache`.
  - Validasi keberadaan kredensial: jika `API_URL`, `SITE_ID`, atau `SITE_SECRET` kosong, langsung kembalikan default tanpa panggilan jaringan.
  - Panggil `fetch` dengan header `X-Site-Id` & `X-Site-Secret`, `next: { revalidate, tags: ["site-config"] }`, dan timeout `API_TIMEOUT_MS` via `AbortController`.
  - Tangani `try/catch` tanpa melempar error; logging error ringkas tanpa membocorkan rahasia.
  - Tulis unit test `get-site-config.test.ts` mencakup 7 skenario di `docs/07` §13.

---

## Fase 3: Logika Bisnis & Test Vector 5 Modul (`src/lib/`) & Unit Testing
Mengimplementasikan modul fungsi murni untuk 5 modul HRIS sesuai spesifikasi numerik di `docs/04-modules.md`.

- [x] **3.1 Routing Persetujuan Berjenjang (`approval.ts` + `approval.test.ts`)**
  - Implementasikan `approvalChain(type: LeaveType, hari: number): Role[]`.
  - Tangani aturan jenis cuti tahunan, sakit, dinas luar kota/negeri, izin belajar, dan lempar `RangeError` untuk input di luar batasan.
  - Tulis unit test `approval.test.ts` untuk seluruh rentang hari dan tipe.

- [x] **3.2 Rantai Audit Trail SHA-256 (`audit.ts` + `audit.test.ts`)**
  - Implementasikan fungsi async Web Crypto: `sha256(text)`, `appendEntry(prevHash, actor, action, timestamp)`, `verifyChain(chain)`.
  - Genesis hash: `sha256("GENESIS") = 901131d838b17aac0f7885b81e03cbdc9f5157a00343d30ab22083685ed1416a`.
  - Tulis unit test `audit.test.ts` mencakup jalur default (5 entri: `b71a50df` hingga `fa1c6fc4`) dan simulasi deteksi rantai putus pada entri #3.

- [x] **3.3 Sinkronisasi & Normalisasi Kehadiran Cabang (`sync.ts` + `sync.test.ts`)**
  - Implementasikan `syncSummary(branches)`: agregasi log mentah, duplikat, log unik, dan mesin offline.
  - Implementasikan `toWIB(date, time, zone)` untuk konversi jam WIT/WITA ke WIB.
  - Tulis unit test `sync.test.ts` mencakup data 7 cabang (10.536 mentah -> 10.471 unik; 10.509 setelah Jayapura disusulkan) dan konversi jam.

- [x] **3.4 Evaluasi KPI 360 & Kompetensi Pejabat (`score360.ts` + `score360.test.ts`)**
  - Implementasikan kalkulasi nilai 360 5 dimensi, normalisasi bobot jika kelompok penilai disembunyikan (<3 penilai), skor KPI, dan nilai akhir kelayakan (`kategori()`).
  - Tulis unit test `score360.test.ts` memverifikasi hasil default (`4,20 · Layak`) dan varian saat bawahan disembunyikan (`4,25 · Layak`).

- [x] **3.5 Slip Gaji & Rekonsiliasi Pajak Tahunan (`slip.ts`, `compliance.ts` + test)**
  - `slip.ts`: Kalkulasi bruto, TER Kategori A, PPh 21, BPJS Ketenagakerjaan & Kesehatan, gaji bersih.
  - `compliance.ts`: Rekonsiliasi total PPh 21 bulanan vs 1721-A1 (selisih Rp 1.250.000 -> Rp 0 setelah koreksi Maret).
  - Tulis unit test `slip.test.ts` (fixture Budi Santoso: bersih Rp 10.408.000) dan `compliance.test.ts`.

- [x] **3.6 Kontrol Akses Dokumen Library (`library.ts` + `library.test.ts`)**
  - Implementasikan `canView(role, classification)`.
  - Tulis unit test `library.test.ts` untuk 10 dokumen fixture dan verifikasi hak akses Karyawan (6 dokumen terlihat).

- [x] **3.7 Helper Formatter & Fixture Data (`format.ts`, `data.ts`, `site.ts`)**
  - `format.ts`: `rupiah()`, `persen()`, format tanggal lokal WIB.
  - `site.ts`: Nilai statis nama, domain, dan locale.
  - `data.ts`: Data fixture cabang, dokumen library, pejabat struktural, FAQ kepatuhan.

---

## Fase 4: Design System, Token CSS, & Komponen UI Primitif
Mengonfigurasi tema visual sesuai `docs/02-design-system.md` dan aturan keras `docs/06-anti-slop.md`.

- [x] **4.1 Token CSS & Konfigurasi Tailwind (`globals.css`)**
  - Definisikan variabel `:root` di `globals.css`: `--brand`, `--brand-hover`, `--brand-tint`, `--on-brand`, `--canvas`, `--paper`, `--panel`, `--footer`, `--line`, `--ink`, `--steel`, status token, dan `--wa-green`.
  - Konfigurasikan `@theme` Tailwind memetakan token ke utility class (`bg-brand`, `text-ink`, `border-line`, dsb.).
  - Pasang font Google `Public Sans` dan `Roboto Mono` via `next/font/google`.

- [x] **4.2 Komponen Primitif UI (`src/components/ui/`)**
  - `Button.tsx`: Varian primer (di atas brand / kanvas), sekunder, teks, fokus ring aksesibel.
  - `Card.tsx`: Background `--paper`, border 1px `--line`, radius 4px, nol bayangan.
  - `Badge.tsx`: Badge formal persegi 4px.
  - `StatusChip.tsx`: Chip status kombinasi ikon + teks (varian ok, warn, danger, neutral, info).
  - `DataTable.tsx`: Tabel semantik berkepadatan tinggi, caption, header `--panel`, penanganan scroll horizontal aman dengan `role="region"`, `aria-label`, dan `tabindex="0"`.
  - `Reveal.tsx`: Efek fade-in halus sekali saat masuk viewport (hormat `prefers-reduced-motion`).
  - `Logo.tsx` & `BrandLogo.tsx`: Wordmark resmi HRZenith buatan sendiri + penanganan logo dinamis dari API via `<img>`.
  - `WhatsAppIcon.tsx`: Glyph resmi WhatsApp inline SVG (aria-hidden).
  - `TrackingScripts.tsx`: Pemasangan skrip Google Analytics & Meta Pixel hanya bila ID valid.

- [x] **4.3 Kerangka Tata Letak Section (`SectionShell.tsx`)**
  - Buat komponen `SectionShell`: Layout 12 kolom desktop dengan rel kiri 3 kolom (nomor `1.0` - `9.0` Roboto Mono, judul H2, teks pengantar, sticky) + konten kanan 9 kolom.

---

## Fase 5: Diagram Teknis SVG & Aset Visual (Pengganti Foto Stok)
Membangun diagram teknis murni SVG/JSX sesuai `docs/02` §6 dan `docs/04`.

- [x] **5.1 Diagram Alur Audit (`ComplianceFlow.tsx`)**
  - Swimlane 5 jalur (`Staff`, `Atasan`, `HRD`, `Sistem`, `Auditor`) × 8 langkah audit.
  - Interaktivitas: klik langkah membuka panel rincian (Aktor, Aksi, Data dicatat, Kontrol).
  - Tombol `Putar alur` menyorot langkah 1-8 secara berurutan sekali (300ms/langkah).

- [x] **5.2 Diagram Hub Integrasi ERP (`ErpHub.tsx`)**
  - Skema kotak tengah `HRZenith`, sumber kiri (fingerprint, portal), target kanan (ERP Keuangan, Manufaktur, SSO, Bank H2H, Direktori) dengan label protokol generik (`REST API`, `SFTP/CSV`, `Webhook`, `SAML/OIDC`).

- [x] **5.3 Peta Skematik Cabang Nasional (`BranchMap.tsx`)**
  - Diagram titik skematik 7 kota cabang tersusun barat-timur (WIB, WITA, WIT) yang terhubung ke server cloud pusat.

- [x] **5.4 Grafik Radar KPI 360 (`Radar360.tsx`)**
  - Radar SVG manual 5 dimensi dengan poligon penilai (Atasan, Rekan, Bawahan, Diri) dan pola garis berbeda (solid, putus-putus, titik).

- [x] **5.5 Logo Mitra Korporasi Fiktif (`PartnerLogo.tsx`)**
  - 6 logo mitra enterprise fiktif buatan sendiri (Garda Energi, Arta Mandala, Samudra Logistik, Cendana Utama, Bumi Karya, Teknik Prima) beraksen satu warna `--steel` dengan label `Ilustratif`.

---

## Fase 6: Layout Root, Navigasi, & Seluruh Section Halaman
Merakit kerangka halaman sesuai urutan di `docs/03-page-structure.md`.

- [x] **6.1 Root Layout & Navigasi (`layout.tsx`, `Navbar.tsx`, `Footer.tsx`)**
  - `layout.tsx`: Ambil `getSiteConfig()`, suntikkan CSS variables brand pada `<html style>`, set metadata & viewport dinamis, pasang `TrackingScripts`.
  - `UtilityBar.tsx`: Bar formal atas 36px (label status, link dokumen keamanan, kontak sales).
  - `Navbar.tsx` & `NavbarShell.tsx`: Navbar sticky 64px, brand logo, navigasi menu anchor, CTA primer, drawer mobile dengan focus trap.
  - `Footer.tsx`: Tagline, navigasi modul, blok kontak dinamis, copyright dinamis, penanda klaim ilustratif.
  - `WhatsAppFloat.tsx`: Tombol WhatsApp melayang kapsul fixed pojok kanan bawah dari URL konfigurasi.

- [x] **6.2 Section Hero & Referensi Mitra (`Hero.tsx`, `PartnerStrip.tsx`)**
  - `Hero.tsx`: Pita brand, copy dinamis (H1, subheadline, CTA text), tombol WhatsApp sekunder, panel kepatuhan (mini DataTable 3 pilar + 3 badge keamanan).
  - `PartnerStrip.tsx`: Baris 6 logo mitra fiktif berlabel `Referensi organisasi (ilustratif)`.

- [x] **6.3 Section 1.0 Keamanan & Integrasi (`SecuritySection.tsx`)**
  - Rel `1.0`, tabel 6 kontrol keamanan ISO/IEC 27001:2022 Annex A, dan diagram `ErpHub`.

- [x] **6.4 Section 2.0 Alur Audit Compliance (`AuditFlowSection.tsx`)**
  - Rel `2.0`, diagram `ComplianceFlow`, 3 poin verifikasi integritas, dan tautan langsung ke modul perizinan.

- [x] **6.5 Section 4.0 Perbandingan Pendekatan (`ComparisonSection.tsx`)**
  - Rel `4.0`, tabel komparasi 9 aspek (Proses Manual vs HRIS Umum vs HRZenith) dengan kolom HRZenith disorot.

- [x] **6.6 Section 5.0 Edisi & Deployment (`EditionsSection.tsx`)**
  - Rel `5.0`, matriks edisi tanpa harga (Enterprise, Corporate, Sovereign), rincian deployment on-premise/cloud, retensi audit, dan CTA konsultasi.

- [x] **6.7 Section 6.0 Implementasi Bertahap (`RoadmapSection.tsx`)**
  - Rel `6.0`, tabel 4 fase implementasi (Discovery, Konfigurasi & Integrasi, Pilot & UAT, Go-Live).

- [x] **6.8 Section 7.0 Studi Kasus Korporasi (`CaseStudiesSection.tsx`)**
  - Rel `7.0`, 2 kartu metrik organisasi besar fiktif (Arta Mandala Finansial & Garda Energi Nusantara) dengan label ilustratif terlihat.

- [x] **6.9 Section 8.0 FAQ Kepatuhan & Keamanan (`FaqSection.tsx`)**
  - Rel `8.0`, akordeon aksesibel 8 pertanyaan tim CISO/Audit/Pengadaan dengan atribut WAI-ARIA lengkap.

- [x] **6.10 Section 9.0 Konsultasi Penutup (`FinalCtaSection.tsx`)**
  - Rel `9.0`, pita brand, tombol konsultasi mailto, tombol WhatsApp, dan blok kontak langsung.

---

## Fase 7: Demo Interaktif 5 Modul HRIS (`src/components/modules/`)
Membangun wadah master-detail `ModuleTabs.tsx` dan demo interaktif 5 modul (merujuk ke `docs/04-modules.md`).

- [x] **7.1 Wadah Modul Master-Detail (`ModuleTabs.tsx`)**
  - Tab vertikal desktop (border kiri 4px `--brand`) / horizontal mobile.
  - Deep linking hash (`#modul-perizinan`, dst.) dan lazy rendering panel non-aktif.

- [x] **7.2 Modul 1: Perizinan (BINTANG) (`PerizinanDemo.tsx`)**
  - Teks H3, deskripsi, tabel sub-fitur lengkap.
  - Kontrol pengajuan (jenis izin, durasi stepper hari, pemohon, sisa cuti).
  - Stepper rantai dinamis (`approvalChain`) 4 tingkat (Staff -> Spv -> Manager -> HRD).
  - Tombol aksi aktif: Setujui, Kembalikan, Tolak (wajib catatan), Delegasikan, Simulasi SLA terlewat.
  - Baris dampak persetujuan final (sisa cuti terpotong, sinkron absensi & payroll).
  - Tabel audit trail dengan hash SHA-256 riil dan tombol `Verifikasi Integritas`.
  - Tombol `Simulasikan perubahan data` yang membuktikan deteksi rantai putus pada entri #3.

- [x] **7.3 Modul 2: Absensi (`AbsensiDemo.tsx`)**
  - Visual diagram `BranchMap` skematik.
  - Ringkasan sinkronisasi (62 mesin, 10.536 mentah, 65 duplikat, 10.471 unik).
  - Tabel cabang dan tombol `Sinkronkan Semua` serta `Hubungkan Ulang Jayapura`.
  - Alat konversi normalisasi jam lokal (WITA/WIT ke WIB) via `toWIB`.
  - Indikator rekapitulasi kehadiran nasional (93,9% hadir).

- [x] **7.4 Modul 3: Gaji (`GajiDemo.tsx`)**
  - Tab 1: Audit trail batch payroll maker-checker (tolak persetujuan diri sendiri).
  - Tab 2: Slip gaji terenkripsi password (PIN DDMMYYYY `15081990`) dengan batasan 3 kali percobaan.
  - Tab 3: Panel kepatuhan pajak tahunan (selisih Rp 1.250.000 menjadi Rp 0 setelah koreksi Maret diterapkan).

- [x] **7.5 Modul 4: Library (`LibraryDemo.tsx`)**
  - Pemilih peran (Karyawan, Manajer, HRD Director, Auditor Internal).
  - Filter pencarian, jenis dokumen, dan status.
  - Tabel 10 dokumen dengan judul tersensor `Akses dibatasi` untuk dokumen di atas hak akses.
  - Panel rincian riwayat versi dan tombol interaktif konfirmasi baca pakta integritas.

- [x] **7.6 Modul 5: Exam (`ExamDemo.tsx`)**
  - Tab 1: KPI 360° dengan `Radar360`, slider pencapaian KPI, kalkulasi nilai akhir kelayakan (`4,20 · Layak`), saklar anonimitas penilai bawahan (<3 penilai -> `4,25 · Layak`), dan analisis blind spot.
  - Tab 2: Matriks kompetensi jabatan 4 pejabat dan simulasi ujian proctoring dengan timer hitung mundur dan deteksi pindah tab.

---

## Fase 8: SEO, OpenGraph Dinamis, Schema JSON-LD, Sitemap & Robots
Mengimplementasikan optimasi mesin pencari sesuai `docs/05-seo-og-quality.md`.

- [x] **8.1 Metadata & Viewport Dinamis (`layout.tsx`)**
  - `generateMetadata()`: title, description, canonical, openGraph, twitter card, favicon dari konfigurasi CMS / default persis.
  - `generateViewport()`: themeColor mengikuti brand color.

- [x] **8.2 OpenGraph Image Default Route (`src/app/og-default/route.tsx`)**
  - Route handler `ImageResponse` (1200×630) tanpa gambar raster eksternal.
  - Visual: Wordmark HRZenith, headline kepatuhan, kartu diagram rantai persetujuan dan baris log audit hash.
  - Baca font lokal TTF dari `src/assets/fonts/` (tanpa fetch jaringan saat build).

- [x] **8.3 Schema Markup Terstruktur (`src/lib/schema.ts`)**
  - JSON-LD `@graph` memuat: `Organization`, `WebSite`, `SoftwareApplication` (dengan daftar lengkap 5 modul & sub-fitur), dan `FAQPage` (dari 8 pertanyaan FAQ).
  - Pasang di `src/app/page.tsx` via `<script type="application/ld+json">`.

- [x] **8.4 Sitemap & Robots (`sitemap.ts`, `robots.ts`)**
  - `sitemap.ts`: Endpoint XML sitemap dengan URL statis `site.url`.
  - `robots.ts`: Aturan crawling mengizinkan semua bot dan mengarah ke sitemap.

---

## Fase 9: Skrip Mock CMS & Pengujian Ketahanan 3 Kondisi
Memverifikasi ketahanan integrasi sesuai `docs/07` §13 & §14.

- [x] **9.1 Pembuatan Skrip Mock Server (`scripts/mock-cms.mjs`)**
  - Buat server Node.js murni (port 8000) yang melayani `GET /api/v1/site/config`.
  - Validasi header `X-Site-Id: 04-hrzenith` dan `X-Site-Secret: test-secret`.
  - Dukung opsi flag: normal (200), `--fail` (500), `--slow` (delay 6000ms untuk uji timeout).

- [x] **9.2 Pengujian 3 Skenario Build**
  - Skenario A: Tanpa berkas `.env.local` -> `npm run build` sukses 100% menggunakan default.
  - Skenario B: `API_URL` menunjuk host tak terjangkau (`http://localhost:9999`) -> `npm run build` sukses 100% via timeout & fallback.
  - Skenario C: Menjalankan mock CMS valid -> `npm run build` sukses 100% membaca data dinamis.

- [x] **9.3 Verifikasi Perilaku Cache ISR**
  - Uji revalidasi cache pada runtime production (`npm run build && npm start`) dengan mengubah nilai pada mock server.

---

## Fase 10: Audit Anti-Slop, Verifikasi Kualitas Akhir, & Dokumentasi Laporan
Memastikan proyek 100% patuh aturan dan siap diserahkan.

- [x] **10.1 Audit Otomatis Anti-Slop (`docs/06` §8)**
  - Eksekusi serangkaian perintah grep untuk memastikan tidak ada:
    - Efek gradien, backdrop-blur, shadow dekoratif, atau rounded besar.
    - Kode warna hex liar di luar berkas yang diizinkan.
    - Kata-kata terlarang (lorem ipsum, revolusioner, terdepan, dsb.).
    - Klaim berisiko (tersertifikasi tanpa bukti, 100% aman, dsb.).
    - Kredensial `NEXT_PUBLIC_` atau kebocoran `SITE_SECRET` ke bundle klien.
    - Sisa template atau penggunaan `any` / `@ts-ignore`.

- [x] **10.2 Verifikasi Akhir Kualitas Teknis**
  - `npm run typecheck` bersih tanpa error.
  - `npm test` seluruh suite unit test hijau 100%.
  - Uji responsivitas di resolusi 375px, 768px, 1024px, 1440px tanpa horizontal page scroll.
  - Uji aksesibilitas navigasi keyboard (fokus ring, ARIA tabs, akordeon, modal).

- [x] **10.3 Penyusunan Laporan Akhir Proyek**
  - Buat laporan akhir komprehensif mengikuti format [docs/05-seo-og-quality.md](05-seo-og-quality.md) Bagian 10.
