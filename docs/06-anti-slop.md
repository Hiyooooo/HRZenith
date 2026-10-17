# 06 — Anti "AI Slop" dan Klaim Berlebihan (ATURAN KERAS)

Untuk pembeli enterprise dan pemerintah, kesan generik atau klaim yang tak terbukti langsung menurunkan kepercayaan. Halaman ini harus terbaca seperti dokumen tata kelola yang teliti. Baca file ini sebelum menulis kode atau copy.

## 1. Visual: dilarang
- Gradien apa pun (CSS, SVG `<linearGradient>`, teks gradien). Semua bentuk **datar**.
- Ungu/pink/neon sebagai warna bawaan; glow, aurora, blob, mesh, glassmorphism, `backdrop-blur`, noise.
- Shadow dekoratif, kartu melayang, `hover:scale-*`, kartu dengan sudut `rounded-2xl/3xl`, ikon di lingkaran berwarna.
- Foto stok (jabat tangan, tim di ruang rapat, gedung kaca, orang menunjuk layar), ilustrasi isometrik 3D, ilustrasi "orang berjalan di atas grafik".
- **Dashboard palsu** berisi grafik acak, kartu KPI dengan angka tak terhubung ke apa pun, atau tabel penuh data tanpa tujuan.
- Animasi looping (pulse, marquee, orbit), parallax, hitungan angka "naik" tanpa makna.
- Emoji di UI.
- Teks di atas `--brand` selain putih penuh (tanpa abu atau transparan).
- Angka di mockup yang tidak konsisten antar tempat (hero, modul, OG).

## 2. Logo, lambang, dan merek: dilarang keras
- **Lambang negara** (Garuda Pancasila), logo kementerian/lembaga, BUMN, bank, dan perusahaan nyata, termasuk "mirip" atau diwarnai ulang.
- Logo/badge **ISO, SOC, atau lembaga sertifikasi** dan lambang "terverifikasi" yang meniru segel resmi.
- Logo merek ERP/HRIS/bank/mesin fingerprint tertentu. Diagram integrasi memakai label generik (`ERP Keuangan`).
- Nama mitra/klien yang menyerupai organisasi nyata; semua nama klien fiktif dan berlabel `Ilustratif`.
- Foto atau nama orang nyata pada testimoni/studi kasus.

## 3. Klaim keamanan & kepatuhan: aturan wording
| Dilarang | Gunakan |
|---|---|
| `Tersertifikasi ISO 27001`, `bersertifikat` (tanpa bukti) | `Selaras ISO/IEC 27001`, `mengacu pada kontrol Annex A` |
| `Patuh UU PDP` / `Compliant` | `Dirancang sesuai prinsip UU PDP` |
| `Tidak bisa diretas`, `100% aman`, `keamanan tingkat militer` | Sebut kontrol konkret: `AES-256`, `TLS 1.3`, `RBAC`, `log berantai-hash` |
| `Audit trail tidak bisa diubah` | `Perubahan terdeteksi lewat verifikasi hash berantai` |
| Menyebut integrasi produk ERP/bank/mesin tertentu | `REST API, SFTP/CSV, webhook`; produk spesifik setelah terverifikasi |
| `Disetujui DJP/BSSN/Kementerian…` | Tidak ada klaim persetujuan lembaga |
| `Terhubung langsung ke DJP` (laporan pajak) | `Menyiapkan rekap dan 1721-A1 untuk pelaporan`; tanpa klaim integrasi DJP |
- Semua klaim teknis diberi komentar kode `{/* KLAIM: konfirmasi ... */}` dan masuk laporan akhir "Perlu keputusan pemilik".
- Status sertifikasi diubah **hanya** oleh pemilik setelah sertifikat asli diserahkan.
- Pernyataan perbandingan ("HRIS umum") bersifat ilustratif dan dapat ditinjau pemilik.

## 4. Copy: dilarang
- Kata/frasa: *revolusioner, terdepan, inovatif, canggih, seamless, tanpa batas, next-level, game-changer, solusi terbaik, kelas dunia, transformasi digital, di era digital, kecerdasan buatan* (kecuali ada fitur AI nyata), *membuka potensi*, "bukan sekadar … tetapi …".
- Triplet slogan kosong, pertanyaan retoris sebagai judul, tanda seru.
- Klaim absolut atau tanpa mekanisme ("sepenuhnya akurat", "zero error").
- Statistik, studi kasus, dan testimoni karangan tanpa penanda ilustratif.
- Em dash (—) di copy halaman; pakai titik atau titik dua.
- Sapaan akrab atau humor.

## 5. Copy: wajib
- Kalimat deklaratif dengan istilah tepat: `audit trail`, `maker-checker`, `routing persetujuan`, `SK Direksi`, `retensi`, `SLA`.
- Setiap klaim fitur memiliki mekanisme dan contoh di halaman (tabel, diagram, atau demo).
- Jujur soal batas dan status: "selaras", "estimasi ilustratif", "dikonfirmasi saat discovery".
- Teks dari API dirender apa adanya sebagai teks (tidak ada HTML), dan layout tetap utuh untuk teks terpanjang yang diizinkan.

## 5a. Kode: dilarang
- Sisa template `create-next-app` (logo Next/Vercel, `page.module.css`, SVG bawaan, "Get started by editing").
- `any`, `// @ts-ignore`, `console.log`, komentar yang mengulang kode, dependensi/komponen tak terpakai.
- Rumus atau angka demo hardcoded di JSX; angka sihir tanpa nama.
- `div` + `onClick` sebagai tombol; ikon bermakna tanpa label; diagram tanpa alternatif teks.
- `NEXT_PUBLIC_` untuk kunci API; fetch API dari komponen klien; `export const revalidate`; `dangerouslySetInnerHTML` untuk data API; menyisipkan skrip mentah dari admin.
- Mengunduh/mengunggah berkas, kamera, atau geolokasi sungguhan di demo.

## 6. Visual: wajib (penanda desain yang disengaja)
- Anatomi section kokoh: rel kiri bernomor `1.0 … 9.0` + konten kanan; tabel dengan header `--panel`; angka mono rata kanan.
- Diagram yang benar-benar menjelaskan mekanisme (swimlane audit, hub integrasi, radar 360), bukan hiasan.
- Satu warna brand + netral; status dengan ikon dan teks.
- Logo mitra satu warna `--steel`, seragam ukuran, berlabel ilustratif.

## 7. Uji anti-slop (jawab semua; jika ada "tidak", perbaiki)
1. Jika logo dan nama dihapus, apakah halaman ini masih jelas milik platform HRIS enterprise dengan fokus audit (bukan SaaS apa saja)?
2. Apakah setiap klaim keamanan memakai wording §3 dan punya komentar `KLAIM`?
3. Apakah setiap angka demo bisa ditelusuri ke `lib/*.ts` atau diberi tanda ilustratif?
4. Apakah tiap section memuat tabel, diagram, atau demo yang spesifik (bukan dekorasi)?
5. Apakah tidak ada logo/lambang asli dan tidak ada foto stok?
6. Apakah demo hash chain benar-benar menghitung SHA-256 dan menunjukkan rantai putus saat data diubah?
7. Apakah halaman tetap utuh dengan default saat API mati, dan dengan headline 120 karakter dari API?
8. Apakah warna brand non-default (mis. `#0F766E`) tetap terbaca (teks putih di atas brand, tautan, fokus)?
9. Apakah ada elemen yang bergerak terus-menerus? (Harus tidak.)
10. Apakah ritme tabel, diagram, dan blok teks bervariasi saat di-scroll cepat?

## 8. Audit otomatis (jalankan di root proyek; semua **tanpa hasil** kecuali dicatat)
```bash
# warna & efek terlarang
grep -rEn "gradient|bg-clip-text|backdrop-blur|blur-|shadow-(sm|md|lg|xl|2xl)|rounded-(2xl|3xl)|hover:scale|indigo|purple|violet|fuchsia|pink|animate-(pulse|bounce|ping)" src
# hex di komponen (hanya boleh di globals.css, og-default/route.tsx, lib/cms/defaults.ts, components/diagrams/)
grep -rEn "#[0-9A-Fa-f]{6}\b" src --include=*.tsx --include=*.ts | grep -v -e "og-default" -e "lib/cms" -e "components/diagrams/" -e "\.test\.ts"
# kata & placeholder terlarang
grep -rEin "lorem|revolusioner|terdepan|seamless|next-level|game-changer|kelas dunia|your text here|href=\"#\"" src
# klaim berisiko
grep -rEin "tersertifikasi|bersertifikat|100% aman|tidak bisa diretas|tidak (bisa|dapat) diubah|military" src
# sisa template, debug, API sensor
grep -rEn "console\.log|@ts-ignore|: any\b|Get started by editing|getUserMedia|navigator\.geolocation" src
# gambar raster/hotlink; <img> hanya di BrandLogo
grep -rEn "<img |https?://(images\.unsplash|images\.pexels|source\.unsplash)" src | grep -v "ui/BrandLogo"
# emoji di source UI
grep -rEnP "[\x{1F300}-\x{1FAFF}\x{2728}\x{26A1}]" src
```
Pengecualian sah (catat di laporan): `tersertifikasi`/`tidak bisa diubah` hanya sebagai **teks pertanyaan FAQ** (nomor 1 dan 2 di `03` §10) atau dalam kalimat yang menjelaskan status/batas, serta di berkas tes; `rounded-full` pada kapsul WhatsApp dan titik status; `animate-spin` pada spinner; `<img>` pada `ui/BrandLogo`; `console.warn` di `lib/cms/`.
