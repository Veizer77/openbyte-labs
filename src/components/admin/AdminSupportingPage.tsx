"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AdminHeader, AdminSidebar } from "./AdminShell";
import {
  listCalculatorConfigAction,
  saveCalculatorConfigAction,
} from "@/actions/admin/calculator";
import {
  calculatorAdminConfigSchema,
  type CalculatorAdminConfig,
} from "@/schemas/calculator-admin";
import { rupiah } from "@/lib/format";
import { usePreview } from "@/components/preview/PreviewProvider";

type Kind = "halaman" | "media" | "kalkulator";
const titles: Record<Kind, string> = {
  halaman: "Halaman & Susunan Blok",
  media: "Media Library",
  kalkulator: "Kalkulator Builder",
};

const blockDescriptions: Record<string, string> = {
  Hero: "Judul, ringkasan, dan tombol halaman; tinjau sebelum publikasi",
  Layanan: "Layanan dan cakupan yang telah disetujui",
  Portofolio: "Proyek berstatus terbit dengan payload kanonis yang disetujui",
  Kalkulator: "Estimasi awal; harga dan jadwal final dikonfirmasi tertulis",
  Paket: "Paket layanan yang menunggu verifikasi dan persetujuan",
  Testimoni: "Kutipan, identitas, relasi proyek, dan izin publikasi yang disetujui",
  FAQ: "Pertanyaan umum; verifikasi jawaban sebelum publikasi",
  Tentang: "Informasi profil dan praktik yang telah diverifikasi",
  "Banner CTA": "Ajakan konsultasi tanpa janji ketersediaan atau waktu respons",
};

function PageBlocks() {
  const [blocks, setBlocks] = useState([
    "Hero",
    "Layanan",
    "Portofolio",
    "Kalkulator",
    "Paket",
    "Testimoni",
    "FAQ",
    "Tentang",
    "Banner CTA",
  ]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [title, setTitle] = useState("Beranda Utama (Home)");
  const [slug, setSlug] = useState("home");
  const [metaDesc, setMetaDesc] = useState(
    "Informasi website, aplikasi, dan sistem digital. Cakupan proyek dikonfirmasi melalui penawaran tertulis.",
  );
  const [status, setStatus] = useState("Draft");
  const { notify } = usePreview();

  // Content for each block
  const [blockContents, setBlockContents] = useState<
    Record<string, Record<string, string>>
  >({
    Hero: {
      headline: "Website, Aplikasi, dan Sistem Digital",
      subheadline:
        "OpenByte Labs mengerjakan solusi digital sesuai kebutuhan dan ruang lingkup yang disepakati.",
      badge: "Informasi menunggu verifikasi",
      ctaPrimary: "Konsultasi Kebutuhan Proyek",
      ctaSecondary: "Hitung Estimasi Biaya",
    },
    Layanan: {
      title: "Layanan Digital",
      subtitle: "Teknologi dan ruang lingkup dibahas untuk setiap proyek.",
      card1: "Layanan menunggu verifikasi",
      card2: "Layanan menunggu verifikasi",
      card3: "Layanan menunggu verifikasi",
      card4: "Layanan menunggu verifikasi",
    },
    Portofolio: {
      title: "Proyek",
      subtitle: "Proyek hanya ditampilkan setelah payload kanonis disetujui.",
      featuredProject: "Proyek contoh — draf",
      categoryFilter: "Kategori menunggu verifikasi",
    },
    Kalkulator: {
      title: "Kalkulator Estimasi",
      subtitle:
        "Hitung simulasi kebutuhan modul, estimasi investasi, dan rentang hari kerja secara interaktif.",
      disclaimer:
        "Estimasi bersifat indikatif; rincian final diverifikasi saat konsultasi teknis.",
    },
    Paket: {
      title: "Informasi Paket",
      subtitle: "Paket dan harga menunggu verifikasi serta persetujuan.",
      guaranteeNote:
        "Cakupan dukungan dan garansi hanya berlaku bila disepakati tertulis.",
    },
    Testimoni: {
      title: "Testimoni",
      subtitle:
        "Kutipan, identitas, relasi proyek, dan izin harus diverifikasi sebelum publikasi.",
      highlightQuote: "Belum ada testimoni yang disetujui untuk publikasi.",
      clientName: "",
    },
    FAQ: {
      title: "Pertanyaan yang Sering Diajukan",
      subtitle:
        "Penjelasan transparan seputar proses rekayasa, hak kekayaan intelektual, dan termin pembayaran.",
      q1: "Bagaimana alur kerja pengembangan di OpenByte Labs?",
      a1: "Tahapan, hasil kerja, jadwal, dan proses serah terima disepakati tertulis untuk setiap proyek.",
      q2: "Apakah source code menjadi milik klien?",
      a2: "Kepemilikan, lisensi, dan penyerahan source code diatur dalam dokumen proyek.",
    },
    Tentang: {
      title: "Tentang OpenByte Labs",
      subtitle:
        "Informasi profil, keamanan, dan praktik kerja menunggu verifikasi sebelum publikasi.",
      leadBio:
        "Informasi profil pemilik menunggu tinjauan sebelum dipublikasikan.",
    },
    "Banner CTA": {
      title: "Diskusikan Kebutuhan Proyek",
      subtitle:
        "Diskusikan visi sistem Anda bersama tim teknis OpenByte Labs tanpa komitmen awal.",
      waButtonText: "Ajukan Konsultasi",
      guaranteeBadge: "Waktu respons dikonfirmasi terpisah",
    },
  });

  const [activeEditingBlock, setActiveEditingBlock] = useState<string | null>(
    null,
  );

  function move(index: number, delta: number) {
    setBlocks((current) => {
      const next = [...current];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });
  }

  const activeCount = blocks.length - hidden.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
      {/* Kolom Kiri Utama: Form Data & Urutan Blok */}
      <div className="lg:col-span-8 flex flex-col gap-6 w-full">
        {/* Card Pengaturan Dasar */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_2px_#0000000d] flex flex-col gap-4 border border-[#00000008]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f0f0f0]">
            <span className="symbol text-xl text-[#52525b]">settings</span>
            <h2 className="text-base font-semibold text-[#18181a] m-0">
              Pengaturan Dasar Halaman
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="field">
              Judul Halaman
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Contoh: Beranda Utama"
              />
            </label>
            <label className="field">
              Slug URL
              <div className="flex items-center rounded-xl bg-[#f0f0f0] px-3 py-2 text-sm text-[#52525b]">
                <span className="text-[#a1a1aa] mr-1 select-none">
                  openbyte.id/
                </span>
                <input
                  className="!bg-transparent !p-0 !text-sm text-[#18181a] font-medium"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="home"
                />
              </div>
            </label>
          </div>
          <label className="field">
            Meta Deskripsi SEO
            <textarea
              rows={2}
              value={metaDesc}
              onChange={(event) => setMetaDesc(event.target.value)}
              placeholder="Deskripsi singkat yang muncul di mesin pencari..."
              className="!min-h-[72px]"
            />
          </label>
        </section>

        {/* Card Susunan Blok Konten */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_2px_#0000000d] flex flex-col gap-4 border border-[#00000008]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#f0f0f0]">
            <div className="flex items-center gap-2">
              <span className="symbol text-xl text-[#52525b]">view_stream</span>
              <div>
                <h2 className="text-base font-semibold text-[#18181a] m-0">
                  Susunan Blok Konten Beranda
                </h2>
                <p className="text-xs text-[#52525b] mt-0.5 m-0">
                  Atur urutan, visibilitas, dan sesuaikan rincian isi dari setiap
                  blok secara spesifik.
                </p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f0f0f0] text-[#52525b] self-start sm:self-auto">
              {activeCount} dari {blocks.length} Blok Aktif
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-1">
            {blocks.map((block, index) => {
              const isHidden = hidden.includes(block);
              return (
                <div
                  key={block}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border transition-all p-3.5 sm:p-4 ${
                    isHidden
                      ? "bg-[#fafafa] border-[#e4e4e7] opacity-60"
                      : "bg-[#ffffff] border-[#e4e4e7] hover:border-[#18181a33] hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f0f0] text-xs font-semibold text-[#52525b] shrink-0">
                      {index + 1}
                    </div>
                    <span className="symbol text-[#a1a1aa] select-none hidden sm:inline-block">
                      drag_indicator
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#18181a]">
                          {block}
                        </span>
                        {isHidden ? (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#f4f4f5] text-[#71717a]">
                            Disembunyikan
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#e2e89d] text-[#454a10]">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#71717a] truncate mt-0.5 m-0">
                        {blockDescriptions[block] || "Blok komponen halaman"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                    {/* Tombol Edit Isi Blok */}
                    <button
                      type="button"
                      onClick={() => setActiveEditingBlock(block)}
                      className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0f0f0] hover:bg-[#18181a] text-[#18181a] hover:text-white transition-colors"
                      title={`Edit isi konten ${block}`}
                    >
                      <span className="symbol text-sm">edit_note</span>
                      <span>Edit Isi Blok</span>
                    </button>

                    <label className="text-xs font-medium flex items-center gap-1.5 cursor-pointer select-none px-2 py-1 rounded hover:bg-[#f0f0f0]">
                      <input
                        type="checkbox"
                        checked={!isHidden}
                        onChange={() =>
                          setHidden((current) =>
                            current.includes(block)
                              ? current.filter((value) => value !== block)
                              : [...current, block],
                          )
                        }
                        className="cursor-pointer"
                      />
                      <span className="hidden sm:inline">Tampil</span>
                    </label>

                    <div className="flex items-center gap-1 border-l border-[#e4e4e7] pl-2">
                      <button
                        type="button"
                        className="symbol p-1.5 rounded-lg hover:bg-[#f0f0f0] text-[#52525b] disabled:opacity-20 disabled:hover:bg-transparent"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                        aria-label={`Naikkan ${block}`}
                        title="Geser ke atas"
                      >
                        arrow_upward
                      </button>
                      <button
                        type="button"
                        className="symbol p-1.5 rounded-lg hover:bg-[#f0f0f0] text-[#52525b] disabled:opacity-20 disabled:hover:bg-transparent"
                        disabled={index === blocks.length - 1}
                        onClick={() => move(index, 1)}
                        aria-label={`Turunkan ${block}`}
                        title="Geser ke bawah"
                      >
                        arrow_downward
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#71717a] mt-2 pt-2 border-t border-[#f0f0f0]">
            <span className="symbol text-base text-[#a1a1aa]">info</span>
            <span>
              Perubahan urutan dan konten blok dapat langsung dipratinjau secara
              interaktif.
            </span>
          </div>
        </section>

        {/* Modal / Dialog Editor Isi Blok Spesifik */}
        {activeEditingBlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181a66] backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e4e4e7] flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-[#f0f0f0]">
                <div>
                  <h3 className="text-lg font-bold text-[#18181a] m-0 flex items-center gap-2">
                    <span className="symbol text-xl text-[#82b440]">
                      edit_document
                    </span>
                    Editor Isi Blok: {activeEditingBlock}
                  </h3>
                  <p className="text-xs text-[#71717a] mt-1 m-0">
                    Sesuaikan teks headline, subheadline, tombol aksi, dan data
                    spesifik blok ini.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveEditingBlock(null)}
                  className="symbol text-xl text-[#71717a] hover:text-[#18181a] p-1 rounded-lg hover:bg-[#f0f0f0]"
                >
                  close
                </button>
              </div>

              {/* Form Input Dinamis Berdasarkan Blok */}
              <div className="flex flex-col gap-3 py-2">
                {Object.entries(
                  blockContents[activeEditingBlock] || {
                    title: `Judul Section ${activeEditingBlock}`,
                    description: `Deskripsi section ${activeEditingBlock}`,
                  },
                ).map(([key, val]) => (
                  <label key={key} className="field">
                    <span className="capitalize font-semibold text-[#18181a] text-xs">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    {val.length > 80 ? (
                      <textarea
                        rows={3}
                        value={val}
                        onChange={(e) => {
                          const updatedVal = e.target.value;
                          setBlockContents((prev) => ({
                            ...prev,
                            [activeEditingBlock]: {
                              ...(prev[activeEditingBlock] || {}),
                              [key]: updatedVal,
                            },
                          }));
                        }}
                      />
                    ) : (
                      <input
                        value={val}
                        onChange={(e) => {
                          const updatedVal = e.target.value;
                          setBlockContents((prev) => ({
                            ...prev,
                            [activeEditingBlock]: {
                              ...(prev[activeEditingBlock] || {}),
                              [key]: updatedVal,
                            },
                          }));
                        }}
                      />
                    )}
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f0f0]">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setActiveEditingBlock(null)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    notify(
                      `Perubahan blok "${activeEditingBlock}" hanya diterapkan di editor. Simpan ke database belum tersedia.`,
                    );
                    setActiveEditingBlock(null);
                  }}
                >
                  <span className="symbol text-base">check</span>
                  Terapkan Perubahan Blok
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kolom Kanan: Status Publikasi & Panel Metadata */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full">
        {/* Card Status & Aksi Simpan */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_2px_#0000000d] flex flex-col gap-4 border border-[#00000008]">
          <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f0]">
            <h2 className="text-base font-semibold text-[#18181a] m-0">
              Status Publikasi
            </h2>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                status === "Published"
                  ? "bg-[#e2e89d] text-[#454a10]"
                  : "bg-[#f4f4f5] text-[#71717a]"
              }`}
            >
              {status}
            </span>
          </div>

          <label className="field">
            Status Tayang
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="cursor-pointer"
            >
              <option value="Published">Published (Tampil ke Publik)</option>
              <option value="Draft">Draft (Hanya Tim Admin)</option>
              <option value="Scheduled">Terjadwal</option>
            </select>
          </label>

          <div className="flex flex-col gap-2 text-xs text-[#52525b] pt-1">
            <div className="flex justify-between py-1 border-b border-[#f4f4f5]">
              <span>Terakhir Diedit</span>
              <span className="font-medium text-[#18181a]">
                Belum tersedia
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#f4f4f5]">
              <span>Author Pengubah</span>
              <span className="font-medium text-[#18181a]">
                Admin Contoh
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Akses Konten</span>
              <span className="font-medium text-[#18181a]">
                Semua Pengunjung
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              className="primary-button w-full"
              onClick={() =>
                notify(
                  "Page Builder belum menyimpan perubahan ke database. Perubahan ini hanya ada di sesi editor.",
                )
              }
            >
              <span className="symbol text-lg">save</span>
              Simpan Perubahan
            </button>
            <Link
              href="/"
              target="_blank"
              className="secondary-button w-full text-center"
            >
              <span className="symbol text-lg">open_in_new</span>
              Buka Halaman Live
            </Link>
          </div>
        </section>

        {/* Card Ringkasan & SEO Readiness */}
        <section className="p-5 sm:p-6 bg-white rounded-2xl shadow-[0px_1px_2px_#0000000d] flex flex-col gap-3.5 border border-[#00000008]">
          <h2 className="text-base font-semibold text-[#18181a] m-0 pb-2 border-b border-[#f0f0f0]">
            Ringkasan Struktur Halaman
          </h2>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-[#f9f9f9] p-3 border border-[#f0f0f0]">
              <div className="text-2xl font-bold text-[#18181a]">
                {activeCount}
              </div>
              <div className="text-[11px] text-[#71717a] mt-0.5">
                Section Aktif
              </div>
            </div>
            <div className="rounded-xl bg-[#f9f9f9] p-3 border border-[#f0f0f0]">
              <div className="text-2xl font-bold text-[#82b440]">98%</div>
              <div className="text-[11px] text-[#71717a] mt-0.5">
                Skor Kesiapan SEO
              </div>
            </div>
          </div>
          <div className="text-xs text-[#52525b] leading-relaxed mt-1">
            Tip: Menempatkan bagian <strong>Layanan</strong> dan{" "}
            <strong>Portofolio</strong> di 3 urutan teratas secara terbukti
            meningkatkan konversi booking konsultasi agensi.
          </div>
        </section>
      </div>
    </div>
  );
}

interface MediaItem {
  id: string;
  name: string;
  url: string;
  alt: string;
  format: string;
  size: string;
  dimensions: string;
  isLocalPreview: boolean;
}

function MediaLibrary() {
  const { notify } = usePreview();
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const urls = useRef<string[]>([]);

  useEffect(
    () => () => {
      urls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const handleFileSelect = (selectedFiles: File[]) => {
    setErrorMessage("");

    const hasSvg = selectedFiles.some(
      (f) => f.type === "image/svg+xml" || f.name.toLowerCase().endsWith(".svg"),
    );
    if (hasSvg) {
      setErrorMessage("SVG tidak diizinkan demi keamanan. Gunakan berkas PNG, JPEG, atau WebP.");
      return;
    }

    selectedFiles.forEach((file) => {
      const objectUrl = URL.createObjectURL(file);
      urls.current.push(objectUrl);

      const ext = file.name.split(".").pop()?.toUpperCase() || "IMAGE";
      const sizeStr =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
          : Math.round(file.size / 1024) + " KB";

      const newItem: MediaItem = {
        id: `local-${file.name}-${urls.current.length}`,
        name: file.name,
        url: objectUrl,
        alt: `Media ${file.name.replace(/\.[^.]+$/, "")}`,
        format: ext,
        size: sizeStr,
        dimensions: "Memuat...",
        isLocalPreview: true,
      };

      // Extract real image dimensions asynchronously
      const img = new Image();
      img.onload = () => {
        setFiles((current) =>
          current.map((item) =>
            item.url === objectUrl
              ? {
                  ...item,
                  dimensions: `${img.naturalWidth} × ${img.naturalHeight} px`,
                }
              : item,
          ),
        );
      };
      img.src = objectUrl;

      setFiles((current) => [newItem, ...current]);
    });

    notify(
      `${selectedFiles.length} berkas dimuat ke pratinjau browser lokal. Sinkronisasi Cloudflare R2 memerlukan pipeline backend aktif.`,
    );
  };

  const handleRemove = (item: MediaItem) => {
    if (item.isLocalPreview) {
      URL.revokeObjectURL(item.url);
      urls.current = urls.current.filter((u) => u !== item.url);
    }
    setFiles((current) => current.filter((f) => f.id !== item.id));
    notify("Aset media dihapus dari daftar pratinjau.");
  };

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0px_1px_2px_#0000000d] border border-[#00000008] flex flex-col gap-6">
      {/* Upload Dropzone */}
      <label className="flex flex-col items-center justify-center min-h-48 p-8 rounded-xl border border-dashed border-[#c7c6ca] bg-[#f9f9f9] hover:bg-[#f0f0f0] transition-colors cursor-pointer text-center">
        <span className="symbol text-4xl mb-3 text-[#52525b]">cloud_upload</span>
        <span className="text-sm font-semibold text-[#18181a]">
          Pilih berkas media untuk Pratinjau Gambar Lokal
        </span>
        <span className="text-xs text-[#52525b] mt-1.5 max-w-lg">
          Mendukung PNG, JPEG, WebP. Pratinjau langsung di browser via Object URL.
          Pipeline kompresi Sharp dan integrasi Cloudflare R2 memerlukan koneksi backend.
        </span>
        <div className="flex items-center gap-3 mt-4">
          <input
            className="text-xs"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={(event) => {
              const selected = Array.from(event.target.files ?? []);
              if (selected.length) {
                handleFileSelect(selected);
              }
              event.target.value = "";
            }}
          />
        </div>
      </label>

      {/* SVG Rejection Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3 bg-[#fee2e2] border border-[#fca5a5] rounded-xl text-xs text-[#991b1b] flex items-center gap-2"
        >
          <span className="symbol text-base text-[#b91c1c]">error</span>
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Backend Integration Notice */}
      <div className="flex items-center justify-between p-3 bg-[#f9f9f9] border border-[#e4e4e7] rounded-xl text-xs text-[#52525b]">
        <div className="flex items-center gap-2">
          <span className="symbol text-base text-[#18181a]">info</span>
          <span>Status Media Storage:</span>
          <span className="font-medium text-[#18181a]">
            Pratinjau memori browser (Client-side Object URL). Berkas belum diunggah ke storage cloud.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#71717a]">
          Cloudflare R2 · Pipeline Terisolasi
        </span>
      </div>

      {/* Media Cards Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f0]">
          <h3 className="text-sm font-semibold text-[#18181a] m-0">
            Aset Media ({files.length})
          </h3>
          <span className="text-xs text-[#71717a]">
            Daftar Aset Gambar & Pratinjau Lokal
          </span>
        </div>

        {files.length === 0 ? (
          <div className="box-border w-full p-8 text-center bg-[#f9f9f9] border border-[#e4e4e7] rounded-xl text-xs text-[#71717a]">
            Belum ada media di preview. Pilih berkas gambar di atas untuk memulai pratinjau.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="rounded-xl bg-[#f9f9f9] border border-[#e4e4e7] p-4 flex flex-col justify-between gap-3 shadow-xs"
              >
                <div className="flex flex-col gap-2">
                  <div
                    role="img"
                    aria-label={file.alt}
                    className="h-40 rounded-lg bg-cover bg-center border border-[#e4e4e7] relative"
                    style={{ backgroundImage: `url('${file.url}')` }}
                  >
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#18181a] text-white">
                      {file.format}
                    </span>
                    <span
                      className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${
                        file.isLocalPreview ? "bg-[#0284c7]" : "bg-[#82b440]"
                      }`}
                    >
                      {file.isLocalPreview ? "LOKAL" : "CONTOH"}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#18181a] truncate mt-1">
                    {file.name}
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-[#71717a] py-1 border-y border-[#f0f0f0]">
                    <div>
                      Ukuran:{" "}
                      <span className="font-medium text-[#18181a]">
                        {file.size}
                      </span>
                    </div>
                    <div>
                      Dimensi:{" "}
                      <span className="font-medium text-[#18181a]">
                        {file.dimensions}
                      </span>
                    </div>
                  </div>

                  <label className="field">
                    Teks alternatif
                    <input
                      value={file.alt}
                      onChange={(event) =>
                        setFiles((current) =>
                          current.map((item) =>
                            item.id === file.id
                              ? { ...item, alt: event.target.value }
                              : item,
                          ),
                        )
                      }
                      placeholder="Deskripsi gambar untuk aksesibilitas"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="secondary-button w-full !min-h-[32px] !py-1 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]"
                  onClick={() => handleRemove(file)}
                >
                  Hapus dari preview
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CalculatorBuilder() {
  const [groups, setGroups] = useState<CalculatorAdminConfig["groups"]>([]);
  const [items, setItems] = useState<CalculatorAdminConfig["items"]>([]);
  const [activeGroup, setActiveGroup] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const { notify } = usePreview();

  useEffect(() => {
    let active = true;
    void listCalculatorConfigAction()
      .then((result) => {
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        const parsed = calculatorAdminConfigSchema.safeParse(result.data);
        if (!parsed.success) {
          setError("Konfigurasi kalkulator dari server tidak valid.");
          return;
        }
        setGroups(parsed.data.groups);
        setItems(parsed.data.items);
        setActiveGroup(parsed.data.groups[0]?.id ?? "");
      })
      .catch(() => {
        if (active) setError("Konfigurasi kalkulator tidak dapat dimuat.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const allItemIds = items.map((i) => ({ id: i.id, label: i.label }));

  const toggleRule = (
    itemId: string,
    relatedItemId: string,
    ruleType: "requires" | "excludes",
  ) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;
        const exists = item.rules.some(
          (rule) =>
            rule.ruleType === ruleType &&
            rule.relatedItemId === relatedItemId,
        );
        return {
          ...item,
          rules: exists
            ? item.rules.filter(
                (rule) =>
                  rule.ruleType !== ruleType ||
                  rule.relatedItemId !== relatedItemId,
              )
            : [...item.rules, { relatedItemId, ruleType }],
        };
      }),
    );
  };

  const addNewItem = () => {
    if (!activeGroup) return;
    const newItem = {
      id: crypto.randomUUID(),
      groupId: activeGroup,
      label: `Modul Baru (${activeGroup})`,
      description: "",
      pricingType: "flat" as const,
      unitLabel: null,
      maxUnits: null,
      priceMin: 500000,
      priceMax: 1500000,
      daysMin: 2,
      daysMax: 5,
      isDefault: false,
      isActive: true,
      sortOrder:
        Math.max(
          -1,
          ...items
            .filter((item) => item.groupId === activeGroup)
            .map((item) => item.sortOrder),
        ) + 1,
      rules: [],
    };
    setItems((prev) => [...prev, newItem]);
    notify("Item baru ditambahkan. Simpan konfigurasi untuk menerapkannya.");
  };

  const removeItem = (id: string) => {
    setItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          rules: item.rules.filter((rule) => rule.relatedItemId !== id),
        })),
    );
    notify("Item dihapus. Simpan konfigurasi untuk menerapkannya.");
  };

  const save = async () => {
    setIsSaving(true);
    setError("");
    try {
      const parsed = calculatorAdminConfigSchema.safeParse({ groups, items });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Konfigurasi tidak valid.");
        return;
      }
      const result = await saveCalculatorConfigAction(parsed.data);
      if (result.ok) notify("Konfigurasi kalkulator tersimpan.");
      else setError(result.message);
    } catch {
      setError("Konfigurasi kalkulator gagal disimpan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0px_1px_2px_#0000000d] border border-[#00000008] flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#f0f0f0]">
        <nav aria-label="Grup kalkulator" className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              aria-pressed={activeGroup === group.id}
              onClick={() => setActiveGroup(group.id)}
              className={
                activeGroup === group.id ? "primary-button" : "secondary-button"
              }
            >
              {group.title}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={addNewItem}
          disabled={isLoading || !activeGroup}
          className="secondary-button text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span className="symbol text-base">add_circle</span>
          Tambah Item Baru
        </button>
      </div>

      {isLoading ? (
        <p role="status" className="m-0 text-sm text-[#52525b]">
          Memuat konfigurasi kalkulator…
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="m-0 text-sm text-[#b91c1c]">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        {items
          .filter((item) => item.groupId === activeGroup)
          .map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-[#f9f9f9] border border-[#e4e4e7] p-5 flex flex-col gap-4 shadow-xs"
            >
              {/* Header Item: Label & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 flex items-center gap-3">
                  <input
                    value={item.label}
                    onChange={(e) =>
                      setItems((current) =>
                        current.map((v) =>
                          v.id === item.id ? { ...v, label: e.target.value } : v,
                        ),
                      )
                    }
                    className="font-bold text-base text-[#18181a] bg-transparent border-b border-transparent hover:border-[#e4e4e7] focus:border-[#18181a] outline-none px-1"
                    placeholder="Nama modul kalkulator"
                  />
                  <span className="font-mono text-xs text-[#71717a] bg-[#f0f0f0] px-2 py-0.5 rounded">
                    id: {item.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#e2e89d] text-[#454a10]">
                    {rupiah(item.priceMin)} - {rupiah(item.priceMax ?? item.priceMin)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="symbol text-lg text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded-md transition-colors"
                    title="Hapus item ini"
                  >
                    delete_outline
                  </button>
                </div>
              </div>

              {/* Price & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {(["priceMin", "priceMax", "daysMin", "daysMax"] as const).map((field) => (
                  <label className="field" key={field}>
                    {
                      {
                        priceMin: "Harga minimum (Rp)",
                        priceMax: "Harga maksimum (Rp)",
                        daysMin: "Hari minimum",
                        daysMax: "Hari maksimum",
                      }[field]
                    }
                    <input
                      type="number"
                      min={0}
                      value={item[field] ?? ""}
                      onChange={(event) =>
                        setItems((current) =>
                          current.map((value) =>
                            value.id === item.id
                              ? {
                                  ...value,
                                  [field]:
                                    event.target.value === ""
                                      ? field === "priceMax" || field === "daysMax"
                                        ? null
                                        : 0
                                      : Math.max(0, Number(event.target.value)),
                                }
                              : value,
                          ),
                        )
                      }
                    />
                  </label>
                ))}
              </div>

              {/* Interactive Requires & Excludes Controls */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f0f0]">
                {/* Requires Configuration */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#18181a] flex items-center gap-1">
                      <span className="symbol text-sm text-[#82b440]">
                        link
                      </span>
                      Ketergantungan Wajib (Requires):
                    </span>
                    <select
                      className="text-xs p-1 rounded border border-[#e4e4e7] bg-white cursor-pointer"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          toggleRule(item.id, e.target.value, "requires");
                        }
                      }}
                    >
                      <option value="">+ Tambah Dependency</option>
                      {allItemIds
                        .filter((i) => i.id !== item.id)
                        .map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-lg bg-white border border-[#e4e4e7]">
                    {item.rules.some((rule) => rule.ruleType === "requires") ? (
                      item.rules
                        .filter((rule) => rule.ruleType === "requires")
                        .map((rule) => {
                        const reqId = rule.relatedItemId;
                        const target = items.find((i) => i.id === reqId);
                        return (
                          <span
                            key={reqId}
                            className="text-[11px] font-medium bg-[#f0f0f0] text-[#18181a] px-2 py-0.5 rounded flex items-center gap-1"
                          >
                            <span>{target?.label || reqId}</span>
                            <button
                              type="button"
                              onClick={() =>
                                toggleRule(item.id, reqId, "requires")
                              }
                              className="symbol text-xs hover:text-[#ba1a1a]"
                              title="Hapus ketergantungan"
                            >
                              close
                            </button>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-[#a1a1aa] italic">
                        Tanpa syarat ketergantungan.
                      </span>
                    )}
                  </div>
                </div>

                {/* Excludes Configuration */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#18181a] flex items-center gap-1">
                      <span className="symbol text-sm text-[#f97316]">
                        block
                      </span>
                      Saling Meniadakan (Excludes):
                    </span>
                    <select
                      className="text-xs p-1 rounded border border-[#e4e4e7] bg-white cursor-pointer"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          toggleRule(item.id, e.target.value, "excludes");
                        }
                      }}
                    >
                      <option value="">+ Tambah Mutually Exclusive</option>
                      {allItemIds
                        .filter((i) => i.id !== item.id)
                        .map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.label}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-lg bg-white border border-[#e4e4e7]">
                    {item.rules.some((rule) => rule.ruleType === "excludes") ? (
                      item.rules
                        .filter((rule) => rule.ruleType === "excludes")
                        .map((rule) => {
                        const excId = rule.relatedItemId;
                        const target = items.find((i) => i.id === excId);
                        return (
                          <span
                            key={excId}
                            className="text-[11px] font-medium bg-[#fee2e2] text-[#991b1b] px-2 py-0.5 rounded flex items-center gap-1"
                          >
                            <span>{target?.label || excId}</span>
                            <button
                              type="button"
                              onClick={() =>
                                toggleRule(item.id, excId, "excludes")
                              }
                              className="symbol text-xs hover:text-[#ba1a1a]"
                              title="Hapus pembatasan"
                            >
                              close
                            </button>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-[#a1a1aa] italic">
                        Bebas dipilih bersamaan modul lain.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-[#f0f0f0] text-xs text-[#52525b]">
        <span>
          Semua konfigurasi ketergantungan (requires & excludes) aktif di sesi
          kalkulator visual ini.
        </span>
        <button
          type="button"
          onClick={() => void save()}
          disabled={isLoading || isSaving}
          className="primary-button text-xs !min-h-[36px] disabled:opacity-50"
        >
          <span className="symbol text-base">save</span>
          {isSaving ? "Menyimpan…" : "Simpan Konfigurasi Kalkulator"}
        </button>
      </div>
    </section>
  );
}

export function AdminSupportingPage({ kind }: { kind: Kind }) {
  const { notify } = usePreview();
  return (
    <div className="screen admin-screen relative w-full min-h-screen bg-[#f9f9f9] flex flex-col">
      <AdminSidebar />
      <div
        data-layout="canvas-content"
        className="w-full min-h-screen flex flex-col lg:pl-[288px]"
      >
        <AdminHeader />
        <main
          id="konten"
          className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 w-full max-w-[1920px] mx-auto flex-1"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-[11px] text-[#52525b] mb-1.5 font-medium"
              >
                <span>Admin</span>
                <span>/</span>
                <span>Konten Website</span>
                <span>/</span>
                <span className="text-[#18181a] font-semibold">
                  {titles[kind]}
                </span>
              </nav>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#18181a] m-0">
                {titles[kind]}
              </h1>
              <p className="text-xs sm:text-sm text-[#52525b] mt-1">
                Kelola dan sesuaikan struktur tata letak halaman website secara
                visual dan terstruktur.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                target="_blank"
                className="secondary-button !min-h-[38px] !py-2 text-xs"
              >
                <span className="symbol text-base">visibility</span>
                Pratinjau Web
              </Link>
              {kind === "halaman" ? (
                <button
                  type="button"
                  className="primary-button !min-h-[38px] !py-2 text-xs"
                  onClick={() =>
                    notify(
                      "Page Builder belum menyimpan perubahan ke database. Perubahan ini hanya ada di sesi editor.",
                    )
                  }
                >
                  <span className="symbol text-base">save</span>
                  Simpan Perubahan
                </button>
              ) : null}
            </div>
          </div>
          {kind === "halaman" ? (
            <PageBlocks />
          ) : kind === "media" ? (
            <MediaLibrary />
          ) : (
            <CalculatorBuilder />
          )}
        </main>
      </div>
    </div>
  );
}
