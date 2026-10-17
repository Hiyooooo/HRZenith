import React from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { ComplianceFlow } from "@/components/diagrams/ComplianceFlow";
import { Check, ArrowDown } from "lucide-react";

export const AuditFlowSection: React.FC = () => {
  return (
    <SectionShell
      id="alur-audit"
      number="2.0"
      title="Dari pengajuan sampai pemeriksaan auditor."
      description="Delapan langkah alur birokrasi, lima peran organisasi, dalam satu rantai transaksi yang dapat diverifikasi keabsahannya."
      bg="paper"
    >
      <div className="space-y-6">
        {/* Diagram Alur Kepatuhan */}
        <ComplianceFlow />

        {/* 3 Poin Kepatuhan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-canvas border border-line rounded-[4px] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[14px] text-ink">
              <Check className="w-4 h-4 text-brand shrink-0" />
              <span>Pencatatan Multidimensi</span>
            </div>
            <p className="text-[13px] text-steel leading-relaxed">
              Setiap langkah membukukan cap waktu (WIB), identitas aktor, keputusan, dan nomor versi kebijakan yang berlaku saat transaksi.
            </p>
          </div>

          <div className="p-4 bg-canvas border border-line rounded-[4px] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[14px] text-ink">
              <Check className="w-4 h-4 text-brand shrink-0" />
              <span>Integritas Kriptografis</span>
            </div>
            <p className="text-[13px] text-steel leading-relaxed">
              Catatan transaksi diikat berantai-hash SHA-256. Setiap modifikasi data di tengah rantai seketika membatalkan validitas entri berikutnya.
            </p>
          </div>

          <div className="p-4 bg-canvas border border-line rounded-[4px] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[14px] text-ink">
              <Check className="w-4 h-4 text-brand shrink-0" />
              <span>Akses Mandiri Auditor</span>
            </div>
            <p className="text-[13px] text-steel leading-relaxed">
              Auditor internal dan eksternal dapat mengekspor log dan menjalankan audit integritas mandiri tanpa perlu bergantung pada bantuan pengembang TI.
            </p>
          </div>
        </div>

        {/* Tautan Coba Verifikasi */}
        <div className="pt-2 text-center sm:text-left">
          <a
            href="#modul"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand underline underline-offset-4 decoration-1 hover:text-brand-hover"
          >
            <span>Coba simulasi verifikasi integritas rantai di modul Perizinan</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
};
