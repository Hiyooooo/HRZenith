export interface MonthlyTaxRecord {
  month: string;
  amount: number;
}

export interface ReconciliationResult {
  totalDipotong: number;
  totalA1: number;
  selisih: number;
  status: "selaras" | "perlu-ditinjau";
}

export const MONTHLY_TAX_2025: MonthlyTaxRecord[] = [
  { month: "Januari", amount: 1204300000 },
  { month: "Februari", amount: 1211850000 },
  { month: "Maret", amount: 1325400000 },
  { month: "April", amount: 1209100000 },
  { month: "Mei", amount: 1215700000 },
  { month: "Juni", amount: 1230400000 },
  { month: "Juli", amount: 1221600000 },
  { month: "Agustus", amount: 1219050000 },
  { month: "September", amount: 1226900000 },
  { month: "Oktober", amount: 1233250000 },
  { month: "November", amount: 1240800000 },
  { month: "Desember", amount: 1402650000 },
];

export const INITIAL_A1_TOTAL = 14939750000;
export const CORRECTED_A1_TOTAL = 14941000000;

export function reconcileTax(
  records: MonthlyTaxRecord[],
  totalA1: number
): ReconciliationResult {
  const totalDipotong = records.reduce((sum, r) => sum + r.amount, 0);
  const selisih = Math.abs(totalDipotong - totalA1);
  const status = selisih === 0 ? "selaras" : "perlu-ditinjau";

  return {
    totalDipotong,
    totalA1,
    selisih,
    status,
  };
}
