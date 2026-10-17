import React from "react";
import type { SiteConfig } from "@/lib/cms/types";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export interface FooterProps {
  config: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  const { branding, contact, footer_text } = config;

  return (
    <footer className="bg-footer text-on-footer pt-16 pb-28 sm:pb-20 border-t border-line/20">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Kolom 1: Brand & Tagline (2 Kolom di LG) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo logoUrl={branding.logoUrl} variant="light" size="md" />
            <p className="text-[14px] text-on-footer-2 max-w-sm leading-relaxed">
              Platform HRIS Enterprise untuk skala nasional dan global. Mengamankan tata kelola SDM, persetujuan berjenjang, dan rantai audit kepatuhan korporasi.
            </p>
            <div className="text-[12px] font-mono text-on-footer-2">
              Sistem terdistribusi multi-cabang · Bersertifikasi arsitektur ISO 27001
            </div>
          </div>

          {/* Kolom 2: 5 Modul */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-mono font-bold uppercase tracking-wider text-white">
              Platform Modul
            </h4>
            <ul className="space-y-2 text-[14px] text-on-footer-2">
              <li>
                <a href="#modul" className="hover:text-white transition-colors">
                  Perizinan Multi-Tier
                </a>
              </li>
              <li>
                <a href="#modul" className="hover:text-white transition-colors">
                  Absensi Fingerprint
                </a>
              </li>
              <li>
                <a href="#modul" className="hover:text-white transition-colors">
                  Gaji & PPh 21 TER
                </a>
              </li>
              <li>
                <a href="#modul" className="hover:text-white transition-colors">
                  Library SK & Dokumen
                </a>
              </li>
              <li>
                <a href="#modul" className="hover:text-white transition-colors">
                  Exam & Asesmen 360°
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Tata Kelola & Navigasi */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-mono font-bold uppercase tracking-wider text-white">
              Tata Kelola
            </h4>
            <ul className="space-y-2 text-[14px] text-on-footer-2">
              <li>
                <a href="#keamanan" className="hover:text-white transition-colors">
                  Kontrol Keamanan
                </a>
              </li>
              <li>
                <a href="#alur-audit" className="hover:text-white transition-colors">
                  Alur Audit Compliance
                </a>
              </li>
              <li>
                <a href="#perbandingan" className="hover:text-white transition-colors">
                  Perbandingan Solusi
                </a>
              </li>
              <li>
                <a href="#edisi" className="hover:text-white transition-colors">
                  Edisi & Deployment
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ Kepatuhan
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Saluran Komunikasi */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-mono font-bold uppercase tracking-wider text-white">
              Kontak Korporasi
            </h4>
            <div className="space-y-2.5 text-[13px] text-on-footer-2">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-tint shrink-0" />
                <span>{contact.email}</span>
              </a>
              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-tint shrink-0" />
                  <span>{contact.phone}</span>
                </a>
              )}
              {contact.address && (
                <div className="flex items-start gap-2 pt-1">
                  <MapPin className="w-4 h-4 text-brand-tint shrink-0 mt-0.5" />
                  <span className="leading-snug">{contact.address}</span>
                </div>
              )}

              {/* Tautan Media Sosial */}
              {contact.socials && contact.socials.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {contact.socials.map((soc) => (
                    <a
                      key={soc.url}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-mono border border-white/10 bg-white/5 px-2.5 py-1 rounded-[4px] text-on-footer hover:text-white hover:border-white/30 transition-colors"
                    >
                      <span>{soc.name || soc.platform}</span>
                      <ExternalLink className="w-3 h-3 text-on-footer-2" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Baris Bawah: Copyright & Disclaimer */}
        <div className="pt-8 border-t border-line/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-on-footer-2">
          <div>
            <p>{footer_text}</p>
            <p className="text-[12px] text-on-footer-2/70 mt-1">
              Seluruh nama klien mitra, angka metrik, dan studi kasus pada halaman ini bersifat ilustratif untuk keperluan demonstrasi tata kelola platform.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-[12px]">
            <a
              href={`mailto:${contact.email}?subject=Permintaan%20Kebijakan%20Privasi%20HRZenith`}
              className="hover:text-white transition-colors"
            >
              Kebijakan Privasi
            </a>
            <span>·</span>
            <a
              href={`mailto:${contact.email}?subject=Syarat%20dan%20Ketentuan%20HRZenith`}
              className="hover:text-white transition-colors"
            >
              Syarat Layanan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
