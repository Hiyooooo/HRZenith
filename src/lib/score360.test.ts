import { describe, it, expect } from "vitest";
import { compute360, computeSkorKPI, kategori } from "./score360";

describe("score360 evaluation", () => {
  it("computes default values correctly with KPI 88%", () => {
    const res = compute360(88, false);

    expect(Number(res.nilai360.toFixed(2))).toBe(3.9);
    expect(res.skorKPI).toBe(4.4);
    expect(Number(res.nilaiAkhir.toFixed(2))).toBe(4.2);
    expect(res.kategori).toBe("Layak");

    // Dimension combined scores: [4.20, 3.55, 3.85, 4.05, 3.85]
    expect(res.dimensionScores.map((s) => Number(s.toFixed(2)))).toEqual([
      4.2, 3.55, 3.85, 4.05, 3.85,
    ]);

    expect(Number(res.blindSpot.toFixed(2))).toBe(0.6);
  });

  it("handles normalized weights when bawahan is hidden (<3 evaluators)", () => {
    const res = compute360(88, true);

    expect(Number(res.nilai360.toFixed(2))).toBe(4.03);
    expect(res.skorKPI).toBe(4.4);
    expect(Number(res.nilaiAkhir.toFixed(2))).toBe(4.25);
    expect(res.kategori).toBe("Layak");
  });

  it("handles KPI thresholds and categories", () => {
    expect(computeSkorKPI(60)).toBe(3.0);
    expect(computeSkorKPI(40)).toBe(2.0);
    expect(computeSkorKPI(120)).toBe(5.0); // clamped at 5.0

    expect(kategori(4.2)).toBe("Layak");
    expect(kategori(3.36)).toBe("Layak dengan pengembangan");
    expect(kategori(2.76)).toBe("Belum layak");
  });
});
