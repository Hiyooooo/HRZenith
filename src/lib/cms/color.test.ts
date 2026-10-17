import { describe, it, expect } from "vitest";
import { deriveBrand } from "./color";

describe("deriveBrand", () => {
  it("derives valid brand colors for #1E3A8A", () => {
    const res = deriveBrand("#1E3A8A");
    expect(res).toEqual({
      brand: "#1E3A8A",
      hover: "#1A3277",
      tint: "#EDEFF6",
      onBrand: "#FFFFFF",
    });
  });

  it("normalizes lowercase hex", () => {
    const res = deriveBrand("#1e3a8a");
    expect(res).toEqual({
      brand: "#1E3A8A",
      hover: "#1A3277",
      tint: "#EDEFF6",
      onBrand: "#FFFFFF",
    });
  });

  it("handles valid dark teal #0F766E", () => {
    const res = deriveBrand("#0F766E");
    expect(res).toEqual({
      brand: "#0F766E",
      hover: "#0D655F",
      tint: "#ECF4F3",
      onBrand: "#FFFFFF",
    });
  });

  it("handles valid blue #1D4ED8", () => {
    const res = deriveBrand("#1D4ED8");
    expect(res).toEqual({
      brand: "#1D4ED8",
      hover: "#1943BA",
      tint: "#EDF1FC",
      onBrand: "#FFFFFF",
    });
  });

  it("accepts various custom brand colors (orange, blue, emerald)", () => {
    const orange = deriveBrand("#F97316");
    expect(orange).not.toBeNull();
    expect(orange?.brand).toBe("#F97316");

    const blue = deriveBrand("#3B82F6");
    expect(blue).not.toBeNull();
    expect(blue?.brand).toBe("#3B82F6");

    const emerald = deriveBrand("#10B981");
    expect(emerald).not.toBeNull();
    expect(emerald?.brand).toBe("#10B981");
  });

  it("rejects pure white as primary brand color", () => {
    expect(deriveBrand("#FFFFFF")).toBeNull();
  });

  it("rejects invalid hex formats", () => {
    expect(deriveBrand("1E3A8A")).toBeNull();
    expect(deriveBrand("blue")).toBeNull();
    expect(deriveBrand("#12345")).toBeNull();
    expect(deriveBrand("#1E3A8AFF")).toBeNull();
  });
});
