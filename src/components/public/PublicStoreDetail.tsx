"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { TurnstileWidget } from "./TurnstileWidget";
import {
  finalizePaymentProofUploadAction,
  finalizeReviewMediaUploadAction,
  preparePaymentProofUploadAction,
  prepareReviewMediaUploadAction,
  previewStoreCouponAction,
  submitStoreOrderAction,
  submitStoreReviewAction,
} from "@/actions/public/store";
import type { ActionResult } from "@/actions/result";
import { dateWib, rupiah } from "@/lib/format";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import type {
  PublicStoreProduct,
  StoreCouponPreviewResult,
  StoreReviewMediaItem,
  StoreReviewPublic,
} from "@/schemas/store";

type Tier = "single" | "commercial";
type DetailTab = "overview" | "package" | "changelog" | "reviews";
type OrderResult = {
  orderCode: string;
  whatsappUrl: string | null;
  amount: number;
  baseAmount: number;
  setupFeeAmount: number;
  discountAmount: number;
  couponCode: string | null;
  productTitle: string;
  licenseTier: Tier;
};

const fieldClass =
  "h-[42px] w-full rounded-[10px] border border-[#eaeaea] bg-[#f9f9f9] px-3 text-[13px] text-[#18181a] placeholder-[#a1a1aa] outline-none transition-all focus:border-[#18181a] focus:bg-white";

function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[13px] text-[#b58105]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < value ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function PublicStoreDetail({
  product,
  settings,
  reviews,
  related,
}: {
  product: PublicStoreProduct;
  settings?: PublicSiteSettings;
  reviews: StoreReviewPublic[];
  related: PublicStoreProduct[];
}) {
  const commercialAvailable = product.priceCommercial !== null;
  const [tier, setTier] = useState<Tier>("single");
  const [includeSetup, setIncludeSetup] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<StoreCouponPreviewResult | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  const [buyerName, setBuyerName] = useState("");
  const [buyerWhatsapp, setBuyerWhatsapp] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerGithub, setBuyerGithub] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<OrderResult | null>(null);
  const [proofState, setProofState] = useState("");
  const [proofDone, setProofDone] = useState(false);

  const [tab, setTab] = useState<DetailTab>("overview");
  const [slideIndex, setSlideIndex] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const [reviewList, setReviewList] = useState<StoreReviewPublic[]>(reviews);
  const [reviewCode, setReviewCode] = useState("");
  const [reviewPin, setReviewPin] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMedia, setReviewMedia] = useState<StoreReviewMediaItem[]>([]);
  const [reviewState, setReviewState] = useState("");
  const [reviewError, setReviewError] = useState("");

  const slides = useMemo(() => {
    const list: Array<{
      kind: "video" | "image";
      url: string;
      poster?: string;
      alt: string;
      caption?: string;
    }> = [];
    if (product.videoUrl) {
      list.push({
        kind: "video",
        url: product.videoUrl,
        poster: product.thumbnail?.url,
        alt: `${product.title} — video demo`,
      });
    }
    if (product.thumbnail) {
      list.push({
        kind: "image",
        url: product.thumbnail.url,
        alt: product.thumbnail.alt || product.title,
      });
    }
    for (const item of product.gallery) {
      list.push({
        kind: "image",
        url: item.url,
        alt: item.alt || product.title,
        caption: item.caption,
      });
    }
    return list;
  }, [product]);

  const activeSlide = slides[slideIndex] ?? slides[0];

  const basePrice = tier === "commercial" ? product.priceCommercial : product.priceSingle;
  const base = basePrice ?? 0;
  const appliedCoupon = coupon && coupon.baseAmount === base ? coupon : null;
  const discount = appliedCoupon?.discountAmount ?? 0;
  const setupFee =
    includeSetup && product.setupServicePrice !== null ? product.setupServicePrice : 0;
  const total = Math.max(0, base - discount) + setupFee;

  const activeCompareAt =
    tier === "commercial" ? product.compareAtPriceCommercial : product.compareAtPriceSingle;
  const activeCompareValid = activeCompareAt !== null && activeCompareAt > base;

  const averageScore = reviewList.length
    ? reviewList.reduce((sum, review) => sum + review.rating, 0) / reviewList.length
    : product.ratingAverage / 100;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewList.filter((review) => review.rating === star).length,
  }));

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code || isCheckingCoupon) return;
    setIsCheckingCoupon(true);
    setCouponError("");
    try {
      const response = await previewStoreCouponAction({
        code,
        productSlug: product.slug,
        licenseTier: tier,
        includeSetupService: includeSetup,
      });
      if (!response.ok) {
        setCoupon(null);
        setCouponError(response.message);
        return;
      }
      setCoupon(response.data);
    } catch {
      setCoupon(null);
      setCouponError("Kode kupon tidak dapat diperiksa.");
    } finally {
      setIsCheckingCoupon(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    if (!consent) {
      setError("Anda harus menyetujui ketentuan lisensi dan larangan redistribusi.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      const response: ActionResult<OrderResult> = await submitStoreOrderAction({
        productSlug: product.slug,
        licenseTier: tier,
        buyerName: buyerName.trim(),
        buyerWhatsapp: buyerWhatsapp.trim(),
        buyerEmail: buyerEmail.trim(),
        ...(buyerGithub.trim() ? { buyerGithub: buyerGithub.trim() } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
        ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
        ...(setupFee > 0 ? { includeSetupService: true } : {}),
        consent: true,
        turnstileToken,
        honeypot,
      });
      if (!response.ok) {
        setError(response.message);
        setFieldErrors(response.fieldErrors ?? {});
        setResetKey((key) => key + 1);
        setTurnstileToken("");
        return;
      }
      setResult(response.data);
      if (response.data.whatsappUrl) {
        window.open(response.data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      setError("Pesanan tidak dapat diproses. Coba lagi beberapa saat.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function uploadProof(file: File) {
    if (!result || proofState) return;
    setProofState("Meminta tautan unggah...");
    setError("");
    try {
      const prepared = await preparePaymentProofUploadAction({
        orderCode: result.orderCode,
        filename: file.name,
        mimeType: file.type as "image/png" | "image/jpeg" | "image/webp" | "application/pdf",
      });
      if (!prepared.ok) {
        setError(prepared.message);
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
        setError("Unggah bukti transfer gagal.");
        setProofState("");
        return;
      }
      setProofState("Memverifikasi bukti transfer...");
      const finalized = await finalizePaymentProofUploadAction({
        orderCode: result.orderCode,
        buyerWhatsapp: buyerWhatsapp.trim() || undefined,
        buyerEmail: buyerEmail.trim() || undefined,
        key: prepared.data.key,
      });
      if (!finalized.ok) {
        setError(finalized.message);
        setProofState("");
        return;
      }
      setProofDone(true);
      setProofState("");
    } catch {
      setError("Bukti transfer tidak dapat diunggah.");
      setProofState("");
    }
  }

  async function uploadReviewMedia(file: File) {
    if (reviewState) return;
    setReviewState("Mengunggah media...");
    setReviewError("");
    try {
      const prepared = await prepareReviewMediaUploadAction({
        orderCode: reviewCode.trim().toUpperCase(),
        filename: file.name,
        mimeType: file.type,
      });
      if (!prepared.ok) {
        setReviewError(prepared.message);
        setReviewState("");
        return;
      }
      const put = await fetch(prepared.data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) {
        setReviewError("Unggah media ulasan gagal.");
        setReviewState("");
        return;
      }
      const finalized = await finalizeReviewMediaUploadAction({
        orderCode: reviewCode.trim().toUpperCase(),
        key: prepared.data.key,
      });
      if (!finalized.ok) {
        setReviewError(finalized.message);
        setReviewState("");
        return;
      }
      setReviewMedia((current) => [...current, finalized.data]);
      setReviewState("");
    } catch {
      setReviewError("Media ulasan tidak dapat diunggah.");
      setReviewState("");
    }
  }

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reviewState) return;
    setReviewState("Mengirim ulasan...");
    setReviewError("");
    try {
      const response = await submitStoreReviewAction({
        orderCode: reviewCode.trim().toUpperCase(),
        pin: reviewPin.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        mediaItems: reviewMedia,
      });
      if (!response.ok) {
        setReviewError(response.message);
        setReviewState("");
        return;
      }
      setReviewList((current) => [
        response.data,
        ...current.filter((review) => review.id !== response.data.id),
      ]);
      setReviewComment("");
      setReviewMedia([]);
      setReviewPin("");
      setReviewState("Ulasan terkirim. Terima kasih!");
    } catch {
      setReviewError("Ulasan tidak dapat dikirim.");
      setReviewState("");
    }
  }

  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: "overview", label: "Deskripsi & Fitur" },
    { id: "package", label: "Isi Paket & Spesifikasi" },
    { id: "changelog", label: "Changelog Versi" },
    { id: "reviews", label: `Ulasan Pembeli (${reviewList.length})` },
  ];

  return (
    <div className="box-border relative flex min-h-screen w-full flex-col items-stretch justify-start overflow-x-hidden bg-[#ffffff] screen public-screen">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="box-border relative flex w-full flex-1 flex-col items-center justify-start bg-[#ffffff] pb-16 pt-[104px] lg:pt-[68px]"
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-[#71717a]">
            <Link href="/" className="text-[#52525b] no-underline hover:text-[#18181a]">
              Beranda
            </Link>
            <span className="text-[#a1a1aa]">/</span>
            <Link href="/store" className="text-[#52525b] no-underline hover:text-[#18181a]">
              Store
            </Link>
            <span className="text-[#a1a1aa]">/</span>
            <span className="text-[#18181a]">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: media stage, tabs, reviews, related */}
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="overflow-hidden rounded-[16px] border border-[#eaeaea] bg-white">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f0f0f0]">
                  {activeSlide?.kind === "video" ? (
                    <video
                      key={activeSlide.url}
                      src={activeSlide.url}
                      poster={activeSlide.poster}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-contain bg-[#18181a]"
                    />
                  ) : activeSlide ? (
                    <>
                      <Image
                        src={activeSlide.url}
                        alt={activeSlide.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setLightbox(activeSlide.url)}
                        className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-[8px] bg-[#18181a]/85 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur"
                      >
                        <span className="symbol text-[15px] text-[#e2e89d]" aria-hidden="true">
                          zoom_out_map
                        </span>
                        Perbesar
                      </button>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#18181a]">
                      <span className="symbol text-5xl text-[#e2e89d]" aria-hidden="true">
                        {product.productType === "ui_template" ? "palette" : "code"}
                      </span>
                    </div>
                  )}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-[6px] bg-[#18181a] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                    {product.productType === "ui_template" ? "HTML UI/UX" : "Source Code"}
                  </span>
                  {slides.length > 1 ? (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-[6px] bg-[#18181a]/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                      <span className="symbol text-[13px] text-[#e2e89d]" aria-hidden="true">
                        photo_library
                      </span>
                      <span>
                        {slideIndex + 1} / {slides.length}
                      </span>
                    </span>
                  ) : null}
                  {slides.length > 1 ? (
                    <>
                      <button
                        type="button"
                        aria-label="Slide sebelumnya"
                        onClick={() =>
                          setSlideIndex((index) => (index - 1 + slides.length) % slides.length)
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#18181a] shadow-md transition-all hover:bg-white hover:scale-105 active:scale-95"
                      >
                        <span className="symbol text-[20px]" aria-hidden="true">
                          chevron_left
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label="Slide berikutnya"
                        onClick={() => setSlideIndex((index) => (index + 1) % slides.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#18181a] shadow-md transition-all hover:bg-white hover:scale-105 active:scale-95"
                      >
                        <span className="symbol text-[20px]" aria-hidden="true">
                          chevron_right
                        </span>
                      </button>
                    </>
                  ) : null}
                </div>
                {slides.length > 1 ? (
                  <div className="border-t border-[#eaeaea] bg-[#fbfbfb] p-3">
                    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
                      {slides.map((slide, index) => {
                        const isActive = index === slideIndex;
                        return (
                          <button
                            key={`${slide.url}-${index}`}
                            type="button"
                            onClick={() => setSlideIndex(index)}
                            aria-label={`Tampilkan slide ${index + 1}`}
                            aria-current={isActive ? "true" : undefined}
                            className={`group relative aspect-[16/10] w-[88px] sm:w-[96px] shrink-0 cursor-pointer overflow-hidden rounded-[8px] border transition-all duration-150 ${
                              isActive
                                ? "border-[#18181a] ring-2 ring-[#18181a] ring-offset-2 ring-offset-[#fbfbfb] opacity-100 shadow-sm"
                                : "border-[#e4e4e7] opacity-60 hover:opacity-100 hover:border-[#a1a1aa]"
                            }`}
                          >
                            {slide.kind === "image" ? (
                              <Image
                                src={slide.url}
                                alt={slide.alt}
                                fill
                                unoptimized
                                sizes="100px"
                                className="object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center bg-[#18181a]">
                                <span className="symbol text-[22px] text-[#e2e89d]" aria-hidden="true">
                                  play_circle
                                </span>
                              </span>
                            )}
                            {slide.kind === "video" && (
                              <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded bg-black/70 text-white">
                                <span className="symbol text-[12px]">play_arrow</span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              {product.demoUrl ? (
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] border border-[#18181a] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#18181a] no-underline transition-colors hover:bg-[#f0f0f0]"
                >
                  <span className="symbol text-[18px]" aria-hidden="true">
                    rocket_launch
                  </span>
                  Buka Live Demo Interaktif
                </a>
              ) : null}

              <div className="flex flex-col gap-2">
                <h1 className="m-0 text-[28px]/[1.2] font-semibold tracking-[-0.02em] text-[#18181a] sm:text-[34px]/[1.15]">
                  {product.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#71717a]">
                  <span className="font-mono">v{product.version}</span>
                  <span>·</span>
                  <Stars value={Math.round(averageScore)} />
                  <span className="font-semibold text-[#18181a]">{averageScore.toFixed(1)}</span>
                  <span>({product.ratingCount})</span>
                  <span>·</span>
                  <span>{product.salesCount} terjual</span>
                  {product.githubRepoInfo ? <span>· Repo {product.githubRepoInfo}</span> : null}
                </div>
                {product.tagline ? (
                  <p className="m-0 text-[15px]/[1.65] text-[#52525b]">{product.tagline}</p>
                ) : null}
              </div>

              <div id="ulasan" className="flex flex-wrap gap-1.5 border-b border-[#eaeaea] pb-1">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={tab === item.id}
                    onClick={() => setTab(item.id)}
                    className={`rounded-[8px] px-3 py-2 text-[13px] font-medium transition-colors ${
                      tab === item.id
                        ? "bg-[#18181a] text-white"
                        : "text-[#52525b] hover:bg-[#f0f0f0] hover:text-[#18181a]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {tab === "overview" ? (
                <div className="flex flex-col gap-4">
                  {product.summary ? (
                    <section className="rounded-[16px] border border-[#eaeaea] bg-white p-6">
                      <h2 className="m-0 mb-2 text-[15px] font-semibold text-[#18181a]">Deskripsi Produk</h2>
                      <p className="m-0 whitespace-pre-line text-[14px]/[1.75] text-[#52525b]">
                        {product.summary}
                      </p>
                    </section>
                  ) : null}

                  {product.features.length ? (
                    <section className="rounded-[16px] border border-[#eaeaea] bg-white p-6">
                      <h2 className="m-0 mb-3 text-[15px] font-semibold text-[#18181a]">
                        Fitur &amp; Komponen Utama
                      </h2>
                      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-[13px]/[1.6] text-[#52525b]">
                            <span className="symbol mt-0.5 text-[16px] text-[#82b440]" aria-hidden="true">
                              check_circle
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  <section className="rounded-[16px] border border-[#eaeaea] bg-[#fbfbfb] p-6">
                    <h2 className="m-0 mb-3 text-[15px] font-semibold text-[#18181a]">
                      Ketentuan Lisensi &amp; Anti-Redistribusi
                    </h2>
                    <div className="grid gap-3 text-[13px]/[1.7] text-[#52525b]">
                      <p className="m-0">
                        <strong className="text-[#18181a]">Single Project License</strong> — untuk satu
                        proyek pribadi atau klien. Dilarang menjual ulang, membagikan, atau
                        mempublikasikan ulang sebagai template/source code.
                      </p>
                      <p className="m-0">
                        <strong className="text-[#18181a]">Commercial / Agency License</strong> — boleh
                        dipakai pada banyak proyek klien, namun tetap dilarang menjual ulang sebagai
                        template/source code di marketplace mana pun.
                      </p>
                      <p className="m-0 text-[12px] text-[#71717a]">
                        Setiap pembelian dilindungi License Fingerprint forensik. Pelanggaran
                        distribusi berakibat pencabutan lisensi (kill-switch) dan proses sesuai UU
                        Hak Cipta No. 28 Tahun 2014.
                      </p>
                    </div>
                  </section>
                </div>
              ) : null}

              {tab === "package" ? (
                <div className="flex flex-col gap-4">
                  <section className="rounded-[16px] border border-[#eaeaea] bg-white p-6">
                    <h2 className="m-0 mb-3 text-[15px] font-semibold text-[#18181a]">
                      Isi Paket Unduhan (.ZIP)
                    </h2>
                    {product.includedFiles.length ? (
                      <ul className="m-0 grid list-none grid-cols-1 gap-1.5 p-0 font-mono text-[12px]/[1.7] text-[#52525b]">
                        {product.includedFiles.map((file) => (
                          <li key={file} className="flex items-start gap-2">
                            <span className="symbol mt-0.5 text-[15px] text-[#71717a]" aria-hidden="true">
                              description
                            </span>
                            {file}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="m-0 text-[13px] text-[#71717a]">
                        Daftar file belum dipublikasikan.
                      </p>
                    )}
                  </section>

                  <section className="rounded-[16px] border border-[#eaeaea] bg-white p-6">
                    <h2 className="m-0 mb-3 text-[15px] font-semibold text-[#18181a]">Tech Stack</h2>
                    {product.techStack.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.techStack.map((tech) => (
                          <span key={tech} className="rounded-[4px] bg-[#f0f0f0] px-2 py-1 text-[11px] font-medium text-[#52525b]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="m-0 text-[13px] text-[#71717a]">Belum ada tech stack.</p>
                    )}
                  </section>
                </div>
              ) : null}

              {tab === "changelog" ? (
                <section className="rounded-[16px] border border-[#eaeaea] bg-white p-6">
                  <h2 className="m-0 mb-3 text-[15px] font-semibold text-[#18181a]">Changelog Versi</h2>
                  {product.changelog ? (
                    <p className="m-0 whitespace-pre-line font-mono text-[12.5px]/[1.8] text-[#52525b]">
                      {product.changelog}
                    </p>
                  ) : (
                    <p className="m-0 text-[13px] text-[#71717a]">
                      Belum ada catatan rilis untuk produk ini.
                    </p>
                  )}
                </section>
              ) : null}

              {tab === "reviews" ? (
                <div className="flex flex-col gap-4">
                  <section className="rounded-[16px] border border-[#eaeaea] bg-white p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[40px]/[1] font-semibold text-[#18181a]">
                          {averageScore.toFixed(1)}
                        </span>
                        <Stars value={Math.round(averageScore)} />
                        <span className="text-[11px] text-[#71717a]">
                          {reviewList.length} ulasan
                        </span>
                      </div>
                      <div className="flex-1">
                        {distribution.map((item) => (
                          <div key={item.star} className="flex items-center gap-2 py-0.5">
                            <span className="w-8 text-[11px] text-[#71717a]">{item.star}★</span>
                            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f0f0f0]">
                              <span
                                className="block h-full rounded-full bg-[#b58105]"
                                style={{
                                  width: `${
                                    reviewList.length
                                      ? Math.round((item.count / reviewList.length) * 100)
                                      : 0
                                  }%`,
                                }}
                              />
                            </span>
                            <span className="w-6 text-right text-[11px] text-[#71717a]">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <div className="grid gap-3">
                    {reviewList.length === 0 ? (
                      <p className="m-0 rounded-[12px] border border-dashed border-[#eaeaea] bg-[#fafafa] p-6 text-center text-[13px] text-[#71717a]">
                        Belum ada ulasan. Jadilah pembeli pertama yang memberi rating.
                      </p>
                    ) : (
                      reviewList.map((review) => (
                        <article
                          key={review.id}
                          className="flex flex-col gap-2 rounded-[16px] border border-[#eaeaea] bg-white p-5"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[13px] font-semibold text-[#18181a]">
                              {review.buyerName}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#eef8ed] px-1.5 py-0.5 text-[10px] font-semibold text-[#457c1d]">
                              <span className="symbol text-[12px]" aria-hidden="true">
                                verified
                              </span>
                              Pembeli Terverifikasi
                            </span>
                            <span className="rounded-[4px] bg-[#f0f0f0] px-1.5 py-0.5 text-[10px] font-medium text-[#52525b]">
                              {review.licenseTier === "commercial" ? "Commercial" : "Single"}
                            </span>
                            <span className="ml-auto text-[11px] text-[#71717a]">
                              {dateWib(review.createdAt)}
                            </span>
                          </div>
                          <Stars value={review.rating} />
                          <p className="m-0 whitespace-pre-line text-[13px]/[1.7] text-[#52525b]">
                            {review.comment}
                          </p>
                          {review.mediaItems.length ? (
                            <div className="flex flex-wrap gap-2">
                              {review.mediaItems.map((media, index) =>
                                media.kind === "video" ? (
                                  <video
                                    key={`${media.url}-${index}`}
                                    src={media.url}
                                    controls
                                    playsInline
                                    preload="metadata"
                                    className="h-28 w-40 rounded-[8px] bg-black object-cover"
                                  />
                                ) : (
                                  <button
                                    key={`${media.url}-${index}`}
                                    type="button"
                                    onClick={() => setLightbox(media.url)}
                                    className="relative h-20 w-20 overflow-hidden rounded-[8px] bg-[#f0f0f0]"
                                  >
                                    <Image
                                      src={media.url}
                                      alt={media.caption ?? "Foto ulasan pembeli"}
                                      fill
                                      unoptimized
                                      sizes="80px"
                                      className="object-cover"
                                    />
                                  </button>
                                ),
                              )}
                            </div>
                          ) : null}
                          {review.adminReply ? (
                            <div className="rounded-[10px] bg-[#fbfbfb] p-3 text-[12px]/[1.7] text-[#52525b]">
                              <strong className="text-[#18181a]">Balasan OpenByte Labs: </strong>
                              {review.adminReply}
                            </div>
                          ) : null}
                        </article>
                      ))
                    )}
                  </div>

                  <form
                    onSubmit={submitReview}
                    className="flex flex-col gap-3 rounded-[16px] border border-[#eaeaea] bg-white p-6"
                  >
                    <h2 className="m-0 text-[15px] font-semibold text-[#18181a]">
                      Kirim Ulasan &amp; Upload Foto/Video Review
                    </h2>
                    <p className="m-0 text-[12px] text-[#71717a]">
                      Gunakan Kode Order dan PIN lisensi Anda. Hanya pembeli lunas yang dapat
                      mengirim ulasan.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
                        Kode Order
                        <input
                          required
                          value={reviewCode}
                          onChange={(e) => setReviewCode(e.target.value.toUpperCase())}
                          className={`${fieldClass} font-mono`}
                          placeholder="OBL-STR-XXXXXX"
                        />
                      </label>
                      <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
                        PIN Lisensi
                        <input
                          required
                          inputMode="numeric"
                          maxLength={6}
                          value={reviewPin}
                          onChange={(e) =>
                            setReviewPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                          }
                          className={`${fieldClass} font-mono tracking-[0.3em]`}
                          placeholder="••••••"
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          aria-label={`Beri ${star} bintang`}
                          onClick={() => setReviewRating(star)}
                          className={`text-[24px] leading-none ${
                            star <= reviewRating ? "text-[#b58105]" : "text-[#d4d4d8]"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      required
                      rows={3}
                      maxLength={2000}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full rounded-[10px] border border-[#eaeaea] bg-[#f9f9f9] p-3 text-[13px] text-[#18181a] outline-none transition-all focus:border-[#18181a] focus:bg-white"
                      placeholder="Ceritakan pengalaman Anda memakai produk ini (min. 10 karakter)..."
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#eaeaea] bg-white px-3 py-2 text-[12px] font-medium text-[#18181a] hover:bg-[#f0f0f0]">
                        <span className="symbol text-[16px]" aria-hidden="true">
                          add_a_photo
                        </span>
                        Tambah Foto/Video Review
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
                          className="hidden"
                          disabled={reviewState !== "" || reviewMedia.length >= 6}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) void uploadReviewMedia(file);
                          }}
                        />
                      </label>
                      {reviewMedia.map((media, index) => (
                        <span
                          key={`${media.url}-${index}`}
                          className="inline-flex items-center gap-1 rounded-[6px] bg-[#f0f0f0] px-2 py-1 text-[11px] text-[#52525b]"
                        >
                          {media.kind === "video" ? "video" : "foto"} #{index + 1}
                          <button
                            type="button"
                            onClick={() =>
                              setReviewMedia((current) =>
                                current.filter((_, position) => position !== index),
                              )
                            }
                            className="text-[#ba1a1a]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    {reviewError ? (
                      <p className="m-0 rounded-[8px] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#991b1b]">
                        {reviewError}
                      </p>
                    ) : null}
                    {reviewState ? (
                      <p className="m-0 text-[12px] text-[#52525b]">{reviewState}</p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={reviewState !== ""}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-[#18181a] px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50"
                    >
                      Kirim Ulasan
                      <span className="symbol text-[17px] text-[#e2e89d]" aria-hidden="true">
                        send
                      </span>
                    </button>
                  </form>
                </div>
              ) : null}
            </div>

            {/* Right: sticky checkout */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 flex flex-col gap-4 rounded-[16px] border border-[#eaeaea] bg-white p-6 shadow-[0px_2px_12px_#0000000a]">
                {result ? (
                  <div className="flex flex-col gap-3 rounded-[12px] border border-[#d6eed3] bg-[#eef8ed] p-4">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#457c1d]">
                      <span className="symbol text-[18px]" aria-hidden="true">
                        check_circle
                      </span>
                      Pesanan diterima
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase tracking-[0.08em] text-[#52525b]">
                        Kode Order / Lisensi
                      </span>
                      <span className="font-mono text-xl font-semibold tracking-[0.08em] text-[#18181a]">
                        {result.orderCode}
                      </span>
                    </div>
                    <p className="m-0 text-[12px]/[1.65] text-[#52525b]">
                      Simpan kode ini. Selesaikan pembayaran {rupiah(result.amount)} untuk{" "}
                      {result.productTitle}, lalu kirim bukti ke Admin. Setelah lunas, Admin akan
                      mengirim PIN 6 digit agar Anda dapat membuka{" "}
                      <Link href="/store/akses" className="font-medium text-[#18181a] underline">
                        Portal Unduhan
                      </Link>
                      .
                    </p>
                    {result.whatsappUrl ? (
                      <a
                        href={result.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-[10px] bg-[#18181a] px-4 py-2 text-[13px] font-semibold text-white no-underline"
                      >
                        <span className="symbol text-[18px] text-[#e2e89d]" aria-hidden="true">
                          chat
                        </span>
                        Kirim Detail Pesanan ke WhatsApp Admin
                      </a>
                    ) : null}
                    <div className="flex flex-col gap-1.5 rounded-[10px] border border-[#cfe8cb] bg-white p-3">
                      <span className="text-[12px] font-semibold text-[#18181a]">
                        Upload Bukti Transfer
                      </span>
                      {proofDone ? (
                        <span className="text-[12px] text-[#457c1d]">
                          Bukti bayar terkirim. Menunggu verifikasi Admin.
                        </span>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,application/pdf"
                            disabled={proofState !== ""}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (file) void uploadProof(file);
                            }}
                            className="block w-full text-[11px] text-[#52525b]"
                          />
                          <span className="text-[11px] text-[#71717a]">
                            Gambar atau PDF, maksimal 10 MB.
                          </span>
                          {proofState ? (
                            <span className="text-[11px] text-[#52525b]">{proofState}</span>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                ) : null}

                <div>
                  <h2 className="m-0 text-[16px] font-semibold text-[#18181a]">
                    Pilih Lisensi &amp; Pesan
                  </h2>
                  <p className="m-0 mt-0.5 text-[12px] text-[#71717a]">
                    Isi data pembeli untuk menerima Kode Order &amp; PIN lisensi.
                  </p>
                </div>

                <div className="grid gap-2">
                  <label
                    className={`group relative flex cursor-pointer items-center justify-between gap-3.5 rounded-[12px] border p-3.5 transition-all ${
                      tier === "single"
                        ? "border-[#18181a] bg-[#fafafa] ring-1 ring-[#18181a] shadow-sm"
                        : "border-[#e4e4e7] bg-white hover:border-[#a1a1aa] hover:bg-[#fafafa]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <input
                        type="radio"
                        name="licenseTier"
                        checked={tier === "single"}
                        onChange={() => setTier("single")}
                        className="h-4 w-4 shrink-0 accent-[#18181a] cursor-pointer"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-semibold text-[#18181a] leading-tight">
                          Single Project License
                        </span>
                        <span className="text-[11px] text-[#71717a] mt-0.5 leading-normal">
                          1 proyek pribadi / klien
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pl-2 text-right">
                      {product.compareAtPriceSingle !== null &&
                      product.compareAtPriceSingle > product.priceSingle ? (
                        <span className="text-[11px] text-[#a1a1aa] line-through leading-tight">
                          {rupiah(product.compareAtPriceSingle)}
                        </span>
                      ) : null}
                      <span className="text-[14px] font-bold text-[#18181a] leading-tight mt-0.5">
                        {rupiah(product.priceSingle)}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`group relative flex items-center justify-between gap-3.5 rounded-[12px] border p-3.5 transition-all ${
                      !commercialAvailable
                        ? "cursor-not-allowed border-[#eaeaea] bg-[#fafafa] opacity-50"
                        : tier === "commercial"
                          ? "cursor-pointer border-[#18181a] bg-[#fafafa] ring-1 ring-[#18181a] shadow-sm"
                          : "cursor-pointer border-[#e4e4e7] bg-white hover:border-[#a1a1aa] hover:bg-[#fafafa]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <input
                        type="radio"
                        name="licenseTier"
                        disabled={!commercialAvailable}
                        checked={tier === "commercial"}
                        onChange={() => setTier("commercial")}
                        className="h-4 w-4 shrink-0 accent-[#18181a] cursor-pointer"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-semibold text-[#18181a] leading-tight">
                          Commercial / Agency License
                        </span>
                        <span className="text-[11px] text-[#71717a] mt-0.5 leading-normal">
                          Multi-proyek klien
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pl-2 text-right">
                      {product.compareAtPriceCommercial !== null &&
                      product.priceCommercial !== null &&
                      product.compareAtPriceCommercial > product.priceCommercial ? (
                        <span className="text-[11px] text-[#a1a1aa] line-through leading-tight">
                          {rupiah(product.compareAtPriceCommercial)}
                        </span>
                      ) : null}
                      <span className="text-[14px] font-bold text-[#18181a] leading-tight mt-0.5">
                        {commercialAvailable ? rupiah(product.priceCommercial as number) : "—"}
                      </span>
                    </div>
                  </label>
                </div>

                {product.setupServicePrice !== null ? (
                  <label
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-[12px] border p-3 transition-all ${
                      includeSetup
                        ? "border-[#18181a] bg-[#fafafa] ring-1 ring-[#18181a]"
                        : "border-[#e4e4e7] bg-white hover:border-[#a1a1aa] hover:bg-[#fafafa]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={includeSetup}
                        onChange={(e) => setIncludeSetup(e.target.checked)}
                        className="h-4 w-4 shrink-0 rounded border-[#d4d4d8] accent-[#18181a] cursor-pointer"
                      />
                      <span className="text-[12px] text-[#52525b] leading-snug">
                        + Tambah Jasa Instalasi &amp; Deploy ke Server/Domain
                      </span>
                    </div>
                    <span className="shrink-0 text-[12px] font-bold text-[#18181a]">
                      +{rupiah(product.setupServicePrice)}
                    </span>
                  </label>
                ) : null}

                <div className="grid gap-2">
                  <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
                    Kode Kupon Promo
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className={`${fieldClass} font-mono`}
                        placeholder="LAUNCH30"
                      />
                      <button
                        type="button"
                        disabled={isCheckingCoupon || !couponCode.trim()}
                        onClick={() => void applyCoupon()}
                        className="shrink-0 rounded-[10px] border border-[#18181a] px-3 text-[12px] font-semibold text-[#18181a] disabled:opacity-40"
                      >
                        {isCheckingCoupon ? "..." : "Gunakan"}
                      </button>
                    </div>
                  </label>
                  {couponError ? (
                    <span className="text-[11px] text-[#ba1a1a]">{couponError}</span>
                  ) : null}
                  {appliedCoupon ? (
                    <span className="text-[11px] font-medium text-[#457c1d]">
                      Kupon {appliedCoupon.code} aktif — potongan{" "}
                      {rupiah(appliedCoupon.discountAmount)}.
                    </span>
                  ) : null}
                </div>

                <div className="grid gap-1 rounded-[12px] bg-[#fbfbfb] p-3 text-[12px] text-[#52525b]">
                  <div className="flex justify-between">
                    <span>Harga Lisensi</span>
                    <span>{rupiah(base)}</span>
                  </div>
                  {setupFee > 0 ? (
                    <div className="flex justify-between">
                      <span>Jasa Instalasi</span>
                      <span>{rupiah(setupFee)}</span>
                    </div>
                  ) : null}
                  {discount > 0 ? (
                    <div className="flex justify-between text-[#457c1d]">
                      <span>Potongan Kupon</span>
                      <span>−{rupiah(discount)}</span>
                    </div>
                  ) : null}
                  <div className="mt-1 flex justify-between border-t border-[#eaeaea] pt-1.5 text-[13px] font-semibold text-[#18181a]">
                    <span>Total Bayar</span>
                    <span>{rupiah(total)}</span>
                  </div>
                  {activeCompareValid ? (
                    <span className="text-[11px] text-[#71717a]">
                      Harga normal {rupiah(activeCompareAt as number)} — hemat{" "}
                      {Math.round((1 - base / (activeCompareAt as number)) * 100)}%.
                    </span>
                  ) : null}
                </div>

                <form onSubmit={submit} className="grid gap-3">
                  <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
                    Nama Lengkap
                    <input
                      required
                      autoComplete="name"
                      maxLength={120}
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className={fieldClass}
                      placeholder="Nama sesuai identitas"
                    />
                    {fieldErrors.buyerName ? (
                      <span className="text-[11px] text-[#ba1a1a]">{fieldErrors.buyerName}</span>
                    ) : null}
                  </label>

                  <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
                    Nomor WhatsApp
                    <input
                      required
                      type="tel"
                      autoComplete="tel"
                      value={buyerWhatsapp}
                      onChange={(e) => setBuyerWhatsapp(e.target.value)}
                      className={fieldClass}
                      placeholder="0812xxxxxxx"
                    />
                    {fieldErrors.buyerWhatsapp ? (
                      <span className="text-[11px] text-[#ba1a1a]">{fieldErrors.buyerWhatsapp}</span>
                    ) : null}
                  </label>

                  <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
                    Alamat Email
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className={fieldClass}
                      placeholder="nama@email.com"
                    />
                    {fieldErrors.buyerEmail ? (
                      <span className="text-[11px] text-[#ba1a1a]">{fieldErrors.buyerEmail}</span>
                    ) : null}
                  </label>

                  <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
                    Username GitHub (opsional)
                    <input
                      maxLength={100}
                      value={buyerGithub}
                      onChange={(e) => setBuyerGithub(e.target.value)}
                      className={fieldClass}
                      placeholder="Untuk akses repo privat"
                    />
                  </label>

                  <label className="grid gap-1 text-[12px] font-medium text-[#52525b]">
                    Catatan Tambahan (opsional)
                    <textarea
                      rows={2}
                      maxLength={1000}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-[10px] border border-[#eaeaea] bg-[#f9f9f9] p-3 text-[13px] text-[#18181a] outline-none transition-all focus:border-[#18181a] focus:bg-white"
                      placeholder="Permintaan khusus, kebutuhan kustomisasi..."
                    />
                  </label>

                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    name="company"
                  />

                  <label className="flex items-start gap-2 text-[12px]/[1.6] text-[#52525b]">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded border-[#d4d4d8]"
                    />
                    <span>
                      Saya menyetujui ketentuan lisensi dan larangan redistribusi /
                      penjualan ulang source code maupun template ini.
                    </span>
                  </label>

                  <TurnstileWidget
                    action="store_checkout"
                    resetKey={resetKey}
                    onTokenChange={setTurnstileToken}
                  />

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
                    {isSubmitting ? "Memproses..." : "Pesan & Dapatkan Kode Lisensi"}
                    <span className="symbol text-[18px] text-[#e2e89d]" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>

                  <p className="m-0 text-center text-[11px] text-[#71717a]">
                    Total tagihan:{" "}
                    <strong className="text-[#18181a]">{rupiah(total)}</strong>
                  </p>
                </form>

                <div className="grid gap-2 rounded-[12px] border border-[#eaeaea] bg-[#fbfbfb] p-3.5 text-[12px] text-[#52525b]">
                  <span className="text-[12px] font-semibold text-[#18181a]">
                    Spesifikasi Teknis
                  </span>
                  <div className="flex justify-between">
                    <span>Versi</span>
                    <span className="font-mono text-[#18181a]">v{product.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ukuran paket .zip</span>
                    <span className="text-[#18181a]">
                      {formatBytes(product.packageSizeBytes)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total terjual</span>
                    <span className="text-[#18181a]">{product.salesCount} pembeli</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating</span>
                    <span className="text-[#18181a]">
                      {averageScore.toFixed(1)} / 5.0 ({product.ratingCount})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {related.length ? (
            <section className="mt-12 flex flex-col gap-4">
              <h2 className="m-0 text-[18px] font-semibold text-[#18181a]">
                Produk Serupa Lainnya
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {related.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/store/${item.slug}`}
                    className="flex flex-col overflow-hidden rounded-[16px] border border-[#eaeaea] bg-white no-underline transition-all hover:translate-y-[-2px] hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f0f0f0]">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail.url}
                          alt={item.thumbnail.alt || item.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#18181a]">
                          <span className="symbol text-4xl text-[#e2e89d]" aria-hidden="true">
                            {item.productType === "ui_template" ? "palette" : "code"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-4">
                      <h3 className="m-0 text-[15px] font-semibold text-[#18181a]">
                        {item.title}
                      </h3>
                      <span className="text-[12px] text-[#71717a]">
                        {item.ratingCount
                          ? `${(item.ratingAverage / 100).toFixed(1)}★ (${item.ratingCount})`
                          : "Belum ada rating"}{" "}
                        · {item.salesCount} terjual
                      </span>
                      <span className="mt-auto text-[15px] font-semibold text-[#18181a]">
                        {rupiah(item.priceSingle)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau gambar"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181a]/90 p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="relative h-full max-h-[80vh] w-full max-w-[1100px]">
            <Image
              src={lightbox}
              alt="Pratinjau gambar produk"
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            aria-label="Tutup pratinjau"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-semibold text-white"
          >
            Tutup
          </button>
        </div>
      ) : null}

      <PublicFooter settings={settings} />
    </div>
  );
}