export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SecurityControlItem {
  control: string;
  implementation: string;
  reference: string;
}

export interface ComparisonRow {
  aspect: string;
  manual: { status: "danger"; text: string };
  commonHris: { status: "warn" | "danger"; text: string };
  hrzenith: { status: "ok"; text: string };
}

export interface EditionItem {
  name: string;
  isPopular?: boolean;
  deployment: string;
  residency: string;
  sso: string;
  retention: string;
  entities: string;
  erp: string;
  support: string;
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  activity: string;
  deliverable: string;
}

export interface CaseStudy {
  id: string;
  clientName: string;
  sector: string;
  scale: string;
  context: string;
  metrics: Array<{ label: string; value: string }>;
  quote: string;
}

export interface SecurityBadgeItem {
  title: string;
  desc: string;
  iconName: "ShieldCheck" | "Lock" | "KeyRound" | "FileLock2";
}

// Data FAQ Kepatuhan & Keamanan (dipakai UI Akordeon & JSON-LD FAQPage)
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Apakah HRZenith sudah tersertifikasi ISO/IEC 27001?",
    answer:
      "Platform dirancang selaras kerangka ISO/IEC 27001 dan mengacu pada kontrol Annex A. Status sertifikasi resmi disampaikan dalam dokumen keamanan yang kami berikan atas permintaan.",
  },
  {
    id: "faq-2",
    question: "Apakah audit trail benar-benar tidak bisa diubah?",
    answer:
      "Setiap entri berantai-hash SHA-256 dengan entri sebelumnya. Perubahan pada entri lama tidak dapat disembunyikan karena rantai setelahnya tidak lagi cocok, dan auditor dapat memverifikasinya. Kontrol akses basis data tetap diterapkan.",
  },
  {
    id: "faq-3",
    question: "Bagaimana integrasi dengan ERP kami?",
    answer:
      "Melalui REST API, webhook, dan pertukaran file SFTP/CSV terjadwal. Cakupan dan produk ERP dipetakan pada fase discovery.",
  },
  {
    id: "faq-4",
    question: "Apakah mendukung SSO dan direktori perusahaan?",
    answer:
      "Ya, SAML 2.0 dan OIDC. Sinkronisasi direktori (LDAP/AD) tersedia pada edisi tertentu.",
  },
  {
    id: "faq-5",
    question: "Di mana data disimpan?",
    answer:
      "Pada pusat data di Indonesia. Opsi private cloud atau on-premise tersedia pada edisi yang sesuai.",
  },
  {
    id: "faq-6",
    question: "Mesin fingerprint apa saja yang dapat disinkronkan?",
    answer:
      "Mesin yang mendukung push protocol atau ekspor berkala. Daftar tipe dikonfirmasi saat discovery, termasuk antrean log saat mesin offline.",
  },
  {
    id: "faq-7",
    question: "Bagaimana penetapan zona waktu dan hari libur nasional?",
    answer:
      "Setiap log disimpan dengan zona asal (WIB/WITA/WIT) lalu dinormalisasi. Kalender libur nasional dan cuti bersama diperbarui dari konfigurasi.",
  },
  {
    id: "faq-8",
    question: "Bagaimana proses pengadaan dan model lisensi?",
    answer:
      "Lisensi per karyawan aktif per bulan atau tahunan, menurut edisi. Kami menyiapkan dokumen teknis dan penawaran untuk kebutuhan pengadaan Anda.",
  },
];

// Badge Keamanan Hero
export const SECURITY_BADGES: SecurityBadgeItem[] = [
  {
    title: "Selaras ISO/IEC 27001",
    desc: "Mengacu kontrol Annex A",
    iconName: "ShieldCheck",
  },
  {
    title: "Enkripsi AES-256",
    desc: "Data tersimpan & slip PDF",
    iconName: "Lock",
  },
  {
    title: "Protokol TLS 1.3",
    desc: "Enkripsi data bergerak",
    iconName: "KeyRound",
  },
  {
    title: "Prinsip UU PDP",
    desc: "Hak akses & retensi ketat",
    iconName: "FileLock2",
  },
];

// Tabel Kontrol Keamanan (Section 1.0)
export const SECURITY_CONTROLS: SecurityControlItem[] = [
  {
    control: "Kriptografi",
    implementation:
      "Data tersimpan AES-256, data bergerak TLS 1.3, slip gaji PDF dienkripsi kata sandi",
    reference: "ISO/IEC 27001:2022 A.8.24",
  },
  {
    control: "Kontrol akses",
    implementation:
      "Akses berbasis peran (RBAC) per modul, cabang, dan klasifikasi dokumen",
    reference: "A.5.15, A.5.18",
  },
  {
    control: "Autentikasi",
    implementation: "SSO SAML 2.0 / OIDC, autentikasi multi-faktor",
    reference: "A.8.5",
  },
  {
    control: "Pencatatan",
    implementation: "Audit trail berantai-hash SHA-256; ekspor untuk auditor",
    reference: "A.8.15",
  },
  {
    control: "Pencadangan",
    implementation: "Cadangan terjadwal dan uji pemulihan berkala",
    reference: "A.8.13",
  },
  {
    control: "Pelindungan data pribadi",
    implementation:
      "Pembatasan akses, retensi dapat diatur, jejak akses data sensitif",
    reference: "A.5.34, UU PDP",
  },
];

// Tabel Perbandingan (Section 4.0)
export const COMPARISON_DATA: ComparisonRow[] = [
  {
    aspect: "Persetujuan berjenjang dengan routing aturan",
    manual: { status: "danger", text: "Formulir kertas, alur sering terlewat" },
    commonHris: { status: "warn", text: "Maksimal 2 tingkat, aturan kaku" },
    hrzenith: { status: "ok", text: "4 tingkat otomatis, SLA, delegasi, eskalasi" },
  },
  {
    aspect: "Audit trail yang dapat diverifikasi integritasnya",
    manual: { status: "danger", text: "Tidak ada catatan perubahan" },
    commonHris: { status: "warn", text: "Log database biasa, rawan diedit admin" },
    hrzenith: { status: "ok", text: "Berantai-hash SHA-256, verifikasi mandiri" },
  },
  {
    aspect: "Sinkronisasi fingerprint multi-cabang & zona waktu",
    manual: { status: "danger", text: "Rekap manual via flashdisk/email" },
    commonHris: { status: "warn", text: "Hanya rekap parsial tanpa normalisasi" },
    hrzenith: { status: "ok", text: "Terkoneksi cloud, normalisasi WIB/WITA/WIT" },
  },
  {
    aspect: "Maker-checker pada payroll",
    manual: { status: "danger", text: "Satu staf finance mengatur semua" },
    commonHris: { status: "warn", text: "Persetujuan tunggal tanpa validasi peran" },
    hrzenith: { status: "ok", text: "Pemisahan tegas pembuat batch & penyetuju" },
  },
  {
    aspect: "Slip gaji terenkripsi kata sandi",
    manual: { status: "danger", text: "Amplop kertas atau PDF terbuka" },
    commonHris: { status: "warn", text: "Portal login tanpa proteksi per berkas" },
    hrzenith: { status: "ok", text: "PDF terkunci PIN unik, limit percobaan" },
  },
  {
    aspect: "Rekonsiliasi & laporan pajak tahunan",
    manual: { status: "danger", text: "Kalkulasi spreadsheet berisiko selisih" },
    commonHris: { status: "warn", text: "Hanya hitungan bulanan tanpa rekap 1721-A1" },
    hrzenith: { status: "ok", text: "Rekap 12 bulan vs 1721-A1, audit selisih otomatis" },
  },
  {
    aspect: "Repositori dokumen ISO/SK dengan klasifikasi",
    manual: { status: "danger", text: "Buku manual fisik di lemari arsip" },
    commonHris: { status: "danger", text: "Tidak menyediakan repositori dokumen" },
    hrzenith: { status: "ok", text: "Klasifikasi 4 tingkat, versi & bukti baca" },
  },
  {
    aspect: "Asesmen 360 dengan anonimitas penilai",
    manual: { status: "danger", text: "Kuesioner manual tanpa privasi" },
    commonHris: { status: "danger", text: "Hanya evaluasi atasan langsung" },
    hrzenith: { status: "ok", text: "Radar 5 dimensi, batas anonimitas <3 penilai" },
  },
  {
    aspect: "SSO, RBAC, dan integrasi ERP",
    manual: { status: "danger", text: "Tanpa integrasi digital" },
    commonHris: { status: "warn", text: "Konektor terbatas, akun mandiri" },
    hrzenith: { status: "ok", text: "SAML/OIDC, RBAC granular, konektor ERP multi-protokol" },
  },
];

// Matriks Edisi (Section 5.0)
export const EDITIONS_DATA: EditionItem[] = [
  {
    name: "Enterprise",
    isPopular: false,
    deployment: "Cloud terkelola",
    residency: "Indonesia",
    sso: "SAML 2.0 / OIDC",
    retention: "3 tahun",
    entities: "Hingga 5 entitas",
    erp: "Konektor standar",
    support: "Jam kerja operasional",
  },
  {
    name: "Corporate",
    isPopular: true,
    deployment: "Private cloud dedicated",
    residency: "Indonesia",
    sso: "SAML 2.0 / OIDC + Sinkron Direktori",
    retention: "10 tahun",
    entities: "Tidak dibatasi",
    erp: "Konektor + pengembangan kustom",
    support: "24/7 untuk insiden kritis",
  },
  {
    name: "Sovereign",
    isPopular: false,
    deployment: "Private cloud atau on-premise",
    residency: "Indonesia, sesuai instruksi instansi",
    sso: "SAML / OIDC / LDAP internal khusus",
    retention: "Sesuai regulasi instansi / permanen",
    entities: "Tidak dibatasi",
    erp: "Konektor + review keamanan instansi",
    support: "Dedicated technical account + SLA khusus",
  },
];

// Roadmap Implementasi (Section 6.0)
export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: "1. Discovery",
    duration: "2–3 minggu",
    activity:
      "Pemetaan alur birokrasi, struktur organisasi, aturan perizinan, daftar cabang dan mesin fingerprint",
    deliverable: "Dokumen desain alur dan matriks persetujuan",
  },
  {
    phase: "2. Konfigurasi & Integrasi",
    duration: "4–8 minggu",
    activity:
      "Konfigurasi routing perizinan, SSO korporasi, konektor ERP, dan sinkronisasi mesin cabang",
    deliverable: "Lingkungan UAT terkonfigurasi",
  },
  {
    phase: "3. Pilot & UAT",
    duration: "4 minggu",
    activity:
      "Uji coba pada satu divisi/cabang percontohan, uji integritas audit trail, dan simulasi payroll paralel",
    deliverable: "Berita acara UAT bertandatangan",
  },
  {
    phase: "4. Go-Live Bertahap",
    duration: "Sesuai jumlah cabang",
    activity:
      "Peluncuran per gelombang cabang nasional, pelatihan admin SDM, dan orientasi auditor internal",
    deliverable: "Laporan peluncuran dan transisi SLA",
  },
];

// Studi Kasus (Section 7.0)
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "arta-mandala",
    clientName: "Arta Mandala Finansial",
    sector: "Institusi Perbankan Nasional",
    scale: "120 Kantor Cabang & Unit",
    context:
      "Standardisasi birokrasi perizinan dan penegakan audit trail kepatuhan perbankan di seluruh unit kerja.",
    metrics: [
      { label: "Waktu persetujuan cuti", value: "5 → 2 hari" },
      { label: "Berkas cetak persetujuan", value: "−90%" },
      { label: "Temuan audit perizinan", value: "0 temuan" },
    ],
    quote:
      "Pemeriksaan auditor internal terhadap riwayat cuti dan lembur kini selesai dalam hitungan jam berkat verifikasi log hash.",
  },
  {
    id: "garda-energi",
    clientName: "Garda Energi Nusantara",
    sector: "Konglomerat Energi & Logistik",
    scale: "38 Lokasi Operasional Nasional",
    context:
      "Konsolidasi data absensi mesin fingerprint lintas zona waktu dan rekonsiliasi kepatuhan pajak tahunan.",
    metrics: [
      { label: "Cabang tersinkronisasi", value: "38 / 38" },
      { label: "Selisih rekonsiliasi pajak", value: "Rp 0" },
      { label: "Waktu rekap kehadiran nasional", value: "3 hari → 2 jam" },
    ],
    quote:
      "Rekonsiliasi PPh 21 bulanan terhadap bukti potong 1721-A1 sekarang otomatis selaras tanpa perhitungan lembur manual.",
  },
];
