import React from "react";
import { Cloud, Wifi, WifiOff } from "lucide-react";

interface BranchNode {
  id: string;
  name: string;
  zone: "WIB" | "WITA" | "WIT";
  x: number; // percentage
  y: number; // percentage
  isOnline: boolean;
  machines: number;
}

const BRANCH_NODES: BranchNode[] = [
  { id: "mdn", name: "Medan", zone: "WIB", x: 12, y: 35, isOnline: true, machines: 9 },
  { id: "jkt", name: "Jakarta", zone: "WIB", x: 28, y: 72, isOnline: true, machines: 18 },
  { id: "sby", name: "Surabaya", zone: "WIB", x: 44, y: 78, isOnline: true, machines: 12 },
  { id: "bpn", name: "Balikpapan", zone: "WITA", x: 50, y: 45, isOnline: true, machines: 6 },
  { id: "dps", name: "Denpasar", zone: "WITA", x: 58, y: 82, isOnline: true, machines: 5 },
  { id: "mks", name: "Makassar", zone: "WITA", x: 68, y: 55, isOnline: true, machines: 8 },
  { id: "jyp", name: "Jayapura", zone: "WIT", x: 90, y: 50, isOnline: false, machines: 4 },
];

export interface BranchMapProps {
  isJayapuraConnected?: boolean;
}

export const BranchMap: React.FC<BranchMapProps> = ({ isJayapuraConnected = false }) => {
  return (
    <div className="bg-canvas border border-line rounded-[4px] p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
            Topologi Jaringan Kehadiran
          </span>
          <span className="text-[14px] font-bold text-ink">
            Peta Skematik 7 Cabang Nasional & Sinkronisasi Cloud
          </span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-panel text-steel border border-line">
          Skematik, bukan peta
        </span>
      </div>

      {/* Area Skematik Visual */}
      <div className="relative w-full h-[260px] bg-paper border border-line rounded-[4px] overflow-hidden p-4 select-none">
        {/* Pola Titik Grid Latar */}
        <svg
          className="absolute inset-0 w-full h-full text-line/40"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dot-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>

        {/* Zona Waktu Vertikal Divider Lines */}
        <div className="absolute top-0 bottom-0 left-[48%] border-r border-dashed border-line/60 z-0 flex items-start p-2">
          <span className="font-mono text-[10px] text-steel font-bold bg-panel/80 px-1 rounded">
            Garis Batas WITA
          </span>
        </div>
        <div className="absolute top-0 bottom-0 left-[80%] border-r border-dashed border-line/60 z-0 flex items-start p-2">
          <span className="font-mono text-[10px] text-steel font-bold bg-panel/80 px-1 rounded">
            Garis Batas WIT
          </span>
        </div>

        {/* Server Cloud Pusat (Tengah Atas) */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-[4px] bg-brand text-on-brand flex items-center justify-center border border-brand-hover shadow-none">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <span className="text-[11px] font-bold font-mono text-ink mt-1 bg-paper/90 px-1.5 py-0.5 rounded border border-line/80">
            Server Cloud Pusat (WIB)
          </span>
        </div>

        {/* Garis Koneksi SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          {BRANCH_NODES.map((b) => {
            const isOnline = b.id === "jyp" ? isJayapuraConnected : b.isOnline;
            return (
              <line
                key={`line-${b.id}`}
                x1="50%"
                y1="36"
                x2={`${b.x}%`}
                y2={`${b.y}%`}
                stroke={isOnline ? "var(--brand)" : "var(--danger)"}
                strokeWidth="1.5"
                strokeDasharray={isOnline ? undefined : "4 3"}
                opacity={isOnline ? 0.35 : 0.8}
              />
            );
          })}
        </svg>

        {/* Simpul Cabang */}
        {BRANCH_NODES.map((b) => {
          const isOnline = b.id === "jyp" ? isJayapuraConnected : b.isOnline;
          return (
            <div
              key={b.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              <div
                className={`w-6 h-6 rounded-[4px] flex items-center justify-center border text-[10px] font-bold ${
                  isOnline
                    ? "bg-paper text-brand border-brand"
                    : "bg-danger-bg text-danger border-danger"
                }`}
              >
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 stroke-[2]" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 stroke-[2]" />
                )}
              </div>
              <div className="text-center mt-1 bg-paper/90 px-1 py-0.5 rounded border border-line/60">
                <span className="text-[11px] font-semibold text-ink block leading-tight">
                  {b.name}
                </span>
                <span className="text-[9px] font-mono text-steel block">
                  {b.zone} · {b.machines} msn
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between text-[12px] text-steel gap-2 pt-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand inline-block" />
            <span>Cabang Terhubung & Sinkron</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger inline-block" />
            <span>Offline (Antrean Log Ditampung)</span>
          </span>
        </div>
        <span className="font-mono text-[11px]">Normalisasi Acuan Waktu: WIB (UTC+7)</span>
      </div>
    </div>
  );
};
