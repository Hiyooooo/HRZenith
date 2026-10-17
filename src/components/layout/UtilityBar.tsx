import React from "react";
import { ShieldAlert, Mail } from "lucide-react";

export interface UtilityBarProps {
  email: string;
}

export const UtilityBar: React.FC<UtilityBarProps> = ({ email }) => {
  return (
    <aside
      aria-label="Informasi Perusahaan dan Dokumen Keamanan"
      className="hidden sm:block bg-panel border-b border-line text-[13px] text-steel"
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-9 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand inline-block" />
          <span className="font-semibold text-ink">
            Platform HRIS Enterprise · Indonesia
          </span>
          <span className="text-line-2">|</span>
          <span className="text-steel">Standar Kepatuhan Korporasi & BUMN</span>
        </div>

        <nav aria-label="Akses Cepat Dokumen Keamanan" className="flex items-center gap-4">
          <a
            href={`mailto:${email}?subject=Minta%20Dokumen%20Keamanan%20HRZenith`}
            className="flex items-center gap-1.5 hover:text-brand transition-colors text-ink font-medium"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-brand" />
            <span>Dokumen Keamanan</span>
          </a>
          <span className="text-line-2">|</span>
          <a
            href="#konsultasi"
            className="flex items-center gap-1.5 hover:text-brand transition-colors text-ink font-medium"
          >
            <Mail className="w-3.5 h-3.5 text-brand" />
            <span>Hubungi Sales</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};
