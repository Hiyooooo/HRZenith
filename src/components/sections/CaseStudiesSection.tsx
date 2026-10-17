import React from "react";
import Image from "next/image";
import { SectionShell } from "@/components/ui/SectionShell";
import { CASE_STUDIES } from "@/lib/data";
import { Building2, Quote } from "lucide-react";

const CASE_IMAGES: Record<string, { src: string; caption: string }> = {
  "arta-mandala": {
    src: "/images/case-finance.jpg",
    caption: "Headquarters Perbankan & Layanan Finansial",
  },
  "garda-energi": {
    src: "/images/case-energy.jpg",
    caption: "Fasilitas Operasional Terpadu Nasional",
  },
};

export const CaseStudiesSection: React.FC = () => {
  return (
    <SectionShell
      id="studi-kasus"
      number="7.0"
      title="Hasil yang diukur pada organisasi besar."
      description="Studi dampak implementasi standardisasi alur birokrasi dan rekonsiliasi audit pada entitas berskala nasional."
      bg="canvas"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ILUSTRATIF: ganti dengan studi kasus asli yang disetujui klien */}
        {CASE_STUDIES.map((cs) => (
          <div
            key={cs.id}
            className="bg-paper border border-line rounded-[4px] p-6 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand shrink-0" />
                    <h3 className="text-[17px] font-bold text-ink">
                      {cs.clientName}
                    </h3>
                  </div>
                  <span className="text-[12px] font-mono text-steel block mt-0.5">
                    {cs.sector} · {cs.scale}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-panel text-steel border border-line uppercase">
                  Ilustratif
                </span>
              </div>

              {/* Foto Ilustratif Entitas Korporasi */}
              {CASE_IMAGES[cs.id] && (
                <div className="relative h-44 w-full rounded-[4px] overflow-hidden border border-line bg-canvas">
                  <Image
                    src={CASE_IMAGES[cs.id].src}
                    alt={cs.clientName}
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-ink/20" />
                  <span className="absolute bottom-2.5 left-3 text-[10px] font-mono font-bold text-white bg-brand/90 px-2 py-0.5 rounded shadow-sm">
                    {CASE_IMAGES[cs.id].caption}
                  </span>
                </div>
              )}

              <p className="text-[13px] text-ink-2 leading-relaxed">
                {cs.context}
              </p>

              {/* 3 Metrik Hasil */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {cs.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-3 bg-canvas border border-line rounded-[4px] text-center space-y-1"
                  >
                    <div className="text-[16px] sm:text-[18px] font-mono font-bold text-brand leading-none">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-steel leading-tight">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kutipan Direksi / Audit */}
            <div className="p-3.5 bg-panel/60 border border-line/60 rounded-[4px] relative space-y-1.5">
              <Quote className="w-4 h-4 text-brand rotate-180 opacity-60" />
              <p className="text-[12px] text-ink italic leading-relaxed">
                &ldquo;{cs.quote}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};
