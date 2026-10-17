import React from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export interface WhatsAppFloatProps {
  whatsappUrl: string;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ whatsappUrl }) => {
  return (
    <aside
      aria-label="Kanal Komunikasi Cepat"
      className="fixed right-5 bottom-5 z-50 select-none print:hidden"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi HRZenith melalui WhatsApp (tab baru)"
        className="inline-flex items-center gap-2.5 h-12 px-4 sm:px-5 rounded-full bg-footer text-white border border-white/25 hover:bg-footer-2 transition-colors focus-visible:outline-white focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="text-wa-green">
          <WhatsAppIcon size={22} />
        </span>
        <span className="text-[14px] font-semibold tracking-tight">
          <span>WhatsApp</span>
          <span className="hidden sm:inline">&nbsp;Konsultasi</span>
        </span>
      </a>
    </aside>
  );
};
