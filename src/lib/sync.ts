export type TimeZone = "WIB" | "WITA" | "WIT";

export interface BranchRecord {
  id: string;
  name: string;
  zone: TimeZone;
  machines: number;
  rawLogs: number;
  duplicates: number;
  offlineMachines?: number;
  queueLogs?: number;
  isOnline: boolean;
}

export interface SyncSummaryResult {
  totalMachines: number;
  totalRawLogs: number;
  totalDuplicates: number;
  totalUniqueLogs: number;
  offlineMachines: number;
  queuedLogs: number;
}

export const INITIAL_BRANCHES: BranchRecord[] = [
  {
    id: "jkt",
    name: "Jakarta Pusat",
    zone: "WIB",
    machines: 18,
    rawLogs: 3420,
    duplicates: 21,
    isOnline: true,
  },
  {
    id: "sby",
    name: "Surabaya",
    zone: "WIB",
    machines: 12,
    rawLogs: 2215,
    duplicates: 14,
    isOnline: true,
  },
  {
    id: "mdn",
    name: "Medan",
    zone: "WIB",
    machines: 9,
    rawLogs: 1640,
    duplicates: 9,
    isOnline: true,
  },
  {
    id: "mks",
    name: "Makassar",
    zone: "WITA",
    machines: 8,
    rawLogs: 1188,
    duplicates: 7,
    isOnline: true,
  },
  {
    id: "bpn",
    name: "Balikpapan",
    zone: "WITA",
    machines: 6,
    rawLogs: 902,
    duplicates: 5,
    isOnline: true,
  },
  {
    id: "jyp",
    name: "Jayapura",
    zone: "WIT",
    machines: 4,
    rawLogs: 411,
    duplicates: 3,
    offlineMachines: 1,
    queueLogs: 38,
    isOnline: false,
  },
  {
    id: "dps",
    name: "Denpasar",
    zone: "WITA",
    machines: 5,
    rawLogs: 760,
    duplicates: 6,
    isOnline: true,
  },
];

export function syncSummary(branches: BranchRecord[]): SyncSummaryResult {
  let totalMachines = 0;
  let totalRawLogs = 0;
  let totalDuplicates = 0;
  let offlineMachines = 0;
  let queuedLogs = 0;

  for (const b of branches) {
    totalMachines += b.machines;
    totalRawLogs += b.rawLogs;
    totalDuplicates += b.duplicates;
    if (b.offlineMachines) offlineMachines += b.offlineMachines;
    if (b.queueLogs) queuedLogs += b.queueLogs;
  }

  const totalUniqueLogs = totalRawLogs - totalDuplicates;

  return {
    totalMachines,
    totalRawLogs,
    totalDuplicates,
    totalUniqueLogs,
    offlineMachines,
    queuedLogs,
  };
}

export function reconnectBranch(
  branches: BranchRecord[],
  branchId: string
): BranchRecord[] {
  return branches.map((b) => {
    if (b.id === branchId || b.name === branchId) {
      const addedLogs = b.queueLogs || 0;
      return {
        ...b,
        rawLogs: b.rawLogs + addedLogs,
        queueLogs: 0,
        offlineMachines: 0,
        isOnline: true,
      };
    }
    return b;
  });
}

export function toWIB(dateStr: string, timeStr: string, zone: TimeZone): string {
  // Parse date: YYYY-MM-DD
  const [year, month, day] = dateStr.split("-").map(Number);
  // Parse time: HH:mm
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Buat UTC timestamp ekuivalen
  // WIB = UTC+7, WITA = UTC+8, WIT = UTC+9
  let offsetHours = 0;
  if (zone === "WIT") {
    offsetHours = -2; // WIT ke WIB adalah -2 jam
  } else if (zone === "WITA") {
    offsetHours = -1; // WITA ke WIB adalah -1 jam
  }

  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  date.setUTCHours(date.getUTCHours() + offsetHours);

  const outYear = date.getUTCFullYear();
  const outMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const outDay = String(date.getUTCDate()).padStart(2, "0");
  const outHours = String(date.getUTCHours()).padStart(2, "0");
  const outMinutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${outYear}-${outMonth}-${outDay} ${outHours}:${outMinutes}`;
}
