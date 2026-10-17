import React from "react";
import Image from "next/image";
import type { SiteConfig } from "@/lib/cms/types";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { DataTable } from "@/components/ui/DataTable";
import { SECURITY_BADGES } from "@/lib/data";
import { ShieldCheck, Lock, KeyRound, FileLock2, ArrowRight } from "lucide-react";

export interface HeroProps {
  config: SiteConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  const { hero, cta, contact } = config;

  const renderBadgeIcon = (name: string) => {
    switch (name) {
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-brand shrink-0" />;
      case "Lock":
        return <Lock className="w-4 h-4 text-brand shrink-0" />;
      case "KeyRound":
        return <KeyRound className="w-4 h-4 text-brand shrink-0" />;
      case "FileLock2":
        return <FileLock2 className="w-4 h-4 text-brand shrink-0" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-brand shrink-0" />;
    }
  };

  return (
    <section
      id="beranda"
      className="relative bg-brand text-on-brand py-16 lg:py-24 border-b border-brand-hover overflow-hidden"
    >
      {/* Background Gambar Nyata Enterprise */}
      <Image
        src="/images/hero-team.jpg"
        alt="Operasional dan Kolaborasi Eksekutif SDM Enterprise"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Lapisan Tint Warna Brand untuk Kontras Teks Maksimal */}
      <div className="absolute inset-0 bg-brand/88" />

      {/* Pola Grid Geometris Halus */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      <div className="relative max-w-[1240px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Kolom Kiri: Copywriting & CTA (7 Kolom) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white/10 border border-white/20 text-[12px] font-mono tracking-wider uppercase text-white font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-none" />
              <span>Platform HRIS Enterprise · Skala Nasional & Global</span>
            </div>

            <h1 className="text-[32px] sm:text-[40px] lg:text-[46px] font-bold text-white tracking-[-0.02em] leading-[1.12]">
              {hero.headline}
            </h1>

            <p className="text-[16px] sm:text-[17px] text-white/90 leading-[1.6] max-w-2xl font-normal">
              {hero.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                href={`mailto:${contact.email}?subject=Jadwalkan%20Konsultasi%20HRZenith`}
                variant="primary-on-brand"
                className="gap-2 text-[15px]"
              >
                <span>{hero.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                href={cta.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary-on-brand"
                className="gap-2 text-[15px]"
              >
                <WhatsAppIcon size={18} />
                <span>Chat WhatsApp</span>
              </Button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[13px] text-white/75">
              <a
                href={`mailto:${contact.email}?subject=Minta%20Dokumen%20Keamanan%20HRZenith`}
                className="underline underline-offset-4 decoration-white/40 hover:text-white hover:decoration-white transition-colors"
              >
                Minta Dokumen Keamanan (Whitepaper)
              </a>
              <span className="hidden sm:inline text-white/30">·</span>
              <span>Sesi konsultasi 45 menit bersama tim tata kelola</span>
            </div>
          </div>

          {/* Kolom Kanan: Panel Kepatuhan (5 Kolom) */}
          <div className="lg:col-span-5">
            <div className="bg-paper text-ink p-5 sm:p-6 rounded-[4px] border border-white/20 shadow-none space-y-5">
              <div className="border-b border-line pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                    Standar Arsitektur
                  </span>
                  <h3 className="text-[16px] font-bold text-ink">
                    Panel Tata Kelola & Kepatuhan
                  </h3>
                </div>
                <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-ok-bg text-ok border border-ok/20">
                  Siap Audit
                </span>
              </div>

              {/* DataTable Mini 3 Pilar */}
              <DataTable caption="Pilar Kepatuhan HRZenith" hideCaption>
                <tbody>
                  <tr className="border-b border-line">
                    <th scope="row" className="py-2.5 px-3 text-[12px] font-bold text-ink bg-panel w-2/5 align-top">
                      Keamanan Informasi
                    </th>
                    <td className="py-2.5 px-3 text-[12px] text-ink-2 font-mono leading-relaxed">
                      Selaras ISO/IEC 27001 · AES-256 · TLS 1.3 · RBAC + SSO
                    </td>
                  </tr>
                  <tr className="border-b border-line">
                    <th scope="row" className="py-2.5 px-3 text-[12px] font-bold text-ink bg-panel w-2/5 align-top">
                      Integrasi ERP
                    </th>
                    <td className="py-2.5 px-3 text-[12px] text-ink-2 font-mono leading-relaxed">
                      REST API · SFTP/CSV terjadwal · Webhook · SAML/OIDC
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-3 text-[12px] font-bold text-ink bg-panel w-2/5 align-top">
                      Standardisasi Alur
                    </th>
                    <td className="py-2.5 px-3 text-[12px] text-ink-2 font-mono leading-relaxed">
                      4 tingkat persetujuan · SLA & eskalasi · Audit trail berantai-hash
                    </td>
                  </tr>
                </tbody>
              </DataTable>

              {/* 4 Lencana Keamanan */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {SECURITY_BADGES.map((b) => (
                  <div
                    key={b.title}
                    className="p-2.5 bg-canvas border border-line rounded-[4px] space-y-0.5"
                  >
                    <div className="flex items-center gap-1.5 text-ink font-semibold text-[12px]">
                      {renderBadgeIcon(b.iconName)}
                      <span className="leading-tight">{b.title}</span>
                    </div>
                    <span className="text-[11px] text-steel block leading-tight">
                      {b.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
