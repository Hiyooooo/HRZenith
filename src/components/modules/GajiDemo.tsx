"use client";

import React, { useState } from "react";
import {
  Wallet,
  FileLock2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileCheck,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  SLIP_BUDI_FIXTURE,
} from "@/lib/slip";
import {
  MONTHLY_TAX_2025,
  reconcileTax,
} from "@/lib/compliance";
import { rupiah } from "@/lib/format";

type GajiTab = "batch" | "slip" | "pajak";

interface BatchAuditLog {
  id: number;
  time: string;
  actor: string;
  role: string;
  action: string;
  status: "DRAFT" | "DIVERIFIKASI" | "DISETUJUI" | "DIKUNCI";
}

export const GajiDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GajiTab>("batch");

  // State Tab 1: Batch Maker-Checker
  const [currentUser, setCurrentUser] = useState<"dewi" | "hendra">("dewi");
  const [batchStatus, setBatchStatus] = useState<
    "Draft" | "Diverifikasi" | "Disetujui" | "Dikunci"
  >("Draft");
  const [batchLogs, setBatchLogs] = useState<BatchAuditLog[]>([
    {
      id: 1,
      time: "2026-10-25 08:30 WIB",
      actor: "Dewi Lestari",
      role: "Payroll Officer (Maker)",
      action: "Pembuatan Draf Batch Payroll 2.000 Karyawan",
      status: "DRAFT",
    },
  ]);
  const [makerCheckerError, setMakerCheckerError] = useState<string | null>(
    null
  );

  // State Tab 2: Slip Gaji Terenkripsi
  const [isSlipUnlocked, setIsSlipUnlocked] = useState<boolean>(false);
  const [enteredPassword, setEnteredPassword] = useState<string>("");
  const [slipAttempts, setSlipAttempts] = useState<number>(3);
  const [slipErrorMessage, setSlipErrorMessage] = useState<string | null>(null);

  // State Tab 3: Kepatuhan Pajak 1721-A1
  const [isTaxCorrected, setIsTaxCorrected] = useState<boolean>(false);

  // Perhitungan rekonsiliasi pajak
  const totalDipotong = MONTHLY_TAX_2025.reduce((sum, r) => sum + r.amount, 0);
  const totalA1 = isTaxCorrected
    ? totalDipotong
    : totalDipotong - 1250000; // Selisih 1.250.000 sebelum koreksi
  const taxRecon = reconcileTax(MONTHLY_TAX_2025, totalA1);

  // Handler Tab 1: Maker Actions
  const handleDewiSubmit = () => {
    setMakerCheckerError(null);
    setBatchStatus("Diverifikasi");
    setBatchLogs((prev) => [
      {
        id: prev.length + 1,
        time: new Date().toLocaleTimeString("id-ID") + " WIB",
        actor: "Dewi Lestari",
        role: "Payroll Officer (Maker)",
        action: "Pengajuan Draf Batch untuk Persetujuan Checker",
        status: "DIVERIFIKASI",
      },
      ...prev,
    ]);
  };

  const handleDewiIllegalApprove = () => {
    setMakerCheckerError(
      "Pelanggaran Segregation of Duties (SoD): Pembuat draf (Maker: Dewi Lestari) dilarang menyetujui batch gaji buatannya sendiri. Wajib disetujui oleh peran Checker."
    );
  };

  // Handler Tab 1: Checker Actions
  const handleHendraApprove = () => {
    setMakerCheckerError(null);
    setBatchStatus("Disetujui");
    setBatchLogs((prev) => [
      {
        id: prev.length + 1,
        time: new Date().toLocaleTimeString("id-ID") + " WIB",
        actor: "Hendra Gunawan",
        role: "Finance Manager (Checker)",
        action: "Verifikasi & Otorisasi Pengeluaran Dana Batch Gaji",
        status: "DISETUJUI",
      },
      ...prev,
    ]);
  };

  const handleHendraLock = () => {
    setMakerCheckerError(null);
    setBatchStatus("Dikunci");
    setBatchLogs((prev) => [
      {
        id: prev.length + 1,
        time: new Date().toLocaleTimeString("id-ID") + " WIB",
        actor: "Hendra Gunawan",
        role: "Finance Manager (Checker)",
        action: "Penguncian Permanen Batch (File Siap Ditransfer H2H)",
        status: "DIKUNCI",
      },
      ...prev,
    ]);
  };

  // Handler Tab 2: Password Unlock
  const handleUnlockSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword === "15081990") {
      setIsSlipUnlocked(true);
      setSlipErrorMessage(null);
    } else {
      const nextAttempts = slipAttempts - 1;
      setSlipAttempts(nextAttempts);
      if (nextAttempts <= 0) {
        setSlipErrorMessage(
          "Akun terkunci: Batas maksimal 3 kali percobaan kata sandi terlampaui. Sesi ditutup demi keamanan."
        );
      } else {
        setSlipErrorMessage(
          `Kata sandi salah. Sisa percobaan: ${nextAttempts} kali.`
        );
      }
    }
  };

  const handleResetSlip = () => {
    setIsSlipUnlocked(false);
    setEnteredPassword("");
    setSlipAttempts(3);
    setSlipErrorMessage(null);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Modul */}
      <div className="border-b border-line pb-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-[4px] bg-brand text-on-brand flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-brand block">
            Modul 03: Kontrol & Kepatuhan Payroll
          </span>
          <h3 className="text-[18px] sm:text-[20px] font-bold text-ink">
            Payroll dengan pemisahan kontrol dan bukti audit.
          </h3>
          <p className="text-[14px] text-steel max-w-2xl mt-0.5">
            Audit trail payroll maker-checker, slip gaji PDF terenkripsi kata sandi, dan kepatuhan pajak tahunan 1721-A1.
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
                <td className="px-4 py-2 font-bold text-ink w-1/3">Audit trail payroll (maker-checker)</td>
                <td className="px-4 py-2 text-steel">Pemisahan wewenang pembuat draf dan penyetuju transfer dengan log audit terikat.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Slip gaji terenkripsi password</td>
                <td className="px-4 py-2 text-steel">Dokumen PDF slip gaji karyawan dienkripsi format tanggal lahir (DDMMYYYY) berstandar AES-256.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Kepatuhan pajak tahunan (1721-A1)</td>
                <td className="px-4 py-2 text-steel">Rekonsiliasi otomatis pemotongan PPh 21 bulanan terhadap formulir 1721-A1 tahunan.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Kalkulasi PPh 21 TER & BPJS</td>
                <td className="px-4 py-2 text-steel">Perhitungan otomatis tarif efektif rata-rata (TER Kategori A), BPJS Ketenagakerjaan (3%), dan BPJS Kesehatan (1%).</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Reimbursement & klaim</td>
                <td className="px-4 py-2 text-steel">Penggantian biaya dinas terverifikasi yang langsung terintegrasi ke komponen payroll.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigasi Tab Internal Modul */}
      <div className="flex border-b border-line gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("batch")}
          className={`pb-2.5 px-3 text-[13px] font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "batch"
              ? "border-brand text-brand"
              : "border-transparent text-steel hover:text-ink"
          }`}
        >
          1. Maker-Checker Batch
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("slip")}
          className={`pb-2.5 px-3 text-[13px] font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "slip"
              ? "border-brand text-brand"
              : "border-transparent text-steel hover:text-ink"
          }`}
        >
          2. Slip Gaji Terenkripsi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pajak")}
          className={`pb-2.5 px-3 text-[13px] font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "pajak"
              ? "border-brand text-brand"
              : "border-transparent text-steel hover:text-ink"
          }`}
        >
          3. Kepatuhan Pajak 1721-A1
        </button>
      </div>

      {/* ===================== TAB 1: BATCH MAKER-CHECKER ===================== */}
      {activeTab === "batch" && (
        <div className="space-y-6">
          {/* Konsol Kontrol Dual-Control Maker-Checker */}
          <div className="bg-canvas/50 border border-line rounded-[4px] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-2.5">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                  Pengendalian Batch Finansial
                </span>
                <h4 className="text-[15px] font-bold text-ink">
                  Batch: Gaji Periode Oktober 2026 (2.000 Karyawan)
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-steel font-medium">Status Batch:</span>
                <span className="font-mono font-bold text-brand uppercase px-2.5 py-1 rounded bg-brand-tint border border-brand/20 text-[12px]">
                  {batchStatus}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Pemilih Peran Pengguna Aktif */}
              <div className="space-y-2">
                <span className="text-[12px] font-semibold text-ink block">
                  Simulasikan Sebagai Pengguna:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser("dewi");
                      setMakerCheckerError(null);
                    }}
                    className={`p-3 rounded-[4px] border text-left transition-all ${
                      currentUser === "dewi"
                        ? "bg-brand-tint border-brand text-brand font-bold"
                        : "bg-paper border-line text-ink hover:bg-canvas"
                    }`}
                  >
                    <div className="font-bold text-[13px]">Dewi Lestari</div>
                    <div className="text-[11px] text-steel">Payroll Officer (Maker)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser("hendra");
                      setMakerCheckerError(null);
                    }}
                    className={`p-3 rounded-[4px] border text-left transition-all ${
                      currentUser === "hendra"
                        ? "bg-brand-tint border-brand text-brand font-bold"
                        : "bg-paper border-line text-ink hover:bg-canvas"
                    }`}
                  >
                    <div className="font-bold text-[13px]">Hendra Gunawan</div>
                    <div className="text-[11px] text-steel">Finance Manager (Checker)</div>
                  </button>
                </div>
              </div>

              {/* Aksi yang Diizinkan */}
              <div className="space-y-2">
                <span className="text-[12px] font-semibold text-ink block">
                  Aksi yang Diotorisasi untuk {currentUser === "dewi" ? "Dewi Lestari (Maker)" : "Hendra Gunawan (Checker)"}:
                </span>
                {currentUser === "dewi" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleDewiSubmit}
                      disabled={batchStatus !== "Draft"}
                      className="text-[12px] min-h-[42px] py-2 px-3 font-semibold leading-snug"
                    >
                      Ajukan Verifikasi Batch
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDewiIllegalApprove}
                      disabled={batchStatus === "Dikunci"}
                      className="text-[12px] min-h-[42px] py-2 px-3 text-danger border-danger/40 hover:bg-danger-bg/20 font-semibold leading-snug"
                    >
                      Uji Setujui Sendiri (Uji SoD)
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleHendraApprove}
                      disabled={batchStatus !== "Diverifikasi"}
                      className="text-[12px] min-h-[42px] py-2 px-3 font-semibold leading-snug"
                    >
                      Setujui Batch (Checker)
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleHendraLock}
                      disabled={batchStatus !== "Disetujui"}
                      className="text-[12px] min-h-[42px] py-2 px-3 font-semibold leading-snug"
                    >
                      Kunci Batch Permanen
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Error Maker-Checker */}
            {makerCheckerError && (
              <div className="p-3 bg-danger-bg/50 border border-danger/30 rounded text-[12px] text-danger space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Pelanggaran Segregation of Duties (SoD) Terdeteksi</span>
                </div>
                <p className="leading-relaxed">{makerCheckerError}</p>
              </div>
            )}
          </div>

          {/* Buku Log Audit Batch Payroll (Lebar Penuh) */}
          <div className="bg-paper border border-line rounded-[4px] p-4 sm:p-5 space-y-3">
            <div className="border-b border-line pb-2.5">
              <h4 className="text-[14px] font-bold text-ink">
                Buku Log Transaksi Perubahan Batch Payroll
              </h4>
              <span className="text-[11px] text-steel">
                Setiap persetujuan dan perubahan komponen terikat identitas pengguna secara permanen
              </span>
            </div>

            <div className="border border-line rounded-[4px] overflow-hidden">
              <div
                tabIndex={0}
                role="region"
                aria-label="Tabel Log Batch Payroll"
                className="overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
              >
                <table className="w-full text-left text-[12px] min-w-[620px]">
                  <thead className="bg-panel border-b border-line text-[11px] font-bold uppercase tracking-wider text-steel">
                    <tr>
                      <th scope="col" className="py-2.5 px-3 w-10 text-center">#</th>
                      <th scope="col" className="py-2.5 px-3 w-36 whitespace-nowrap">Waktu</th>
                      <th scope="col" className="py-2.5 px-3 min-w-[130px]">Aktor</th>
                      <th scope="col" className="py-2.5 px-3 min-w-[140px]">Peran</th>
                      <th scope="col" className="py-2.5 px-3 min-w-[180px]">Aksi Terdata</th>
                      <th scope="col" className="py-2.5 px-3 w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-[12px] font-mono">
                    {batchLogs.map((log) => (
                      <tr key={log.id} className="bg-paper hover:bg-canvas/50">
                        <td className="py-2.5 px-3 text-steel text-center">{log.id}</td>
                        <td className="py-2.5 px-3 text-ink whitespace-nowrap">{log.time}</td>
                        <td className="py-2.5 px-3 font-sans font-semibold text-ink">
                          {log.actor}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-steel text-[11px]">
                          {log.role}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-ink">
                          {log.action}
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusChip
                            status={
                              log.status === "DIKUNCI"
                                ? "ok"
                                : log.status === "DISETUJUI"
                                ? "info"
                                : log.status === "DIVERIFIKASI"
                                ? "warn"
                                : "neutral"
                            }
                            text={log.status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: SLIP GAJI TERENKRIPSI ===================== */}
      {activeTab === "slip" && (
        <div className="space-y-6">
          {!isSlipUnlocked ? (
            /* Panel Form Kata Sandi (Terkunci) */
            <div className="max-w-xl mx-auto bg-canvas/50 border border-line rounded-[4px] p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-line pb-3">
                <div className="w-10 h-10 rounded bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <FileLock2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                    Dokumen Rahasia Karyawan
                  </span>
                  <h4 className="text-[16px] font-bold text-ink">
                    Berkas: Slip-Gaji-Okt-2026.pdf (AES-256)
                  </h4>
                </div>
              </div>

              <div className="p-3.5 bg-paper border border-line rounded text-[12px] space-y-1 text-steel">
                <span className="font-bold text-ink block">Petunjuk Simulasi Karyawan:</span>
                <p>
                  Gunakan tanggal lahir format DDMMYYYY: <strong className="font-mono text-brand">15081990</strong> (Budi Santoso, lahir 15 Agustus 1990) untuk mendekripsi dokumen.
                </p>
              </div>

              <form onSubmit={handleUnlockSlip} className="space-y-4 text-[13px]">
                <div>
                  <label htmlFor="slip-password-input" className="font-semibold text-ink block mb-1">
                    Kata Sandi Enkripsi PDF
                  </label>
                  <input
                    id="slip-password-input"
                    aria-label="Kata Sandi Enkripsi PDF"
                    type="password"
                    placeholder="Masukkan DDMMYYYY..."
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    disabled={slipAttempts <= 0}
                    className="w-full h-11 px-3 font-mono font-bold text-[16px] border border-control rounded bg-paper text-ink"
                  />
                </div>

                {slipErrorMessage && (
                  <div className="p-3 bg-danger-bg/50 text-danger text-[12px] rounded border border-danger/30 font-medium">
                    {slipErrorMessage}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={slipAttempts <= 0 || !enteredPassword}
                    className="flex-1 text-[13px] h-10 font-semibold"
                  >
                    Buka Slip Gaji
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetSlip}
                    className="text-[12px] h-10 px-4"
                  >
                    Reset
                  </Button>
                </div>
              </form>

              <p className="text-[11px] text-steel italic text-center">
                * Pada arsitektur nyata, enkripsi PDF dilakukan di level server backend dengan AES-256. Kata sandi tidak pernah disimpan dalam kode peramban.
              </p>
            </div>
          ) : (
            /* Panel Slip Terbuka (Tampilan Resmi Dokumen Gaji) */
            <div className="bg-paper border-2 border-line rounded-[4px] p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-line pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-ok text-white flex items-center justify-center">
                    <Unlock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                      Dokumen Terverifikasi & Didekripsi
                    </span>
                    <h4 className="text-[16px] font-bold text-ink">
                      Slip Pembayaran Gaji Elektronik — PT HRZenith Solusi Nusantara
                    </h4>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetSlip}
                  className="text-[12px] h-8 px-3 shrink-0"
                >
                  Kunci Lagi
                </Button>
              </div>

              {/* Data Karyawan & Periode */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-canvas border border-line rounded text-[12px]">
                <div>
                  <span className="text-steel block">Nama Karyawan:</span>
                  <span className="font-bold text-ink">Budi Santoso</span>
                </div>
                <div>
                  <span className="text-steel block">Jabatan / Level:</span>
                  <span className="font-bold text-ink">Supervisor Operasional</span>
                </div>
                <div>
                  <span className="text-steel block">Periode Gaji:</span>
                  <span className="font-mono font-bold text-ink">Oktober 2026</span>
                </div>
                <div>
                  <span className="text-steel block">Kategori PPh 21:</span>
                  <span className="font-mono font-bold text-brand">TER Kategori A (3,5%)</span>
                </div>
              </div>

              {/* Rincian Komponen Gaji */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Kolom Pendapatan */}
                <div className="border border-line rounded overflow-hidden">
                  <div className="bg-panel px-3.5 py-2 border-b border-line text-[11px] font-bold uppercase tracking-wider text-steel">
                    A. Komponen Pendapatan Bruto
                  </div>
                  <div className="divide-y divide-line text-[13px]">
                    <div className="flex justify-between px-3.5 py-2">
                      <span className="text-steel">Gaji Pokok</span>
                      <span className="font-mono font-semibold text-ink">{rupiah(SLIP_BUDI_FIXTURE.pokok)}</span>
                    </div>
                    <div className="flex justify-between px-3.5 py-2">
                      <span className="text-steel">Tunjangan Jabatan</span>
                      <span className="font-mono font-semibold text-ink">{rupiah(SLIP_BUDI_FIXTURE.tunjanganJabatan)}</span>
                    </div>
                    <div className="flex justify-between px-3.5 py-2">
                      <span className="text-steel">Tunjangan Makan & Transport</span>
                      <span className="font-mono font-semibold text-ink">{rupiah(SLIP_BUDI_FIXTURE.tunjanganMakanTransport)}</span>
                    </div>
                    <div className="flex justify-between px-3.5 py-2.5 bg-canvas font-bold">
                      <span className="text-ink">Total Pendapatan Bruto</span>
                      <span className="font-mono text-ink">{rupiah(SLIP_BUDI_FIXTURE.bruto)}</span>
                    </div>
                  </div>
                </div>

                {/* Kolom Potongan Pajak & BPJS */}
                <div className="border border-line rounded overflow-hidden">
                  <div className="bg-panel px-3.5 py-2 border-b border-line text-[11px] font-bold uppercase tracking-wider text-steel">
                    B. Potongan Pajak & Jaminan Sosial
                  </div>
                  <div className="divide-y divide-line text-[13px]">
                    <div className="flex justify-between px-3.5 py-2">
                      <span className="text-steel">PPh 21 (TER A 3,5%)</span>
                      <span className="font-mono font-semibold text-danger">−{rupiah(SLIP_BUDI_FIXTURE.pph21)}</span>
                    </div>
                    <div className="flex justify-between px-3.5 py-2">
                      <span className="text-steel">BPJS Ketenagakerjaan (JHT 2% + JP 1%)</span>
                      <span className="font-mono font-semibold text-danger">−{rupiah(SLIP_BUDI_FIXTURE.bpjsTk)}</span>
                    </div>
                    <div className="flex justify-between px-3.5 py-2">
                      <span className="text-steel">BPJS Kesehatan (1%)</span>
                      <span className="font-mono font-semibold text-danger">−{rupiah(SLIP_BUDI_FIXTURE.bpjsKes)}</span>
                    </div>
                    <div className="flex justify-between px-3.5 py-2.5 bg-canvas font-bold">
                      <span className="text-ink">Total Potongan Wajib</span>
                      <span className="font-mono text-danger">−{rupiah(SLIP_BUDI_FIXTURE.pph21 + SLIP_BUDI_FIXTURE.bpjsTk + SLIP_BUDI_FIXTURE.bpjsKes)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Gaji Bersih Diterima */}
              <div className="p-4 bg-brand-tint border-2 border-brand rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-brand block">
                    Gaji Bersih Diterima (Take Home Pay)
                  </span>
                  <span className="text-[12px] text-steel">Ditransfer otomatis via Bank Host-to-Host</span>
                </div>
                <div className="text-[26px] font-mono font-bold text-brand">
                  {rupiah(SLIP_BUDI_FIXTURE.bersih)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 3: KEPATUHAN PAJAK 1721-A1 ===================== */}
      {activeTab === "pajak" && (
        <div className="space-y-6">
          {/* Panel Rekonsiliasi Pajak */}
          <div className="bg-canvas/50 border border-line rounded-[4px] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-2.5">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                  Audit Kepatuhan Pajak Korporasi
                </span>
                <h4 className="text-[15px] font-bold text-ink">
                  Rekonsiliasi Pemotongan PPh 21 Bulanan vs Formulir 1721-A1 (Tahun Pajak 2025)
                </h4>
              </div>

              <StatusChip
                status={taxRecon.status === "selaras" ? "ok" : "warn"}
                text={taxRecon.status === "selaras" ? "Selaras (Rp 0)" : "Perlu Ditinjau"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px]">
              <div className="p-3.5 bg-paper border border-line rounded">
                <span className="text-[11px] text-steel block">Total PPh 21 Dipotong (Jan–Des):</span>
                <span className="font-mono font-bold text-[16px] text-ink block mt-0.5">
                  {rupiah(taxRecon.totalDipotong)}
                </span>
              </div>

              <div className="p-3.5 bg-paper border border-line rounded">
                <span className="text-[11px] text-steel block">Total Tercantum di 1721-A1:</span>
                <span className="font-mono font-bold text-[16px] text-ink block mt-0.5">
                  {rupiah(taxRecon.totalA1)}
                </span>
              </div>

              <div className="p-3.5 bg-paper border border-line rounded flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-steel block">Selisih Rekonsiliasi:</span>
                  <span
                    className={`font-mono font-bold text-[16px] block mt-0.5 ${
                      taxRecon.selisih === 0 ? "text-ok" : "text-warn"
                    }`}
                  >
                    {rupiah(taxRecon.selisih)}
                  </span>
                </div>
                {taxRecon.selisih > 0 && (
                  <span className="text-[10px] text-warn font-semibold">
                    * Koreksi rapel Maret belum masuk ke 1721-A1
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="primary"
                onClick={() => setIsTaxCorrected(!isTaxCorrected)}
                className="text-[12px] min-h-[38px] py-1.5 px-3.5 font-semibold leading-snug"
              >
                {isTaxCorrected
                  ? "Batalkan Koreksi Maret (Kembalikan Selisih)"
                  : "Terapkan Koreksi Maret (Sinkronkan 1721-A1)"}
              </Button>

              <div className="flex items-center gap-3 text-[11px] text-steel font-mono">
                <span>Unduh 1721-A1 (PDF)</span>
                <span>•</span>
                <span>Unduh Rekap Bulanan (CSV)</span>
              </div>
            </div>
          </div>

          {/* Tabel Rekap 12 Bulan (Lebar Penuh) */}
          <div className="bg-paper border border-line rounded-[4px] p-4 sm:p-5 space-y-3">
            <div className="border-b border-line pb-2.5">
              <h4 className="text-[14px] font-bold text-ink">
                Rincian Pemotongan PPh 21 Bulanan (Tahun 2025)
              </h4>
            </div>

            <div className="border border-line rounded-[4px] overflow-hidden">
              <div
                tabIndex={0}
                role="region"
                aria-label="Tabel Rekap PPh 21 12 Bulan"
                className="overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
              >
                <table className="w-full text-left text-[12px] min-w-[500px]">
                  <thead className="bg-panel border-b border-line text-[11px] font-bold uppercase tracking-wider text-steel">
                    <tr>
                      <th scope="col" className="py-2.5 px-3 w-32">Bulan</th>
                      <th scope="col" className="py-2.5 px-3 text-right w-48">PPh 21 Dipotong</th>
                      <th scope="col" className="py-2.5 px-3">Catatan Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-[12px] font-mono">
                    {MONTHLY_TAX_2025.map((row) => (
                      <tr
                        key={row.month}
                        className={
                          row.month === "Maret" && !isTaxCorrected
                            ? "bg-warn-bg/30 text-ink font-semibold"
                            : "bg-paper hover:bg-canvas/50"
                        }
                      >
                        <td className="py-2 px-3 font-sans font-medium text-ink">
                          {row.month} 2025
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-ink">
                          {rupiah(row.amount)}
                        </td>
                        <td className="py-2 px-3 font-sans text-steel text-[11px]">
                          {row.month === "Maret"
                            ? isTaxCorrected
                              ? "Koreksi rapel telah disinkronkan ke 1721-A1"
                              : "Terdapat rapel penyesuaian grade jabatan (+Rp 1.250.000)"
                            : "Normal, sesuai tarif TER bulanan"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Bukti Audit */}
      <div className="flex items-center gap-2 text-steel text-[12px] pt-3 border-t border-line">
        <Lock className="w-4 h-4 text-brand shrink-0" />
        <span>
          <strong>Bukti audit:</strong> Setiap perubahan komponen gaji dan keputusan otorisasi batch tersimpan permanen beserta tanda tangan digital pelakunya.
        </span>
      </div>
    </div>
  );
};
