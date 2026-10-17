export interface SlipDetail {
  employeeName: string;
  position: string;
  period: string;
  pokok: number;
  tunjanganJabatan: number;
  tunjanganMakanTransport: number;
  bruto: number;
  tarifTerPercent: number;
  pph21: number;
  bpjsTk: number;
  bpjsKes: number;
  bersih: number;
}

export const TER_A_BRACKETS: Array<{ limit: number; rate: number }> = [
  { limit: 5400000, rate: 0 },
  { limit: 5650000, rate: 0.25 },
  { limit: 5950000, rate: 0.5 },
  { limit: 6300000, rate: 0.75 },
  { limit: 6750000, rate: 1.0 },
  { limit: 7500000, rate: 1.25 },
  { limit: 8550000, rate: 1.5 },
  { limit: 9650000, rate: 1.75 },
  { limit: 10050000, rate: 2.0 },
  { limit: 10350000, rate: 2.25 },
  { limit: 10700000, rate: 2.5 },
  { limit: 11050000, rate: 3.0 },
  { limit: 11600000, rate: 3.5 },
  { limit: 12500000, rate: 4.0 },
  { limit: 13750000, rate: 5.0 },
  { limit: 15100000, rate: 6.0 },
];

export function lookupTER_A(bruto: number): number {
  if (bruto < 0) throw new RangeError(`Gaji bruto tidak valid: ${bruto}`);
  for (const b of TER_A_BRACKETS) {
    if (bruto <= b.limit) {
      return b.rate;
    }
  }
  throw new RangeError(
    `Penghasilan bruto ${bruto} di atas batas cakupan demo TER A (15.100.000)`
  );
}

export function computeSlip(
  pokok: number,
  tunjanganJabatan: number,
  tunjanganMakanTransport: number,
  employeeName = "Budi Santoso",
  position = "Supervisor",
  period = "Oktober 2026"
): SlipDetail {
  const bruto = pokok + tunjanganJabatan + tunjanganMakanTransport;
  const tarifTerPercent = lookupTER_A(bruto);
  const pph21 = Math.round((bruto * tarifTerPercent) / 100);

  // Upah dasar = pokok + tunjangan jabatan
  const upahDasar = pokok + tunjanganJabatan;
  const bpjsTk = Math.round(upahDasar * 0.03); // JHT 2% + JP 1%
  const bpjsKes = Math.round(upahDasar * 0.01); // BPJS Kes 1%

  const bersih = bruto - pph21 - bpjsTk - bpjsKes;

  return {
    employeeName,
    position,
    period,
    pokok,
    tunjanganJabatan,
    tunjanganMakanTransport,
    bruto,
    tarifTerPercent,
    pph21,
    bpjsTk,
    bpjsKes,
    bersih,
  };
}

export const SLIP_BUDI_FIXTURE = computeSlip(
  9000000,
  1000000,
  1200000,
  "Budi Santoso",
  "Supervisor",
  "Oktober 2026"
);

export const DEFAULT_SLIP_PASSWORD = "15081990";
