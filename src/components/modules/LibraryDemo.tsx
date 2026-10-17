"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Lock,
  FileCheck,
  Search,
  CheckCircle2,
  Download,
  History,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  LIBRARY_DOCUMENTS,
  canView,
  type LibraryUserRole,
  type LibraryDocument,
  type DocumentType,
} from "@/lib/library";

export const LibraryDemo: React.FC = () => {
  const [role, setRole] = useState<LibraryUserRole>("karyawan");
  const [search, setSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedDoc, setSelectedDoc] = useState<LibraryDocument>(
    LIBRARY_DOCUMENTS[4] // KB-003 default
  );
  const [readConfirmed, setReadConfirmed] = useState<boolean>(false);

  const filteredDocs = LIBRARY_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      doc.number.toLowerCase().includes(search.toLowerCase()) ||
      doc.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const isSelectedVisible = canView(role, selectedDoc.classification);

  return (
    <div className="space-y-6 w-full">
      {/* Header Modul */}
      <div className="border-b border-line pb-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-[4px] bg-brand text-on-brand flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-brand block">
            Modul 04: Repositori Dokumen Legal & ISO
          </span>
          <h3 className="text-[18px] sm:text-[20px] font-bold text-ink">
            Dokumen resmi dengan klasifikasi, versi, dan bukti baca.
          </h3>
          <p className="text-[14px] text-steel max-w-2xl mt-0.5">
            Repositori dokumen ISO, SK Direksi, dan kebijakan kerahasiaan dengan kontrol hak akses granular dan riwayat versi.
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
                <td className="px-4 py-2 font-bold text-ink w-1/3">Repositori dokumen ISO terkendali</td>
                <td className="px-4 py-2 text-steel">Manual mutu, SOP kerja, formulir, dan instruksi kerja selaras ISO 9001 / ISO 27001.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">SK Direksi & tata kelola</td>
                <td className="px-4 py-2 text-steel">Penomoran terpusat, tanggal penetapan, tanggal berlaku, dan divisi penanggung jawab.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Kebijakan kerahasiaan & pakta</td>
                <td className="px-4 py-2 text-steel">Pelacakan bukti konfirmasi baca digital per individu karyawan dengan stempel waktu audit.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Klasifikasi hak akses (RBAC)</td>
                <td className="px-4 py-2 text-steel">Tingkat kerahasiaan: Publik, Internal, Rahasia, dan Sangat Rahasia.</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold text-ink">Riwayat versi & peninjauan berkala</td>
                <td className="px-4 py-2 text-steel">Catatan perubahan versi dokumen dan jadwal review kepatuhan tahunan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Kontrol Peran RBAC & Filter Pencarian */}
      <div className="bg-canvas/50 border border-line rounded-[4px] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel block">
              Simulasi Hak Akses Berbasis Peran (RBAC)
            </span>
            <span className="text-[14px] font-bold text-ink">
              Pilih Peran Pengguna Aktif:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[12px]">
            {(
              [
                { id: "karyawan", label: "Karyawan (Publik & Internal)" },
                { id: "manajer", label: "Manajer (+ Rahasia)" },
                { id: "hrd", label: "HRD Director (Semua Dokumen)" },
                { id: "auditor", label: "Auditor Internal (Semua Dokumen)" },
              ] as const
            ).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`px-3 py-1.5 rounded-[4px] font-semibold border transition-colors select-none ${
                  role === r.id
                    ? "bg-brand text-on-brand border-brand font-bold"
                    : "bg-paper text-ink border-line hover:bg-canvas"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Pencarian & Filter Jenis */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-[13px]">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-steel absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Cari nomor dokumen (mis. ISO-IS-001) atau judul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-9 pr-3 border border-control rounded bg-paper text-ink font-medium"
            />
          </div>
          <div className="sm:col-span-4">
            <select
              aria-label="Filter Jenis Dokumen"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full h-11 px-3 border border-control rounded bg-paper text-ink font-medium"
            >
              <option value="ALL">Semua Jenis Dokumen</option>
              <option value="ISO">Dokumen ISO</option>
              <option value="SK Direksi">SK Direksi</option>
              <option value="Kebijakan">Kebijakan Kerahasiaan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel 10 Dokumen Terkendali (Lebar Penuh) */}
      <div className="bg-paper border border-line rounded-[4px] p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-line pb-2.5">
          <h4 className="text-[14px] font-bold text-ink">
            Katalog Dokumen Terkendali ({filteredDocs.length} Dokumen)
          </h4>
          <span className="text-[11px] font-mono text-steel">
            * Klik salah satu baris dokumen untuk membuka rincian dan riwayat versi
          </span>
        </div>

        <div className="border border-line rounded-[4px] overflow-hidden">
          <div
            tabIndex={0}
            role="region"
            aria-label="Katalog Dokumen Terkendali"
            className="overflow-x-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
          >
            <table className="w-full text-left text-[12px] min-w-[620px]">
              <thead className="bg-panel border-b border-line text-[11px] font-bold uppercase tracking-wider text-steel">
                <tr>
                  <th scope="col" className="py-2.5 px-3 w-32 whitespace-nowrap">Nomor Dokumen</th>
                  <th scope="col" className="py-2.5 px-3 min-w-[200px]">Judul Dokumen Resmi</th>
                  <th scope="col" className="py-2.5 px-3 w-16 text-center">Versi</th>
                  <th scope="col" className="py-2.5 px-3 w-28">Klasifikasi</th>
                  <th scope="col" className="py-2.5 px-3 w-28">Status</th>
                  <th scope="col" className="py-2.5 px-3 w-32">Review Berikutnya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-[12px]">
                {filteredDocs.map((doc) => {
                  const isAllowed = canView(role, doc.classification);
                  const isSelected = selectedDoc.id === doc.id;

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-brand-tint/40 font-semibold"
                          : "bg-paper hover:bg-canvas/50"
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-brand whitespace-nowrap">
                        {doc.number}
                      </td>
                      <td className="py-2.5 px-3">
                        {isAllowed ? (
                          <span className="text-ink font-medium">{doc.title}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-steel italic">
                            <Lock className="w-3.5 h-3.5 text-danger shrink-0" />
                            <span>Akses dibatasi ({doc.classification})</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-center text-steel">{doc.version}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-panel text-steel border border-line whitespace-nowrap">
                          {doc.classification}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {doc.status === "Berlaku" ? (
                          <StatusChip status="ok" text="Berlaku" />
                        ) : doc.status === "Kedaluwarsa" ? (
                          <StatusChip status="danger" text="Kedaluwarsa" />
                        ) : (
                          <StatusChip status="neutral" text="Draft" />
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-steel whitespace-nowrap">
                        {doc.nextReview}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bagian 2: Panel Rincian Dokumen Terpilih & Pakta Integritas (Lebar Penuh) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Kolom Kiri: Rincian Versi Dokumen Terpilih (7 Kolom) */}
        <div className="md:col-span-7 bg-paper border border-line rounded-[4px] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
              <History className="w-4 h-4 text-brand" />
              <span>Riwayat Versi Dokumen</span>
            </span>
            <span className="font-mono text-[12px] font-bold text-brand">
              {selectedDoc.number}
            </span>
          </div>

          {isSelectedVisible ? (
            <div className="space-y-3.5 text-[12px]">
              <div>
                <h5 className="font-bold text-ink text-[14px]">{selectedDoc.title}</h5>
                <span className="text-[11px] text-steel">
                  Tipe: {selectedDoc.type} · Berlaku sejak: {selectedDoc.history[0]?.date || "2026-01-15"}
                </span>
              </div>

              {/* Tabel Riwayat Versi */}
              <div className="border border-line rounded overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-panel border-b border-line text-steel uppercase font-mono">
                    <tr>
                      <th className="py-1.5 px-3">Versi</th>
                      <th className="py-1.5 px-3">Penyetuju</th>
                      <th className="py-1.5 px-3">Ringkasan Perubahan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {selectedDoc.history.map((v) => (
                      <tr key={v.version} className="bg-paper">
                        <td className="py-2 px-3 font-mono font-bold text-brand">{v.version}</td>
                        <td className="py-2 px-3 text-steel">{v.approvedBy}</td>
                        <td className="py-2 px-3 text-ink">{v.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Button variant="outline" className="text-[12px] min-h-[38px] py-1.5 px-3.5 gap-1.5 font-semibold leading-snug text-center">
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen Resmi (Ber-Watermark)</span>
                </Button>
                <span className="text-[11px] text-steel italic">
                  * Setiap unduhan tercatat dalam jejak audit kepatuhan.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 border border-dashed border-danger/40 rounded bg-danger-bg/20 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-danger mx-auto" />
              <h5 className="font-bold text-ink text-[14px]">Akses Dokumen Dibatasi</h5>
              <p className="text-[12px] text-steel max-w-sm mx-auto">
                Peran pengguna saat ini ({role.toUpperCase()}) tidak memiliki wewenang untuk membuka dokumen dengan tingkat klasifikasi <strong>{selectedDoc.classification}</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Pelacakan Bukti Baca Pakta Integritas (5 Kolom) */}
        <div className="md:col-span-5 bg-paper border border-line rounded-[4px] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-ok" />
              <span>Pelacakan Bukti Baca (Kepatuhan)</span>
            </span>
            <span className="text-[11px] font-mono text-steel">KB-003</span>
          </div>

          <div className="space-y-3 text-[12px]">
            <div>
              <span className="font-bold text-ink block">KB-003 Perjanjian Kerahasiaan Karyawan</span>
              <p className="text-steel text-[11px] mt-0.5">
                Kewajiban penandatanganan pakta integritas dan kerahasiaan data tahunan.
              </p>
            </div>

            {/* Progress Bar Karyawan */}
            <div className="p-3 bg-canvas border border-line rounded space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-steel">Status Penyelesaian Organisasi:</span>
                <span className="font-mono font-bold text-brand">
                  {readConfirmed ? "1.843" : "1.842"} / 2.000 Karyawan
                </span>
              </div>
              <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-300"
                  style={{ width: readConfirmed ? "92.15%" : "92.1%" }}
                />
              </div>
              <span className="text-[10px] text-steel block text-right font-mono">
                Tingkat Kepatuhan: 92,1%
              </span>
            </div>

            {/* Aksi Konfirmasi Baca Pengguna */}
            <div className="pt-2">
              {!readConfirmed ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setReadConfirmed(true)}
                  className="w-full text-[12px] min-h-[40px] py-2 px-3 font-semibold leading-snug text-center"
                >
                  Saya Telah Membaca dan Menyetujui
                </Button>
              ) : (
                <div className="p-3 bg-ok-bg text-ok border border-ok/30 rounded flex items-center justify-between font-bold text-[12px]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Dikonfirmasi & Disahkan
                  </span>
                  <button
                    type="button"
                    onClick={() => setReadConfirmed(false)}
                    className="text-[11px] underline text-steel hover:text-ink font-mono"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bukti Audit */}
      <div className="flex items-center gap-2 text-steel text-[12px] pt-3 border-t border-line">
        <Lock className="w-4 h-4 text-brand shrink-0" />
        <span>
          <strong>Bukti audit:</strong> Akses, pengunduhan dokumen berwatermark identitas pengguna, dan stempel waktu konfirmasi baca tercatat permanen pada sistem audit repository.
        </span>
      </div>
    </div>
  );
};
