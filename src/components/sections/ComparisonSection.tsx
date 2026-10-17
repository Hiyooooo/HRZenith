import React from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { DataTable } from "@/components/ui/DataTable";
import { COMPARISON_DATA } from "@/lib/data";
import { StatusChip } from "@/components/ui/StatusChip";

export const ComparisonSection: React.FC = () => {
  return (
    <SectionShell
      id="perbandingan"
      number="4.0"
      title="Perbandingan pendekatan pengelolaan SDM."
      description="Evaluasi matriks kapabilitas tata kelola berdasarkan kebutuhan audit ketat dan standar operasional korporasi."
      bg="paper"
    >
      <div className="space-y-4">
        <DataTable caption="Matriks Perbandingan Pendekatan SDM" hideCaption>
          <thead>
            <tr className="bg-panel border-b border-line text-[12px] font-bold uppercase tracking-wider text-steel">
              <th scope="col" className="py-3.5 px-4 w-1/4">
                Aspek Tata Kelola
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/4">
                Proses Manual
              </th>
              <th scope="col" className="py-3.5 px-4 w-1/4">
                HRIS Konvensional
              </th>
              <th
                scope="col"
                className="py-3.5 px-4 w-1/4 bg-brand-tint text-brand border-x-2 border-brand font-bold"
              >
                HRZenith Enterprise
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-[13px]">
            {COMPARISON_DATA.map((row, i) => (
              <tr
                key={row.aspect}
                className={i % 2 === 0 ? "bg-paper" : "bg-canvas/40"}
              >
                <th scope="row" className="py-3.5 px-4 font-bold text-ink align-top">
                  {row.aspect}
                </th>
                <td className="py-3.5 px-4 align-top space-y-1.5">
                  <StatusChip status={row.manual.status} text="Tidak Ada" />
                  <p className="text-[12px] text-steel leading-snug">
                    {row.manual.text}
                  </p>
                </td>
                <td className="py-3.5 px-4 align-top space-y-1.5">
                  <StatusChip
                    status={row.commonHris.status}
                    text={row.commonHris.status === "warn" ? "Sebagian" : "Tidak Ada"}
                  />
                  <p className="text-[12px] text-steel leading-snug">
                    {row.commonHris.text}
                  </p>
                </td>
                <td className="py-3.5 px-4 align-top space-y-1.5 bg-brand-tint/20 border-x-2 border-brand font-medium">
                  <StatusChip status="ok" text="Penuh" />
                  <p className="text-[12px] text-ink font-semibold leading-snug">
                    {row.hrzenith.text}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>

        {/* KLAIM: tinjau ulang pernyataan perbandingan */}
        <p className="text-[12px] text-steel italic">
          * Istilah &quot;HRIS Konvensional&quot; merujuk pada platform umum tanpa modul audit trail kriptografis atau kepatuhan berjenjang; bukan perbandingan terhadap merek dagang spesifik. Penilaian bersifat ilustratif untuk studi kapabilitas tata kelola.
        </p>
      </div>
    </SectionShell>
  );
};
