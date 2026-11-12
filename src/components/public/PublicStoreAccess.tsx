"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import {
  finalizePaymentProofUploadAction,
  preparePaymentProofUploadAction,
  requestStoreDownloadUrlAction,
  verifyStoreLicenseAction,
} from "@/actions/public/store";
import { dateWib } from "@/lib/format";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import type { StoreLicenseView } from "@/schemas/store";

const fieldClass =
  "h-[46px] w-full rounded-[10px] border border-[#eaeaea] bg-[#f9f9f9] px-3 text-[14px] text-[#18181a] placeholder-[#a1a1aa] outline-none transition-all focus:border-[#18181a] focus:bg-white";

function downloadCertificate(view: StoreLicenseView) {
  const blob = new Blob([view.certificate], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `LICENSE-${view.orderCode}.txt`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function PublicStoreAccess({ settings }: { settings?: PublicSiteSettings }) {
  const [orderCode, setOrderCode] = useState("");
  const [pin, setPin] = useState("");
  const [view, setView] = useState<StoreLicenseView | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [proofContact, setProofContact] = useState("");
  const [proofState, setProofState] = useState("");
  const [proofStatus, setProofStatus] = useState("");

  async function uploadProof(file: File) {
    if (proofState) return;
    setProofState("Meminta tautan unggah...");
    setProofStatus("");
    try {
      const prepared = await preparePaymentProofUploadAction({
        orderCode: orderCode.trim().toUpperCase(),
        filename: file.name,
        mimeType: file.type as
          | "image/png"
          | "image/jpeg"
          | "image/webp"
          | "application/pdf",
      });
      if (!prepared.ok) {
        setProofStatus(prepared.message);
        setProofState("");
        return;
      }
      setProofState("Mengunggah bukti transfer...");
      const put = await fetch(prepared.data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) {
        setProofStatus("Unggah bukti transfer gagal.");
        setProofState("");
        return;
      }
      setProofState("Memverifikasi bukti transfer...");
      const contact = proofContact.trim();
      const isEmail = contact.includes("@");
      const finalized = await finalizePaymentProofUploadAction({
        orderCode: orderCode.trim().toUpperCase(),
        ...(contact
          ? isEmail
            ? { buyerEmail: contact }
            : { buyerWhatsapp: contact }
          : {}),
        key: prepared.data.key,
      });
      if (!finalized.ok) {
        setProofStatus(finalized.message);
        setProofState("");
        return;
      }
      setProofStatus("Bukti pembayaran terkirim. Admin akan memverifikasi.");
      setProofState("");
    } catch {
      setProofStatus("Bukti pembayaran tidak dapat diunggah.");
      setProofState("");
    }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setDownloadError("");
    try {
      const response = await verifyStoreLicenseAction({ orderCode, pin });
      if (!response.ok) {
        setError(response.message);
        setView(null);
        return;
      }
      setView(response.data);
    } catch {
      setError("Lisensi tidak dapat diverifikasi. Coba lagi beberapa saat.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function download() {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadError("");
    try {
      const response = await requestStoreDownloadUrlAction({ orderCode, pin });
      if (!response.ok) {
        setDownloadError(response.message);
        return;
      }
      setView(response.data);
      if (response.data.downloadUrl) {
        window.location.assign(response.data.downloadUrl);
      }
    } catch {
      setDownloadError("Unduhan tidak dapat dimulai. Coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="box-border relative flex min-h-screen w-full flex-col items-stretch justify-start overflow-x-hidden bg-[#ffffff] screen public-screen">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="box-border relative flex w-full flex-1 flex-col items-center justify-start bg-[#ffffff] pb-16 pt-[104px] lg:pt-[68px]"
      >
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 pt-8 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#52525b]">
              <span className="symbol text-[18px] text-[#82b440]" aria-hidden="true">
                key
              </span>
              Portal Unduhan &amp; Lisensi
            </div>
            <h1 className="m-0 text-[28px]/[1.2] font-semibold tracking-[-0.02em] text-[#18181a] sm:text-[34px]/[1.15]">
              Akses Unduhan &amp; Lisensi Saya
            </h1>
            <p className="m-0 text-[14px]/[1.65] text-[#52525b]">
              Masukkan Kode Order dan PIN 6 digit yang dikirim Admin setelah pembayaran
              lunas. Tautan unduhan paket hanya aktif 60 detik demi keamanan.
            </p>
          </header>

          <form
            onSubmit={verify}
            className="flex flex-col gap-4 rounded-[16px] border border-[#eaeaea] bg-white p-6 shadow-[0px_2px_12px_#0000000a]"
          >
            <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
              Kode Order / Lisensi
              <input
                required
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                className={`${fieldClass} font-mono tracking-[0.08em]`}
                placeholder="OBL-STR-XXXXXX"
                autoComplete="off"
              />
            </label>
            <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
              PIN Lisensi (6 digit)
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className={`${fieldClass} font-mono tracking-[0.4em]`}
                placeholder="••••••"
                autoComplete="one-time-code"
              />
            </label>

            {error ? (
              <p className="m-0 rounded-[8px] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#991b1b]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] bg-[#18181a] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#242427] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Memverifikasi..." : "Verifikasi Lisensi"}
              <span className="symbol text-[18px] text-[#e2e89d]" aria-hidden="true">
                verified_user
              </span>
            </button>
          </form>

          <section className="flex flex-col gap-3 rounded-[16px] border border-[#eaeaea] bg-white p-6 shadow-[0px_2px_12px_#0000000a]">
            <div>
              <h2 className="m-0 text-[15px] font-semibold text-[#18181a]">
                Upload Bukti Pembayaran
              </h2>
              <p className="m-0 mt-0.5 text-[12px]/[1.6] text-[#71717a]">
                Untuk pesanan yang masih menunggu pembayaran. Masukkan Kode Order di atas
                lalu unggah foto atau PDF bukti transfer (maks. 10 MB).
              </p>
            </div>
            <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
              WhatsApp / Email Pemesan (opsional, untuk verifikasi)
              <input
                value={proofContact}
                onChange={(e) => setProofContact(e.target.value)}
                className={fieldClass}
                placeholder="0812xxxxxxx atau nama@email.com"
              />
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              disabled={proofState !== "" || !orderCode.trim()}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) void uploadProof(file);
              }}
              className="block w-full text-[12px] text-[#52525b]"
            />
            {proofState ? (
              <span className="text-[12px] text-[#52525b]">{proofState}</span>
            ) : null}
            {proofStatus ? (
              <span className="text-[12px] text-[#457c1d]">{proofStatus}</span>
            ) : null}
          </section>

          {view ? (
            <section className="flex flex-col gap-4 overflow-hidden rounded-[16px] border border-[#18181a] bg-[#18181a] p-6 text-white shadow-[0px_4px_20px_#0000001a]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e2e89d]">
                  Sertifikat Lisensi Digital Resmi
                </span>
                <span className="rounded-[6px] bg-[#e2e89d] px-2 py-0.5 text-[10px] font-semibold text-[#454a10]">
                  AKTIF
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-[0.08em] text-[#a8a8ad]">
                    Produk
                  </span>
                  <span className="text-[14px] font-semibold">
                    {view.productTitle} <span className="text-[12px] font-normal text-[#a8a8ad]">v{view.productVersion}</span>
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-[0.08em] text-[#a8a8ad]">
                    Pemegang Lisensi
                  </span>
                  <span className="text-[14px] font-semibold">{view.buyerName}</span>
                  <span className="text-[11px] text-[#a8a8ad]">{view.buyerEmail}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-[0.08em] text-[#a8a8ad]">
                    Tipe Lisensi
                  </span>
                  <span className="text-[14px] font-semibold">
                    {view.licenseTier === "commercial" ? "Commercial / Agency" : "Single Project"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-[0.08em] text-[#a8a8ad]">
                    Kode Order
                  </span>
                  <span className="font-mono text-[14px] font-semibold">{view.orderCode}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 rounded-[12px] bg-[#242427] p-4">
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#a8a8ad]">
                  SHA-256 License Fingerprint
                </span>
                <span className="break-all font-mono text-[13px] font-semibold text-[#e2e89d]">
                  OBL-FP-{view.licenseFingerprint}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
                <span className="text-[#a8a8ad]">
                  Sisa Kuota Unduh:{" "}
                  <strong className="text-white">
                    {view.remainingDownloads} dari {view.maxDownloads}
                  </strong>
                </span>
                <span className="text-[#a8a8ad]">
                  Kedaluwarsa:{" "}
                  <strong className="text-white">
                    {view.expiresAt ? dateWib(view.expiresAt) : "—"}
                  </strong>
                </span>
              </div>

              {downloadError ? (
                <p className="m-0 rounded-[8px] bg-[#3a1c1c] px-3 py-2 text-[12px] text-[#fca5a5]">
                  {downloadError}
                </p>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={isDownloading || !view.hasPackage || view.remainingDownloads <= 0}
                  onClick={() => void download()}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#e2e89d] px-4 py-2.5 text-[13px] font-semibold text-[#454a10] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="symbol text-[18px]" aria-hidden="true">
                    download
                  </span>
                  {view.hasPackage
                    ? isDownloading
                      ? "Menyiapkan tautan..."
                      : "Unduh Paket Source Code / HTML (.ZIP)"
                    : "Paket .zip belum tersedia"}
                </button>
                <button
                  type="button"
                  onClick={() => downloadCertificate(view)}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#3f3f45] bg-transparent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#242427]"
                >
                  <span className="symbol text-[18px]" aria-hidden="true">
                    description
                  </span>
                  Unduh Sertifikat (LICENSE.txt)
                </button>
              </div>

              {view.productSlug ? (
                <Link
                  href={`/store/${view.productSlug}#ulasan`}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[10px] border border-[#3f3f45] bg-[#242427] px-4 py-2 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-[#2e2e33]"
                >
                  <span className="symbol text-[18px] text-[#e2e89d]" aria-hidden="true">
                    star
                  </span>
                  Beri Rating &amp; Ulasan Produk
                </Link>
              ) : null}

              <p className="m-0 text-[11px]/[1.6] text-[#a8a8ad]">
                Tautan unduhan .zip aktif hanya 60 detik dan terikat pada alamat IP Anda.
                Jangan bagikan PIN maupun tautan kepada siapa pun.
              </p>
            </section>
          ) : null}

          <div className="rounded-[16px] border border-[#eaeaea] bg-[#fafafa] p-5 text-[12px]/[1.7] text-[#52525b]">
            Belum punya Kode Order?{" "}
            <Link href="/store" className="font-medium text-[#18181a] underline">
              Jelajahi katalog Digital Store
            </Link>{" "}
            lalu selesaikan pembayaran untuk mendapatkan PIN aktivasi lisensi.
          </div>
        </div>
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}
