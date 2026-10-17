import React from "react";
import { GROUP_SCORES } from "@/lib/score360";

export interface Radar360Props {
  hideBawahan?: boolean;
  size?: number;
}

const DIMENSIONS = [
  "Integritas",
  "Kepemimpinan",
  "Pengambilan Keputusan",
  "Kolaborasi",
  "Orientasi Hasil",
];

export const Radar360: React.FC<Radar360Props> = ({
  hideBawahan = false,
  size = 320,
}) => {
  const center = 160;
  const maxRadius = 105;
  const totalLevels = 5;

  const getCoordinates = (index: number, value: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;
    const r = (value / 5) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const getPolygonPoints = (scores: number[]) => {
    return scores
      .map((score, i) => {
        const { x, y } = getCoordinates(i, score);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  const atasanPoints = getPolygonPoints(GROUP_SCORES.atasan);
  const rekanPoints = getPolygonPoints(GROUP_SCORES.rekan);
  const bawahanPoints = getPolygonPoints(GROUP_SCORES.bawahan);
  const diriPoints = getPolygonPoints(GROUP_SCORES.diri);

  return (
    <div className="bg-paper border border-line rounded-[4px] p-4 sm:p-5 flex flex-col items-center">
      <div className="w-full text-left mb-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
          Pemetaan Asesmen 360°
        </span>
        <h4 className="text-[15px] font-bold text-ink">
          Radar 5 Dimensi Kompetensi Manajerial
        </h4>
      </div>

      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full select-none"
          role="img"
          aria-label="Radar 5 sumbu evaluasi 360 derajat"
        >
          {/* Level Grid Pentagons (1 s.d. 5) */}
          {[1, 2, 3, 4, 5].map((lvl) => {
            const levelPoints = [0, 1, 2, 3, 4]
              .map((i) => {
                const { x, y } = getCoordinates(i, lvl);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(" ");
            return (
              <polygon
                key={`lvl-${lvl}`}
                points={levelPoints}
                fill={lvl === 5 ? "var(--canvas)" : "none"}
                stroke="var(--line)"
                strokeWidth={lvl === 5 ? "1.5" : "1"}
                strokeDasharray={lvl === 5 ? undefined : "2 2"}
                opacity={0.7}
              />
            );
          })}

          {/* Sumbu Roda Jari-Jari (Spokes) */}
          {[0, 1, 2, 3, 4].map((i) => {
            const { x, y } = getCoordinates(i, 5);
            return (
              <line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="var(--line-2)"
                strokeWidth="1"
              />
            );
          })}

          {/* Poligon Diri Sendiri (Pembanding, Abu-Abu Solid tipis) */}
          <polygon
            points={diriPoints}
            fill="none"
            stroke="var(--control)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Poligon Bawahan (Dotted Line) */}
          {!hideBawahan && (
            <polygon
              points={bawahanPoints}
              fill="rgba(146, 64, 14, 0.08)"
              stroke="var(--warn)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          )}

          {/* Poligon Rekan (Dashed Line) */}
          <polygon
            points={rekanPoints}
            fill="rgba(71, 85, 105, 0.12)"
            stroke="var(--steel)"
            strokeWidth="2"
            strokeDasharray="6 3"
          />

          {/* Poligon Atasan (Solid Brand Blue) */}
          <polygon
            points={atasanPoints}
            fill="rgba(30, 58, 138, 0.18)"
            stroke="var(--brand)"
            strokeWidth="2.5"
          />

          {/* Label Sumbu (5 Dimensi) */}
          {DIMENSIONS.map((dim, i) => {
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
            const labelR = maxRadius + 28;
            const x = center + labelR * Math.cos(angle);
            const y = center + labelR * Math.sin(angle);

            let textAnchor: "middle" | "start" | "end" = "middle";
            if (Math.cos(angle) > 0.3) textAnchor = "start";
            if (Math.cos(angle) < -0.3) textAnchor = "end";

            return (
              <text
                key={dim}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="central"
                className="text-[10px] sm:text-[11px] font-bold fill-[var(--ink)] tracking-tight"
              >
                {dim}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legenda Radar */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2 border-t border-line mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-brand inline-block" />
          <span className="font-semibold text-ink">Atasan (40%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-steel inline-block" />
          <span className="font-semibold text-ink">Rekan (30%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-4 h-0.5 border-t-2 border-dotted border-warn inline-block ${
              hideBawahan ? "opacity-30" : ""
            }`}
          />
          <span className={`font-semibold ${hideBawahan ? "line-through text-steel" : "text-ink"}`}>
            Bawahan (30%)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 border-t border-dashed border-control inline-block" />
          <span className="font-semibold text-steel">Diri (Pembanding)</span>
        </div>
      </div>
    </div>
  );
};
