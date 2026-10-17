export type EvaluatorGroup = "atasan" | "rekan" | "bawahan" | "diri";

export interface DimensionsScores {
  integritas: number;
  kepemimpinan: number;
  keputusan: number;
  kolaborasi: number;
  orientasiHasil: number;
}

export interface OfficialEvaluation {
  id: string;
  name: string;
  position: string;
  manajerial: number;
  sosialKultural: number;
  teknis: number;
  rataRata: number;
  rekomendasi: string;
}

export const GROUP_SCORES: Record<EvaluatorGroup, number[]> = {
  atasan: [4.5, 4.0, 4.0, 4.5, 4.0], // Rata-rata 4.2
  rekan: [4.0, 3.5, 4.0, 4.0, 3.5], // Rata-rata 3.8
  bawahan: [4.0, 3.0, 3.5, 3.5, 4.0], // Rata-rata 3.6
  diri: [4.5, 4.5, 4.5, 4.5, 4.5], // Rata-rata 4.5 (pembanding)
};

export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}

export function computeSkorKPI(pencapaianPercent: number): number {
  const raw = pencapaianPercent / 20;
  return Math.max(0, Math.min(5, raw));
}

export function compute360(
  pencapaianPercent: number,
  hideBawahan = false
): {
  nilai360: number;
  skorKPI: number;
  nilaiAkhir: number;
  kategori: string;
  dimensionScores: number[];
  blindSpot: number;
} {
  const atasanAvg = average(GROUP_SCORES.atasan);
  const rekanAvg = average(GROUP_SCORES.rekan);
  const bawahanAvg = average(GROUP_SCORES.bawahan);
  const diriAvg = average(GROUP_SCORES.diri);

  let nilai360: number;
  let dimensionScores: number[];

  if (hideBawahan) {
    // Normalisasi bobot: Atasan 4/7, Rekan 3/7
    const wAtasan = 4 / 7;
    const wRekan = 3 / 7;
    nilai360 = wAtasan * atasanAvg + wRekan * rekanAvg;

    dimensionScores = [0, 1, 2, 3, 4].map((i) => {
      return wAtasan * GROUP_SCORES.atasan[i] + wRekan * GROUP_SCORES.rekan[i];
    });
  } else {
    // Bobot default: Atasan 40%, Rekan 30%, Bawahan 30%
    nilai360 = 0.4 * atasanAvg + 0.3 * rekanAvg + 0.3 * bawahanAvg;

    dimensionScores = [0, 1, 2, 3, 4].map((i) => {
      return (
        0.4 * GROUP_SCORES.atasan[i] +
        0.3 * GROUP_SCORES.rekan[i] +
        0.3 * GROUP_SCORES.bawahan[i]
      );
    });
  }

  const skorKPI = computeSkorKPI(pencapaianPercent);
  const nilaiAkhir = 0.6 * skorKPI + 0.4 * nilai360;
  const kat = kategori(nilaiAkhir);
  const blindSpot = diriAvg - nilai360;

  return {
    nilai360,
    skorKPI,
    nilaiAkhir,
    kategori: kat,
    dimensionScores,
    blindSpot,
  };
}

export function kategori(score: number): string {
  if (score >= 4.0) return "Layak";
  if (score >= 3.0) return "Layak dengan pengembangan";
  return "Belum layak";
}

export const OFFICIALS_FIXTURES: OfficialEvaluation[] = [
  {
    id: "sari",
    name: "Sari Utami",
    position: "General Manager",
    manajerial: 4.5,
    sosialKultural: 4.2,
    teknis: 4.0,
    rataRata: 4.23,
    rekomendasi: "Layak",
  },
  {
    id: "andi",
    name: "Andi Wijaya",
    position: "Manager",
    manajerial: 4.0,
    sosialKultural: 3.8,
    teknis: 4.2,
    rataRata: 4.0,
    rekomendasi: "Layak",
  },
  {
    id: "hadi",
    name: "Hadi Prasetyo",
    position: "Manager",
    manajerial: 3.6,
    sosialKultural: 3.4,
    teknis: 3.8,
    rataRata: 3.6,
    rekomendasi: "Layak dengan pengembangan",
  },
  {
    id: "lina",
    name: "Lina Marlina",
    position: "Kepala Seksi",
    manajerial: 2.8,
    sosialKultural: 3.0,
    teknis: 2.6,
    rataRata: 2.8,
    rekomendasi: "Belum layak",
  },
];
