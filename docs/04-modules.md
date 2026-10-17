# 04 — Spesifikasi: Hero, Diagram Alur Audit, dan 5 Modul

Semua visual dari **JSX/CSS/SVG + `lucide-react`** (tanpa gambar raster). Demo = showcase interaktif dengan state lokal React, **tanpa network request** (kecuali Web Crypto lokal). Semua angka berasal dari `lib/*.ts` dan lolos test vector di bawah. **Seluruh konten bagian ini ditulis di komponen (hardcode), tidak dari API** (`07` §4). Tiap demo memakai `aria-label`, `aria-live="polite"` untuk hasil dinamis, tombol `<button>` asli ≥ 44px.

Struktur panel modul: `eyebrow (ikon + nama)` → `H3 manfaat` → `deskripsi ≤ 24 kata` → `tabel sub-fitur (fitur | keterangan)` → `demo interaktif` → `blok Bukti audit`.

---

## A. Diagram Alur Audit (`diagrams/ComplianceFlow.tsx`)
Swimlane 5 jalur × 8 langkah. Klik langkah → panel rincian (`Aktor`, `Aksi`, `Data dicatat`, `Kontrol`).

| # | Langkah | Jalur | Data dicatat | Kontrol |
|---|---|---|---|---|
| 1 | Pengajuan | Staff | Jenis, tanggal, durasi, lampiran, waktu (WIB) | Formulir tervalidasi kebijakan |
| 2 | Validasi otomatis | Sistem | Saldo cuti, bentrok jadwal, aturan jenis izin, versi kebijakan | Penolakan otomatis bila melanggar aturan |
| 3 | Persetujuan Supervisor | Atasan | Aktor, keputusan, komentar, waktu | SLA 2 hari kerja, delegasi tercatat |
| 4 | Persetujuan Manager | Atasan | Aktor, keputusan, komentar, waktu | Routing menurut jenis dan durasi |
| 5 | Penetapan HRD Director | HRD | Keputusan final, nomor referensi | Hanya untuk kategori yang diwajibkan |
| 6 | Pencatatan dan sinkron | Sistem | Perubahan saldo cuti, jadwal, potongan payroll, kiriman ke ERP | Transaksi atomik, log kegagalan |
| 7 | Audit trail berantai-hash | Sistem | Hash SHA-256 entri dan hash sebelumnya | Perubahan terdeteksi saat verifikasi |
| 8 | Pemeriksaan auditor | Auditor | Ekspor log, hasil verifikasi, hash kepala | Akses baca-saja, jejak akses auditor |

Tombol `Putar alur` menyorot langkah 1→8 berurutan **sekali** (300ms per langkah); reduced-motion: tanpa animasi.

---

## B. HERO: Panel Kepatuhan
Spesifikasi di `03` §1. Panel statis (tanpa demo). Badge keamanan memakai komponen `02` §5. Semua teks hero (H1, sub, teks CTA) dibaca dari konfigurasi dengan default (`07`).

---

## C. `ModuleTabs.tsx` (master-detail)
- Tab: `Perizinan` (badge `Utama`) · `Absensi` · `Gaji` · `Library` · `Exam`. Default Perizinan.
- Navigasi panah/Home/End; `aria-selected`, `aria-controls`; hash `#modul-<nama>` memilih tab; tautan dari §A memilih Perizinan.
- Panel yang tidak aktif tidak dirender (kurangi beban); `dynamic()` untuk demo selain Perizinan.

---

## 1. PERIZINAN 📑 (`PerizinanDemo.tsx`): BINTANG
- **Ikon** `CalendarCheck` · **H3** `Persetujuan berjenjang dengan jejak yang dapat dibuktikan.`
- **Deskripsi**: `Empat tingkat persetujuan dengan routing otomatis, SLA, eskalasi, dan audit trail berantai-hash.`
- **Tabel sub-fitur**:
  | Fitur | Keterangan |
  |---|---|
  | Multi-tier approval | Staff → Supervisor → Manager → HRD Director |
  | Routing otomatis | Jumlah tingkat mengikuti jenis dan durasi izin |
  | Audit trail lengkap | Waktu, aktor, aksi, hash berantai SHA-256 |
  | SLA dan eskalasi | Batas 2 hari kerja per tingkat; eskalasi otomatis |
  | Delegasi | Wakil menyetujui saat atasan berhalangan, tercatat |
  | Jenis izin | Cuti tahunan, izin sakit, dinas, izin belajar, lembur |
  | Sisa cuti transparan | Saldo diperbarui setelah persetujuan final |

### Routing (`lib/approval.ts`, fungsi murni)
```ts
type Role = "spv" | "manager" | "hrd";
type LeaveType = "cuti-tahunan" | "izin-sakit" | "dinas-luar-kota" | "dinas-luar-negeri" | "izin-belajar";
approvalChain(type: LeaveType, hari: number): Role[]   // melempar RangeError bila hari tidak bulat atau di luar rentang
```
| Jenis | Rentang hari | Aturan rantai |
|---|---|---|
| `cuti-tahunan` | 1–14 | ≤ 3 hari: `[spv, manager]`; ≥ 4 hari: `[spv, manager, hrd]` |
| `izin-sakit` | 1–14 | ≤ 2 hari: `[spv]`; ≥ 3 hari: `[spv, manager]` |
| `dinas-luar-kota` | 1–14 | `[spv, manager]` |
| `dinas-luar-negeri` | 1–30 | `[spv, manager, hrd]` |
| `izin-belajar` | 1–365 | `[spv, manager, hrd]` |

Label peran: `spv` = `Supervisor`, `manager` = `Manager`, `hrd` = `HRD Director`; pemohon selalu `Staff`.

### Demo
- **Kontrol pengajuan** (kiri): `Jenis izin` (select 5 jenis), `Durasi (hari)` (stepper 1–14, tombol ±), pemohon `Rina Kusumawati · Staff`, sisa cuti `9 dari 12 hari`. Default: `cuti-tahunan`, `5` hari → rantai 3 tingkat. Mengubah jenis/durasi memperbarui **stepper rantai** secara langsung (`approvalChain`), disertai teks aturan (`Cuti tahunan ≥ 4 hari: sampai HRD Director`). Tombol `Ajukan`.
- **Stepper rantai**: `Staff → Supervisor → Manager → HRD Director` (hanya tingkat yang dibutuhkan yang aktif; tingkat yang dilewati abu-abu bergaris dengan label `Tidak diperlukan`). Status tiap langkah: ikon + teks (`Menunggu`, `Disetujui`, `Dikembalikan`, `Ditolak`, `Terlambat`).
- **Aksi pada langkah aktif**: `Setujui sebagai {Peran}` · `Kembalikan untuk revisi` · `Tolak` (wajib komentar ≥ 10 karakter; kolom komentar muncul saat memilih) · `Delegasikan ke {Wakil}` (mencatat `DIDELEGASIKAN`, langkah tetap sama) · `Simulasikan SLA terlewat` (mencatat `ESKALASI_SLA` oleh Sistem; langkah berlabel `Terlambat`; tombol `Ambil alih sebagai {tingkat berikutnya}` mencatat `DIAMBIL_ALIH` lalu keputusan).
- **Persetujuan final**: status `Disetujui final`, nomor referensi `IZN-2026-000123`, baris dampak: `Sisa cuti 9 → 4 dari 12 hari` · `Jadwal Absensi diperbarui` · `Cuti berbayar: tanpa potongan payroll`.
- **Tabel Audit Trail** (kanan, `DataTable`, entri baru ditambahkan di bawah dengan sorot 1 dtk): `#` | `Waktu simulasi (WIB)` | `Aktor` | `Aksi` | `Hash` (8 hex pertama, Roboto Mono) | `Integritas` (ikon + teks). Label di atas tabel: `Waktu simulasi: jam bukan waktu nyata`.
- **Verifikasi integritas**: tombol `Verifikasi Integritas` menghitung ulang rantai dari awal dengan Web Crypto (`crypto.subtle.digest`), lalu menampilkan `Rantai utuh · 5 entri terverifikasi` (ikon `ShieldCheck`) atau `Rantai putus pada entri #3` (ikon `ShieldAlert`; entri #3 dan sesudahnya ditandai `Tidak cocok`). Tombol `Simulasikan perubahan data` mengubah aksi entri #3 menjadi `DITOLAK` **tanpa** memperbarui hash tersimpan; `Pulihkan` mengembalikannya. Catatan kecil: `Hash kepala dapat dicatat ke luar sistem (mis. diekspor ke auditor) agar penulisan ulang seluruh rantai pun terdeteksi.`
- Tombol `Ekspor Log (CSV)` dekoratif (tanpa unduhan). `Reset Demo` mengembalikan semuanya.
- **Klaim**: komentar kode `{/* KLAIM: konfirmasi mekanisme hash chain dengan engineering */}`.

### Audit chain (`lib/audit.ts`)
```
genesis  = sha256("GENESIS")
hash_i   = sha256(hash_{i-1} + "|" + aktor + "|" + aksi + "|" + waktuISO)     // hex huruf kecil; hash_0 = genesis
verify   = hitung ulang maju dari genesis memakai hash hasil hitung ulang; bandingkan dengan hash tersimpan
```
`sha256` memakai `crypto.subtle.digest` (browser dan Node ≥ 18 di vitest). Fungsi `appendEntry`, `verifyChain` async.

**Jam simulasi** (urut per entri baru): `2026-10-19T08:15:00+07:00`, `2026-10-19T09:02:00+07:00`, `2026-10-19T10:40:00+07:00`, `2026-10-20T08:55:00+07:00`, `2026-10-20T14:20:00+07:00`, `2026-10-21T09:10:00+07:00`, `2026-10-21T10:05:00+07:00`, `2026-10-21T13:30:00+07:00`, `2026-10-22T08:40:00+07:00`, `2026-10-22T11:15:00+07:00`, `2026-10-22T15:00:00+07:00`, `2026-10-23T09:00:00+07:00`. Bila habis, tombol aksi dinonaktifkan dengan pesan `Reset Demo untuk mencoba lagi`.

### Test vector (`audit.test.ts`, `approval.test.ts`)
**Jalur default** (cuti-tahunan 5 hari; Ajukan → validasi otomatis → tiga persetujuan):
| # | Waktu | Aktor | Aksi | Hash (8 hex) |
|---|---|---|---|---|
| 1 | 2026-10-19T08:15:00+07:00 | `Rina Kusumawati (Staff)` | `DIAJUKAN` | `b71a50df` |
| 2 | 2026-10-19T09:02:00+07:00 | `Sistem` | `VALIDASI_KEBIJAKAN_LULUS` | `126bf3f4` |
| 3 | 2026-10-19T10:40:00+07:00 | `Budi Santoso (Supervisor)` | `DISETUJUI` | `7847ee62` |
| 4 | 2026-10-20T08:55:00+07:00 | `Andi Wijaya (Manager)` | `DISETUJUI` | `60ec6765` |
| 5 | 2026-10-20T14:20:00+07:00 | `Maya Anggraeni (HRD Director)` | `DISETUJUI_FINAL` | `fa1c6fc4` |

- `sha256("GENESIS")` = `901131d838b17aac0f7885b81e03cbdc9f5157a00343d30ab22083685ed1416a`.
- Hash penuh entri #1 = `b71a50df698bb59d9e33fdbffab5b23cd7a1393759b3e81537aa593a182c2bf9`.
- **Perubahan** entri #3 menjadi `DITOLAK` (hash tersimpan tidak diubah): hitung ulang maju memberi 8 hex `b71a50df`, `126bf3f4`, `02c60862`, `fd3a5eb6`, `e557d10b` ⇒ `verifyChain` melaporkan `ok: false`, `firstBroken: 3`, entri #3, #4, #5 tidak cocok; #1 dan #2 cocok.
- Routing: `cuti-tahunan` 3 → `[spv, manager]`; 4 → `[spv, manager, hrd]`; 14 → tiga tingkat; `izin-sakit` 2 → `[spv]`, 3 → `[spv, manager]`; `dinas-luar-kota` 5 → `[spv, manager]`; `dinas-luar-negeri` 5 → tiga tingkat; `izin-belajar` 30 → tiga tingkat. `cuti-tahunan` 0, 15, 2,5 → `RangeError`.

---

## 2. ABSENSI 📍 (`AbsensiDemo.tsx`)
- **Ikon** `Fingerprint` · **H3** `Seluruh cabang, satu data kehadiran.`
- **Deskripsi**: `Mesin fingerprint tiap cabang tersinkron ke server cloud terpusat, dengan zona waktu dinormalisasi.`
- **Tabel sub-fitur**:
  | Fitur | Keterangan |
  |---|---|
  | Sinkronisasi fingerprint multi-cabang | Log mesin dikirim terjadwal ke server cloud pusat |
  | Normalisasi zona waktu | WIB, WITA, WIT dikonversi ke satu acuan |
  | Deduplikasi dan antrean offline | Log ganda dibuang; log mesin offline menunggu dan disusulkan |
  | Rekap kehadiran nasional real-time | Hadir, terlambat, belum absen, per cabang dan nasional |
  | Shift kerja dan hari libur nasional | Kalender libur dan cuti bersama dari konfigurasi |
  | Kanal pelengkap | Mobile GPS geofencing untuk dinas luar |
- **Demo**:
  1. **`BranchMap`** (skematik) di kiri: 7 simpul + `Server Cloud` di pusat; simpul bermasalah berlabel ikon `WifiOff` + teks.
  2. **Ringkasan**: `62 mesin · 10.536 log mentah · 65 duplikat dibuang · 10.471 log unik` (dari `syncSummary`).
  3. **Tabel cabang** (`DataTable`): `Cabang` | `Zona` | `Mesin` | `Log mentah` | `Duplikat` | `Log unik` | `Status`.
  4. Tombol `Sinkronkan Semua` (spinner 600ms sekali; status baris → `Tersinkron`, `Terakhir sinkron` diperbarui sebagai teks simulasi) dan `Hubungkan Ulang Jayapura` (antrean 38 log disusulkan: mentah `10.574`, unik `10.509`).
  5. **Normalisasi zona waktu**: input jam lokal + zona (`WIB`/`WITA`/`WIT`) → hasil WIB (`08:00 WIT` → `06:00 WIB`), dari `toWIB`.
  6. **Rekap nasional**: `8.742 / 9.310 hadir (93,9%)` + bar dan teks (`Terlambat`, `Belum absen` disertakan).
- **Bukti audit**: `Setiap log tersimpan dengan zona asal, ID mesin, dan waktu sinkron.`

### Data (`data.ts`)
| Cabang | Zona | Mesin | Log mentah | Duplikat | Catatan |
|---|---|---|---|---|---|
| Jakarta Pusat | WIB | 18 | 3.420 | 21 | |
| Surabaya | WIB | 12 | 2.215 | 14 | |
| Medan | WIB | 9 | 1.640 | 9 | |
| Makassar | WITA | 8 | 1.188 | 7 | |
| Balikpapan | WITA | 6 | 902 | 5 | |
| Jayapura | WIT | 4 | 411 | 3 | 1 mesin offline, antrean 38 log |
| Denpasar | WITA | 5 | 760 | 6 | |

### Test vector (`sync.test.ts`)
- `syncSummary(branches)` → `mesin 62`, `mentah 10536`, `duplikat 65`, `unik 10471`, `mesinOffline 1`, `antrean 38`.
- Setelah `reconnect("Jayapura")` → `mentah 10574`, `duplikat 65`, `unik 10509`, `antrean 0`.
- `toWIB(tanggal, jam, zona)`: `("2026-10-19","08:00","WIT")` → `2026-10-19 06:00`; `("…","08:00","WITA")` → `2026-10-19 07:00`; `("…","08:00","WIB")` → `2026-10-19 08:00`; `("2026-10-20","00:30","WIT")` → `2026-10-19 22:30`; `("2026-10-19","05:30","WIT")` → `2026-10-19 03:30`.
- Persentase kehadiran `8742 / 9310` → `93,9%` (format 1 desimal, koma).

---

## 3. GAJI 💰 (`GajiDemo.tsx`)
- **Ikon** `Wallet` · **H3** `Payroll dengan kontrol dan bukti.`
- **Deskripsi**: `Maker-checker, slip terenkripsi, dan rekonsiliasi pajak tahunan, di atas perhitungan otomatis.`
- **Tabel sub-fitur**:
  | Fitur | Keterangan |
  |---|---|
  | Audit trail payroll | Siapa mengubah komponen, nilai lama dan baru, alasan |
  | Maker-checker | Pembuat batch dan penyetuju harus orang berbeda |
  | Slip gaji terenkripsi | PDF dikunci kata sandi; percobaan dibatasi |
  | Laporan kepatuhan pajak tahunan | Rekap PPh 21 bulanan, 1721-A1, rekonsiliasi selisih |
  | Kalkulasi otomatis, PPh 21, BPJS | Dari data gaji dan absensi |
  | Reimbursement | Klaim masuk ke batch dengan persetujuan |
- **Demo**: tiga tab (`Audit Trail Batch` · `Slip Terenkripsi` · `Kepatuhan Pajak`).
  1. **Audit Trail Batch**: batch `Gaji Oktober 2026 · 2.000 karyawan (ilustratif)`; status `Draft → Diverifikasi → Disetujui → Dikunci`; pemilih pengguna (segmented): `Dewi Lestari · Payroll Officer` / `Hendra Gunawan · Finance Manager`. Payroll Officer: `Ajukan Verifikasi`, `Ubah Komponen` (contoh log: `Tunjangan jabatan Budi Santoso 3.000.000 → 3.500.000 · alasan SK-014/DIR/2026`). Finance Manager: `Setujui Batch`, `Kunci Batch`. Tombol `Coba setujui sendiri (Dewi)` → pesan `Ditolak: pembuat batch dan penyetuju harus berbeda (maker-checker)` + entri `DITOLAK_MAKER_CHECKER`. Log tampil sebagai tabel (waktu simulasi, pengguna, aksi, nilai lama → baru).
  2. **Slip Terenkripsi**: berkas `Slip-Gaji-Okt-2026.pdf` (ikon `FileLock2`) dalam keadaan terkunci. Input `Kata sandi` + `Buka Slip`. Petunjuk demo: `Demo: gunakan 15081990 (tanggal lahir DDMMYYYY)`. Salah → `Kata sandi salah. Sisa percobaan 2` (maks 3; ke-3 gagal: `Dikunci sementara (disimulasikan)` dengan tombol `Reset Demo`). Benar → slip terbuka (`slip.ts`) dengan rincian dan `Tertutup kembali dalam sesi baru` (tombol `Kunci Lagi`). Catatan: `Demo antarmuka. Pada produk, PDF dienkripsi di server (AES-256) dan kata sandi tidak dikirim ke peramban.`
  3. **Kepatuhan Pajak**: `Tahun Pajak 2025`; tabel rekap PPh 21 per bulan (12 baris) + total; panel rekonsiliasi: `Total dipotong` vs `Total di 1721-A1` → `Selisih Rp 1.250.000` (StatusChip `warn`: `Perlu ditinjau`) dengan penjelasan `Koreksi Maret belum masuk 1721-A1`. Tombol `Terapkan Koreksi Maret` → `Selisih Rp 0` (`ok`) + entri log. Tombol `Unduh 1721-A1` dan `Unduh Rekap` dekoratif. **Tidak mengklaim integrasi DJP**.
- **Bukti audit**: `Setiap perubahan komponen dan keputusan batch tersimpan beserta pelakunya.`

### Rumus slip (`lib/slip.ts`) dan test vector
```
bruto   = pokok + tunjanganJabatan + tunjanganMakanTransport
tarifTER = lookupTER_A(bruto)        // tabel A (di bawah); di atas 15.100.000 = di luar cakupan demo (RangeError)
pph21   = round(bruto × tarifTER / 100)
bpjsTK  = round(upahDasar × 3%)      // JHT 2% + JP 1%; upahDasar = pokok + tunjanganJabatan
bpjsKes = round(upahDasar × 1%)
bersih  = bruto − pph21 − bpjsTK − bpjsKes
```
**Tabel TER A**, `bruto ≤ batas → tarif`: 5.400.000 → 0% · 5.650.000 → 0,25% · 5.950.000 → 0,5% · 6.300.000 → 0,75% · 6.750.000 → 1% · 7.500.000 → 1,25% · 8.550.000 → 1,5% · 9.650.000 → 1,75% · 10.050.000 → 2% · 10.350.000 → 2,25% · 10.700.000 → 2,5% · 11.050.000 → 3% · 11.600.000 → 3,5% · 12.500.000 → 4% · 13.750.000 → 5% · 15.100.000 → 6%.

**Penyederhanaan (WAJIB komentar kode + laporan):** hanya TER kategori A; premi pemberi kerja belum masuk bruto; batas upah iuran tidak dimodelkan (data demo di bawah batas); penghitungan ulang Desember tidak dimodelkan. Konfirmasi dengan konsultan pajak sebelum rilis. UI memuat catatan `Simulasi ilustratif, bukan nasihat pajak.`

**Fixture slip** (karyawan `Budi Santoso`, Supervisor, Okt 2026): pokok `9.000.000`, tunjangan jabatan `1.000.000`, tunjangan makan dan transport `1.200.000` ⇒ `bruto 11.200.000` · `TER 3,5%` · `PPh 21 392.000` · `BPJS TK 300.000` · `BPJS Kes 100.000` · **`bersih 10.408.000`**.

**Rekonsiliasi pajak** (`lib/compliance.ts`): total PPh 21 dipotong TP 2025 per bulan (Rp): Jan `1.204.300.000`, Feb `1.211.850.000`, Mar `1.325.400.000`, Apr `1.209.100.000`, Mei `1.215.700.000`, Jun `1.230.400.000`, Jul `1.221.600.000`, Agu `1.219.050.000`, Sep `1.226.900.000`, Okt `1.233.250.000`, Nov `1.240.800.000`, Des `1.402.650.000`.
- `reconcile(monthly, totalA1)` → `{ dipotong, a1, selisih, status }`.
- Vektor: `dipotong 14.941.000.000`; `a1 14.939.750.000` ⇒ `selisih 1.250.000`, `status "perlu-ditinjau"`; setelah koreksi `a1 14.941.000.000` ⇒ `selisih 0`, `status "selaras"`.

---

## 4. LIBRARY 📚 (`LibraryDemo.tsx`)
- **Ikon** `BookOpen` · **H3** `Dokumen resmi dengan klasifikasi, versi, dan bukti baca.`
- **Deskripsi**: `Repositori dokumen ISO, SK Direksi, dan kebijakan kerahasiaan dengan hak akses dan riwayat versi.`
- **Tabel sub-fitur**:
  | Fitur | Keterangan |
  |---|---|
  | Repositori dokumen ISO | Manual, prosedur, dan catatan terkendali per standar |
  | SK Direksi | Nomor, versi, tanggal berlaku, pemilik dokumen |
  | Kebijakan kerahasiaan | Konfirmasi baca per karyawan dan pelacakan kepatuhan |
  | Klasifikasi dan hak akses | Publik, Internal, Rahasia, Sangat Rahasia |
  | Riwayat versi | Perubahan, penyetuju, tanggal |
  | Masa berlaku dan review | Penanda dokumen kedaluwarsa atau perlu ditinjau |
- **Demo**:
  1. **Pemilih peran** (segmented): `Karyawan` (akses sampai Internal) · `Manajer` (sampai Rahasia) · `HRD Director` (semua) · `Auditor Internal` (semua, baca-saja).
  2. **Filter**: pencarian (nomor atau judul), `Jenis` (`ISO` · `SK Direksi` · `Kebijakan`), `Status` (`Berlaku` · `Draft` · `Kedaluwarsa`).
  3. **Tabel dokumen** (`DataTable`): `Nomor` (mono) | `Judul` | `Versi` | `Klasifikasi` | `Status` | `Review berikutnya`. Dokumen di atas hak akses peran: judul diganti `Akses dibatasi` + ikon `Lock` (nomor tetap tampil).
  4. **Panel rincian** (klik baris yang boleh dibuka): riwayat versi (daftar versi, tanggal, penyetuju, ringkasan perubahan), tombol `Unduh (berwatermark)` dekoratif, catatan `Setiap unduhan tercatat`.
  5. **Konfirmasi baca** untuk `KB-003 Perjanjian Kerahasiaan`: `1.842 / 2.000 karyawan` + bar; tombol `Saya telah membaca dan menyetujui` (peran Karyawan) → `1.843 / 2.000`, status baris pengguna `Dikonfirmasi ✓` (teks + ikon).
- **Data (10 dokumen)**: `ISO-IS-001 Kebijakan Keamanan Informasi · v3.0 · Internal · Berlaku` · `ISO-QM-002 Manual Mutu · v4.2 · Internal · Berlaku` · `SK-014/DIR/2026 Tata Cara Perizinan Berjenjang · v1.0 · Internal · Berlaku` · `SK-021/DIR/2026 Struktur Remunerasi · v1.1 · Rahasia · Berlaku` · `KB-003 Perjanjian Kerahasiaan Karyawan · v2.0 · Internal · Berlaku` · `KB-007 Kebijakan Klasifikasi Informasi · v1.4 · Internal · Berlaku` · `HR-PRO-010 Prosedur Disiplin Pegawai · v2.1 · Rahasia · Berlaku` · `HR-PRO-004 Prosedur Rekrutmen Jabatan Pimpinan · v1.0 · Sangat Rahasia · Draft` · `ISO-IS-014 Rencana Pemulihan Bencana · v2.2 · Rahasia · Kedaluwarsa` · `KB-011 Kebijakan Whistleblowing · v1.2 · Publik · Berlaku`. Tanggal review berikutnya dihitung dari data; dokumen kedaluwarsa memakai StatusChip `danger` (`Kedaluwarsa`).
- **Test (`lib/library.test.ts`, logika di `lib/library.ts`)**: `canView(role, klasifikasi)`: Karyawan melihat `Publik`, `Internal`; Manajer + `Rahasia`; HRD Director dan Auditor semua; Karyawan pada 10 dokumen melihat judul 6 dokumen (ISO-IS-001, ISO-QM-002, SK-014, KB-003, KB-007, KB-011).
- **Bukti audit**: `Akses, unduhan, dan konfirmasi baca tercatat per pengguna.`

---

## 5. EXAM 📝 (`ExamDemo.tsx`)
- **Ikon** `ClipboardCheck` · **H3** `Asesmen pejabat yang terukur dan adil.`
- **Deskripsi**: `Assessment tahunan kompetensi pejabat struktural dan evaluasi KPI 360 derajat dengan anonimitas penilai.`
- **Tabel sub-fitur**:
  | Fitur | Keterangan |
  |---|---|
  | Assessment tahunan pejabat struktural | Dimensi Manajerial, Sosial Kultural, Teknis |
  | Evaluasi KPI 360° | Atasan, rekan, bawahan; diri sendiri sebagai pembanding |
  | Anonimitas penilai | Kelompok dengan kurang dari 3 penilai disembunyikan |
  | Uji kompetensi dan proctoring | Sesi terawasi dengan log pelanggaran |
  | Assessment rekrutmen | Seleksi jabatan dengan skor otomatis |
  | Evaluasi kinerja | Gabungan KPI dan perilaku |
- **Demo**: dua tab: `KPI 360°` dan `Kompetensi Jabatan`.
  1. **KPI 360°** (subjek `Andi Wijaya · Manager`): `Radar360` 5 dimensi (`Integritas`, `Kepemimpinan`, `Pengambilan keputusan`, `Kolaborasi`, `Orientasi hasil`) dan tabel skor per kelompok; bobot `Atasan 40%` · `Rekan 30%` · `Bawahan 30%` (`Diri sendiri` ditampilkan, **tidak** masuk skor). Slider `Pencapaian KPI (%)` (0–100, default 88). Hasil: `Nilai 360 3,90` · `Skor KPI 4,40` · **`Nilai akhir 4,20 · Layak`** (60% KPI + 40% 360). Saklar `Simulasikan penilai bawahan kurang dari 3` → kelompok `Bawahan` berlabel `Disembunyikan (anonimitas): minimal 3 penilai`, bobot dinormalisasi ulang (Atasan 4/7, Rekan 3/7) ⇒ `Nilai 360 4,03` dan `Nilai akhir 4,25`. Jumlah penilai: Atasan 1 (dikecualikan dari aturan minimal), Rekan 5, Bawahan 7. Analisis `Blind spot`: selisih diri vs bobot gabungan (`+0,60` pada contoh).
  2. **Kompetensi Jabatan**: tabel 4 pejabat (`Nama` | `Manajerial` | `Sosial Kultural` | `Teknis` | `Rata-rata` | `Rekomendasi`) dengan data fixture; klik baris menampilkan ringkasan pengembangan. Tombol `Mulai Sesi Uji (contoh)`: 1 studi kasus, timer mono hitung mundur `02:00` (`--warn` + ikon di bawah 00:30), indikator `Proctoring aktif` (`ScanFace`/`Eye`) + log `Tab tetap fokus ✓`; tombol demo `Simulasikan pindah tab` → badge peringatan (ikon + teks) + penghitung pelanggaran.
- **Bukti audit**: `Skor per penilai disimpan terenkripsi; hasil ditampilkan agregat.`

### Skor (`lib/score360.ts`) dan test vector
```
nilai360     = Σ bobot_g × rata_g   (g ∈ kelompok tampil; bobot dinormalisasi bila ada kelompok disembunyikan)
skorKPI      = clamp(pencapaian / 20, 0, 5)
nilaiAkhir   = 0,6 × skorKPI + 0,4 × nilai360
kategori(n)  = n ≥ 4,0 ? "Layak" : n ≥ 3,0 ? "Layak dengan pengembangan" : "Belum layak"
```
Skor kelompok (urut dimensi): Atasan `[4.5, 4.0, 4.0, 4.5, 4.0]` (rata 4,2) · Rekan `[4.0, 3.5, 4.0, 4.0, 3.5]` (3,8) · Bawahan `[4.0, 3.0, 3.5, 3.5, 4.0]` (3,6) · Diri `[4.5, 4.5, 4.5, 4.5, 4.5]` (4,5).
- Skor gabungan per dimensi (bobot 40/30/30): `[4.20, 3.55, 3.85, 4.05, 3.85]`; `nilai360 = 3,90`.
- `skorKPI(88) = 4,4`; `nilaiAkhir = 0,6×4,4 + 0,4×3,90 = 4,20` ⇒ `Layak`.
- KPI 60% ⇒ `skorKPI 3,0`, `nilaiAkhir 3,36` ⇒ `Layak dengan pengembangan`. KPI 40% ⇒ `skorKPI 2,0`, `nilaiAkhir 2,76` ⇒ `Belum layak`. KPI 120% ⇒ `skorKPI 5,0` (clamp).
- Tanpa kelompok Bawahan: `nilai360 = 4,2×(4/7) + 3,8×(3/7) = 4,0286` (tampil `4,03`); `nilaiAkhir = 4,2514` (tampil `4,25`).
- Format: koma desimal, 2 digit (`3,90`, `4,20`).
- **Fixture pejabat**: `Sari Utami (General Manager)` 4,5 / 4,2 / 4,0 ⇒ rata `4,23`; `Andi Wijaya (Manager)` 4,0 / 3,8 / 4,2 ⇒ `4,00`; `Hadi Prasetyo (Manager)` 3,6 / 3,4 / 3,8 ⇒ `3,60`; `Lina Marlina (Kepala Seksi)` 2,8 / 3,0 / 2,6 ⇒ `2,80`. Kategori memakai `kategori()`: Layak, Layak, Layak dengan pengembangan, Belum layak.

---

## Alur Data Antar Modul
- Persetujuan final di **Perizinan** memperbarui **sisa cuti** (panel Perizinan) dan menampilkan baris dampak ke Absensi/Gaji sebagai teks. Tidak ada state bersama yang kompleks; masing-masing demo mandiri kecuali: `ModuleTabs` menyimpan hasil demo Perizinan agar tidak hilang saat berpindah tab (state diangkat ke `ModuleTabs`).
- Tombol `Reset Demo` per modul.

## Aturan Lintas Modul
- State lokal React; tanpa network request, kamera, geolokasi, atau unduhan sungguhan.
- `<button>` asli; target ≥ 44px; hasil dinamis `aria-live="polite"`; tidak hanya warna.
- Timer berhenti saat tab tidak terlihat (`visibilitychange`) dan saat panel tidak aktif.
- Nol animasi looping (`02` §7).
- Warna/radius/spacing dari token `02`; ikon `lucide-react`.
- **Verifikasi akhir**: (1) semua sub-fitur di `AGENTS.md` §4 terlihat; (2) jalur default Perizinan menghasilkan hash `b71a50df … fa1c6fc4` dan `Verifikasi Integritas` utuh; (3) `Simulasikan perubahan data` menghasilkan `Rantai putus pada entri #3`; (4) Absensi menampilkan `10.471` unik, `10.509` setelah hubungkan ulang; (5) slip terbuka dengan `10.408.000`; (6) rekonsiliasi `1.250.000` → `0`; (7) Exam `4,20 · Layak`, `4,25` saat bawahan disembunyikan.
