import { describe, it, expect } from "vitest";
import { parseRevalidate } from "./env";

describe("parseRevalidate", () => {
  it("parses valid numbers in range", () => {
    expect(parseRevalidate("300")).toBe(300);
    expect(parseRevalidate(" 120 ")).toBe(120);
    expect(parseRevalidate("60")).toBe(60);
    expect(parseRevalidate("86400")).toBe(86400);
  });

  it("falls back to 300 on invalid or out-of-range input", () => {
    expect(parseRevalidate(undefined)).toBe(300);
    expect(parseRevalidate("")).toBe(300);
    expect(parseRevalidate("abc")).toBe(300);
    expect(parseRevalidate("0")).toBe(300);
    expect(parseRevalidate("-5")).toBe(300);
    expect(parseRevalidate("12.5")).toBe(300);
    expect(parseRevalidate("86401")).toBe(300);
  });
});
