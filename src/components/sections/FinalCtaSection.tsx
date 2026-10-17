import React from "react";
import Image from "next/image";
import type { SiteConfig } from "@/lib/cms/types";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Mail, Phone, ArrowRight, ShieldAlert } from "lucide-react";

export interface FinalCtaSectionProps {
  config: SiteConfig;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ config }) => {
  const { contact, whatsapp } = config;

  return (
    <section
      id="konsultasi"
      aria-labelledby="cta-heading"
      className="bg-brand text-on-brand py-16 lg:py-24 border-t border-brand-hover"
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Kiri: Visual Ruang Konsultasi Eksekutif */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-96 rounded-[4px] overflow-hidden border border-white/20 bg-brand-hover">
            <Image
              src="/images/consultation.jpg"
              alt="Ruang Pertemuan Eksekutif dan Konsultasi Tata Kelola HRZenith"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-ink/30" />
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-brand/90 backdrop-blur-none border border-white/15 rounded-[4px] text-white">
              <span className="font-mono font-bold block text-[10px] uppercase tracking-wider text-white/80">
                Sesi Privat & Evaluasi Tata Kelola
              </span>
              <p className="text-[12px] text-white leading-tight mt-0.5 font-medium">
                Konsultasi arsitektur birokrasi & matriks kepatuhan bersama tim spesialis HRZenith.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Copywriting & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white/10 border border-white/20 text-[12px] font-mono tracking-wider uppercase text-white font-medium">
              <span>Sesi Khusus Komite & Pimpinan SDM</span>
            </div>

            <h2
              id="cta-heading"
              className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-white tracking-[-0.02em] leading-[1.15]"
            >
              Diskusikan kebutuhan kepatuhan organisasi Anda.
            </h2>

            <p className="text-[15px] sm:text-[16px] text-white/90 leading-relaxed font-normal">
              Kami menyiapkan sesi konsultasi 45 menit, demonstrasi alur audit langsung, dan dokumen ringkasan keamanan teknis selaras ISO/IEC 27001 untuk komite evaluasi internal Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                href={`mailto:${contact.email}?subject=Jadwalkan%20Konsultasi%20HRZenith`}
                variant="primary-on-brand"
                className="gap-2 text-[15px] w-full sm:w-auto"
              >
                <span>Jadwalkan Konsultasi</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary-on-brand"
                className="gap-2 text-[15px] w-full sm:w-auto"
              >
                <WhatsAppIcon size={18} />
                <span>Chat WhatsApp</span>
              </Button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-[13px] text-white/80">
              <a
                href={`mailto:${contact.email}?subject=Minta%20Dokumen%20Keamanan%20HRZenith`}
                className="inline-flex items-center gap-1.5 underline underline-offset-4 decoration-white/40 hover:text-white hover:decoration-white"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Minta Dokumen Keamanan Lengkap (PDF)</span>
              </a>
              <span className="hidden sm:inline text-white/30">|</span>
              <div className="flex items-center gap-4 font-mono text-[12px]">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-white/70" />
                  <span>{contact.email}</span>
                </span>
                {contact.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-white/70" />
                    <span>{contact.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
