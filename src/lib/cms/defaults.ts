import type { SiteConfig } from "./types";

export const DEFAULT_REVALIDATE_SECONDS = 300;
export const API_TIMEOUT_MS = 4000;

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  site: {
    id: "04-hrzenith",
    name: "HRZenith",
    domain: "https://hrzenith.id",
  },
  branding: {
    logoUrl: null, // Menggunakan komponen Logo lokal jika null
    logo_url: "",
    faviconUrl: "/favicon.svg",
    favicon_url: "/favicon.svg",
    primaryColor: "#1E3A8A",
    primary_color: "#1E3A8A",
  },
  hero: {
    headline: "Tata kelola SDM yang dapat diaudit, di seluruh organisasi.",
    subheadline:
      "Perizinan berjenjang dengan jejak audit yang dapat diverifikasi, keamanan informasi selaras ISO/IEC 27001, dan integrasi ke ERP Anda. Satu standar alur birokrasi untuk setiap cabang.",
    ctaText: "Jadwalkan Konsultasi",
    cta_text: "Jadwalkan Konsultasi",
  },
  whatsapp: {
    url: "https://wa.me/6281200000000?text=Halo%20HRZenith%2C%20saya%20ingin%20berkonsultasi%20mengenai%20platform%20HRIS%20enterprise.", // PLACEHOLDER: nomor contoh
  },
  cta: {
    whatsapp_number: "6281200000000",
    whatsapp_message_template:
      "Halo HRZenith, saya ingin berkonsultasi mengenai platform HRIS enterprise.",
    whatsapp_url:
      "https://wa.me/6281200000000?text=Halo%20HRZenith%2C%20saya%20ingin%20berkonsultasi%20mengenai%20platform%20HRIS%20enterprise.",
  },
  contact: {
    email: "halo@hrzenith.id", // PLACEHOLDER
    phone: "+62 21 5000 0000", // PLACEHOLDER
    address:
      "Gedung Contoh Lantai 20, Jl. Jenderal Sudirman Kav. 00, Jakarta 10220", // PLACEHOLDER
    socials: [],
    social_links: [],
    copyright: "© 2026 HRZenith. Seluruh hak dilindungi.",
  },
  footer_text: "© 2026 HRZenith. Seluruh hak dilindungi.",
  tracking: {
    ga_id: null,
    meta_pixel_id: null,
  },
  seo: {
    metaTitle:
      "HRZenith: Platform HRIS Enterprise Skala Nasional",
    meta_title:
      "HRZenith: Platform HRIS Enterprise Skala Nasional",
    metaDescription:
      "Standar tertinggi pengelolaan SDM, audit trail perizinan berjenjang, dan integrasi kepatuhan korporasi.",
    meta_description:
      "Standar tertinggi pengelolaan SDM, audit trail perizinan berjenjang, dan integrasi kepatuhan korporasi.",
    keywords: [
      "HRIS Enterprise",
      "Audit Trail",
      "ISO 27001",
      "Multi-tier Approval",
      "Fingerprint Sync",
      "PPh 21 TER",
    ],
    ogImageUrl: null, // Jatuh ke "/og-default"
    og_image_url: "",
    gaId: null,
    metaPixelId: null,
  },
};
