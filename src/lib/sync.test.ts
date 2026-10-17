import { describe, it, expect } from "vitest";
import {
  INITIAL_BRANCHES,
  syncSummary,
  reconnectBranch,
  toWIB,
} from "./sync";

describe("attendance sync and timezone normalization", () => {
  it("calculates initial sync summary correctly", () => {
    const summary = syncSummary(INITIAL_BRANCHES);
    expect(summary.totalMachines).toBe(62);
    expect(summary.totalRawLogs).toBe(10536);
    expect(summary.totalDuplicates).toBe(65);
    expect(summary.totalUniqueLogs).toBe(10471);
    expect(summary.offlineMachines).toBe(1);
    expect(summary.queuedLogs).toBe(38);
  });

  it("updates summary after reconnecting Jayapura", () => {
    const updatedBranches = reconnectBranch(INITIAL_BRANCHES, "jyp");
    const summary = syncSummary(updatedBranches);
    expect(summary.totalRawLogs).toBe(10574);
    expect(summary.totalDuplicates).toBe(65);
    expect(summary.totalUniqueLogs).toBe(10509);
    expect(summary.offlineMachines).toBe(0);
    expect(summary.queuedLogs).toBe(0);
  });

  it("normalizes timezone to WIB correctly across all test vectors", () => {
    expect(toWIB("2026-10-19", "08:00", "WIT")).toBe("2026-10-19 06:00");
    expect(toWIB("2026-10-19", "08:00", "WITA")).toBe("2026-10-19 07:00");
    expect(toWIB("2026-10-19", "08:00", "WIB")).toBe("2026-10-19 08:00");
    expect(toWIB("2026-10-20", "00:30", "WIT")).toBe("2026-10-19 22:30");
    expect(toWIB("2026-10-19", "05:30", "WIT")).toBe("2026-10-19 03:30");
  });
});
