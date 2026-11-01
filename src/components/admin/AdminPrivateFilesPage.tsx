"use client";

import { useEffect, useState } from "react";
import { downloadTrackingFileAction } from "@/actions/tracking-files";
import {
  listAdminPrivateFilesAction,
  type AdminPrivateFile,
} from "@/actions/admin/private-files";
import { AdminFrame } from "./AdminFrame";

const sizeLabel = (size: number) => size < 1_000_000
  ? `${(size / 1_000).toFixed(0)} KB`
  : `${(size / 1_000_000).toFixed(1)} MB`;

export function AdminPrivateFilesPage() {
  const [files, setFiles] = useState<AdminPrivateFile[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void listAdminPrivateFilesAction().then((result) => {
      if (!active) return;
      if (!result.ok) setError(result.message);
      else {
        setFiles(result.data.files);
        setStorageReady(result.data.storageReady);
      }
      setLoading(false);
    }).catch(() => {
      if (active) { setError("Berkas privat tidak dapat dimuat."); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  async function download(file: AdminPrivateFile) {
    setDownloading(file.id);
    setError("");
    try {
      const result = await downloadTrackingFileAction(file.id, file.clientProjectId);
      if (!result.ok) { setError(result.message); return; }
      window.open(result.data.url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Tautan unduhan tidak dapat dibuat.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <AdminFrame title="Berkas Privat" description="Metadata dan relasi lampiran proyek. Objek tidak disajikan publik; setiap unduhan memerlukan otorisasi proyek dan URL berumur pendek.">
      {!storageReady ? <p className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">Bucket privat belum siap atau masih sama dengan bucket publik. Daftar metadata tetap dapat dilihat, tetapi pengunduhan dan unggahan akan gagal tertutup sampai owner memisahkan bucket R2.</p> : null}
      {error ? <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 mt-0 text-lg font-semibold">Lampiran terverifikasi</h2>
        {loading ? <p role="status" className="text-sm text-[#71717a]">Memuat berkas…</p> : null}
        {!loading && files.length === 0 ? <p className="text-sm text-[#71717a]">Belum ada lampiran proyek terverifikasi.</p> : null}
        <div className="overflow-x-auto"><table className="w-full min-w-[800px] border-collapse text-left text-sm"><thead><tr className="border-b border-neutral-200 text-xs text-[#71717a]"><th className="p-3">Nama berkas</th><th className="p-3">Proyek / klien</th><th className="p-3">Relasi</th><th className="p-3">Tipe / ukuran</th><th className="p-3">Verifikasi</th><th className="p-3">Aksi</th></tr></thead><tbody>{files.map((file) => <tr key={file.id} className="border-b border-neutral-100"><td className="max-w-64 break-words p-3 font-medium">{file.filename}</td><td className="p-3">{file.projectTitle}<span className="block text-xs text-[#71717a]">{file.clientName}</span></td><td className="p-3">{file.relation}</td><td className="p-3">{file.mimeType}<span className="block text-xs text-[#71717a]">{sizeLabel(file.sizeBytes)}</span></td><td className="whitespace-nowrap p-3">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(file.verifiedAt))}</td><td className="p-3"><button type="button" className="secondary-button min-h-9" disabled={!storageReady || downloading === file.id} onClick={() => void download(file)}>{downloading === file.id ? "Menyiapkan…" : "Unduh"}</button></td></tr>)}</tbody></table></div>
      </section>
    </AdminFrame>
  );
}
