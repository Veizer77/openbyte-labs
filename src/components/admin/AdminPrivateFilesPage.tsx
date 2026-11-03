"use client";

import { useEffect, useState } from "react";
import { downloadTrackingFileAction } from "@/actions/tracking-files";
import {
  listAdminPrivateFilesAction,
  type AdminPrivateFile,
} from "@/actions/admin/private-files";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, EmptyState, ToolbarButton } from "./AdminUi";

const sizeLabel = (size: number) =>
  size < 1_000_000
    ? `${(size / 1_000).toFixed(0)} KB`
    : `${(size / 1_000_000).toFixed(1)} MB`;

export function AdminPrivateFilesPage() {
  const [files, setFiles] = useState<AdminPrivateFile[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listAdminPrivateFilesAction();
      if (!result.ok) {
        setError(result.message);
      } else {
        setFiles(result.data.files);
        setStorageReady(result.data.storageReady);
      }
    } catch {
      setError("Berkas privat tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void listAdminPrivateFilesAction()
      .then((result) => {
        if (!active) return;
        if (!result.ok) setError(result.message);
        else {
          setFiles(result.data.files);
          setStorageReady(result.data.storageReady);
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Berkas privat tidak dapat dimuat.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function download(file: AdminPrivateFile) {
    setDownloading(file.id);
    setError("");
    try {
      const result = await downloadTrackingFileAction(
        file.id,
        file.clientProjectId
      );
      if (!result.ok) {
        setError(result.message);
        return;
      }
      window.open(result.data.url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Tautan unduhan tidak dapat dibuat.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <AdminFrame
      title="Berkas Privat & Dokumen Rahasia"
      description="Metadata dan relasi lampiran proyek klien. Berkas privat tidak disajikan ke publik; unduhan membutuhkan otorisasi proyek dan URL berumur pendek."
      screenKey="cms/berkas-privat"
      actions={
        <ToolbarButton
          variant="light"
          icon="sync"
          disabled={loading}
          onClick={() => void load()}
        >
          Refresh Data
        </ToolbarButton>
      }
    >
      {!storageReady ? (
        <div className="mb-4 rounded-[12px] border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 flex items-start gap-2.5">
          <span className="symbol text-lg text-amber-700 shrink-0">warning</span>
          <div className="leading-relaxed">
            <span className="font-semibold block mb-0.5">Bucket Privat R2 Belum Terpisah</span>
            Bucket privat belum siap atau masih sama dengan bucket publik. Daftar
            metadata tetap dapat dilihat, tetapi pengunduhan dan unggahan akan
            gagal tertutup sampai owner memisahkan konfigurasi bucket R2.
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-[12px] border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-center gap-2">
          <span className="symbol text-base">error</span>
          <span>{error}</span>
        </div>
      ) : null}

      <BentoCard>
        <div className="mb-4 flex items-center justify-between border-b border-[#eaeaea] pb-3">
          <div>
            <h2 className="m-0 text-base font-semibold text-[#18181a]">
              Lampiran Terverifikasi
            </h2>
            <p className="mt-0.5 text-xs text-[#71717a]">
              Total {files.length} berkas privat tercatat dalam database
            </p>
          </div>
          <Chip variant={storageReady ? "success" : "warning"} size="sm">
            {storageReady ? "Storage Ready" : "Unconfigured"}
          </Chip>
        </div>

        {loading ? (
          <p className="py-8 text-center text-xs text-[#71717a]">
            Memuat berkas privat…
          </p>
        ) : files.length === 0 ? (
          <EmptyState
            icon="folder_zip"
            title="Belum ada berkas privat"
            description="Berkas lampiran dari klien atau internal proyek akan tercatat di sini."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#eaeaea] text-[#71717a]">
                  <th className="py-2.5 px-3 font-medium">Nama Berkas</th>
                  <th className="py-2.5 px-3 font-medium">Proyek / Klien</th>
                  <th className="py-2.5 px-3 font-medium">Relasi</th>
                  <th className="py-2.5 px-3 font-medium">Format &amp; Ukuran</th>
                  <th className="py-2.5 px-3 font-medium">Waktu Verifikasi</th>
                  <th className="py-2.5 px-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-[#fafafa]">
                    <td className="py-3 px-3 font-semibold text-[#18181a] max-w-56 truncate">
                      {file.filename}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-[#18181a] block">
                        {file.projectTitle}
                      </span>
                      <span className="text-[11px] text-[#71717a]">
                        {file.clientName}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Chip variant="neutral" size="sm">
                        {file.relation}
                      </Chip>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#52525b]">
                      {file.mimeType}
                      <span className="block text-[10px] text-[#71717a]">
                        {sizeLabel(file.sizeBytes)}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-[#52525b]">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta",
                      }).format(new Date(file.verifiedAt))}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <ToolbarButton
                        variant="light"
                        icon="download"
                        disabled={!storageReady || downloading === file.id}
                        onClick={() => void download(file)}
                      >
                        {downloading === file.id ? "Menyiapkan…" : "Unduh"}
                      </ToolbarButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BentoCard>
    </AdminFrame>
  );
}
