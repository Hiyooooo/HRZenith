import { describe, it, expect } from "vitest";
import {
  MONTHLY_TAX_2025,
  INITIAL_A1_TOTAL,
  CORRECTED_A1_TOTAL,
  reconcileTax,
} from "./compliance";

describe("tax compliance reconciliation", () => {
  it("detects discrepancy before March correction", () => {
    const res = reconcileTax(MONTHLY_TAX_2025, INITIAL_A1_TOTAL);
    expect(res.totalDipotong).toBe(14941000000);
    expect(res.totalA1).toBe(14939750000);
    expect(res.selisih).toBe(1250000);
    expect(res.status).toBe("perlu-ditinjau");
  });

  it("becomes selaras after applying March correction", () => {
    const res = reconcileTax(MONTHLY_TAX_2025, CORRECTED_A1_TOTAL);
    expect(res.totalDipotong).toBe(14941000000);
    expect(res.totalA1).toBe(14941000000);
    expect(res.selisih).toBe(0);
    expect(res.status).toBe("selaras");
  });
});
