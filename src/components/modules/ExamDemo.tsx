"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Eye,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  UserCheck,
  ShieldCheck,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import { Radar360 } from "@/components/diagrams/Radar360";
import {
  compute360,
  OFFICIALS_FIXTURES,
  type OfficialEvaluation,
} from "@/lib/score360";

export const ExamDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"360" | "kompetensi">("360");

  // State Tab 1: 360 Evaluasi
  const [kpiPercent, setKpiPercent] = useState<number>(88);
  const [hideBawahan, setHideBawahan] = useState<boolean>(false);

  const result360 = compute360(kpiPercent, hideBawahan);

  // State Tab 2: Kompetensi & Proctoring
  const [selectedOfficial, setSelectedOfficial] = useState<OfficialEvaluation>(
    OFFICIALS_FIXTURES[1] // Andi Wijaya default
  );
  const [isExamSessionOpen, setIsExamSessionOpen] = useState<boolean>(false);
  const [examTimeLeft, setExamTimeLeft] = useState<number>(120); // 2 menit (02:00)
  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [proctorLogs, setProctorLogs] = useState<
    Array<{ time: string; message: string; type: "ok" | "warn" | "danger" }>
  >([]);

  // Timer Proctoring
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isExamSessionOpen && examTimeLeft > 0) {
      interval = setInterval(() => {
        // Cek visibilitas tab browser
        if (typeof document !== "undefined" && document.visibilityState === "hidden") {
          return;
        }
        setExamTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExamSessionOpen, examTimeLeft]);

  // Handle pindah tab browser nyata saat sesi aktif
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isExamSessionOpen && document.visibilityState === "hidden") {
        setViolationsCount((prev) => prev + 1);
        const now = new Date().toLocaleTimeString("id-ID");
        setProctorLogs((prev) => [
          {
            time: now,
            message: "Fokus jendela browser terputus (Tab tidak aktif)",
            type: "danger",
          },
          ...prev,
        ]);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [isExamSessionOpen]);

  const handleStartExam = () => {
    setIsExamSessionOpen(true);
    setExamTimeLeft(120);
    setViolationsCount(0);
    setProctorLogs([
      {
        time: new Date().toLocaleTimeString("id-ID"),
        message: "Sesi ujian proctoring dimulai. Pemantauan fokus jendela aktif.",
        type: "ok",
      },
    ]);
  };

  const handleSimulateTabSwitch = () => {
    setViolationsCount((prev) => prev + 1);
    const now = new Date().toLocaleTimeString("id-ID");
    setProctorLogs((prev) => [
      {
        time: now,
        message: `Pelanggaran terdeteksi: Simulasi perpindahan tab / jendela aktif (#${
          violationsCount + 1
        })`,
        type: "warn",
      },
      ...prev,
    ]);
  };

  const handleResetDemo = () => {
    setKpiPercent(88);
    setHideBawahan(false);
    setSelectedOfficial(OFFICIALS_FIXTURES[1]);
    setIsExamSessionOpen(false);
    setExamTimeLeft(120);
    setViolationsCount(0);
    setProctorLogs([]);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Modul */}
      <div className="border-b border-line pb-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-[4px] bg-brand text-on-brand flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-brand block">
            Modul 05: Asesmen Pejabat Struktural & KPI 360°
          </span>
          <h3 className="text-[18px] sm:text-[20px] font-bold text-ink">
            Asesmen pejabat yang terukur dan adil.
          </h3>
          <p className="text-[14px] text-steel max-w-2xl mt-0.5">
            Assessment tahunan kompetensi pejabat struktural dan evaluasi KPI 360 derajat dengan anonimitas penilai.
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
                <td className="px-4 py-2 font-bold text-ink w-1/3">
                  Assessment tahunan pejabat struktural
                </td>
                <td className="px-4 py-2 text-steel">
                  Dimensi Manajerial, Sosial Kultural, dan Teknis terstandarisasi.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">
                  Evaluasi KPI 360°
                </td>
                <td className="px-4 py-2 text-steel">
                  Penilaian dari Atasan, Rekan, Bawahan; Diri sendiri sebagai pembanding objektif.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">
                  Anonimitas penilai
                </td>
                <td className="px-4 py-2 text-steel">
                  Kelompok dengan kurang dari 3 penilai disembunyikan otomatis untuk perlindungan integritas.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">
                  Uji kompetensi dan proctoring
                </td>
                <td className="px-4 py-2 text-steel">
                  Sesi terawasi dengan pemantauan fokus tab layar dan pencatatan log pelanggaran.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">
                  Assessment rekrutmen & Evaluasi Kinerja
                </td>
                <td className="px-4 py-2 text-steel">
                  Seleksi jabatan struktural dengan skor otomatis menggabungkan KPI (60%) dan 360° (40%).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigasi Tab Internal Modul */}
      <div className="flex border-b border-line gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("360")}
          className={`pb-2.5 px-3 text-[13px] font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "360"
              ? "border-brand text-brand"
              : "border-transparent text-steel hover:text-ink"
          }`}
        >
          Tab 1: KPI 360° & Analisis Blind Spot
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("kompetensi")}
          className={`pb-2.5 px-3 text-[13px] font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "kompetensi"
              ? "border-brand text-brand"
              : "border-transparent text-steel hover:text-ink"
          }`}
        >
          Tab 2: Kompetensi Jabatan & Proctoring Ujian
        </button>
      </div>

      {/* ===================== TAB 1: KPI 360 ===================== */}
      {activeTab === "360" && (
        <div className="space-y-6">
          <div className="bg-canvas/50 border border-line rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                Subjek Evaluasi
              </span>
              <span className="text-[15px] font-bold text-ink">
                Andi Wijaya · Manager (Divisi Operasional)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-steel">Periode Evaluasi:</span>
              <span className="font-mono text-[12px] font-bold text-ink bg-paper px-2.5 py-1 rounded-[4px] border border-line">
                Tahun 2026 (Semester II)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Kolom Kiri: Radar SVG (5 Kolom) */}
            <div className="lg:col-span-5">
              <Radar360 hideBawahan={hideBawahan} />
            </div>

            {/* Kolom Kanan: Detail Penilaian & Kontrol (7 Kolom) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Kontrol Anonimitas */}
              <div className="bg-paper border border-line rounded-[4px] p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                      Kontrol Perlindungan Penilai (Anonimitas)
                    </span>
                    <span className="text-[13px] font-bold text-ink">
                      Simulasikan Penilai Bawahan &lt; 3 Orang:
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={hideBawahan}
                      onChange={(e) => setHideBawahan(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-control peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-line after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand" />
                  </label>
                </div>
                {hideBawahan ? (
                  <div className="bg-warn-bg/50 border border-warn/30 p-2.5 rounded-[4px] text-[12px] text-ink flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warn shrink-0" />
                    <span>
                      <strong>Anonimitas Aktif:</strong> Kelompok bawahan disembunyikan (hanya 2 penilai). Bobot dinormalisasi ulang menjadi Atasan (4/7) dan Rekan (3/7).
                    </span>
                  </div>
                ) : (
                  <p className="text-[12px] text-steel">
                    Kelompok penilai lengkap (Atasan 40%, Rekan 30%, Bawahan 30%). Diri sendiri sebagai tolok ukur refleksi.
                  </p>
                )}
              </div>

              {/* Rincian Skor per Kelompok */}
              <div className="bg-paper border border-line rounded-[4px] p-4 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block mb-1">
                  Rincian Penilai & Skor Rata-rata
                </span>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between items-center py-1 border-b border-line">
                    <span className="text-ink font-semibold">Atasan Langsung (1 Penilai)</span>
                    <span className="font-mono font-bold text-brand">4,20 · Bobot {hideBawahan ? "57,1% (4/7)" : "40%"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-line">
                    <span className="text-ink font-semibold">Rekan Sejawat (5 Penilai)</span>
                    <span className="font-mono font-bold text-steel">3,80 · Bobot {hideBawahan ? "42,9% (3/7)" : "30%"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-line">
                    <span className="text-ink font-semibold">Bawahan Langsung</span>
                    {hideBawahan ? (
                      <span className="font-mono text-warn font-semibold text-[11px]">
                        Disembunyikan (anonimitas: &lt;3 penilai)
                      </span>
                    ) : (
                      <span className="font-mono font-bold text-ink">3,60 · Bobot 30% (7 Penilai)</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-1 text-steel">
                    <span>Diri Sendiri (Refleksi)</span>
                    <span className="font-mono font-bold">4,50 (Pembanding Objektif)</span>
                  </div>
                </div>
              </div>

              {/* Slider KPI */}
              <div className="bg-paper border border-line rounded-[4px] p-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-bold text-ink">
                    Pencapaian KPI Individu:
                  </span>
                  <span className="font-mono text-[16px] font-bold text-brand">
                    {kpiPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="1"
                  value={kpiPercent}
                  onChange={(e) => setKpiPercent(Number(e.target.value))}
                  className="w-full accent-brand cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-steel">
                  <span>0%</span>
                  <span>Target: 100%</span>
                  <span>120% (Maks)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Hasil Akhir Kelayakan (Lebar Penuh) */}
          <div className="bg-canvas/50 border-2 border-line rounded-[4px] p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                  Rekapitulasi Skor Akhir Kinerja & Kompetensi
                </span>
                <div className="flex flex-wrap items-baseline gap-3 mt-1">
                  <span className="text-[28px] font-mono font-bold text-ink">
                    {result360.nilaiAkhir.toFixed(2).replace(".", ",")}
                  </span>
                  <StatusChip
                    status={
                      result360.kategori === "Layak"
                        ? "ok"
                        : result360.kategori === "Layak dengan pengembangan"
                        ? "warn"
                        : "danger"
                    }
                    text={result360.kategori}
                  />
                </div>
                <p className="text-[12px] text-steel mt-1 leading-relaxed">
                  Formula terstandardisasi: 60% Skor KPI ({result360.skorKPI.toFixed(2).replace(".", ",")}) + 40% Skor 360° ({result360.nilai360.toFixed(2).replace(".", ",")}).
                </p>
              </div>

              {/* Analisis Blind Spot */}
              <div className="border-t md:border-t-0 md:border-l border-line pt-3 md:pt-0 md:pl-5 text-[12px] space-y-1 max-w-sm">
                <span className="font-bold text-ink block">
                  Analisis Blind Spot Refleksi:
                </span>
                <p className="text-steel">
                  Selisih penilaian diri (4,50) dengan nilai agregat penilai ({result360.nilai360.toFixed(2).replace(".", ",")}):
                </p>
                <div className="font-mono font-bold text-brand text-[14px]">
                  +{result360.blindSpot.toFixed(2).replace(".", ",")} (Indikasi Kepercayaan Diri Tinggi)
                </div>
                <span className="text-[11px] text-steel block">
                  Rekomendasi: Penyelarasan ekspektasi dan penguatan komunikasi dua arah dengan tim bawahan.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: KOMPETENSI JABATAN & PROCTORING ===================== */}
      {activeTab === "kompetensi" && (
        <div className="space-y-6">
          {/* Matriks 4 Pejabat (Lebar Penuh) */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
              Daftar Evaluasi Pejabat Struktural Tahun 2026
            </span>
            <div className="border border-line rounded-[4px] bg-paper overflow-hidden">
              <div
                tabIndex={0}
                role="region"
                aria-label="Tabel Evaluasi Pejabat Struktural"
                className="overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
              >
                <table className="w-full text-left text-[13px] min-w-[620px]">
                  <thead className="bg-panel border-b border-line text-[11px] font-mono uppercase text-steel">
                    <tr>
                      <th className="px-4 py-2.5">Nama Pejabat</th>
                      <th className="px-4 py-2.5">Jabatan</th>
                      <th className="px-4 py-2.5 text-right">Manajerial</th>
                      <th className="px-4 py-2.5 text-right">Sosial Kultural</th>
                      <th className="px-4 py-2.5 text-right">Teknis</th>
                      <th className="px-4 py-2.5 text-right">Rata-rata</th>
                      <th className="px-4 py-2.5">Rekomendasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {OFFICIALS_FIXTURES.map((off) => {
                      const isSelected = selectedOfficial.id === off.id;
                      return (
                        <tr
                          key={off.id}
                          onClick={() => setSelectedOfficial(off)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-brand/5 font-semibold" : "hover:bg-canvas"
                          }`}
                        >
                          <td className="px-4 py-3 text-ink font-bold flex items-center gap-2 whitespace-nowrap">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
                            {off.name}
                          </td>
                          <td className="px-4 py-3 text-steel whitespace-nowrap">{off.position}</td>
                          <td className="px-4 py-3 text-right font-mono text-ink">
                            {off.manajerial.toFixed(1).replace(".", ",")}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-ink">
                            {off.sosialKultural.toFixed(1).replace(".", ",")}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-ink">
                            {off.teknis.toFixed(1).replace(".", ",")}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-brand">
                            {off.rataRata.toFixed(2).replace(".", ",")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <StatusChip
                              status={
                                off.rekomendasi === "Layak"
                                  ? "ok"
                                  : off.rekomendasi === "Layak dengan pengembangan"
                                  ? "warn"
                                  : "danger"
                              }
                              text={off.rekomendasi}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <span className="text-[11px] text-steel italic block">
              * Klik salah satu baris pejabat di atas untuk melihat profil tindak lanjut pengembangan.
            </span>
          </div>

          {/* Rincian Pejabat Terpilih */}
          <div className="bg-canvas/50 border border-line rounded-[4px] p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                Rencana Tindak Lanjut Pejabat
              </span>
              <h4 className="text-[15px] font-bold text-ink">
                {selectedOfficial.name} — {selectedOfficial.position}
              </h4>
              <p className="text-[12px] text-steel mt-1 max-w-xl leading-relaxed">
                {selectedOfficial.rekomendasi === "Layak" &&
                  "Memenuhi seluruh kualifikasi kompetensi eselon. Direkomendasikan untuk promosi kepemimpinan strategis dan program suksesi talent pool."}
                {selectedOfficial.rekomendasi === "Layak dengan pengembangan" &&
                  "Kualifikasi teknis kuat namun memerlukan penguatan pada aspek negosiasi lintas unit dan manajemen perubahan organisasi."}
                {selectedOfficial.rekomendasi === "Belum layak" &&
                  "Belum memenuhi ambang batas kompetensi minimum. Wajib mengikuti bimbingan teknis intensif dan re-evaluasi 6 bulan mendatang."}
              </p>
            </div>
            <div className="shrink-0">
              {!isExamSessionOpen ? (
                <Button variant="primary" onClick={handleStartExam} className="min-h-[40px] py-2 px-4 text-[13px] font-semibold leading-snug text-center">
                  Mulai Sesi Uji (Simulasi)
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setIsExamSessionOpen(false)} className="min-h-[40px] py-2 px-4 text-[13px] font-semibold leading-snug text-center">
                  Tutup Sesi Uji
                </Button>
              )}
            </div>
          </div>

          {/* Area Simulasi Ujian & Proctoring */}
          {isExamSessionOpen && (
            <div className="border-2 border-brand rounded-[4px] bg-paper p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-ok" />
                  <span className="text-[14px] font-bold text-ink">
                    Sesi Uji Kompetensi Aktif — Studi Kasus Pejabat
                  </span>
                  <span className="text-[11px] font-mono bg-panel px-2 py-0.5 rounded border border-line text-steel">
                    ID-SESI: UJ-2026-X8
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Timer Hitung Mundur */}
                  <div className="flex items-center gap-1.5 font-mono text-[15px] font-bold">
                    <Clock
                      className={`w-4 h-4 ${
                        examTimeLeft <= 30 ? "text-warn" : "text-brand"
                      }`}
                    />
                    <span
                      className={
                        examTimeLeft <= 30
                          ? "text-warn bg-warn-bg px-2 py-0.5 rounded border border-warn/30"
                          : "text-ink"
                      }
                    >
                      {formatTimer(examTimeLeft)}
                    </span>
                  </div>

                  {/* Status Proctoring */}
                  <div className="flex items-center gap-1.5 text-[12px] bg-panel px-2.5 py-1 rounded border border-line">
                    <ShieldCheck className="w-4 h-4 text-ok" />
                    <span className="font-semibold text-ink">Proctoring Aktif</span>
                  </div>
                </div>
              </div>

              {/* Soal Studi Kasus */}
              <div className="bg-canvas border border-line rounded-[4px] p-4 text-[13px] space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
                  Soal Analisis Kasus Manajerial:
                </span>
                <p className="font-semibold text-ink leading-relaxed">
                  KASUS: Terjadi perselisihan penerapan shift kerja dan jam lembur antara serikat pekerja unit produksi cabang dengan manajemen pusat yang berpotensi memicu mogok kerja. Bagaimana langkah terstruktur Anda sebagai pimpinan dalam menangani mitigasi risiko kepatuhan ketenagakerjaan ini?
                </p>
                <div className="space-y-1.5 pt-2">
                  {[
                    "A. Melakukan konsiliasi tripartit dengan Dinas Tenaga Kerja setempat.",
                    "B. Menerapkan audit trail absensi dan rekonsiliasi data lembur bersama perwakilan serikat.",
                    "C. Mengeluarkan surat peringatan bagi seluruh karyawan yang menolak jam kerja shift.",
                    "D. Menghentikan operasional cabang sementara hingga tercapai mufakat.",
                  ].map((opt, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 p-2 rounded hover:bg-paper cursor-pointer border border-transparent hover:border-line"
                    >
                      <input
                        type="radio"
                        name="exam-option"
                        defaultChecked={i === 1}
                        className="accent-brand"
                      />
                      <span className="text-ink">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Kontrol Uji Pelanggaran Proctoring */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleSimulateTabSwitch}
                    className="text-[12px] min-h-[38px] py-1.5 px-3 font-semibold leading-snug text-center"
                  >
                    Simulasikan Pindah Tab
                  </Button>
                  <span className="text-[12px] text-steel">
                    (Uji deteksi otomatis pelanggaran integritas layar)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-ink">
                    Total Pelanggaran:
                  </span>
                  <span
                    className={`font-mono text-[13px] font-bold px-2 py-0.5 rounded ${
                      violationsCount > 0
                        ? "bg-warn-bg text-warn border border-warn/30"
                        : "bg-panel text-steel border border-line"
                    }`}
                  >
                    {violationsCount} Pelanggaran
                  </span>
                </div>
              </div>

              {/* Log Proctoring */}
              {proctorLogs.length > 0 && (
                <div className="bg-canvas border border-line rounded-[4px] p-3 text-[11px] font-mono space-y-1">
                  <span className="text-steel font-bold block mb-1 uppercase">
                    Audit Log Proctoring Real-Time:
                  </span>
                  {proctorLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 ${
                        log.type === "danger"
                          ? "text-danger font-bold"
                          : log.type === "warn"
                          ? "text-warn"
                          : "text-steel"
                      }`}
                    >
                      <span>[{log.time}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Bukti Audit */}
      <div className="flex items-center gap-2 text-steel text-[12px] pt-3 border-t border-line">
        <Lock className="w-4 h-4 text-brand shrink-0" />
        <span>
          <strong>Bukti audit:</strong> Skor per penilai disimpan terenkripsi; hasil ditampilkan agregat demi perlindungan objektivitas penilai.
        </span>
      </div>
    </div>
  );
};
