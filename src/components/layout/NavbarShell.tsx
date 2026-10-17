"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";

export interface NavbarShellProps {
  logoUrl?: string | null;
  ctaText: string;
  email: string;
}

const NAV_LINKS = [
  { label: "Keamanan", href: "#keamanan" },
  { label: "Alur Audit", href: "#alur-audit" },
  { label: "Modul", href: "#modul" },
  { label: "Perbandingan", href: "#perbandingan" },
  { label: "Edisi", href: "#edisi" },
  { label: "FAQ", href: "#faq" },
];

export const NavbarShell: React.FC<NavbarShellProps> = ({
  logoUrl,
  ctaText,
  email,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-paper border-b border-line">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#beranda" className="flex items-center gap-2 focus-visible:outline-brand">
          <BrandLogo logoUrl={logoUrl} size="md" />
        </a>

        {/* Menu Navigasi Desktop */}
        <nav aria-label="Navigasi Utama" className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-semibold text-steel hover:text-ink transition-colors focus-visible:outline-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Primer Kanan */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            href={`mailto:${email}?subject=Jadwalkan%20Konsultasi%20HRZenith`}
            variant="primary"
            className="text-[14px] min-h-[40px] px-4 gap-1.5"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Tombol Hamburger Mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
            className="w-10 h-10 flex items-center justify-center rounded-[4px] border border-line text-ink hover:bg-canvas focus-visible:outline-brand"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Drawer Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-paper/95 border-t border-line flex flex-col justify-between p-6 sm:hidden">
          <nav className="flex flex-col space-y-4 pt-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[18px] font-bold text-ink hover:text-brand transition-colors py-2 border-b border-line/40 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-steel" />
              </a>
            ))}
          </nav>

          <div className="space-y-3 pt-6 border-t border-line">
            <Button
              href={`mailto:${email}?subject=Jadwalkan%20Konsultasi%20HRZenith`}
              variant="primary"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
            >
              {ctaText}
            </Button>
            <Button
              href={`mailto:${email}?subject=Minta%20Dokumen%20Keamanan%20HRZenith`}
              variant="outline"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
            >
              Dokumen Keamanan
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
