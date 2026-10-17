import { site } from "@/lib/site";
import { type SiteConfig } from "@/lib/cms/types";
import { FAQ_ITEMS, type FaqItem } from "@/lib/data";

export function buildJsonLd(config: SiteConfig) {
  const featureList = [
    // Modul Perizinan
    "Multi-tier approval berjenjang (Staff, Supervisor, Manager, HRD Director)",
    "Audit trail rantai-hash SHA-256 yang dapat diverifikasi integritasnya",
    "Routing persetujuan otomatis menurut jenis izin dan durasi hari",
    "SLA dan eskalasi otomatis persetujuan perizinan",
    "Delegasi wewenang persetujuan cuti dan izin",
    "Pengajuan cuti tahunan, izin sakit, dinas luar, dan lembur",
    "Transparansi pelacakan sisa cuti karyawan real-time",
    // Modul Absensi
    "Sinkronisasi mesin fingerprint multi-cabang nasional ke server cloud terpusat",
    "Normalisasi multi-zona waktu (WIB, WITA, WIT) ke basis data pusat",
    "Deduplikasi log kehadiran dan antrean offline saat jaringan terputus",
    "Rekapitulasi kehadiran nasional real-time",
    "Pengaturan pola shift kerja dan kalender libur nasional",
    "Kanal pelengkap absensi mobile GPS geofencing untuk dinas luar",
    // Modul Gaji
    "Audit trail payroll dengan kontrol pembuat dan penyetuju (maker-checker)",
    "Slip gaji digital terenkripsi kata sandi format PDF",
    "Laporan kepatuhan pajak tahunan dan rekonsiliasi formulir 1721-A1",
    "Kalkulasi penggajian otomatis terintegrasi data absensi dan cuti",
    "Perhitungan PPh 21 tarif efektif rata-rata (TER)",
    "Perhitungan iuran BPJS Ketenagakerjaan dan BPJS Kesehatan",
    "Klaim dan reimbursement biaya operasional karyawan",
    // Modul Library
    "Repositori dokumen standarisasi mutu dan kepatuhan ISO",
    "Arsip Surat Keputusan (SK) Direksi dengan riwayat versi",
    "Kebijakan kerahasiaan dan pelacakan konfirmasi baca karyawan",
    "Klasifikasi keamanan informasi (Publik, Internal, Rahasia, Sangat Rahasia)",
    "Riwayat perubahan versi dokumen dan catatan persetujuan",
    "Masa berlaku dokumen dan pengingat jadwal peninjauan berkala",
    // Modul Exam
    "Assessment tahunan kompetensi pejabat struktural eselon",
    "Evaluasi kinerja KPI 360 derajat dengan perlindungan anonimitas penilai",
    "Uji kompetensi dan simulasi ujian terpantau proctoring",
    "Assessment seleksi rekrutmen dan promosi jabatan",
    "Evaluasi kinerja terpadu kombinasi KPI dan perilaku kerja",
    "Pemantauan fokus layar proctoring dengan log deteksi pelanggaran",
  ];

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: config.site.name || site.name,
    url: site.url,
    email: config.contact.email,
  };

  if (
    config.branding.logoUrl &&
    config.branding.logoUrl.startsWith("https://")
  ) {
    organization.logo = config.branding.logoUrl;
  }

  if (config.contact.socials && config.contact.socials.length > 0) {
    organization.sameAs = config.contact.socials.map((s) => s.url);
  }

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: config.site.name || site.name,
    url: site.url,
    inLanguage: "id-ID",
    publisher: {
      "@id": `${site.url}/#organization`,
    },
  };

  const softwareApplication = {
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software`,
    name: config.site.name || site.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: config.seo.metaDescription,
    featureList: featureList,
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${site.url}/#faq`,
    mainEntity: FAQ_ITEMS.map((faq: FaqItem) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, softwareApplication, faqPage],
  };
}
