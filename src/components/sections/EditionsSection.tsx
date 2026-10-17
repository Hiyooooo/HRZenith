import React from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { DataTable } from "@/components/ui/DataTable";
import { EDITIONS_DATA } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

export interface EditionsSectionProps {
  email: string;
}

export const EditionsSection: React.FC<EditionsSectionProps> = ({ email }) => {
  return (
    <SectionShell
      id="edisi"
      number="5.0"
      title="Edisi sesuai skala dan regulasi organisasi."
      description="Tanpa daftar harga publik: model lisensi dikonfigurasi berdasarkan jumlah tenaga kerja aktif, cakupan modul, dan persyaratan residensi data."
      bg="canvas"
    >
      <div className="space-y-6">
        <DataTable caption="Matriks Edisi dan Opsi Deployment" hideCaption>
          <thead>
            <tr className="bg-panel border-b border-line text-[12px] font-bold uppercase tracking-wider text-steel">
              <th scope="col" className="py-3.5 px-4 w-1/4">
                Parameter Arsitektur
              </th>
              {EDITIONS_DATA.map((ed) => (
                <th
                  key={ed.name}
                  scope="col"
                  className={`py-3.5 px-4 w-1/4 text-center ${
                    ed.isPopular
                      ? "bg-brand-tint text-brand border-x-2 border-brand font-bold"
                      : "text-ink"
                  }`}
                >
                  <div className="text-[15px]">{ed.name}</div>
                  {ed.isPopular && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand block mt-0.5">
                      Paling Banyak Dipilih
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-[13px]">
            <tr>
              <th scope="row" className="py-3 px-4 font-bold text-ink bg-panel/30">
                Model Deployment
              </th>
              {EDITIONS_DATA.map((ed) => (
                <td
                  key={`${ed.name}-dep`}
                  className={`py-3 px-4 text-center font-medium ${
                    ed.isPopular ? "bg-brand-tint/15 border-x-2 border-brand" : ""
                  }`}
                >
                  {ed.deployment}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="py-3 px-4 font-bold text-ink bg-panel/30">
                Residensi Data
              </th>
              {EDITIONS_DATA.map((ed) => (
                <td
                  key={`${ed.name}-res`}
                  className={`py-3 px-4 text-center ${
                    ed.isPopular ? "bg-brand-tint/15 border-x-2 border-brand" : ""
                  }`}
                >
                  {ed.residency}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="py-3 px-4 font-bold text-ink bg-panel/30">
                Autentikasi SSO
              </th>
              {EDITIONS_DATA.map((ed) => (
                <td
                  key={`${ed.name}-sso`}
                  className={`py-3 px-4 text-center ${
                    ed.isPopular ? "bg-brand-tint/15 border-x-2 border-brand" : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-1 font-semibold text-ink">
                    <Check className="w-3.5 h-3.5 text-brand" /> {ed.sso}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="py-3 px-4 font-bold text-ink bg-panel/30">
                Retensi Audit Trail
              </th>
              {EDITIONS_DATA.map((ed) => (
                <td
                  key={`${ed.name}-ret`}
                  className={`py-3 px-4 text-center font-mono ${
                    ed.isPopular ? "bg-brand-tint/15 border-x-2 border-brand font-semibold" : ""
                  }`}
                >
                  {ed.retention}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="py-3 px-4 font-bold text-ink bg-panel/30">
                Entitas & Cabang
              </th>
              {EDITIONS_DATA.map((ed) => (
                <td
                  key={`${ed.name}-ent`}
                  className={`py-3 px-4 text-center ${
                    ed.isPopular ? "bg-brand-tint/15 border-x-2 border-brand" : ""
                  }`}
                >
                  {ed.entities}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="py-3 px-4 font-bold text-ink bg-panel/30">
                Integrasi ERP
              </th>
              {EDITIONS_DATA.map((ed) => (
                <td
                  key={`${ed.name}-erp`}
                  className={`py-3 px-4 text-center text-[12px] ${
                    ed.isPopular ? "bg-brand-tint/15 border-x-2 border-brand" : ""
                  }`}
                >
                  {ed.erp}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="py-3 px-4 font-bold text-ink bg-panel/30">
                Tingkat Dukungan SLA
              </th>
              {EDITIONS_DATA.map((ed) => (
                <td
                  key={`${ed.name}-sup`}
                  className={`py-3 px-4 text-center text-[12px] ${
                    ed.isPopular ? "bg-brand-tint/15 border-x-2 border-brand font-semibold" : ""
                  }`}
                >
                  {ed.support}
                </td>
              ))}
            </tr>
          </tbody>
        </DataTable>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <p className="text-[12px] text-steel italic">
            * Seluruh ketentuan matriks edisi bersifat ilustratif. Spesifikasi arsitektur final ditetapkan bersama tim pengadaan dan CISO instansi Anda.
          </p>
          <Button
            href={`mailto:${email}?subject=Konsultasi%20Edisi%20Deployment%20HRZenith`}
            variant="primary"
            className="text-[14px]"
          >
            Jadwalkan Konsultasi Edisi
          </Button>
        </div>
      </div>
    </SectionShell>
  );
};
