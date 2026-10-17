import { describe, it, expect } from "vitest";
import { canView, LIBRARY_DOCUMENTS } from "./library";

describe("library document access control", () => {
  it("enforces role permissions correctly", () => {
    // Karyawan
    expect(canView("karyawan", "Publik")).toBe(true);
    expect(canView("karyawan", "Internal")).toBe(true);
    expect(canView("karyawan", "Rahasia")).toBe(false);
    expect(canView("karyawan", "Sangat Rahasia")).toBe(false);

    // Manajer
    expect(canView("manajer", "Publik")).toBe(true);
    expect(canView("manajer", "Internal")).toBe(true);
    expect(canView("manajer", "Rahasia")).toBe(true);
    expect(canView("manajer", "Sangat Rahasia")).toBe(false);

    // HRD & Auditor
    expect(canView("hrd", "Sangat Rahasia")).toBe(true);
    expect(canView("auditor", "Sangat Rahasia")).toBe(true);
  });

  it("allows Karyawan to view exactly 6 documents out of 10", () => {
    const visibleDocs = LIBRARY_DOCUMENTS.filter((doc) =>
      canView("karyawan", doc.classification)
    );
    expect(visibleDocs).toHaveLength(6);
    const visibleNumbers = visibleDocs.map((d) => d.number);
    expect(visibleNumbers).toEqual([
      "ISO-IS-001",
      "ISO-QM-002",
      "SK-014/DIR/2026",
      "KB-003",
      "KB-007",
      "KB-011",
    ]);
  });
});
