import { describe, it, expect } from "vitest";
import { approvalChain } from "./approval";

describe("approvalChain", () => {
  it("determines correct chain for cuti-tahunan", () => {
    expect(approvalChain("cuti-tahunan", 3)).toEqual(["spv", "manager"]);
    expect(approvalChain("cuti-tahunan", 4)).toEqual(["spv", "manager", "hrd"]);
    expect(approvalChain("cuti-tahunan", 14)).toEqual(["spv", "manager", "hrd"]);
  });

  it("throws RangeError for invalid cuti-tahunan duration", () => {
    expect(() => approvalChain("cuti-tahunan", 0)).toThrow(RangeError);
    expect(() => approvalChain("cuti-tahunan", 15)).toThrow(RangeError);
    expect(() => approvalChain("cuti-tahunan", 2.5)).toThrow(RangeError);
  });

  it("determines correct chain for izin-sakit", () => {
    expect(approvalChain("izin-sakit", 2)).toEqual(["spv"]);
    expect(approvalChain("izin-sakit", 3)).toEqual(["spv", "manager"]);
  });

  it("determines correct chain for dinas-luar-kota", () => {
    expect(approvalChain("dinas-luar-kota", 5)).toEqual(["spv", "manager"]);
  });

  it("determines correct chain for dinas-luar-negeri", () => {
    expect(approvalChain("dinas-luar-negeri", 5)).toEqual(["spv", "manager", "hrd"]);
  });

  it("determines correct chain for izin-belajar", () => {
    expect(approvalChain("izin-belajar", 30)).toEqual(["spv", "manager", "hrd"]);
  });
});
