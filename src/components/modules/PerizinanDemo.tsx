"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  ShieldCheck,
  ShieldAlert,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  AlertTriangle,
  Download,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  approvalChain,
  type LeaveType,
  type Role,
} from "@/lib/approval";
import {
  getGenesisHash,
  computeEntryHash,
  verifyChain,
  type AuditEntry,
  type VerificationResult,
} from "@/lib/audit";

const LEAVE_TYPES: Array<{ id: LeaveType; label: string; maxDays: number }> = [
  { id: "cuti-tahunan", label: "Cuti Tahunan", maxDays: 14 },
  { id: "izin-sakit", label: "Izin Sakit", maxDays: 14 },
  { id: "dinas-luar-kota", label: "Dinas Luar Kota", maxDays: 14 },
  { id: "dinas-luar-negeri", label: "Dinas Luar Negeri", maxDays: 30 },
  { id: "izin-belajar", label: "Izin Belajar", maxDays: 365 },
];

const SIMULATION_TIMESTAMPS = [
  "2026-10-19T08:15:00+07:00",
  "2026-10-19T09:02:00+07:00",
  "2026-10-19T10:40:00+07:00",
  "2026-10-20T08:55:00+07:00",
  "2026-10-20T14:20:00+07:00",
  "2026-10-21T09:10:00+07:00",
  "2026-10-21T10:05:00+07:00",
  "2026-10-21T13:30:00+07:00",
];

export const PerizinanDemo: React.FC = () => {
  const [leaveType, setLeaveType] = useState<LeaveType>("cuti-tahunan");
  const [duration, setDuration] = useState<number>(5);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(2); // 0=staff, 1=sys, 2=spv
  const [rejectionNote, setRejectionNote] = useState<string>("");
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [isFinalApproved, setIsFinalApproved] = useState<boolean>(false);
  const [isOverdue, setIsOverdue] = useState<boolean>(false);

  // Inisialisasi rantai default 5 entri
  const [chain, setChain] = useState<AuditEntry[]>([]);

  const requiredChain = approvalChain(leaveType, duration);

  const buildInitialChain = async () => {
    const genesis = await getGenesisHash();
    const h1 = await computeEntryHash(
      genesis,
      "Rina Kusumawati (Staff)",
      "DIAJUKAN",
      SIMULATION_TIMESTAMPS[0]
    );
    const h2 = await computeEntryHash(
      h1,
      "Sistem",
      "VALIDASI_KEBIJAKAN_LULUS",
      SIMULATION_TIMESTAMPS[1]
    );
    const h3 = await computeEntryHash(
      h2,
      "Budi Santoso (Supervisor)",
      "DISETUJUI",
      SIMULATION_TIMESTAMPS[2]
    );
    const h4 = await computeEntryHash(
      h3,
      "Andi Wijaya (Manager)",
      "DISETUJUI",
      SIMULATION_TIMESTAMPS[3]
    );
    const h5 = await computeEntryHash(
      h4,
      "Maya Anggraeni (HRD Director)",
      "DISETUJUI_FINAL",
      SIMULATION_TIMESTAMPS[4]
    );

    const defaultChain: AuditEntry[] = [
      {
        id: 1,
        prevHash: genesis,
        actor: "Rina Kusumawati (Staff)",
        action: "DIAJUKAN",
        timestamp: SIMULATION_TIMESTAMPS[0],
        hash: h1,
      },
      {
        id: 2,
        prevHash: h1,
        actor: "Sistem",
        action: "VALIDASI_KEBIJAKAN_LULUS",
        timestamp: SIMULATION_TIMESTAMPS[1],
        hash: h2,
      },
      {
        id: 3,
        prevHash: h2,
        actor: "Budi Santoso (Supervisor)",
        action: "DISETUJUI",
        timestamp: SIMULATION_TIMESTAMPS[2],
        hash: h3,
      },
      {
        id: 4,
        prevHash: h3,
        actor: "Andi Wijaya (Manager)",
        action: "DISETUJUI",
        timestamp: SIMULATION_TIMESTAMPS[3],
        hash: h4,
      },
      {
        id: 5,
        prevHash: h4,
        actor: "Maya Anggraeni (HRD Director)",
        action: "DISETUJUI_FINAL",
        timestamp: SIMULATION_TIMESTAMPS[4],
        hash: h5,
      },
    ];

    setChain(defaultChain);
    setIsTampered(false);
    setIsFinalApproved(false);
    setCurrentStepIndex(0);
    setVerification(null);
  };

  useEffect(() => {
    buildInitialChain();
  }, []);

  // Setujui langkah aktif
  const handleApprove = async () => {
    if (chain.length === 0) return;
    const lastEntry = chain[chain.length - 1];
    let newActor = "";
    let newAction = "DISETUJUI";

    if (currentStepIndex === 0) {
      newActor = "Budi Santoso (Supervisor)";
      setCurrentStepIndex(1);
    } else if (currentStepIndex === 1) {
      newActor = "Andi Wijaya (Manager)";
      if (requiredChain.includes("hrd")) {
        setCurrentStepIndex(2);
      } else {
        newAction = "DISETUJUI_FINAL";
        setIsFinalApproved(true);
      }
    } else if (currentStepIndex === 2) {
      newActor = "Maya Anggraeni (HRD Director)";
      newAction = "DISETUJUI_FINAL";
      setIsFinalApproved(true);
    }

    const nextTime =
      SIMULATION_TIMESTAMPS[chain.length] || "2026-10-22T08:00:00+07:00";
    const nextHash = await computeEntryHash(
      lastEntry.hash,
      newActor,
      newAction,
      nextTime
    );

    const newEntry: AuditEntry = {
      id: chain.length + 1,
      prevHash: lastEntry.hash,
      actor: newActor,
      action: newAction,
      timestamp: nextTime,
      hash: nextHash,
    };

    setChain((prev) => [...prev, newEntry]);
    setVerification(null);
  };

  // Delegasikan langkah aktif
  const handleDelegate = async () => {
    if (chain.length === 0) return;
    const lastEntry = chain[chain.length - 1];
    const nextTime =
      SIMULATION_TIMESTAMPS[chain.length] || "2026-10-22T09:00:00+07:00";
    const nextHash = await computeEntryHash(
      lastEntry.hash,
      "Hendra (Pjs Supervisor)",
      "DISETUJUI_DELEGASI",
      nextTime
    );

    const newEntry: AuditEntry = {
      id: chain.length + 1,
      prevHash: lastEntry.hash,
      actor: "Hendra (Pjs Supervisor)",
      action: "DISETUJUI_DELEGASI",
      timestamp: nextTime,
      hash: nextHash,
    };

    setChain((prev) => [...prev, newEntry]);
    setCurrentStepIndex(1);
    setVerification(null);
  };

  // Tolak langkah aktif
  const handleReject = async () => {
    if (chain.length === 0 || rejectionNote.trim().length < 10) return;
    const lastEntry = chain[chain.length - 1];
    const nextTime =
      SIMULATION_TIMESTAMPS[chain.length] || "2026-10-22T10:00:00+07:00";
    const actionText = `DITOLAK: ${rejectionNote}`;
    const nextHash = await computeEntryHash(
      lastEntry.hash,
      "Budi Santoso (Supervisor)",
      actionText,
      nextTime
    );

    const newEntry: AuditEntry = {
      id: chain.length + 1,
      prevHash: lastEntry.hash,
      actor: "Budi Santoso (Supervisor)",
      action: actionText,
      timestamp: nextTime,
      hash: nextHash,
    };

    setChain((prev) => [...prev, newEntry]);
    setShowRejectInput(false);
    setRejectionNote("");
    setVerification(null);
  };

  // Simulasi SLA terlewat
  const handleSimulateOverdue = async () => {
    setIsOverdue(true);
    if (chain.length === 0) return;
    const lastEntry = chain[chain.length - 1];
    const nextTime = "2026-10-21T08:00:00+07:00";
    const nextHash = await computeEntryHash(
      lastEntry.hash,
      "Sistem (Eskalasi Otomatis)",
      "ESKALASI_SLA_TERLEWAT",
      nextTime
    );

    const newEntry: AuditEntry = {
      id: chain.length + 1,
      prevHash: lastEntry.hash,
      actor: "Sistem (Eskalasi Otomatis)",
      action: "ESKALASI_SLA_TERLEWAT",
      timestamp: nextTime,
      hash: nextHash,
    };

    setChain((prev) => [...prev, newEntry]);
    setVerification(null);
  };

  // Verifikasi Integritas Rantai SHA-256
  const handleVerify = async () => {
    const res = await verifyChain(chain);
    setVerification(res);
  };

  // Simulasi Perubahan Ilegal (Tampering) pada entri #3
  const handleTamperToggle = () => {
    if (!isTampered) {
      // Ubah payload entri #3 tanpa menghitung ulang hash
      const tampered = chain.map((entry, idx) => {
        if (idx === 2) {
          return {
            ...entry,
            action: "DISETUJUI_DIPALSUKAN",
          };
        }
        return entry;
      });
      setChain(tampered);
      setIsTampered(true);
      setVerification(null);
    } else {
      // Pulihkan ke DISETUJUI
      const restored = chain.map((entry, idx) => {
        if (idx === 2) {
          return {
            ...entry,
            action: "DISETUJUI",
          };
        }
        return entry;
      });
      setChain(restored);
      setIsTampered(false);
      setVerification(null);
    }
  };

  const remainingLeave = isFinalApproved ? 9 - duration : 9;

  return (
    <div className="space-y-6 w-full">
      {/* Header Modul */}
      <div className="border-b border-line pb-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-[4px] bg-brand text-on-brand flex items-center justify-center shrink-0">
          <CalendarCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-brand block">
            Modul 01: Perizinan Multi-Tier (Poros Utama)
          </span>
          <h3 className="text-[18px] sm:text-[20px] font-bold text-ink">
            Persetujuan berjenjang dengan jejak yang dapat dibuktikan.
          </h3>
          <p className="text-[14px] text-steel max-w-2xl mt-0.5">
            Empat tingkat persetujuan dengan routing otomatis, SLA, eskalasi, dan audit trail berantai-hash SHA-256.
          </p>
        </div>
      </div>

      {/* Tabel Sub-Fitur Standar Enterprise */}
      <div className="border border-line rounded-[4px] bg-paper overflow-hidden">
        <div className="bg-panel px-4 py-2 border-b border-line">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel">
            Cakupan Sub-Fitur Standar Enterprise
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <tbody className="divide-y divide-line">
              <tr>
                <td className="px-4 py-2 font-bold text-ink w-1/3">Multi-tier approval</td>
                <td className="px-4 py-2 text-steel">Alur berjenjang Staff → Supervisor → Manager → HRD Director.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Routing otomatis</td>
                <td className="px-4 py-2 text-steel">Jumlah tingkat persetujuan disesuaikan jenis dan durasi hari izin.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Audit trail lengkap</td>
                <td className="px-4 py-2 text-steel">Pencatatan waktu (WIB), aktor, aksi, dan hash berantai SHA-256.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">SLA, eskalasi & delegasi</td>
                <td className="px-4 py-2 text-steel">Batas 2 hari kerja per tingkat, eskalasi otomatis, dan delegasi wewenang resmi.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Sisa cuti transparan</td>
                <td className="px-4 py-2 text-steel">Pengurangan kuota cuti otomatis tersinkron ke absensi dan payroll.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bagian 1: Konsol Alur & Eksekusi Persetujuan (Workflow Engine) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Kolom Kiri: Formulir Pengajuan Cuti */}
        <div className="bg-canvas/50 border border-line rounded-[4px] p-4 sm:p-5 space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand" />
              <span>Formulir Pengajuan Cuti</span>
            </span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-panel text-steel border border-line">
              Staff: Rina Kusumawati
            </span>
          </div>

          <div className="space-y-3 text-[13px]">
            <div>
              <label htmlFor="leave-type-select" className="font-semibold text-ink block mb-1">
                Jenis Izin
              </label>
              <select
                id="leave-type-select"
                aria-label="Jenis Izin"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full h-11 px-3 border border-control rounded-[4px] bg-paper text-ink font-medium focus-visible:outline-brand"
              >
                {LEAVE_TYPES.map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="leave-duration-input" className="font-semibold text-ink block mb-1">
                Durasi Hari
              </label>
              <div className="flex items-center gap-2 w-full max-w-full">
                <button
                  type="button"
                  aria-label="Kurangi durasi"
                  onClick={() => setDuration((d) => Math.max(1, d - 1))}
                  className="w-10 h-10 shrink-0 rounded-[4px] border border-control bg-paper text-ink font-bold hover:bg-canvas focus-visible:outline-brand flex items-center justify-center text-lg select-none"
                >
                  −
                </button>
                <input
                  id="leave-duration-input"
                  type="text"
                  inputMode="numeric"
                  aria-label="Durasi Hari"
                  readOnly
                  value={duration}
                  className="min-w-0 flex-1 h-10 text-center font-mono font-bold text-[16px] border border-control rounded-[4px] bg-paper text-ink focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Tambah durasi"
                  onClick={() => setDuration((d) => Math.min(14, d + 1))}
                  className="w-10 h-10 shrink-0 rounded-[4px] border border-control bg-paper text-ink font-bold hover:bg-canvas focus-visible:outline-brand flex items-center justify-center text-lg select-none"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-steel block mt-1">
                Aturan routing: Cuti tahunan ≥ 4 hari wajib sampai HRD Director.
              </span>
            </div>

            {/* Saldo Cuti */}
            <div className="p-3 bg-paper border border-line rounded-[4px] flex items-center justify-between">
              <span className="text-steel font-medium">Sisa Saldo Cuti Tahunan:</span>
              <span className="font-mono font-bold text-ink">
                {remainingLeave} dari 12 hari
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rantai Persetujuan & Aksi */}
        <div className="bg-canvas/50 border border-line rounded-[4px] p-4 sm:p-5 space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="text-[13px] font-bold text-ink">
              Rantai Persetujuan ({requiredChain.length} Tingkat Aktif)
            </span>
            <span className="text-[11px] font-mono text-steel">
              SLA: 2 Hari Kerja
            </span>
          </div>

          {/* Daftar Stepper Persetujuan */}
          <div className="space-y-2 text-[12px]">
            {/* 1. Staff */}
            <div className="p-2.5 rounded-[4px] border border-ok/30 bg-ok-bg/30 flex items-center justify-between">
              <span className="font-semibold text-ink flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-ok shrink-0" />
                <span>Staff (Pemohon: Rina K.)</span>
              </span>
              <span className="font-mono text-[11px] text-ok font-bold">Diajukan</span>
            </div>

            {/* 2. SPV */}
            <div
              className={`p-2.5 rounded-[4px] border flex items-center justify-between ${
                chain.length >= 3
                  ? "border-ok/30 bg-ok-bg/30 text-ink"
                  : currentStepIndex === 0
                  ? "border-brand bg-brand-tint text-brand font-bold"
                  : "border-line bg-paper text-steel"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>1. Supervisor (Budi Santoso)</span>
              </span>
              <span className="font-mono text-[11px]">
                {chain.length >= 3 ? "Disetujui" : currentStepIndex === 0 ? "Menunggu" : "-"}
              </span>
            </div>

            {/* 3. Manager */}
            <div
              className={`p-2.5 rounded-[4px] border flex items-center justify-between ${
                chain.length >= 4
                  ? "border-ok/30 bg-ok-bg/30 text-ink"
                  : currentStepIndex === 1
                  ? "border-brand bg-brand-tint text-brand font-bold"
                  : "border-line bg-paper text-steel"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>2. Manager (Andi Wijaya)</span>
              </span>
              <span className="font-mono text-[11px]">
                {chain.length >= 4 ? "Disetujui" : currentStepIndex === 1 ? "Menunggu" : "-"}
              </span>
            </div>

            {/* 4. HRD Director (Kondisional) */}
            <div
              className={`p-2.5 rounded-[4px] border flex items-center justify-between ${
                !requiredChain.includes("hrd")
                  ? "border-line/40 bg-paper/40 text-steel/50 line-through"
                  : isFinalApproved
                  ? "border-ok/30 bg-ok-bg/30 text-ink"
                  : currentStepIndex === 2
                  ? "border-brand bg-brand-tint text-brand font-bold"
                  : "border-line bg-paper text-steel"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>3. HRD Director (Maya A.)</span>
              </span>
              <span className="font-mono text-[11px]">
                {!requiredChain.includes("hrd")
                  ? "Tidak Diperlukan"
                  : isFinalApproved
                  ? "Disetujui Final"
                  : currentStepIndex === 2
                  ? "Menunggu"
                  : "-"}
              </span>
            </div>
          </div>

          {/* Tombol Aksi Persetujuan */}
          {!isFinalApproved && (
            <div className="pt-2 border-t border-line space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-steel block">
                Aksi Tingkat Aktif:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleApprove}
                  className="text-[12px] min-h-[38px] py-1.5 px-3 font-semibold leading-snug"
                >
                  Setujui Langkah
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDelegate}
                  className="text-[12px] min-h-[38px] py-1.5 px-3 font-semibold leading-snug"
                >
                  Delegasikan
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSimulateOverdue}
                  className="text-[11px] min-h-[36px] py-1.5 px-2.5 text-warn border-warn/30 hover:bg-warn-tint font-semibold leading-snug"
                >
                  Simulasi SLA Terlewat
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRejectInput(!showRejectInput)}
                  className="text-[11px] min-h-[36px] py-1.5 px-2.5 text-danger border-danger/30 hover:bg-danger-bg font-semibold leading-snug"
                >
                  Tolak Pengajuan
                </Button>
              </div>

              {showRejectInput && (
                <div className="pt-2 space-y-1.5">
                  <input
                    type="text"
                    placeholder="Alasan penolakan (min. 10 karakter)..."
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                    className="w-full h-9 px-2 text-[12px] border border-control rounded bg-paper text-ink"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleReject}
                    disabled={rejectionNote.trim().length < 10}
                    className="w-full text-[12px] min-h-[36px] py-1.5 font-semibold leading-snug"
                  >
                    Konfirmasi Tolak
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Notifikasi Dampak Persetujuan Final */}
          {isFinalApproved && (
            <div className="p-3 bg-ok-bg/50 border border-ok/30 rounded-[4px] space-y-1 text-[12px]">
              <div className="flex items-center gap-1.5 font-bold text-ok">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Persetujuan Final Terbit: IZN-2026-000123</span>
              </div>
              <ul className="text-ink text-[11px] space-y-0.5 pl-5 list-disc">
                <li>Sisa cuti dipotong: {remainingLeave} hari tersisa</li>
                <li>Jadwal kehadiran cabang di modul Absensi terupdate</li>
                <li>Cuti tahunan berbayar: tanpa potongan pada slip Gaji</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bagian 2: Buku Log Transaksi Audit Trail Berantai (Lebar Penuh) */}
      <div className="bg-paper border border-line rounded-[4px] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <h4 className="text-[15px] font-bold text-ink">
              Buku Log Transaksi Audit Trail Berantai
            </h4>
            <span className="text-[11px] text-steel">
              Waktu simulasi: jam bukan waktu nyata · Web Crypto SHA-256 Rantai Kriptografis
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="secondary"
              onClick={handleVerify}
              className="text-[12px] h-9 px-3 gap-1.5 font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-brand" />
              <span>Verifikasi Integritas</span>
            </Button>

            <button
              type="button"
              onClick={buildInitialChain}
              title="Reset Demo"
              aria-label="Reset Demo"
              className="h-9 w-9 flex items-center justify-center rounded border border-line hover:bg-canvas text-steel transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner Status Verifikasi Kriptografi */}
        {verification && (
          <div
            className={`p-3 rounded-[4px] border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px] ${
              verification.ok
                ? "bg-ok-bg text-ok border-ok/30"
                : "bg-danger-bg text-danger border-danger/30"
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {verification.ok ? (
                <>
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>Rantai Utuh · {chain.length} Entri Terverifikasi Lolos Kriptografi</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span>
                    Rantai Putus pada Entri #{verification.firstBroken} · Terdeteksi Manipulasi Log Kriptografi
                  </span>
                </>
              )}
            </div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider shrink-0">
              {verification.ok ? "STATUS: VALID" : "STATUS: INVALID"}
            </span>
          </div>
        )}

        {/* Tabel Log Audit Trail dengan Scroll Horizontal Aman */}
        <div className="border border-line rounded-[4px] overflow-hidden">
          <div
            tabIndex={0}
            role="region"
            aria-label="Buku Log Transaksi Audit Trail SHA-256"
            className="overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
          >
            <table className="w-full text-left text-[12px] min-w-[620px]">
              <thead className="bg-panel border-b border-line text-[11px] font-bold uppercase tracking-wider text-steel">
                <tr>
                  <th scope="col" className="py-2.5 px-3 w-10 text-center">#</th>
                  <th scope="col" className="py-2.5 px-3 w-28 whitespace-nowrap">Waktu (WIB)</th>
                  <th scope="col" className="py-2.5 px-3 min-w-[140px]">Aktor</th>
                  <th scope="col" className="py-2.5 px-3 min-w-[140px]">Aksi Terdata</th>
                  <th scope="col" className="py-2.5 px-3 w-28 whitespace-nowrap">Hash (8 Hex)</th>
                  <th scope="col" className="py-2.5 px-3 w-28 whitespace-nowrap text-center">Integritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-[12px] font-mono">
                {chain.map((entry, idx) => {
                  const isMatch =
                    verification && verification.entryMatches
                      ? verification.entryMatches[idx]
                      : true;

                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        !isMatch
                          ? "bg-danger-bg/40 text-danger font-bold"
                          : idx === chain.length - 1
                          ? "bg-brand-tint/20"
                          : "bg-paper hover:bg-canvas/50"
                      }`}
                    >
                      <td className="py-2.5 px-3 text-steel text-center">{entry.id}</td>
                      <td className="py-2.5 px-3 text-ink whitespace-nowrap">
                        {entry.timestamp.split("T")[1]?.slice(0, 5) || "08:00"} WIB
                      </td>
                      <td className="py-2.5 px-3 font-sans text-ink font-medium">
                        {entry.actor}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-panel text-ink border border-line font-mono inline-block">
                          {entry.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-brand whitespace-nowrap">
                        #{entry.hash.slice(0, 8)}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-center whitespace-nowrap">
                        {verification ? (
                          isMatch ? (
                            <StatusChip status="ok" text="Valid" />
                          ) : (
                            <StatusChip status="danger" text="Rantai Putus" />
                          )
                        ) : (
                          <span className="text-steel text-[11px]">Tervalidasi</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tombol Simulasi Manipulasi Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[12px]">
          <button
            type="button"
            onClick={handleTamperToggle}
            disabled={chain.length < 3}
            className="inline-flex items-center gap-1.5 text-danger font-semibold underline underline-offset-4 hover:text-danger/80 disabled:opacity-40 select-none text-left"
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isTampered
                ? "Pulihkan Data Asli Entri #3 (Kembalikan Konsistensi)"
                : "Simulasikan Perubahan Ilegal pada Entri #3 (Uji Rantai Putus)"}
            </span>
          </button>

          <div className="flex items-center gap-2 text-steel text-[11px] font-mono">
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Log Auditor (CSV)</span>
          </div>
        </div>

        <p className="text-[11px] text-steel italic">
          * Hash kepala dapat diekspor secara berkala ke tempat penyimpanan luar agar penulisan ulang seluruh rantai pun tetap dapat dideteksi oleh auditor independen.
        </p>
      </div>

      {/* Footer Bukti Audit */}
      <div className="flex items-center gap-2 text-steel text-[12px] pt-3 border-t border-line">
        <Lock className="w-4 h-4 text-brand shrink-0" />
        <span>
          <strong>Bukti audit:</strong> Setiap pengajuan, delegasi, dan persetujuan membentuk hash berantai SHA-256 yang tidak dapat dimanipulasi tanpa terdeteksi auditor.
        </span>
      </div>
    </div>
  );
};
