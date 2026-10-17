# 03 — Struktur Halaman & Copywriting

Satu halaman (`src/app/page.tsx`, Server Component), single scroll. **Urutan section tetap.** Setiap section = satu komponen di `components/sections/`, memakai `SectionShell` (rel kiri bernomor + konten kanan) kecuali hero, strip mitra, CTA, footer.

**Dinamis dari API** (dengan default, `07`): logo, favicon, warna brand, headline/subheadline/teks CTA hero, tautan WhatsApp (hero + melayang), email/telepon/alamat/media sosial/copyright footer, metadata SEO, OG image, GA, Meta Pixel. **Semua teks lain di dokumen ini ditulis langsung di komponen.** Teks hero di bawah adalah **nilai default** (`defaults.ts`).

## Peta Section
| # | Section | id | Latar | Visual utama |
|---|---|---|---|---|
| 0 | UtilityBar + Navbar | — | panel / paper | Logo (dinamis) |
| 1 | Hero | `beranda` | brand | Panel Kepatuhan + badge keamanan |
| 2 | Referensi Organisasi | — | paper | 6 logo mitra fiktif |
| 3 | **1.0** Keamanan dan Integrasi | `keamanan` | canvas | Tabel kontrol + `ErpHub` |
| 4 | **2.0** Alur Audit Compliance | `alur-audit` | paper | `ComplianceFlow` |
| 5 | **3.0** Modul | `modul` | canvas | `ModuleTabs` + 5 demo |
| 6 | **4.0** Perbandingan | `perbandingan` | paper | Tabel komparasi |
| 7 | **5.0** Edisi dan Deployment | `edisi` | canvas | Matriks edisi |
| 8 | **6.0** Implementasi | `implementasi` | paper | Tabel fase |
| 9 | **7.0** Studi Kasus | `studi-kasus` | canvas | 2 kartu metrik |
| 10 | **8.0** FAQ | `faq` | paper | Akordeon |
| 11 | **9.0** Konsultasi (CTA) | `konsultasi` | brand | Formulir ringkas (mailto) / tombol |
| 12 | Footer | — | footer | Logo (dinamis) |
| — | Tombol WhatsApp kapsul (fixed) | — | — | `WhatsAppFloat` |

CTA primer `Jadwalkan Konsultasi` → `mailto:${email}?subject=Jadwalkan%20Konsultasi%20HRZenith` (email dari konfigurasi). Muncul di: navbar, hero, setelah modul, edisi, CTA penutup (≥ 5×). Teks CTA hero dari API; CTA lain tetap statis.

---

## 0. UtilityBar & Navbar
- UtilityBar (≥640): kiri `Platform HRIS Enterprise · Indonesia`; kanan tautan `Dokumen Keamanan` (→ `mailto:` subjek "Minta Dokumen Keamanan") dan `Hubungi Sales` (→ `#konsultasi`).
- Navbar: Logo (`BrandLogo`, dinamis) · tengah: `Keamanan` · `Alur Audit` · `Modul` · `Perbandingan` · `Edisi` · `FAQ` · kanan: primer `Jadwalkan Konsultasi`.
- Mobile: `Menu`/`X`; panel penuh; focus trap; Esc menutup. `NavbarShell` (client) menerima props dari `Navbar` (server).

## 1. Hero (id `beranda`, pita brand)
Desktop ≥1024: kiri copy (7 kolom), kanan **Panel Kepatuhan** (5 kolom). Mobile: copy → panel.
- Eyebrow (mono): `Platform HRIS Enterprise · Skala nasional dan global`
- **H1 (default, dinamis)**: **Tata kelola SDM yang dapat diaudit, di seluruh organisasi.**
- **Sub (default, dinamis, ≤ 2 kalimat)**: `Perizinan berjenjang dengan jejak audit yang dapat diverifikasi, keamanan informasi selaras ISO/IEC 27001, dan integrasi ke ERP Anda. Satu standar alur birokrasi untuk setiap cabang.`
- **CTA primer (default, dinamis)**: `Jadwalkan Konsultasi`
- Tombol sekunder WhatsApp (tautan dari API): ikon + `Chat WhatsApp`.
- Tautan teks: `Minta Dokumen Keamanan`.
- Catatan mikro: `Sesi konsultasi 45 menit · Dokumen keamanan dikirim sesuai kebutuhan audit Anda`
- **Panel Kepatuhan** (kartu putih di atas pita brand, `DataTable` mini 3 baris):
  | Pilar | Rincian |
  |---|---|
  | Keamanan informasi | `Selaras ISO/IEC 27001` · `AES-256` · `TLS 1.3` · RBAC + SSO |
  | Integrasi ERP | `REST API` · `SFTP/CSV terjadwal` · `Webhook` · `SAML/OIDC` |
  | Standardisasi alur | `4 tingkat persetujuan` · `SLA dan eskalasi` · `Audit trail berantai-hash` |
  Di bawah tabel: tiga badge keamanan (`02` §5).

## 2. Referensi Organisasi
Baris label `Referensi organisasi (ilustratif)` + 6 `PartnerLogo` fiktif (`Garda Energi Nusantara` · `Arta Mandala Finansial` · `Samudra Logistik Raya` · `Cendana Utama Energi` · `Bumi Karya Konstruksi` · `Teknik Prima Global`), satu warna `--steel`, dipisah garis vertikal.
- Komentar kode: `{/* ILUSTRATIF: ganti dengan logo mitra asli berizin. Pastikan nama dan glyph tidak menyerupai organisasi nyata */}`.
- Dilarang memakai logo asli BUMN, bank, kementerian, atau lambang negara.

## 3. 1.0 Keamanan dan Integrasi (id `keamanan`)
Rel: `1.0` · H2 **Keamanan dan integrasi untuk audit.** · pengantar `Kontrol dijelaskan dengan mekanisme dan acuannya, bukan sekadar klaim.`
- **Tabel kontrol keamanan** (`DataTable`, 6 baris): `Kontrol` | `Penerapan` | `Acuan`
  1. `Kriptografi` | `Data tersimpan AES-256, data bergerak TLS 1.3, slip gaji PDF dienkripsi kata sandi` | `ISO/IEC 27001:2022 A.8.24`
  2. `Kontrol akses` | `Akses berbasis peran (RBAC) per modul, cabang, dan klasifikasi dokumen` | `A.5.15, A.5.18`
  3. `Autentikasi` | `SSO SAML 2.0 / OIDC, autentikasi multi-faktor` | `A.8.5`
  4. `Pencatatan` | `Audit trail berantai-hash SHA-256; ekspor untuk auditor` | `A.8.15`
  5. `Pencadangan` | `Cadangan terjadwal dan uji pemulihan berkala` | `A.8.13`
  6. `Pelindungan data pribadi` | `Pembatasan akses, retensi dapat diatur, jejak akses data sensitif` | `A.5.34, UU PDP`
  Catatan 13px: `Acuan menunjukkan kerangka yang dijadikan pedoman perancangan, bukan pernyataan sertifikasi.` Komentar kode `{/* KLAIM: konfirmasi dengan tim keamanan */}`.
- **Diagram `ErpHub`** dengan judul blok `Integrasi ke sistem yang sudah ada` dan keterangan `Konektor generik. Produk ERP tertentu dikonfirmasi saat discovery.`

## 4. 2.0 Alur Audit Compliance (id `alur-audit`)
Rel: `2.0` · H2 **Dari pengajuan sampai pemeriksaan auditor.** · pengantar `Delapan langkah, lima peran, satu catatan yang dapat diverifikasi.`
- Diagram `ComplianceFlow` (`04` §Alur Audit): swimlane + panel rincian langkah terpilih; tombol `Putar alur`.
- Di bawah diagram, 3 poin (teks 14px, ikon `Check`): `Setiap langkah mencatat waktu, aktor, aksi, dan versi kebijakan.` · `Catatan berantai-hash: perubahan di tengah rantai terdeteksi.` · `Auditor mengekspor dan memverifikasi tanpa bantuan tim IT.`
- Tautan teks: `Coba verifikasi integritas di modul Perizinan ↓` (→ `#modul`, memilih tab Perizinan).

## 5. 3.0 Modul (id `modul`)
Rel: `3.0` · H2 **Lima modul, satu standar tata kelola.** · pengantar `Perizinan menjadi poros: persetujuan mengalir ke Absensi, Gaji, dan arsip.`
- `ModuleTabs` (master-detail, `02` §5): tab `Perizinan` (badge `Utama`), `Absensi`, `Gaji`, `Library`, `Exam`. Default Perizinan. Deep link `#modul-perizinan` dst.
- Panel tiap modul (`04`): eyebrow ikon + nama, H3 manfaat, deskripsi ≤ 24 kata, daftar sub-fitur (tabel 2 kolom: fitur | keterangan), demo interaktif, blok `Bukti audit` (apa yang tercatat/dapat diekspor).
- CTA di bawah: primer `Jadwalkan Konsultasi`, tautan teks `Minta Dokumen Keamanan`.

## 6. 4.0 Perbandingan (id `perbandingan`)
Rel: `4.0` · H2 **Perbandingan pendekatan pengelolaan SDM.** · pengantar `Berdasarkan kebutuhan audit dan tata kelola organisasi besar.`
`DataTable` 4 kolom: `Aspek` | `Proses manual` | `HRIS umum` | `HRZenith`. Sel berisi StatusChip: `Penuh` (ok, `Check`), `Sebagian` (warn, `Minus`), `Tidak ada` (danger, `X`) + keterangan ≤ 12 kata. Baris (9):
1. Persetujuan berjenjang dengan routing aturan
2. Audit trail yang dapat diverifikasi integritasnya
3. Sinkronisasi fingerprint multi-cabang dan zona waktu
4. Maker-checker pada payroll
5. Slip gaji terenkripsi kata sandi
6. Rekonsiliasi dan laporan pajak tahunan
7. Repositori dokumen ISO/SK dengan klasifikasi dan versi
8. Asesmen 360 dengan anonimitas penilai
9. SSO, RBAC, dan integrasi ERP
- Catatan: `"HRIS umum" merujuk pada produk tanpa modul kepatuhan khusus; bukan perbandingan dengan merek tertentu. Penilaian ilustratif.` Komentar kode `{/* KLAIM: tinjau ulang pernyataan perbandingan */}`.
- Kolom `HRZenith` disorot (border kiri/kanan 2px `--brand`, header bg `--brand-tint`).

## 7. 5.0 Edisi dan Deployment (id `edisi`)
Rel: `5.0` · H2 **Edisi sesuai skala dan regulasi organisasi.** · pengantar `Tanpa daftar harga: lisensi disesuaikan jumlah karyawan, modul, dan model deployment.`
Matriks `DataTable`: kolom `Enterprise` · `Corporate` · `Sovereign` (disorot kolom tengah). Baris (ilustratif):
- Model deployment: `Cloud terkelola` · `Private cloud dedicated` · `Private cloud atau on-premise`
- Residensi data: `Indonesia` · `Indonesia` · `Indonesia, sesuai instruksi`
- SSO SAML/OIDC: ✓ · ✓ · ✓
- Retensi audit trail: `3 tahun` · `10 tahun` · `Sesuai regulasi instansi`
- Multi-entitas dan multi-cabang: `Hingga 5 entitas` · `Tidak dibatasi` · `Tidak dibatasi`
- Integrasi ERP kustom: `Konektor standar` · `Konektor + pengembangan` · `Konektor + pengembangan + review keamanan`
- Dukungan: `Jam kerja` · `24/7 untuk insiden kritis` · `Dedicated + SLA khusus`
- Catatan: `Seluruh isi matriks ilustratif. Konfirmasi dengan pemilik sebelum rilis.` Tombol `Jadwalkan Konsultasi` di bawah.

## 8. 6.0 Implementasi (id `implementasi`)
Rel: `6.0` · H2 **Implementasi bertahap dengan titik uji jelas.** · pengantar `Estimasi ilustratif; jadwal pasti ditetapkan setelah discovery.`
`DataTable`: `Fase` | `Estimasi` | `Aktivitas` | `Keluaran`
1. `Discovery` | `2–3 minggu` | `Pemetaan alur birokrasi, struktur organisasi, aturan perizinan, daftar cabang dan mesin` | `Dokumen desain alur dan matriks persetujuan`
2. `Konfigurasi dan integrasi` | `4–8 minggu` | `Konfigurasi routing, SSO, konektor ERP, sinkronisasi fingerprint` | `Lingkungan UAT`
3. `Pilot dan UAT` | `4 minggu` | `Pilot satu divisi/cabang, uji audit trail, uji payroll paralel` | `Berita acara UAT`
4. `Go-live bertahap` | `Menurut jumlah cabang` | `Peluncuran per gelombang, pelatihan admin dan auditor` | `Laporan peluncuran`

## 9. 7.0 Studi Kasus (id `studi-kasus`)
Rel: `7.0` · H2 **Hasil yang diukur pada organisasi besar.** · pengantar `Contoh ilustratif.`
2 kartu (tanpa foto): organisasi fiktif, konteks 1 kalimat, 3 metrik (angka mono besar + label), 1 kutipan:
- `Arta Mandala Finansial` (perbankan, 120 cabang): `Waktu persetujuan cuti` `5 → 2 hari kerja` · `Berkas persetujuan dicetak` `−90%` · `Temuan audit internal terkait perizinan` `0 dari 4 temuan sebelumnya`
- `Garda Energi Nusantara` (energi, 38 lokasi): `Cabang tersinkron` `38 / 38` · `Selisih rekonsiliasi pajak tahunan` `Rp 0` · `Waktu rekap absensi nasional` `3 hari → 2 jam`
- Komentar kode wajib: `{/* ILUSTRATIF: ganti dengan studi kasus asli yang disetujui klien */}`; label `Ilustratif` terlihat di kartu.

## 10. 8.0 FAQ (id `faq`)
Rel: `8.0` · H2 **Pertanyaan dari tim keamanan dan pengadaan.** Akordeon aksesibel (`button` + `aria-expanded` + `aria-controls`), 8 pertanyaan; data di `data.ts`, dipakai juga oleh JSON-LD.
1. **Apakah HRZenith sudah tersertifikasi ISO/IEC 27001?** Platform dirancang selaras kerangka ISO/IEC 27001 dan mengacu pada kontrol Annex A. Status sertifikasi resmi disampaikan dalam dokumen keamanan yang kami berikan atas permintaan.
2. **Apakah audit trail benar-benar tidak bisa diubah?** Setiap entri berantai-hash SHA-256 dengan entri sebelumnya. Perubahan pada entri lama tidak dapat disembunyikan karena rantai setelahnya tidak lagi cocok, dan auditor dapat memverifikasinya. Kontrol akses basis data tetap diterapkan.
3. **Bagaimana integrasi dengan ERP kami?** Melalui REST API, webhook, dan pertukaran file SFTP/CSV terjadwal. Cakupan dan produk ERP dipetakan pada fase discovery.
4. **Apakah mendukung SSO dan direktori perusahaan?** Ya, SAML 2.0 dan OIDC. Sinkronisasi direktori (LDAP/AD) tersedia pada edisi tertentu.
5. **Di mana data disimpan?** Pada pusat data di Indonesia. Opsi private cloud atau on-premise tersedia pada edisi yang sesuai.
6. **Mesin fingerprint apa saja yang dapat disinkronkan?** Mesin yang mendukung push protocol atau ekspor berkala. Daftar tipe dikonfirmasi saat discovery, termasuk antrean log saat mesin offline.
7. **Bagaimana penetapan zona waktu dan hari libur nasional?** Setiap log disimpan dengan zona asal (WIB/WITA/WIT) lalu dinormalisasi. Kalender libur nasional dan cuti bersama diperbarui dari konfigurasi.
8. **Bagaimana proses pengadaan dan model lisensi?** Lisensi per karyawan aktif per bulan atau tahunan, menurut edisi. Kami menyiapkan dokumen teknis dan penawaran untuk kebutuhan pengadaan Anda.
Catatan kode: `{/* KLAIM: jawaban 1, 3, 4, 5, 6 perlu dikonfirmasi pemilik/engineering */}`.

## 11. 9.0 Konsultasi (CTA, id `konsultasi`, pita brand)
- H2: **Diskusikan kebutuhan kepatuhan organisasi Anda.**
- Sub: `Kami menyiapkan sesi konsultasi dan dokumen keamanan sesuai kebutuhan audit Anda.`
- Tombol: primer-di-atas-brand (putih) `Jadwalkan Konsultasi` + sekunder `Chat WhatsApp` (tautan konfigurasi) + tautan `Minta Dokumen Keamanan`.
- Blok kontak ringkas (dari konfigurasi): email dan telepon.

## 12. Footer (bg `--footer`)
- Logo (`BrandLogo`, dinamis, varian terang) + tagline `Platform HRIS Enterprise untuk skala nasional dan global.`
- Kolom: **Platform** (5 modul → `#modul`), **Keamanan** (Kontrol → `#keamanan`, Alur Audit → `#alur-audit`), **Kontak (dinamis)**: email (`mailto:`), telepon (`tel:`), alamat, **media sosial** (tautan teks; blok disembunyikan bila kosong), **Legal** (Privasi, Syarat → `mailto:legal@...` placeholder; **laporkan: halaman legal asli belum ada**).
- **Baris copyright (dinamis)**; default `© 2026 HRZenith. Seluruh hak dilindungi.` + catatan 13px statis: `Contoh klien, angka, dan studi kasus bersifat ilustratif.`
- Tanpa `href="#"` kosong.

## Aturan Copywriting
- Judul ≤ 10 kata, deskripsi ≤ 24 kata. Kalimat deklaratif dengan mekanisme/angka.
- Tanda "—" di dokumen ini hanya pemisah dalam spesifikasi. Jangan ditulis di halaman; pakai titik dua atau titik.
- Klaim keamanan/kepatuhan: wording hati-hati (`06` §3). Teks dari API dirender sebagai teks biasa.
- Data dummy: Rina Kusumawati (Staff), Budi Santoso (Supervisor), Andi Wijaya (Manager), Maya Anggraeni (HRD Director), Sari Utami, Hadi Prasetyo, Lina Marlina; kota Jakarta, Surabaya, Medan, Makassar, Balikpapan, Jayapura, Denpasar; `Rp`, `WIB/WITA/WIT`.
