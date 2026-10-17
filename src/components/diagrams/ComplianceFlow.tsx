"use client";

import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Play, RotateCcw, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ComplianceStep {
  step: number;
  title: string;
  lane: "Staff" | "Atasan" | "HRD" | "Sistem" | "Auditor";
  dataLogged: string;
  control: string;
}

export const COMPLIANCE_STEPS: ComplianceStep[] = [
  {
    step: 1,
    title: "Pengajuan",
    lane: "Staff",
    dataLogged: "Jenis, tanggal, durasi, lampiran, waktu (WIB)",
    control: "Formulir tervalidasi kebijakan",
  },
  {
    step: 2,
    title: "Validasi otomatis",
    lane: "Sistem",
    dataLogged: "Saldo cuti, bentrok jadwal, aturan jenis izin, versi kebijakan",
    control: "Penolakan otomatis bila melanggar aturan",
  },
  {
    step: 3,
    title: "Persetujuan Supervisor",
    lane: "Atasan",
    dataLogged: "Aktor, keputusan, komentar, waktu",
    control: "SLA 2 hari kerja, delegasi tercatat",
  },
  {
    step: 4,
    title: "Persetujuan Manager",
    lane: "Atasan",
    dataLogged: "Aktor, keputusan, komentar, waktu",
    control: "Routing menurut jenis dan durasi",
  },
  {
    step: 5,
    title: "Penetapan HRD Director",
    lane: "HRD",
    dataLogged: "Keputusan final, nomor referensi",
    control: "Hanya untuk kategori yang diwajibkan",
  },
  {
    step: 6,
    title: "Pencatatan & sinkron",
    lane: "Sistem",
    dataLogged: "Perubahan saldo cuti, jadwal, potongan payroll, kiriman ke ERP",
    control: "Transaksi atomik, log kegagalan",
  },
  {
    step: 7,
    title: "Audit trail berantai-hash",
    lane: "Sistem",
    dataLogged: "Hash SHA-256 entri dan hash sebelumnya",
    control: "Perubahan terdeteksi saat verifikasi",
  },
  {
    step: 8,
    title: "Pemeriksaan auditor",
    lane: "Auditor",
    dataLogged: "Ekspor log, hasil verifikasi, hash kepala",
    control: "Akses baca-saja, jejak akses auditor",
  },
];

const LANES = ["Staff", "Atasan", "HRD", "Sistem", "Auditor"] as const;

export const ComplianceFlow: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeStep =
    COMPLIANCE_STEPS.find((s) => s.step === selectedStep) || COMPLIANCE_STEPS[0];

  const handlePlay = () => {
    // Hormati reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSelectedStep(8);
      return;
    }

    setIsPlaying(true);
    let current = 1;
    setSelectedStep(1);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      current += 1;
      if (current > 8) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsPlaying(false);
      } else {
        setSelectedStep(current);
      }
    }, 350);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-paper border border-line rounded-[4px] p-5 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h3 className="text-[17px] font-bold text-ink">
            Diagram Swimlane Alur Audit Kepatuhan
          </h3>
          <p className="text-[13px] text-steel">
            5 jalur peran × 8 tahapan transaksi berantai-hash. Klik langkah untuk memeriksa rincian kontrol.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePlay}
            disabled={isPlaying}
            className="text-[13px] h-9 px-3 gap-1.5"
          >
            {isPlaying ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Memutar alur...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Putar alur</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Grid Swimlane Desktop (>= 1024px) */}
      <div className="hidden lg:block overflow-x-auto table-scrollbar pb-2">
        <div className="min-w-[760px] space-y-2.5">
          {LANES.map((lane) => (
            <div key={lane} className="grid grid-cols-9 gap-2 items-center">
              {/* Kolom Nama Jalur */}
              <div className="col-span-1 text-[12px] font-bold uppercase tracking-wider text-steel bg-panel px-3 py-2.5 rounded-[4px] text-center border border-line/60">
                {lane}
              </div>

              {/* 8 Kolom Langkah */}
              <div className="col-span-8 grid grid-cols-8 gap-2">
                {COMPLIANCE_STEPS.map((s) => {
                  const isCurrentLane = s.lane === lane;
                  const isSelected = selectedStep === s.step;

                  if (!isCurrentLane) {
                    return (
                      <div
                        key={s.step}
                        className="h-14 border border-line/30 rounded-[4px] bg-canvas/30"
                        aria-hidden="true"
                      />
                    );
                  }

                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setSelectedStep(s.step)}
                      aria-pressed={isSelected}
                      className={clsx(
                        "h-14 p-2 rounded-[4px] text-left transition-all duration-150 relative flex flex-col justify-between border select-none focus-visible:outline-brand",
                        isSelected
                          ? "bg-brand-tint border-brand border-2 text-brand shadow-none"
                          : "bg-paper border-line text-ink hover:border-control hover:bg-canvas"
                      )}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold leading-none">
                        <span>{s.step}.0</span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                        {s.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tampilan Mobile (< 1024px) */}
      <div className="lg:hidden space-y-2">
        {COMPLIANCE_STEPS.map((s) => {
          const isSelected = selectedStep === s.step;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setSelectedStep(s.step)}
              className={clsx(
                "w-full p-3.5 rounded-[4px] border text-left transition-colors flex items-center justify-between gap-3 select-none",
                isSelected
                  ? "bg-brand-tint border-brand border-2 text-brand"
                  : "bg-paper border-line text-ink hover:bg-canvas"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[12px] font-bold px-1.5 py-0.5 rounded bg-panel text-steel">
                  {s.step}
                </span>
                <div>
                  <div className="text-[14px] font-bold leading-tight">
                    {s.title}
                  </div>
                  <div className="text-[12px] text-steel">Jalur: {s.lane}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0 text-steel" />
            </button>
          );
        })}
      </div>

      {/* Panel Rincian Langkah Terpilih */}
      <div className="bg-canvas border border-line rounded-[4px] p-4 sm:p-5">
        <div className="flex items-center gap-2 font-mono text-[12px] font-bold text-brand uppercase mb-2">
          <span>Langkah {activeStep.step}.0</span>
          <span>·</span>
          <span>Jalur: {activeStep.lane}</span>
        </div>
        <h4 className="text-[16px] font-bold text-ink mb-3">{activeStep.title}</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
          <div className="bg-paper p-3.5 rounded-[4px] border border-line">
            <span className="text-[11px] uppercase font-bold text-steel block mb-1">
              Data yang dicatat
            </span>
            <p className="text-ink font-medium leading-relaxed">
              {activeStep.dataLogged}
            </p>
          </div>
          <div className="bg-paper p-3.5 rounded-[4px] border border-line">
            <span className="text-[11px] uppercase font-bold text-steel block mb-1">
              Mekanisme Kontrol Kepatuhan
            </span>
            <p className="text-ink font-medium leading-relaxed flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <span>{activeStep.control}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
