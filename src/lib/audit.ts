export interface AuditEntry {
  id: number;
  timestamp: string;
  actor: string;
  action: string;
  hash: string;
  prevHash: string;
  note?: string;
}

export interface VerificationResult {
  ok: boolean;
  firstBroken: number | null;
  computedHashes: string[];
  entryMatches: boolean[];
}

export const GENESIS_PAYLOAD = "GENESIS";

export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getGenesisHash(): Promise<string> {
  return sha256(GENESIS_PAYLOAD);
}

export function buildPayloadString(
  prevHash: string,
  actor: string,
  action: string,
  timestamp: string
): string {
  return `${prevHash}|${actor}|${action}|${timestamp}`;
}

export async function computeEntryHash(
  prevHash: string,
  actor: string,
  action: string,
  timestamp: string
): Promise<string> {
  const payload = buildPayloadString(prevHash, actor, action, timestamp);
  return sha256(payload);
}

export async function verifyChain(
  chain: AuditEntry[]
): Promise<VerificationResult> {
  if (chain.length === 0) {
    return {
      ok: true,
      firstBroken: null,
      computedHashes: [],
      entryMatches: [],
    };
  }

  const computedHashes: string[] = [];
  const entryMatches: boolean[] = [];
  let prevComputed = await getGenesisHash();
  let firstBroken: number | null = null;
  let allOk = true;

  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i];
    const expectedHash = await computeEntryHash(
      prevComputed,
      entry.actor,
      entry.action,
      entry.timestamp
    );
    computedHashes.push(expectedHash);

    const matches = expectedHash.toLowerCase() === entry.hash.toLowerCase();
    entryMatches.push(matches);

    if (!matches) {
      allOk = false;
      if (firstBroken === null) {
        firstBroken = i + 1; // 1-indexed (nomor entri)
      }
    }

    // Untuk verifikasi maju berantai, rantai selanjutnya dihitung dari hasil perhitungan maju
    prevComputed = expectedHash;
  }

  return {
    ok: allOk,
    firstBroken,
    computedHashes,
    entryMatches,
  };
}
