import React from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { DataTable } from "@/components/ui/DataTable";
import { ROADMAP_PHASES } from "@/lib/data";

export const RoadmapSection: React.FC = () => {
  return (
    <SectionShell
      id="implementasi"
      number="6.0"
      title="Implementasi bertahap dengan titik uji jelas."
      description="Metodologi peluncuran enterprise terukur dengan pengujian paralel untuk menjamin kelangsungan operasional tanpa jeda."
      bg="paper"
    >
      <div className="space-y-4">
        <DataTable caption="Tahapan Roadmap Implementasi Korporasi" hideCaption>
          <thead>
            <tr className="bg-panel border-b border-line text-[12px] font-bold uppercase tracking-wider text-steel">
              <th scope="col" className="py-3 px-4 w-1/5">
                Fase Kerja
              </th>
              <th scope="col" className="py-3 px-4 w-1/6">
                Estimasi Durasi
              </th>
              <th scope="col" className="py-3 px-4 w-2/5">
                Ruang Lingkup Aktivitas
              </th>
              <th scope="col" className="py-3 px-4 w-1/4">
                Keluaran Utama
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-[13px]">
            {ROADMAP_PHASES.map((r, i) => (
              <tr
                key={r.phase}
                className={i % 2 === 0 ? "bg-paper" : "bg-canvas/40"}
              >
                <th scope="row" className="py-3.5 px-4 font-bold text-ink align-top">
                  {r.phase}
                </th>
                <td className="py-3.5 px-4 font-mono font-semibold text-brand align-top">
                  {r.duration}
                </td>
                <td className="py-3.5 px-4 text-ink-2 leading-relaxed align-top">
                  {r.activity}
                </td>
                <td className="py-3.5 px-4 text-ink font-medium leading-relaxed align-top">
                  {r.deliverable}
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>

        <p className="text-[12px] text-steel italic">
          * Jadwal dan estimasi durasi bersifat ilustratif. Kerangka waktu implementasi definitif ditentukan berdasarkan jumlah cabang, kesiapan integrasi ERP, dan kebijakan pengadaan instansi.
        </p>
      </div>
    </SectionShell>
  );
};
