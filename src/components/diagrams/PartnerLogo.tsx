import React from "react";

export type PartnerId =
  | "garda-energi"
  | "arta-mandala"
  | "samudra-logistik"
  | "cendana-utama"
  | "bumi-karya"
  | "teknik-prima";

export interface PartnerLogoProps {
  id: PartnerId;
  className?: string;
}

export const PARTNERS_LIST: Array<{ id: PartnerId; name: string }> = [
  { id: "garda-energi", name: "Garda Energi Nusantara" },
  { id: "arta-mandala", name: "Arta Mandala Finansial" },
  { id: "samudra-logistik", name: "Samudra Logistik Raya" },
  { id: "cendana-utama", name: "Cendana Utama Energi" },
  { id: "bumi-karya", name: "Bumi Karya Konstruksi" },
  { id: "teknik-prima", name: "Teknik Prima Global" },
];

export const PartnerLogo: React.FC<PartnerLogoProps> = ({ id, className }) => {
  const renderGlyph = () => {
    switch (id) {
      case "garda-energi":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        );
      case "arta-mandala":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="10" width="4" height="11" rx="1" />
            <rect x="10" y="6" width="4" height="15" rx="1" />
            <rect x="17" y="2" width="4" height="19" rx="1" />
          </svg>
        );
      case "samudra-logistik":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M3.6 9h16.8" />
            <path d="M3.6 15h16.8" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
          </svg>
        );
      case "cendana-utama":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 3 21 19 3 19" />
            <line x1="12" y1="11" x2="12" y2="19" />
          </svg>
        );
      case "bumi-karya":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="8" height="8" />
            <rect x="13" y="3" width="8" height="8" />
            <rect x="3" y="13" width="8" height="8" />
            <rect x="13" y="13" width="8" height="8" />
          </svg>
        );
      case "teknik-prima":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        );
    }
  };

  const partner = PARTNERS_LIST.find((p) => p.id === id);

  return (
    <div
      className={`inline-flex items-center gap-2 text-steel select-none ${className || ""}`}
      title={`${partner?.name} (Organisasi Ilustratif)`}
    >
      <div className="shrink-0">{renderGlyph()}</div>
      <span className="font-bold text-[13px] tracking-tight uppercase leading-tight line-clamp-1">
        {partner?.name}
      </span>
    </div>
  );
};
