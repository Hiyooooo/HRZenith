import React from "react";
import Image from "next/image";
import { SectionShell } from "@/components/ui/SectionShell";
import { DataTable } from "@/components/ui/DataTable";
import { SECURITY_CONTROLS } from "@/lib/data";
import { ErpHub } from "@/components/diagrams/ErpHub";
import { ShieldCheck } from "lucide-react";

export const SecuritySection: React.FC = () => {
  return (
    <SectionShell
      id="keamanan"
      number="1.0"
      title="Keamanan dan integrasi untuk audit."
      description="Kontrol teknis dijelaskan dengan mekanisme dan kerangka acuannya, bukan sekadar janji pemasaran."
      bg="canvas"
    >
      <div className="space-y-8">
        {/* Tabel Kontrol Keamanan */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand" />
              <span>Matriks Penerapan Kontrol Keamanan Korporasi</span>
            </h3>
            <span className="text-[12px] font-mono text-steel">Standar ISO 27001 Annex A</span>
          </div>

          <DataTable caption="Matriks Kontrol Keamanan HRZenith" hideCaption>
            <thead>
              <tr className="bg-panel border-b border-line text-[12px] font-bold uppercase tracking-wider text-steel">
                <th scope="col" className="py-3 px-4 w-1/4">
                  Domain Kontrol
                </th>
                <th scope="col" className="py-3 px-4 w-1/2">
                  Penerapan Teknis pada Platform
                </th>
                <th scope="col" className="py-3 px-4 w-1/4">
                  Kerangka Acuan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-medium text-[13px] text-ink">
              {SECURITY_CONTROLS.map((ctrl, i) => (
                <tr
                  key={ctrl.control}
                  className={i % 2 === 0 ? "bg-paper" : "bg-canvas/50"}
                >
                  <th scope="row" className="py-3.5 px-4 font-bold text-ink">
                    {ctrl.control}
                  </th>
                  <td className="py-3.5 px-4 text-ink-2 leading-relaxed">
                    {ctrl.implementation}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[12px] text-steel">
                    {ctrl.reference}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          {/* KLAIM: konfirmasi dengan tim keamanan */}
          <p className="text-[13px] text-steel italic">
            * Acuan menunjukkan kerangka internasional yang dijadikan pedoman perancangan arsitektur sistem, bukan pernyataan telah diterbitkannya sertifikat resmi pihak ketiga tanpa verifikasi dokumen.
          </p>
        </div>

        {/* Highlight Infrastruktur Pusat Data */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-paper border border-line rounded-[4px] p-5 sm:p-6">
          <div className="lg:col-span-5 relative h-52 sm:h-60 rounded-[4px] overflow-hidden border border-line bg-canvas">
            <Image
              src="/images/datacenter.jpg"
              alt="Pusat Data dan Infrastruktur Server Keamanan Enterprise"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-ink/20" />
            <span className="absolute bottom-2.5 left-3 text-[11px] font-mono font-semibold text-white bg-brand/90 px-2 py-0.5 rounded shadow-sm">
              Tier-3 Datacenter · Enkripsi AES-256
            </span>
          </div>
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand">
              Infrastruktur & Keamanan Komputasi Awan
            </span>
            <h4 className="text-[17px] sm:text-[19px] font-bold text-ink">
              Pusat Data Berstandar Sovereign & Lingkungan Terisolasi
            </h4>
            <p className="text-[13px] text-steel leading-relaxed">
              Basis data setiap instansi dikarantina dalam lingkungan komputasi terisolasi dengan enkripsi ganda saat diam (at-rest) dan saat transit (in-transit). Dilengkapi audit log tamper-evident berantai-hash yang menjamin integritas rekam jejak SDM untuk audit kepatuhan internal dan pengawasan regulator.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[12px] font-mono text-ink">
              <div className="p-2 bg-canvas border border-line rounded flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>Selaras ISO 27001</span>
              </div>
              <div className="p-2 bg-canvas border border-line rounded flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>Enkripsi AES-256</span>
              </div>
              <div className="p-2 bg-canvas border border-line rounded flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>Target SLA 99,95%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagram Hub Integrasi ERP */}
        <ErpHub />
      </div>
    </SectionShell>
  );
};
