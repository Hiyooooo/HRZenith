export type Role = "spv" | "manager" | "hrd";

export type LeaveType =
  | "cuti-tahunan"
  | "izin-sakit"
  | "dinas-luar-kota"
  | "dinas-luar-negeri"
  | "izin-belajar";

export function approvalChain(type: LeaveType, hari: number): Role[] {
  if (!Number.isInteger(hari)) {
    throw new RangeError(`Durasi hari harus bilangan bulat: ${hari}`);
  }

  switch (type) {
    case "cuti-tahunan":
      if (hari < 1 || hari > 14) {
        throw new RangeError(
          `Cuti tahunan harus dalam rentang 1-14 hari: ${hari}`
        );
      }
      return hari <= 3 ? ["spv", "manager"] : ["spv", "manager", "hrd"];

    case "izin-sakit":
      if (hari < 1 || hari > 14) {
        throw new RangeError(`Izin sakit harus dalam rentang 1-14 hari: ${hari}`);
      }
      return hari <= 2 ? ["spv"] : ["spv", "manager"];

    case "dinas-luar-kota":
      if (hari < 1 || hari > 14) {
        throw new RangeError(
          `Dinas luar kota harus dalam rentang 1-14 hari: ${hari}`
        );
      }
      return ["spv", "manager"];

    case "dinas-luar-negeri":
      if (hari < 1 || hari > 30) {
        throw new RangeError(
          `Dinas luar negeri harus dalam rentang 1-30 hari: ${hari}`
        );
      }
      return ["spv", "manager", "hrd"];

    case "izin-belajar":
      if (hari < 1 || hari > 365) {
        throw new RangeError(
          `Izin belajar harus dalam rentang 1-365 hari: ${hari}`
        );
      }
      return ["spv", "manager", "hrd"];

    default:
      throw new RangeError(`Tipe izin tidak dikenal: ${type}`);
  }
}
