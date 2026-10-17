"use client";

import React, { useState } from "react";
import {
  Fingerprint,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import { BranchMap } from "@/components/diagrams/BranchMap";
import {
  INITIAL_BRANCHES,
  syncSummary,
  reconnectBranch,
  toWIB,
  type TimeZone,
  type BranchRecord,
} from "@/lib/sync";

export const AbsensiDemo: React.FC = () => {
  const [branches, setBranches] = useState<BranchRecord[]>(INITIAL_BRANCHES);
  const [isJayapuraConnected, setIsJayapuraConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncText, setLastSyncText] = useState<string>("09:30:15 WIB");

  // State untuk pengujian konversi waktu
  const [testTime, setTestTime] = useState<string>("08:30");
  const [testZone, setTestZone] = useState<TimeZone>("WIT");

  const summary = syncSummary(branches);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0] + " WIB";
      setLastSyncText(timeStr);
    }, 600);
  };

  const handleReconnectJayapura = () => {
    const updated = reconnectBranch(branches, "jyp");
    setBranches(updated);
    setIsJayapuraConnected(true);
  };

  const normalizedWIB = toWIB("2026-10-19", testTime, testZone).split(" ")[1];

  const formatAngka = (num: number) => {
    return num.toLocaleString("id-ID");
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Modul */}
      <div className="border-b border-line pb-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-[4px] bg-brand text-on-brand flex items-center justify-center shrink-0">
          <Fingerprint className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-brand block">
            Modul 02: Absensi Multi-Cabang
          </span>
          <h3 className="text-[18px] sm:text-[20px] font-bold text-ink">
            Seluruh cabang, satu data kehadiran nasional.
          </h3>
          <p className="text-[14px] text-steel max-w-2xl mt-0.5">
            Mesin fingerprint tiap cabang tersinkron ke server cloud terpusat, dengan zona waktu dinormalisasi otomatis.
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
                <td className="px-4 py-2 font-bold text-ink w-1/3">Sinkronisasi fingerprint multi-cabang</td>
                <td className="px-4 py-2 text-steel">Protokol push otomatis dari mesin fingerprint lokal ke server cloud terpusat.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Normalisasi zona waktu</td>
                <td className="px-4 py-2 text-steel">Pencatatan waktu lokal asal (WIB/WITA/WIT) dan normalisasi standar WIB untuk payroll.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Deduplikasi & antrean offline</td>
                <td className="px-4 py-2 text-steel">Pembersihan log ganda dan buffer offline saat koneksi cabang terputus.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Rekap kehadiran real-time</td>
                <td className="px-4 py-2 text-steel">Dashboard eksekutif konsolidasi absensi 7 cabang dengan SLA sinkronisasi &lt; 5 detik.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Shift kerja & dinas luar GPS</td>
                <td className="px-4 py-2 text-steel">Rotasi shift, kalender libur nasional, dan kanal pelengkap GPS mobile geofencing.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bagian 1: Dashboard Agregasi Log Nasional (Lebar Penuh) */}
      <div className="bg-canvas/50 border border-line rounded-[4px] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-2.5">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
              Agregasi Log Nasional
            </span>
            <h4 className="text-[15px] font-bold text-ink">
              Konsolidasi Mesin Fingerprint Seluruh Cabang
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primary"
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="text-[12px] min-h-[38px] py-1.5 px-3.5 gap-1.5 font-semibold leading-snug"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>Sinkronkan Semua</span>
            </Button>
          </div>
        </div>

        {/* 4 Kartu Metrik Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-paper border border-line rounded text-center">
            <div className="text-[20px] font-mono font-bold text-ink">
              {summary.totalMachines}
            </div>
            <div className="text-[11px] text-steel font-medium">Mesin Terdaftar</div>
          </div>
          <div className="p-3 bg-paper border border-line rounded text-center">
            <div className="text-[20px] font-mono font-bold text-ink">
              {formatAngka(summary.totalRawLogs)}
            </div>
            <div className="text-[11px] text-steel font-medium">Log Mentah Masuk</div>
          </div>
          <div className="p-3 bg-paper border border-line rounded text-center">
            <div className="text-[20px] font-mono font-bold text-warn">
              {summary.totalDuplicates}
            </div>
            <div className="text-[11px] text-steel font-medium">Duplikat Tereliminasi</div>
          </div>
          <div className="p-3 bg-brand-tint border border-brand/20 rounded text-center">
            <div className="text-[20px] font-mono font-bold text-brand">
              {formatAngka(summary.totalUniqueLogs)}
            </div>
            <div className="text-[11px] text-brand font-bold">Log Bersih Unik</div>
          </div>
        </div>

        {/* Indikator Rekapitulasi Nasional */}
        <div className="p-3 bg-paper border border-line rounded space-y-1.5 text-[12px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-steel font-medium">Tingkat Kehadiran Nasional Hari Ini:</span>
            <span className="font-mono font-bold text-ink">
              8.742 / 9.310 Karyawan Aktif (93,9%)
            </span>
          </div>
          <div className="w-full h-2 bg-line rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full" style={{ width: "93.9%" }} />
          </div>
          <div className="flex flex-wrap items-center justify-between text-[11px] text-steel pt-0.5 font-mono">
            <span>Terlambat: 284 orang</span>
            <span>Izin / Sakit: 284 orang</span>
            <span>Sinkronisasi Terakhir: {lastSyncText}</span>
          </div>
        </div>
      </div>

      {/* Bagian 2: Peta Skematik Cabang & Alat Uji Normalisasi Waktu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Kolom Kiri: Peta Skematik (7 Kolom) */}
        <div className="lg:col-span-7 min-w-0">
          <BranchMap isJayapuraConnected={isJayapuraConnected} />
        </div>

        {/* Kolom Kanan: Alat Uji Normalisasi Zona Waktu (5 Kolom) */}
        <div className="lg:col-span-5 min-w-0 bg-paper border border-line rounded-[4px] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand" />
              <span>Normalisasi Multi-Zona Waktu</span>
            </span>
            <span className="text-[11px] font-mono text-steel">Fungsi Murni toWIB</span>
          </div>

          <div className="space-y-3 text-[13px]">
            <div>
              <label htmlFor="absensi-jam-lokal-input" className="font-semibold text-ink block mb-1">
                Jam Absen Lokal
              </label>
              <input
                id="absensi-jam-lokal-input"
                aria-label="Jam Absen Lokal"
                type="text"
                value={testTime}
                onChange={(e) => setTestTime(e.target.value)}
                placeholder="08:30"
                className="w-full h-10 px-3 font-mono font-bold border border-control rounded bg-paper text-ink"
              />
            </div>

            <div>
              <label htmlFor="absensi-zona-asal-select" className="font-semibold text-ink block mb-1">
                Zona Asal Cabang
              </label>
              <select
                id="absensi-zona-asal-select"
                aria-label="Zona Asal Cabang"
                value={testZone}
                onChange={(e) => setTestZone(e.target.value as TimeZone)}
                className="w-full h-10 px-3 font-medium border border-control rounded bg-paper text-ink"
              >
                <option value="WIB">WIB (UTC+7) - Jakarta, Bandung, Surabaya, Medan</option>
                <option value="WITA">WITA (UTC+8) - Balikpapan, Makassar</option>
                <option value="WIT">WIT (UTC+9) - Jayapura</option>
              </select>
            </div>

            <div className="p-3 bg-brand-tint border border-brand/20 rounded-[4px] flex items-center justify-between">
              <span className="text-[12px] font-semibold text-ink">
                Waktu Acuan Server Cloud:
              </span>
              <span className="font-mono font-bold text-[15px] text-brand">
                {normalizedWIB} WIB
              </span>
            </div>
            <p className="text-[11px] text-steel leading-relaxed">
              Log kehadiran dari cabang WITA (-1 jam) dan WIT (-2 jam) diselaraskan secara otomatis ke zona WIB untuk perhitungan lembur terpusat.
            </p>
          </div>
        </div>
      </div>

      {/* Bagian 3: Tabel Status Sinkronisasi 7 Cabang Nasional (Lebar Penuh) */}
      <div className="bg-paper border border-line rounded-[4px] p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-2.5">
          <div>
            <h4 className="text-[14px] font-bold text-ink">Status Cabang Operasional Nasional</h4>
            <span className="text-[11px] text-steel">
              Daftar mesin fingerprint per lokasi dan integritas paket data
            </span>
          </div>

          {!isJayapuraConnected && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReconnectJayapura}
              className="text-[11px] min-h-[34px] py-1.5 px-3 text-warn border-warn/40 hover:bg-warn-bg/20 font-semibold leading-snug text-center"
            >
              Hubungkan Ulang Jayapura (+38 Antrean)
            </Button>
          )}
        </div>

        <div className="border border-line rounded-[4px] overflow-hidden">
          <div
            tabIndex={0}
            role="region"
            aria-label="Tabel Cabang dan Rekap Log Fingerprint"
            className="overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
          >
            <table className="w-full text-left text-[12px] min-w-[620px]">
              <thead className="bg-panel border-b border-line text-[11px] font-bold uppercase tracking-wider text-steel">
                <tr>
                  <th scope="col" className="py-2.5 px-3 min-w-[120px]">Cabang</th>
                  <th scope="col" className="py-2.5 px-3 w-20">Zona</th>
                  <th scope="col" className="py-2.5 px-3 w-20 text-center">Mesin</th>
                  <th scope="col" className="py-2.5 px-3 text-right">Log Mentah</th>
                  <th scope="col" className="py-2.5 px-3 text-right">Duplikat</th>
                  <th scope="col" className="py-2.5 px-3 text-right">Log Bersih</th>
                  <th scope="col" className="py-2.5 px-3 w-36">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-[12px] font-mono">
                {branches.map((b) => (
                  <tr key={b.id} className="bg-paper hover:bg-canvas/50">
                    <td className="py-2.5 px-3 font-sans font-semibold text-ink">
                      {b.name}
                    </td>
                    <td className="py-2.5 px-3 text-steel">{b.zone}</td>
                    <td className="py-2.5 px-3 text-center text-steel">{b.machines}</td>
                    <td className="py-2.5 px-3 text-right text-steel">
                      {formatAngka(b.rawLogs)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-warn">
                      {b.duplicates}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-brand">
                      {formatAngka(b.rawLogs - b.duplicates)}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      {b.isOnline ? (
                        <StatusChip status="ok" text="Tersinkron" />
                      ) : (
                        <StatusChip status="warn" text="Offline (Antrean)" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Bukti Audit */}
      <div className="flex items-center gap-2 text-steel text-[12px] pt-3 border-t border-line">
        <Lock className="w-4 h-4 text-brand shrink-0" />
        <span>
          <strong>Bukti audit:</strong> Setiap log kehadiran disimpan permanen bersama ID mesin sumber, zona asal, dan timestamp normalisasi WIB untuk audit kepatuhan ketenagakerjaan.
        </span>
      </div>
    </div>
  );
};
