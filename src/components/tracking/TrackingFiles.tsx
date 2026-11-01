"use client";

import { useState } from "react";
import {
  prepareTrackingUploadAction,
  finalizeTrackingUploadAction,
  downloadTrackingFileAction,
} from "@/actions/tracking-files";
import { secondaryClass, Notice } from "./ui";

export type Attachment = { fileId: string; filename: string };
export function TrackingAttachments({
  value,
  onChange,
  adminProjectId,
  max = 5,
  onBusyChange,
}: {
  value: Attachment[];
  onChange: (files: Attachment[]) => void;
  adminProjectId?: string;
  max?: number;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="space-y-2">
      <label className="flex flex-col gap-2 text-xs text-[#52525b]">
        Lampiran privat (gambar, PDF, ZIP; maks. 5 MB per berkas)
        <input
          type="file"
          multiple={max > 1}
          accept="image/jpeg,image/png,image/webp,application/pdf,application/zip,.zip"
          disabled={busy || value.length >= max}
          className="max-w-full text-xs file:mr-3 file:min-h-11 file:rounded-lg file:border file:border-[#d4d4d8] file:bg-white file:px-3"
          onChange={async (event) => {
            const input = event.currentTarget;
            const files = [...(input.files ?? [])];
            if (files.length + value.length > max) {
              setError(`Maksimal ${max} lampiran.`);
              input.value = "";
              return;
            }
            setBusy(true);
            onBusyChange?.(true);
            setError("");
            const next = [...value];
            try {
              for (const file of files) {
                if (file.size > 5 * 1024 * 1024 || file.size === 0)
                  throw new Error("Ukuran berkas harus 1 byte sampai 5 MB.");
                const mimeType =
                  file.type ||
                  (/\.zip$/i.test(file.name) ? "application/zip" : "");
                const prepared = await prepareTrackingUploadAction(
                  { filename: file.name, mimeType, sizeBytes: file.size },
                  adminProjectId,
                );
                if (!prepared.ok) throw new Error(prepared.message);
                const uploaded = await fetch(prepared.data.uploadUrl, {
                  method: "PUT",
                  headers: { "Content-Type": mimeType },
                  body: file,
                });
                if (!uploaded.ok)
                  throw new Error(
                    "Unggah gagal. Periksa koneksi atau konfigurasi CORS bucket privat.",
                  );
                const finalized = await finalizeTrackingUploadAction(
                  prepared.data.fileId,
                  adminProjectId,
                );
                if (!finalized.ok) throw new Error(finalized.message);
                next.push(finalized.data);
                onChange([...next]);
              }
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Unggah belum berhasil.",
              );
            } finally {
              setBusy(false);
              onBusyChange?.(false);
              input.value = "";
            }
          }}
        />
      </label>
      {busy ? (
        <p role="status" className="text-xs">
          Mengunggah dan memverifikasi berkas…
        </p>
      ) : null}
      {value.map((file) => (
        <div
          key={file.fileId}
          className="flex items-center justify-between gap-3 text-xs"
        >
          <span className="break-all">{file.filename}</span>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              onChange(value.filter((f) => f.fileId !== file.fileId))
            }
            className="min-h-11 px-2 underline"
            aria-label={`Hapus lampiran ${file.filename}`}
          >
            Hapus
          </button>
        </div>
      ))}
      <Notice error={error} />
    </div>
  );
}
export function DownloadFile({
  fileId,
  label,
  adminProjectId,
}: {
  fileId: string;
  label: string;
  adminProjectId?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <span className="inline-flex max-w-full flex-col gap-1">
      <button
        type="button"
        className={secondaryClass}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const result = await downloadTrackingFileAction(
              fileId,
              adminProjectId,
            );
            if (!result.ok) {
              setError(result.message);
              return;
            }
            window.location.assign(result.data.url);
          } catch {
            setError("Berkas belum dapat diunduh.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Menyiapkan unduhan…" : label}
      </button>
      <Notice error={error} />
    </span>
  );
}
