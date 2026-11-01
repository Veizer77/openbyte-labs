"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { AdminHeader, AdminSidebar } from "./AdminShell";
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
    [],
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
          "Upload ke penyimpanan gagal. Periksa koneksi dan pengaturan CORS bucket staging.",
        );
        setStatus("");
        return;
      }
      if (!response.ok) {
        setUploadError(
          "Penyimpanan menolak upload. Coba lagi atau periksa pengaturan bucket staging.",
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
      setUploadError("Upload media tidak selesai. Periksa koneksi lalu coba lagi.");
      setStatus("");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="screen admin-screen relative flex min-h-screen w-full flex-col bg-[#f9f9f9]">
      <AdminSidebar />
      <div className="flex min-h-screen w-full flex-col lg:pl-[288px]">
        <AdminHeader />
        <main
          id="konten"
          className="mx-auto w-full max-w-[1920px] flex-1 px-4 pb-12 pt-20 sm:px-6 lg:px-8"
        >
          <div className="mb-6">
            <nav
              aria-label="Breadcrumb"
              className="mb-2 flex gap-1.5 text-[11px] text-[#52525b]"
            >
              <span>Admin</span>
              <span aria-hidden="true">/</span>
              <span>Konten Website</span>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-[#18181a]">Media</span>
            </nav>
            <h1 className="m-0 text-2xl font-semibold tracking-[-.5px] text-[#18181a]">
              Media Library
            </h1>
            <p className="mb-0 mt-2 max-w-3xl text-sm leading-5 text-[#52525b]">
              Gambar final disimpan sebagai varian WebP dan dapat dipilih pada
              editor konten. File staging yang belum selesai tidak tampil di
              daftar ini.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(320px,.7fr)_minmax(0,1.3fr)]">
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <h2 className="m-0 text-lg font-semibold text-[#18181a]">
                Unggah gambar
              </h2>
              <p className="mb-5 mt-2 text-xs leading-5 text-[#52525b]">
                Format PNG, JPEG, atau WebP. Maksimal 15 MB. Gambar diproses di
                server sebelum dapat dipakai di website.
              </p>
              <form onSubmit={(event) => void upload(event)}>
                <fieldset
                  disabled={isUploading}
                  className="m-0 flex flex-col gap-4 border-0 p-0"
                >
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Berkas gambar
                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) =>
                        handleFileChange(event.currentTarget.files?.[0])
                      }
                      className="min-h-11 w-full rounded-lg border border-neutral-300 bg-white p-2 text-sm font-normal file:mr-3 file:min-h-8 file:rounded-md file:border-0 file:bg-[#f0f0f0] file:px-3 file:text-xs file:font-medium"
                    />
                  </label>
                  {file ? (
                    <p className="m-0 break-words text-xs text-[#52525b]">
                      {file.name} · {formatBytes(file.size)}
                    </p>
                  ) : null}
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#18181a]">
                    Teks alternatif
                    <input
                      required
                      maxLength={250}
                      value={alt}
                      onChange={(event) => setAlt(event.target.value)}
                      placeholder="Deskripsikan informasi pada gambar"
                      className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal"
                    />
                    <span className="text-xs font-normal leading-5 text-[#52525b]">
                      Digunakan pembaca layar dan editor proyek.
                    </span>
                  </label>
                  {uploadError ? (
                    <p role="alert" className="m-0 text-sm text-red-700">
                      {uploadError}
                    </p>
                  ) : null}
                  {status ? (
                    <p role="status" className="m-0 text-sm text-green-800">
                      {status}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={isUploading || !file}
                    className="primary-button min-h-11 w-fit"
                  >
                    {isUploading ? "Memproses gambar..." : "Unggah dan finalisasi"}
                  </button>
                </fieldset>
              </form>
            </section>

            <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <h2 className="m-0 text-lg font-semibold text-[#18181a]">
                    Aset final
                  </h2>
                  <p className="mb-0 mt-1 text-xs text-[#52525b]">
                    {assets.length} aset pada halaman ini
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => void loadAssets(query, 0, false)}
                  className="secondary-button min-h-11"
                >
                  Muat ulang
                </button>
              </div>
              <form
                aria-label="Cari aset media"
                className="mb-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  void loadAssets(query, 0, false);
                }}
              >
                <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs font-medium text-[#52525b]">
                  Cari nama berkas atau teks alternatif
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal text-[#18181a]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="secondary-button min-h-11 self-end"
                >
                  Cari
                </button>
              </form>

              {error ? (
                <p role="alert" className="text-sm text-red-700">
                  {error}
                </p>
              ) : null}
              {isLoading ? (
                <p role="status" className="text-sm text-[#52525b]">
                  Memuat aset media...
                </p>
              ) : assets.length ? (
                <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 2xl:grid-cols-3">
                  {assets.map((asset) => (
                    <li
                      key={asset.id}
                      className="overflow-hidden rounded-xl border border-neutral-200 bg-[#f9f9f9]"
                    >
                      <div className="relative aspect-[4/3] bg-[#f0f0f0]">
                        <Image
                          src={asset.urls.card}
                          alt={asset.alt || asset.filename}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="m-0 truncate text-sm font-semibold text-[#18181a]">
                          {asset.filename}
                        </h3>
                        <p className="mb-0 mt-1 line-clamp-2 min-h-8 text-xs leading-4 text-[#52525b]">
                          {asset.alt || "Tanpa teks alternatif"}
                        </p>
                        <p className="mb-0 mt-2 text-[11px] text-[#52525b]">
                          {asset.width} × {asset.height} px · {formatBytes(asset.sizeBytes)}
                        </p>
                        <p className="mb-0 mt-2 break-all font-mono text-[10px] leading-4 text-[#52525b]">
                          {asset.id}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-neutral-200 bg-[#f9f9f9] p-5 text-sm text-[#52525b]">
                  Belum ada media final yang cocok. Unggah gambar di panel ini
                  atau ubah kata pencarian.
                </p>
              )}
              {hasMore && !isLoading ? (
              <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => void loadAssets(query, assets.length, true)}
                  className="secondary-button mt-4 min-h-11"
                >
                  Muat media berikutnya
                </button>
              ) : null}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
