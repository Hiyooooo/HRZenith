import React from "react";
import { Server, Database, Users, Shield, ArrowRightLeft, Radio, FileSpreadsheet } from "lucide-react";

export const ErpHub: React.FC = () => {
  return (
    <div className="bg-paper border border-line rounded-[4px] p-5 sm:p-7 space-y-6">
      <div className="border-b border-line pb-4">
        <h3 className="text-[17px] font-bold text-ink">
          Skema Hub Integrasi Enterprise & ERP
        </h3>
        <p className="text-[13px] text-steel">
          Konektor generik multi-protokol. Mengintegrasikan data kehadiran dan payroll ke sistem korporasi yang sudah ada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Sumber Data (Kiri: 3 Kolom) */}
        <div className="md:col-span-3 space-y-3">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel text-center md:text-left">
            Sumber Input Data
          </div>

          <div className="p-3.5 bg-canvas border border-line rounded-[4px] space-y-1">
            <div className="flex items-center gap-2 text-ink font-semibold text-[13px]">
              <Radio className="w-4 h-4 text-brand shrink-0" />
              <span>Mesin Fingerprint Cabang</span>
            </div>
            <p className="text-[11px] text-steel">
              Push protokol real-time & antrean sinkron offline
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-panel text-steel">
                REST API · TCP/IP
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-canvas border border-line rounded-[4px] space-y-1">
            <div className="flex items-center gap-2 text-ink font-semibold text-[13px]">
              <Users className="w-4 h-4 text-brand shrink-0" />
              <span>Portal Mandiri Karyawan</span>
            </div>
            <p className="text-[11px] text-steel">
              Pengajuan izin cuti, sakit, dan lembur
            </p>
            <div className="pt-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-panel text-steel">
                HTTPS · TLS 1.3
              </span>
            </div>
          </div>
        </div>

        {/* Konektor Tengah (Hub: 5 Kolom) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-brand text-on-brand rounded-[4px] text-center space-y-3 relative overflow-hidden border border-brand-hover">
          <div className="w-12 h-12 rounded-[4px] bg-white/10 flex items-center justify-center border border-white/20">
            <ArrowRightLeft className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-[18px] font-bold tracking-tight">HRZenith Enterprise</div>
            <p className="text-[12px] text-white/80 max-w-xs mt-1">
              Engine Validasi, Audit Trail Berantai-Hash, & Protokol Normalisasi Terpusat
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-white/15 border border-white/20">
              AES-256
            </span>
            <span className="px-2 py-0.5 rounded bg-white/15 border border-white/20">
              RBAC Granular
            </span>
            <span className="px-2 py-0.5 rounded bg-white/15 border border-white/20">
              Atomik DB
            </span>
          </div>
        </div>

        {/* Target Enterprise (Kanan: 3 Kolom) */}
        <div className="md:col-span-3 space-y-3">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel text-center md:text-left">
            Sistem Korporasi Tujuan
          </div>

          <div className="p-3 bg-canvas border border-line rounded-[4px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-steel" /> ERP Keuangan
              </span>
              <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-panel text-steel">
                SFTP / API
              </span>
            </div>
            <p className="text-[11px] text-steel">Jurnal otomatis potongan & payroll</p>
          </div>

          <div className="p-3 bg-canvas border border-line rounded-[4px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-steel" /> SSO & IDP
              </span>
              <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-panel text-steel">
                SAML / OIDC
              </span>
            </div>
            <p className="text-[11px] text-steel">Autentikasi terpusat & MFA</p>
          </div>

          <div className="p-3 bg-canvas border border-line rounded-[4px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-steel" /> Bank Host-to-Host
              </span>
              <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-panel text-steel">
                H2H / CSV
              </span>
            </div>
            <p className="text-[11px] text-steel">Batch transfer payroll terenkripsi</p>
          </div>

          <div className="p-3 bg-canvas border border-line rounded-[4px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-steel" /> Direktori LDAP / AD
              </span>
              <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-panel text-steel">
                LDAPS
              </span>
            </div>
            <p className="text-[11px] text-steel">Sinkronisasi struktur organisasi</p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-panel border border-line/60 rounded-[4px] text-[12px] text-steel flex items-center justify-between">
        <span>Konektor generik. Produk ERP tertentu (SAP, Oracle, Workday) dikonfirmasi saat discovery implementasi.</span>
        <span className="font-mono font-bold text-ink">Status: Siap Integrasi</span>
      </div>
    </div>
  );
};
