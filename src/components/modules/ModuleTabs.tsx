"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Fingerprint,
  Wallet,
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PerizinanDemo } from "./PerizinanDemo";
import { AbsensiDemo } from "./AbsensiDemo";
import { GajiDemo } from "./GajiDemo";
import { LibraryDemo } from "./LibraryDemo";
import { ExamDemo } from "./ExamDemo";
import { Button } from "@/components/ui/Button";

export type ModuleId = "perizinan" | "absensi" | "gaji" | "library" | "exam";

interface ModuleMeta {
  id: ModuleId;
  name: string;
  badge?: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MODULES: ModuleMeta[] = [
  {
    id: "perizinan",
    name: "Perizinan",
    badge: "Poros Utama",
    summary: "Multi-tier approval & audit trail rantai-hash",
    icon: CalendarCheck,
  },
  {
    id: "absensi",
    name: "Absensi",
    summary: "Sinkronisasi fingerprint cabang & normalisasi waktu",
    icon: Fingerprint,
  },
  {
    id: "gaji",
    name: "Gaji",
    summary: "Maker-checker, slip terenkripsi & rekonsiliasi pajak",
    icon: Wallet,
  },
  {
    id: "library",
    name: "Library",
    summary: "Repositori dokumen ISO, SK Direksi & bukti baca",
    icon: BookOpen,
  },
  {
    id: "exam",
    name: "Exam",
    summary: "Asesmen pejabat eselon & evaluasi KPI 360°",
    icon: ClipboardCheck,
  },
];

export const ModuleTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ModuleId>("perizinan");
  const [visitedTabs, setVisitedTabs] = useState<Record<ModuleId, boolean>>({
    perizinan: true,
    absensi: false,
    gaji: false,
    library: false,
    exam: false,
  });

  // Handle deep-linking dari URL hash (misal #modul-perizinan atau #modul)
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.toLowerCase();
      if (hash === "#modul" || hash === "#modul-perizinan") {
        setActiveTab("perizinan");
        setVisitedTabs((prev) => ({ ...prev, perizinan: true }));
      } else if (hash === "#modul-absensi") {
        setActiveTab("absensi");
        setVisitedTabs((prev) => ({ ...prev, absensi: true }));
      } else if (hash === "#modul-gaji") {
        setActiveTab("gaji");
        setVisitedTabs((prev) => ({ ...prev, gaji: true }));
      } else if (hash === "#modul-library") {
        setActiveTab("library");
        setVisitedTabs((prev) => ({ ...prev, library: true }));
      } else if (hash === "#modul-exam") {
        setActiveTab("exam");
        setVisitedTabs((prev) => ({ ...prev, exam: true }));
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleSelectTab = (id: ModuleId) => {
    setActiveTab(id);
    setVisitedTabs((prev) => ({ ...prev, [id]: true }));
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#modul-${id}`);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Container Master-Detail: Tab List & Tab Panels */}
      <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start w-full">
        {/* Kolom Kiri: Tab List WAI-ARIA */}
        <div className="w-full xl:w-[250px] shrink-0">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Pilihan 5 Modul HRZenith"
            className="flex flex-row xl:flex-col overflow-x-auto xl:overflow-x-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-2 xl:pb-0 gap-2 select-none border-b xl:border-b-0 border-line"
          >
            {MODULES.map((mod) => {
              const isActive = activeTab === mod.id;
              const Icon = mod.icon;

              return (
                <button
                  key={mod.id}
                  id={`tab-${mod.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={`panel-${mod.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleSelectTab(mod.id)}
                  className={`group shrink-0 text-left transition-all rounded-[4px] p-3 sm:p-3.5 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isActive
                      ? "bg-paper border-line xl:border-l-[4px] xl:border-l-brand shadow-none"
                      : "bg-panel/60 border-transparent hover:bg-paper hover:border-line text-steel hover:text-ink"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-[4px] flex items-center justify-center transition-colors shrink-0 ${
                          isActive
                            ? "bg-brand text-on-brand"
                            : "bg-canvas text-steel group-hover:text-ink"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[14px] font-bold ${
                          isActive ? "text-ink" : "text-steel group-hover:text-ink"
                        }`}
                      >
                        {mod.name}
                      </span>
                    </div>

                    {mod.badge && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-tint text-brand px-1.5 py-0.5 rounded-[2px] border border-brand/20 shrink-0">
                        {mod.badge}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-[11px] mt-1.5 leading-snug line-clamp-2 hidden xl:block ${
                      isActive ? "text-steel" : "text-steel/80"
                    }`}
                  >
                    {mod.summary}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="hidden xl:block mt-5 p-4 rounded-[4px] bg-canvas border border-line text-[12px] text-steel space-y-1.5">
            <span className="font-bold text-ink block font-mono text-[11px] uppercase tracking-wider">
              Arsitektur Data Terpadu
            </span>
            <p className="leading-relaxed">
              Persetujuan final di <strong>Perizinan</strong> menyinkronkan kuota cuti, absensi cabang, dan potongan gaji secara otomatis.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Tab Panels dengan Lazy Mounting & State Preservation */}
        <div className="flex-1 min-w-0 w-full">
          <div className="bg-paper border border-line rounded-[4px] p-4 sm:p-6 lg:p-7 min-h-[500px] w-full">
            {/* Panel 1: Perizinan */}
            <div
              id="panel-perizinan"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="tab-perizinan"
              style={{ display: activeTab === "perizinan" ? "block" : "none" }}
              className="w-full"
            >
              {visitedTabs.perizinan && <PerizinanDemo />}
            </div>

            {/* Panel 2: Absensi */}
            <div
              id="panel-absensi"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="tab-absensi"
              style={{ display: activeTab === "absensi" ? "block" : "none" }}
              className="w-full"
            >
              {visitedTabs.absensi && <AbsensiDemo />}
            </div>

            {/* Panel 3: Gaji */}
            <div
              id="panel-gaji"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="tab-gaji"
              style={{ display: activeTab === "gaji" ? "block" : "none" }}
              className="w-full"
            >
              {visitedTabs.gaji && <GajiDemo />}
            </div>

            {/* Panel 4: Library */}
            <div
              id="panel-library"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="tab-library"
              style={{ display: activeTab === "library" ? "block" : "none" }}
              className="w-full"
            >
              {visitedTabs.library && <LibraryDemo />}
            </div>

            {/* Panel 5: Exam */}
            <div
              id="panel-exam"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby="tab-exam"
              style={{ display: activeTab === "exam" ? "block" : "none" }}
              className="w-full"
            >
              {visitedTabs.exam && <ExamDemo />}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section Modul */}
      <div className="bg-canvas border border-line rounded-[4px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-[15px] font-bold text-ink">
            Perlu kustomisasi modul untuk regulasi khusus institusi Anda?
          </h4>
          <p className="text-[13px] text-steel mt-0.5">
            Konsultasikan struktur birokrasi, sistem grading gaji, dan konektor ERP bersama tim arsitek solusi HRZenith.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant="primary"
            onClick={() => {
              const el = document.getElementById("konsultasi");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>Jadwalkan Konsultasi</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <a
            href="mailto:sales@hrzenith.co.id?subject=Permintaan%20Whitepaper%20Keamanan%20dan%20Modul%20HRZenith"
            className="text-[13px] font-semibold text-brand hover:underline inline-flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Minta Dokumen Keamanan</span>
          </a>
        </div>
      </div>
    </div>
  );
};
