"use client";

import { useState } from "react";
import { convertLeadAction } from "@/actions/admin/tracking";
import { ToolbarButton } from "./AdminUi";

const inputClass =
  "w-full rounded-[10px] border border-[#eaeaea] bg-white px-3 py-2 text-xs text-[#18181a] outline-none focus:border-[#18181a] transition-all";

export type LeadConversionSource = "inquiry" | "quote";

/**
 * Form konversi lead menjadi proyek klien.
 *
 * Nama, WhatsApp, dan email sengaja **tidak** ditampilkan sebagai isian: nilai
 * itu dibaca ulang dari baris lead di server. Yang diisi admin hanya hal yang
 * memang belum diketahui lead — judul proyek, nilai kontrak, dan tanggal.
 *
 * Nilai kontrak wajib diisi. Harga paket atau rentang kalkulator bukan harga
 * deal, jadi tidak dipakai otomatis; menebaknya berarti membuat proyek dengan
 * nilai yang tidak pernah disepakati klien.
 */
export function LeadConversionPanel({
  source,
  sourceId,
  suggestedTitle,
  suggestedCost,
  disabled,
  onConverted,
}: {
  source: LeadConversionSource;
  sourceId: string;
  suggestedTitle: string;
  suggestedCost: number | null;
  disabled?: boolean;
  onConverted: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(suggestedTitle);
  const [cost, setCost] = useState(suggestedCost ? String(suggestedCost) : "");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    const totalCost = Number(cost);
    if (!title.trim()) {
      setError("Judul proyek wajib diisi.");
      return;
    }
    if (!Number.isInteger(totalCost) || totalCost < 0) {
      setError("Nilai kontrak harus angka bulat rupiah tanpa titik atau koma.");
      return;
    }
    setBusy(true);
    try {
      const result = await convertLeadAction({
        source,
        sourceId,
        projectTitle: title.trim(),
        totalCost,
        categoryId: null,
        servicePackageId: null,
        startDate,
        targetCompletionDate: targetDate,
        internalNotes: "",
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setOpen(false);
      onConverted(
        `Proyek klien dibuat dengan kode ${result.data.project.trackingCode}. PIN akses: ${result.data.pin} — catat sekarang, PIN tidak ditampilkan lagi.`
      );
    } catch {
      setError("Konversi gagal. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div className="mt-4 rounded-[12px] border border-[#eaeaea] bg-[#fcfcfc] p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-[#18181a]">
              Jadikan Proyek Klien
            </div>
            <p className="m-0 mt-0.5 text-[11px] text-[#71717a]">
              Membuat portal klien dari lead ini tanpa mengetik ulang identitas.
            </p>
          </div>
          <ToolbarButton
            variant="light"
            icon="arrow_forward"
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            Konversi
          </ToolbarButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-[12px] border border-[#18181a] bg-white p-3.5">
      <div className="text-xs font-semibold text-[#18181a]">
        Konversi Lead ke Proyek Klien
      </div>
      <p className="m-0 mt-1 text-[11px] text-[#71717a]">
        Nama, WhatsApp, dan email diambil dari data lead. Isi hanya yang belum
        diketahui.
      </p>

      <div className="mt-3 grid gap-3">
        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Judul Proyek
          <input
            className={inputClass}
            value={title}
            maxLength={200}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Sistem Informasi Inventori"
          />
        </label>

        <label className="grid gap-1 text-xs font-medium text-[#52525b]">
          Nilai Kontrak (Rp)
          <input
            className={inputClass}
            value={cost}
            inputMode="numeric"
            onChange={(e) => setCost(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="5000000"
          />
          <span className="text-[11px] font-normal text-[#71717a]">
            Harga deal final, bukan rentang estimasi kalkulator.
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-xs font-medium text-[#52525b]">
            Mulai
            <input
              className={inputClass}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-[#52525b]">
            Target Selesai
            <input
              className={inputClass}
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </label>
        </div>

        {error ? (
          <p
            className="m-0 rounded-[8px] border border-[#ef4444]/30 bg-[#fef2f2] p-2.5 text-[11px] text-[#b91c1c]"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <ToolbarButton
            variant="dark"
            icon="check"
            disabled={busy}
            onClick={() => void submit()}
          >
            {busy ? "Mengonversi…" : "Buat Proyek Klien"}
          </ToolbarButton>
          <ToolbarButton
            variant="light"
            icon="close"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              setError("");
            }}
          >
            Batal
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
}
