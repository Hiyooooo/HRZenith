# 01 — Project Brief

## Ringkasan
**HRZenith** adalah platform HRIS enterprise untuk organisasi besar yang diaudit, diatur regulasi, dan tersebar di banyak cabang. Inti produk: **standardisasi alur birokrasi SDM dengan jejak audit yang bisa dibuktikan**. Perizinan berjenjang, absensi mesin fingerprint nasional, payroll yang terkendali, repositori dokumen resmi, dan asesmen pejabat berada di satu platform dengan keamanan informasi yang selaras ISO/IEC 27001 dan integrasi ke ERP.

Website ini adalah **landing page promosi**: formal, persuasif, fokus konversi. Bukan aplikasi internal, dan tidak memuat dashboard sungguhan.

## Target Audiens
- **Sektor**: BUMN, konglomerat/multinasional, perbankan dan asuransi, lembaga pemerintahan dan instansi.
- **Pengambil keputusan dan pengaruh** (siklus pembelian panjang, banyak pihak):
  - Direktur SDM / Kepala Biro SDM: butuh standardisasi alur dan beban administrasi lebih ringan.
  - **CISO / Kepala TI**: butuh bukti keamanan (enkripsi, akses, log, SSO) dan kemampuan integrasi.
  - **Internal Audit / SPI / Kepatuhan**: butuh jejak audit yang dapat diverifikasi.
  - Finance/Payroll Manager: butuh kontrol payroll dan kepatuhan pajak.
  - Procurement/Pengadaan: butuh dokumen, SLA, dan kejelasan model lisensi.
- Selera: dokumen yang rapi, tabel yang bisa dibandingkan, diagram yang bisa dijelaskan ke komite. Skeptis terhadap janji pemasaran.

## Tujuan Halaman (urut prioritas)
1. **Konversi utama**: `Jadwalkan Konsultasi` (teks CTA hero dapat diubah dari admin panel).
2. **Konversi sekunder**: `Minta Dokumen Keamanan`, lalu klik WhatsApp.
3. Dalam 5 detik pengunjung paham: "HRIS enterprise dengan audit trail, keamanan ISO 27001, integrasi ERP".
4. Dalam 60 detik pengunjung menjalankan alur persetujuan multi-tier dan **memverifikasi integritas audit trail** sendiri.
5. Memberi bahan untuk komite internal: tabel komparasi, diagram alur audit, matriks edisi, peta implementasi.

## Proposisi Nilai
- **Alur birokrasi standar**: persetujuan Staff → Supervisor → Manager → HRD Director dengan aturan routing, SLA, dan eskalasi.
- **Audit trail yang dapat diverifikasi**: setiap tindakan tercatat berantai-hash (SHA-256); perubahan di tengah rantai terdeteksi.
- **Data kehadiran nasional terpusat**: mesin fingerprint tiap cabang tersinkron ke satu server cloud, zona waktu dinormalisasi.
- **Payroll terkendali**: maker-checker, slip terenkripsi, rekonsiliasi pajak tahunan.
- **Siap integrasi**: REST API, SFTP/CSV terjadwal, webhook, SSO SAML/OIDC.

## Kerangka Persuasi
Janji (hero: keamanan, ERP, standardisasi) → Referensi organisasi → Kontrol keamanan dan integrasi → Alur audit compliance (diagram) → Bukti interaktif per modul → Perbandingan terstruktur → Edisi dan deployment → Peta implementasi → Studi kasus → FAQ keberatan (sertifikasi, residensi data, SSO, pengadaan) → CTA.

## Tone & Voice (beda tegas dari 01–03)
- **Formal, presisi, tenang**: bahasa dokumen tata kelola. Kalimat deklaratif, istilah tepat ("tata kelola", "kepatuhan", "audit internal", "SK Direksi", "jejak audit").
- Netral tanpa sapaan akrab; bila perlu "Anda" / "organisasi Anda".
- Klaim selalu bermekanisme dan berbatas: "tercatat berantai-hash dan dapat diverifikasi", bukan "tidak bisa diubah".
- Tidak ada humor, seruan, atau slogan. Daftar kata terlarang di `06`.

## Referensi Gaya (inspirasi, bukan salinan)
Situs produk enterprise HR/ERP yang padat informasi: struktur kokoh, tabel, diagram, bahasa kepatuhan. Tidak meniru brand, tata letak, atau ikon spesifik.

## Di Luar Cakupan
Backend aplikasi HRIS nyata, autentikasi pengguna, pembayaran, blog, multi-bahasa, dashboard sungguhan. **Yang dalam cakupan**: pembacaan konfigurasi situs dari admin panel Laravel (`07`). CTA mengarah ke anchor/`mailto:`/tautan WhatsApp dari API.

## Default yang Diasumsikan (agent: pakai, lalu laporkan)
- CTA primer `Jadwalkan Konsultasi`; sekunder `Minta Dokumen Keamanan`.
- Tanpa harga: pembelian enterprise lewat konsultasi. Edisi ditampilkan sebagai matriks fitur tanpa angka.
- Logo HRZenith: wordmark + simbol buatan sendiri; logo mitra: 6 logo **fiktif buatan sendiri**, ditandai ilustratif.
- Studi kasus, angka, durasi implementasi, SLA: ilustratif.
- Status ISO/IEC 27001: **belum dinyatakan tersertifikasi**. Wording "selaras"; pemilik memutuskan kapan mengubahnya (`06` §3).
- Seluruh konfigurasi dinamis memiliki nilai cadangan (`07` §7).
