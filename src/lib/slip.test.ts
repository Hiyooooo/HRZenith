import { describe, it, expect } from "vitest";
import { lookupTER_A, computeSlip, SLIP_BUDI_FIXTURE } from "./slip";

describe("payroll slip and TER A calculation", () => {
  it("determines correct TER A rates according to brackets", () => {
    expect(lookupTER_A(5400000)).toBe(0);
    expect(lookupTER_A(5650000)).toBe(0.25);
    expect(lookupTER_A(11200000)).toBe(3.5);
    expect(lookupTER_A(15100000)).toBe(6.0);
    expect(() => lookupTER_A(15200000)).toThrow(RangeError);
  });

  it("computes Budi Santoso fixture accurately according to test vector", () => {
    const slip = computeSlip(9000000, 1000000, 1200000);
    expect(slip.bruto).toBe(11200000);
    expect(slip.tarifTerPercent).toBe(3.5);
    expect(slip.pph21).toBe(392000);
    expect(slip.bpjsTk).toBe(300000);
    expect(slip.bpjsKes).toBe(100000);
    expect(slip.bersih).toBe(10408000);

    expect(SLIP_BUDI_FIXTURE.bersih).toBe(10408000);
  });
});
