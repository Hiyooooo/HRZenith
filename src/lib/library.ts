export type DocumentClassification =
  | "Publik"
  | "Internal"
  | "Rahasia"
  | "Sangat Rahasia";

export type DocumentType = "ISO" | "SK Direksi" | "Kebijakan";

export type DocumentStatus = "Berlaku" | "Draft" | "Kedaluwarsa";

export type LibraryUserRole = "karyawan" | "manajer" | "hrd" | "auditor";

export interface VersionHistoryItem {
  version: string;
  date: string;
  approvedBy: string;
  summary: string;
}

export interface LibraryDocument {
  id: string;
  number: string;
  title: string;
  version: string;
  type: DocumentType;
  classification: DocumentClassification;
  status: DocumentStatus;
  nextReview: string;
  history: VersionHistoryItem[];
}

export function canView(
  role: LibraryUserRole,
  classification: DocumentClassification
): boolean {
  switch (role) {
    case "karyawan":
      return classification === "Publik" || classification === "Internal";
    case "manajer":
      return (
        classification === "Publik" ||
        classification === "Internal" ||
        classification === "Rahasia"
      );
    case "hrd":
    case "auditor":
      return true;
    default:
      return false;
  }
}

export const LIBRARY_DOCUMENTS: LibraryDocument[] = [
  {
    id: "iso-001",
    number: "ISO-IS-001",
    title: "Kebijakan Keamanan Informasi",
    version: "v3.0",
    type: "ISO",
    classification: "Internal",
    status: "Berlaku",
    nextReview: "2027-01-15",
    history: [
      {
        version: "v3.0",
        date: "2026-01-15",
        approvedBy: "CISO / Direksi",
        summary: "Pembaruan kontrol kriptografi dan retensi log",
      },
      {
        version: "v2.0",
        date: "2024-02-10",
        approvedBy: "Kepala TI",
        summary: "Penambahan klausul klasifikasi data",
      },
    ],
  },
  {
    id: "iso-002",
    number: "ISO-QM-002",
    title: "Manual Mutu Organisasi",
    version: "v4.2",
    type: "ISO",
    classification: "Internal",
    status: "Berlaku",
    nextReview: "2027-03-20",
    history: [
      {
        version: "v4.2",
        date: "2025-03-20",
        approvedBy: "Tim Mutu",
        summary: "Harmonisasi proses operasional multi-cabang",
      },
    ],
  },
  {
    id: "sk-014",
    number: "SK-014/DIR/2026",
    title: "Tata Cara Perizinan Berjenjang",
    version: "v1.0",
    type: "SK Direksi",
    classification: "Internal",
    status: "Berlaku",
    nextReview: "2027-02-01",
    history: [
      {
        version: "v1.0",
        date: "2026-02-01",
        approvedBy: "Direktur Utama",
        summary: "Standardisasi 4 tingkat persetujuan dan SLA cuti",
      },
    ],
  },
  {
    id: "sk-021",
    number: "SK-021/DIR/2026",
    title: "Struktur Remunerasi dan Tunjangan Jabatan",
    version: "v1.1",
    type: "SK Direksi",
    classification: "Rahasia",
    status: "Berlaku",
    nextReview: "2026-12-31",
    history: [
      {
        version: "v1.1",
        date: "2026-04-10",
        approvedBy: "Direktur Keuangan & SDM",
        summary: "Penyesuaian tunjangan grade supervisor dan manajerial",
      },
    ],
  },
  {
    id: "kb-003",
    number: "KB-003",
    title: "Perjanjian Kerahasiaan Karyawan",
    version: "v2.0",
    type: "Kebijakan",
    classification: "Internal",
    status: "Berlaku",
    nextReview: "2027-06-30",
    history: [
      {
        version: "v2.0",
        date: "2025-06-30",
        approvedBy: "Legal & Kepatuhan",
        summary: "Klausul kepatuhan prinsip pelindungan data pribadi",
      },
    ],
  },
  {
    id: "kb-007",
    number: "KB-007",
    title: "Kebijakan Klasifikasi Informasi",
    version: "v1.4",
    type: "Kebijakan",
    classification: "Internal",
    status: "Berlaku",
    nextReview: "2026-11-15",
    history: [
      {
        version: "v1.4",
        date: "2024-11-15",
        approvedBy: "CISO",
        summary: "Pedoman pelabelan dokumen Publik s.d Sangat Rahasia",
      },
    ],
  },
  {
    id: "hr-010",
    number: "HR-PRO-010",
    title: "Prosedur Disiplin Pegawai",
    version: "v2.1",
    type: "Kebijakan",
    classification: "Rahasia",
    status: "Berlaku",
    nextReview: "2027-04-01",
    history: [
      {
        version: "v2.1",
        date: "2025-04-01",
        approvedBy: "HRD Director",
        summary: "Mekanisme komite disiplin dan eskalasi pelanggaran",
      },
    ],
  },
  {
    id: "hr-004",
    number: "HR-PRO-004",
    title: "Prosedur Rekrutmen Jabatan Pimpinan",
    version: "v1.0",
    type: "Kebijakan",
    classification: "Sangat Rahasia",
    status: "Draft",
    nextReview: "2026-12-01",
    history: [
      {
        version: "v1.0",
        date: "2026-08-01",
        approvedBy: "Komite Nominasi",
        summary: "Draf asesmen psikometri dan proctoring calon direksi",
      },
    ],
  },
  {
    id: "iso-014",
    number: "ISO-IS-014",
    title: "Rencana Pemulihan Bencana (Disaster Recovery)",
    version: "v2.2",
    type: "ISO",
    classification: "Rahasia",
    status: "Kedaluwarsa",
    nextReview: "2026-05-10",
    history: [
      {
        version: "v2.2",
        date: "2023-05-10",
        approvedBy: "Kepala TI",
        summary: "Prosedur failover data center sekunder",
      },
    ],
  },
  {
    id: "kb-011",
    number: "KB-011",
    title: "Kebijakan Whistleblowing dan Perlindungan Pelapor",
    version: "v1.2",
    type: "Kebijakan",
    classification: "Publik",
    status: "Berlaku",
    nextReview: "2027-08-15",
    history: [
      {
        version: "v1.2",
        date: "2025-08-15",
        approvedBy: "Satuan Pengawas Internal (SPI)",
        summary: "Kanal pelaporan independen dan jaminan kerahasiaan",
      },
    ],
  },
];
