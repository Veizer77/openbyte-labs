"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, EmptyState, SearchField, ToolbarButton } from "./AdminUi";
import {
  createMediaUploadAction,
  finalizeMediaUploadAction,
  listMediaAction,
} from "@/actions/admin/media";
import { mediaAssetSchema, type MediaAsset } from "@/schemas/media";
import { z } from "zod";

const pageSize = 30;
const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxUploadBytes = 15 * 1024 * 1024;

function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

export function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const loadAssets = useCallback(
    async (search: string, offset: number, append: boolean) => {
      setIsLoading(true);
      setError("");
      try {
        const result = await listMediaAction({
          query: search.trim() || undefined,
          limit: pageSize,
          offset,
        });
        if (!result.ok) {
          setError(result.message);
          return;
        }
        const data = z.array(mediaAssetSchema).parse(result.data);
        setAssets((current) => (append ? [...current, ...data] : data));
        setHasMore(data.length === pageSize);
      } catch {
        setError("Daftar media tidak dapat dimuat.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    async function loadInitialAssets() {
      await loadAssets("", 0, false);
    }
    void loadInitialAssets();
  }, [loadAssets]);

  function handleFileChange(selected: File | undefined) {
    setUploadError("");
    setStatus("");
    if (!selected) {
      setFile(null);
      return;
    }
    if (!acceptedTypes.includes(selected.type)) {
      setFile(null);
      setUploadError("Pilih gambar PNG, JPEG, atau WebP. SVG tidak didukung.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    if (selected.size < 1 || selected.size > maxUploadBytes) {
      setFile(null);
      setUploadError("Ukuran gambar harus lebih dari 0 dan maksimal 15 MB.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    setFile(selected);
    setAlt("");
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isUploading) return;
    if (!file) {
      setUploadError("Pilih berkas gambar terlebih dahulu.");
      return;
    }
    if (!alt.trim()) {
      setUploadError("Teks alternatif wajib diisi sebelum menyimpan media.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setStatus("Menyiapkan upload aman...");
    try {
      const grant = await createMediaUploadAction({
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });
      if (!grant.ok) {
        setUploadError(grant.message);
        setStatus("");
        return;
      }

      setStatus("Mengirim gambar ke penyimpanan...");
      let response: Response;
      try {
        response = await fetch(grant.data.uploadUrl, {
          method: "PUT",
          headers: grant.data.headers,
          body: file,
        });
      } catch {
        setUploadError(
          "Upload ke penyimpanan gagal. Periksa koneksi dan pengaturan CORS bucket staging."
        );
        setStatus("");
        return;
      }
      if (!response.ok) {
        setUploadError(
          "Penyimpanan menolak upload. Coba lagi atau periksa pengaturan bucket staging."
        );
        setStatus("");
        return;
      }

      setStatus("Memvalidasi gambar dan membuat varian WebP...");
      const finalized = await finalizeMediaUploadAction({
        id: grant.data.id,
        alt: alt.trim(),
      });
      if (!finalized.ok) {
        setUploadError(finalized.message);
        setStatus("");
        return;
      }

      setStatus(`Media ${finalized.data.filename} siap digunakan.`);
      setFile(null);
      setAlt("");
      if (fileInput.current) fileInput.current.value = "";
      await loadAssets(query, 0, false);
    } catch {
      setUploadError(
        "Upload media tidak selesai. Periksa koneksi lalu coba lagi."
      );
      setStatus("");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <AdminFrame
      title="Media Library"
      description="Kelola penyimpanan gambar publik teroptimasi WebP. Berkas diproses di server sebelum dapat dipilih pada editor portofolio atau blok halaman."
      screenKey="cms/media-library"
      actions={
        <div className="flex items-center gap-2">
          <ToolbarButton
            variant="light"
            icon="sync"
            disabled={isLoading || isUploading}
            onClick={() => void loadAssets(query, 0, false)}
          >
            Refresh
          </ToolbarButton>
        </div>
      }
    >
      {error ? (
        <div className="mb-4 rounded-[12px] border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-center gap-2">
          <span className="symbol text-base">error</span>
          <span>{error}</span>
        </div>
      ) : null}
      {status ? (
        <div className="mb-4 rounded-[12px] border border-green-200 bg-green-50 p-3.5 text-xs text-green-900 flex items-center gap-2">
          <span className="symbol text-base">check_circle</span>
          <span>{status}</span>
        </div>
      ) : null}

      <div className="grid items-start gap-5 xl:grid-cols-[340px_1fr]">
        {/* Left Side: Upload Form */}
        <BentoCard className="sticky top-20">
          <div className="mb-4 border-b border-[#eaeaea] pb-3">
            <h2 className="m-0 text-base font-semibold text-[#18181a]">
              Unggah Media Baru
            </h2>
            <p className="mt-0.5 text-xs text-[#71717a]">
              PNG, JPEG, WebP. Maks 15 MB. Diproses otomatis ke varian WebP responsif
            </p>
          </div>

          <form onSubmit={(e) => void upload(e)} className="grid gap-3.5">
            <fieldset
              disabled={isUploading}
              className="m-0 grid gap-3 border-0 p-0"
            >
              <label className="grid gap-1.5 text-xs font-medium text-[#52525b]">
                Pilih Berkas Gambar
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) =>
                    handleFileChange(e.currentTarget.files?.[0])
                  }
                  className="w-full rounded-[10px] border border-[#eaeaea] bg-white p-2 text-xs text-[#18181a] file:mr-3 file:rounded-[6px] file:border-0 file:bg-[#f0f0f0] file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-[#18181a]"
                />
              </label>

              {file ? (
                <div className="rounded-[8px] bg-[#f9f9f9] p-2 text-xs text-[#52525b] border border-[#eaeaea]">
                  <span className="font-semibold text-[#18181a] block truncate">
                    {file.name}
                  </span>
                  <span className="text-[11px] text-[#71717a]">
                    {formatBytes(file.size)} · {file.type}
                  </span>
                </div>
              ) : null}

              <label className="grid gap-1 text-xs font-medium text-[#52525b]">
                Teks Alternatif (Alt Text)
                <input
                  required
                  maxLength={250}
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Deskripsi gambar untuk aksesibilitas..."
                  className={inputClass}
                />
                <span className="text-[10px] text-[#71717a]">
                  Wajib diisi untuk kepatuhan aksesibilitas web &amp; SEO.
                </span>
              </label>

              {uploadError ? (
                <p className="m-0 rounded-[8px] bg-red-50 p-2 text-xs text-red-800">
                  {uploadError}
                </p>
              ) : null}

              <div className="pt-2">
                <ToolbarButton
                  type="submit"
                  variant="dark"
                  disabled={isUploading || !file}
                  className="w-full"
                >
                  {isUploading
                    ? "Memproses Gambar…"
                    : "Unggah dan Finalisasi"}
                </ToolbarButton>
              </div>
            </fieldset>
          </form>
        </BentoCard>

        {/* Right Side: Media Grid */}
        <BentoCard>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-[#eaeaea] pb-3">
            <div>
              <h2 className="m-0 text-base font-semibold text-[#18181a]">
                Katalog Media ({assets.length})
              </h2>
              <p className="mt-0.5 text-xs text-[#71717a]">
                Aset gambar yang telah diproses dan siap digunakan pada konten
              </p>
            </div>

            <div className="w-full sm:w-64">
              <SearchField
                value={query}
                onChange={(q) => {
                  setQuery(q);
                  void loadAssets(q, 0, false);
                }}
                placeholder="Cari nama atau teks alt..."
              />
            </div>
          </div>

          {isLoading ? (
            <p className="py-8 text-center text-xs text-[#71717a]">
              Memuat aset media…
            </p>
          ) : assets.length === 0 ? (
            <EmptyState
              icon="photo_library"
              title="Tidak ada aset media"
              description="Belum ada berkas media yang cocok. Unggah gambar baru di sebelah kiri."
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="overflow-hidden rounded-[12px] border border-[#eaeaea] bg-white transition-all hover:shadow-sm hover:border-[#18181a33]"
                >
                  <div className="relative aspect-[16/10] bg-[#f0f0f0]">
                    <Image
                      src={asset.urls.card}
                      alt={asset.alt || asset.filename}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Chip variant="neutral" size="sm">
                        {asset.mimeType.split("/")[1]?.toUpperCase()}
                      </Chip>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="m-0 truncate text-xs font-semibold text-[#18181a]">
                      {asset.filename}
                    </h3>
                    <p className="m-0 mt-1 line-clamp-1 text-[11px] text-[#52525b]">
                      {asset.alt || "Tanpa alt text"}
                    </p>
                    <div className="mt-2 flex items-center justify-between border-t border-[#f0f0f0] pt-2 text-[10px] text-[#71717a]">
                      <span>
                        {asset.width} × {asset.height} px
                      </span>
                      <span>{formatBytes(asset.sizeBytes)}</span>
                    </div>
                    <div className="mt-1.5 truncate font-mono text-[9px] text-[#a1a1aa]">
                      ID: {asset.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && !isLoading ? (
            <div className="mt-4 flex justify-center border-t border-[#eaeaea] pt-3">
              <ToolbarButton
                variant="light"
                onClick={() => void loadAssets(query, assets.length, true)}
              >
                Muat Media Berikutnya
              </ToolbarButton>
            </div>
          ) : null}
        </BentoCard>
      </div>
    </AdminFrame>
  );
}
