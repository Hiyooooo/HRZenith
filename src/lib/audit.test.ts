import { describe, it, expect } from "vitest";
import {
  sha256,
  getGenesisHash,
  computeEntryHash,
  verifyChain,
  type AuditEntry,
} from "./audit";

describe("audit chain SHA-256", () => {
  it("matches genesis hash vector", async () => {
    const genesis = await getGenesisHash();
    expect(genesis).toBe(
      "901131d838b17aac0f7885b81e03cbdc9f5157a00343d30ab22083685ed1416a"
    );
  });

  it("computes entry #1 full hash vector", async () => {
    const genesis = await getGenesisHash();
    const hash1 = await computeEntryHash(
      genesis,
      "Rina Kusumawati (Staff)",
      "DIAJUKAN",
      "2026-10-19T08:15:00+07:00"
    );
    expect(hash1).toBe(
      "b71a50df698bb59d9e33fdbffab5b23cd7a1393759b3e81537aa593a182c2bf9"
    );
    expect(hash1.slice(0, 8)).toBe("b71a50df");
  });

  it("verifies intact default path (5 entries)", async () => {
    const genesis = await getGenesisHash();

    const h1 = await computeEntryHash(
      genesis,
      "Rina Kusumawati (Staff)",
      "DIAJUKAN",
      "2026-10-19T08:15:00+07:00"
    );
    const h2 = await computeEntryHash(
      h1,
      "Sistem",
      "VALIDASI_KEBIJAKAN_LULUS",
      "2026-10-19T09:02:00+07:00"
    );
    const h3 = await computeEntryHash(
      h2,
      "Budi Santoso (Supervisor)",
      "DISETUJUI",
      "2026-10-19T10:40:00+07:00"
    );
    const h4 = await computeEntryHash(
      h3,
      "Andi Wijaya (Manager)",
      "DISETUJUI",
      "2026-10-20T08:55:00+07:00"
    );
    const h5 = await computeEntryHash(
      h4,
      "Maya Anggraeni (HRD Director)",
      "DISETUJUI_FINAL",
      "2026-10-20T14:20:00+07:00"
    );

    expect(h1.slice(0, 8)).toBe("b71a50df");
    expect(h2.slice(0, 8)).toBe("126bf3f4");
    expect(h3.slice(0, 8)).toBe("7847ee62");
    expect(h4.slice(0, 8)).toBe("60ec6765");
    expect(h5.slice(0, 8)).toBe("fa1c6fc4");

    const chain: AuditEntry[] = [
      {
        id: 1,
        timestamp: "2026-10-19T08:15:00+07:00",
        actor: "Rina Kusumawati (Staff)",
        action: "DIAJUKAN",
        prevHash: genesis,
        hash: h1,
      },
      {
        id: 2,
        timestamp: "2026-10-19T09:02:00+07:00",
        actor: "Sistem",
        action: "VALIDASI_KEBIJAKAN_LULUS",
        prevHash: h1,
        hash: h2,
      },
      {
        id: 3,
        timestamp: "2026-10-19T10:40:00+07:00",
        actor: "Budi Santoso (Supervisor)",
        action: "DISETUJUI",
        prevHash: h2,
        hash: h3,
      },
      {
        id: 4,
        timestamp: "2026-10-20T08:55:00+07:00",
        actor: "Andi Wijaya (Manager)",
        action: "DISETUJUI",
        prevHash: h3,
        hash: h4,
      },
      {
        id: 5,
        timestamp: "2026-10-20T14:20:00+07:00",
        actor: "Maya Anggraeni (HRD Director)",
        action: "DISETUJUI_FINAL",
        prevHash: h4,
        hash: h5,
      },
    ];

    const result = await verifyChain(chain);
    expect(result.ok).toBe(true);
    expect(result.firstBroken).toBeNull();
    expect(result.entryMatches).toEqual([true, true, true, true, true]);
  });

  it("detects tampering when entry #3 action is altered to DITOLAK without updating stored hash", async () => {
    const genesis = await getGenesisHash();

    const h1 = await computeEntryHash(
      genesis,
      "Rina Kusumawati (Staff)",
      "DIAJUKAN",
      "2026-10-19T08:15:00+07:00"
    );
    const h2 = await computeEntryHash(
      h1,
      "Sistem",
      "VALIDASI_KEBIJAKAN_LULUS",
      "2026-10-19T09:02:00+07:00"
    );
    const h3 = await computeEntryHash(
      h2,
      "Budi Santoso (Supervisor)",
      "DISETUJUI",
      "2026-10-19T10:40:00+07:00"
    );
    const h4 = await computeEntryHash(
      h3,
      "Andi Wijaya (Manager)",
      "DISETUJUI",
      "2026-10-20T08:55:00+07:00"
    );
    const h5 = await computeEntryHash(
      h4,
      "Maya Anggraeni (HRD Director)",
      "DISETUJUI_FINAL",
      "2026-10-20T14:20:00+07:00"
    );

    // Tampered chain: entry #3 action is DITOLAK, but hash stored remains h3
    const tamperedChain: AuditEntry[] = [
      {
        id: 1,
        timestamp: "2026-10-19T08:15:00+07:00",
        actor: "Rina Kusumawati (Staff)",
        action: "DIAJUKAN",
        prevHash: genesis,
        hash: h1,
      },
      {
        id: 2,
        timestamp: "2026-10-19T09:02:00+07:00",
        actor: "Sistem",
        action: "VALIDASI_KEBIJAKAN_LULUS",
        prevHash: h1,
        hash: h2,
      },
      {
        id: 3,
        timestamp: "2026-10-19T10:40:00+07:00",
        actor: "Budi Santoso (Supervisor)",
        action: "DITOLAK", // TAMPERED!
        prevHash: h2,
        hash: h3, // Stored hash remains original
      },
      {
        id: 4,
        timestamp: "2026-10-20T08:55:00+07:00",
        actor: "Andi Wijaya (Manager)",
        action: "DISETUJUI",
        prevHash: h3,
        hash: h4,
      },
      {
        id: 5,
        timestamp: "2026-10-20T14:20:00+07:00",
        actor: "Maya Anggraeni (HRD Director)",
        action: "DISETUJUI_FINAL",
        prevHash: h4,
        hash: h5,
      },
    ];

    const result = await verifyChain(tamperedChain);
    expect(result.ok).toBe(false);
    expect(result.firstBroken).toBe(3);
    expect(result.entryMatches).toEqual([true, true, false, false, false]);

    // Check computed 8-hex prefixes
    expect(result.computedHashes[0].slice(0, 8)).toBe("b71a50df");
    expect(result.computedHashes[1].slice(0, 8)).toBe("126bf3f4");
    expect(result.computedHashes[2].slice(0, 8)).toBe("02c60862");
    expect(result.computedHashes[3].slice(0, 8)).toBe("fd3a5eb6");
    expect(result.computedHashes[4].slice(0, 8)).toBe("e557d10b");
  });
});
