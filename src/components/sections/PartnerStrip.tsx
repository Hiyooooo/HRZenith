import React from "react";
import { PartnerLogo, PARTNERS_LIST } from "@/components/diagrams/PartnerLogo";

export const PartnerStrip: React.FC = () => {
  return (
    <section className="bg-paper border-b border-line py-8">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 space-y-4">
        {/* ILUSTRATIF: ganti dengan logo mitra asli berizin. Pastikan nama dan glyph tidak menyerupai organisasi nyata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-line/50 pb-2">
          <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-steel">
            Referensi Organisasi Skala Nasional
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-panel text-steel border border-line">
            Ilustratif
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {PARTNERS_LIST.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center py-2 px-3 border border-line/40 rounded-[4px] bg-canvas/30 hover:bg-canvas transition-colors"
            >
              <PartnerLogo id={partner.id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
