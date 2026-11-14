"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { rupiah } from "@/lib/format";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import type { PublicStoreProduct } from "@/schemas/store";

type TypeFilter = "all" | "source_code" | "ui_template";
type SortBy =
  | "featured"
  | "bestseller"
  | "newest"
  | "rating"
  | "price_asc"
  | "price_desc";

const SORT_LABELS: Array<{ id: SortBy; label: string }> = [
  { id: "featured", label: "Unggulan" },
  { id: "bestseller", label: "Terlaris" },
  { id: "newest", label: "Terbaru" },
  { id: "rating", label: "Rating Tertinggi" },
  { id: "price_asc", label: "Harga: Rendah ke Tinggi" },
  { id: "price_desc", label: "Harga: Tinggi ke Rendah" },
];

export function PublicStoreCatalog({
  products,
  settings,
}: {
  products: PublicStoreProduct[];
  settings?: PublicSiteSettings;
}) {
  const [type, setType] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("featured");

  const techOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of products) {
      for (const item of product.techStack) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10)
      .map(([name]) => name);
  }, [products]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (type !== "all" && product.productType !== type) return false;
      if (tech !== "all" && !product.techStack.includes(tech)) return false;
      if (!term) return true;
      return (
        product.title.toLowerCase().includes(term) ||
        product.tagline.toLowerCase().includes(term) ||
        product.techStack.some((item) => item.toLowerCase().includes(term))
      );
    });
    const sorted = [...filtered];
    switch (sortBy) {
      case "bestseller":
        sorted.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case "newest":
        sorted.sort((a, b) => b.sortOrder - a.sortOrder);
        break;
      case "rating":
        sorted.sort(
          (a, b) => b.ratingAverage - a.ratingAverage || b.ratingCount - a.ratingCount,
        );
        break;
      case "price_asc":
        sorted.sort((a, b) => a.priceSingle - b.priceSingle);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.priceSingle - a.priceSingle);
        break;
      default:
        sorted.sort(
          (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.sortOrder - b.sortOrder,
        );
    }
    return sorted;
  }, [products, type, query, tech, sortBy]);

  const tabs: Array<{ id: TypeFilter; label: string; count: number }> = [
    { id: "all", label: "Semua Produk", count: products.length },
    {
      id: "source_code",
      label: "Source Code Proyek",
      count: products.filter((p) => p.productType === "source_code").length,
    },
    {
      id: "ui_template",
      label: "Desain UI/UX (HTML)",
      count: products.filter((p) => p.productType === "ui_template").length,
    },
  ];

  return (
    <div className="box-border relative flex min-h-screen w-full flex-col items-stretch justify-start overflow-x-hidden bg-[#ffffff] screen public-screen has-editorial-hero">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="box-border relative flex w-full flex-1 flex-col items-center justify-start bg-[#ffffff] pb-16 pt-[104px] lg:pt-[68px]"
      >
        <section className="w-full border-b border-[#eaeaea] arch-grid-bg hero-band">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:px-8 sm:py-14 2xl:max-w-[1600px]">
            <div className="flex max-w-3xl flex-col gap-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#52525b]">
                <span className="h-2 w-2 rounded-full bg-[#82b440]" />
                <span>Digital Store • Source Code &amp; UI/UX Architecture</span>
              </div>
              <h1 className="m-0 text-[32px]/[1.14] font-semibold tracking-[-0.03em] text-[#18181a] sm:text-[42px]/[1.1] lg:text-[48px]/[1.08]" data-heading="true">
                Katalog Source Code &amp; Template UI/UX Siap Produksi
              </h1>
              <p className="m-0 max-w-2xl text-[15px]/[1.65] font-normal text-[#52525b] sm:text-[16px]/[1.65]">
                Setiap paket dilengkapi dokumentasi instalasi, isi file terperinci,
                dan dilindungi sistem lisensi terenkripsi serta tautan unduhan
                privat yang aktif hanya 60 detik.
              </p>
            </div>

            <Link
              href="/store/akses"
              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-[12px] bg-[#18181a] px-4 py-2.5 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-[#242427]"
            >
              <span className="symbol text-[18px] text-[#e2e89d]" aria-hidden="true">
                key
              </span>
              Akses Unduhan &amp; Lisensi Saya
            </Link>
          </div>
        </section>

        <div className="box-border flex w-full max-w-[1440px] flex-col items-stretch justify-start gap-8 px-4 pt-6 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
          <section className="flex flex-col items-start justify-between gap-3 py-2 md:flex-row md:items-center">
            <nav aria-label="Filter kategori produk" className="box-border flex flex-wrap gap-1.5 rounded-[12px] bg-[#f0f0f0] p-1">
              {tabs.map((tab) => {
                const isSelected = tab.id === type;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setType(tab.id)}
                    className={`flex items-center gap-2 rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      isSelected
                        ? "bg-[#18181a] text-white shadow-[0px_1px_2px_#0000000d]"
                        : "text-[#52525b] hover:text-[#18181a]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#e2e2e2] text-[#52525b]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
              <select
                aria-label="Urutkan produk"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="h-[38px] rounded-[10px] border border-[#eaeaea] bg-white px-2.5 text-[12px] font-medium text-[#18181a] outline-none"
              >
                {SORT_LABELS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex w-full items-center gap-2 rounded-[10px] bg-[#f0f0f0] px-3 py-2 text-[#52525b] md:w-72">
              <span className="symbol text-[18px]" aria-hidden="true">
                search
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul atau teknologi..."
                className="w-full bg-transparent text-xs text-[#18181a] placeholder-[#71717a] outline-none"
              />
            </div>
            </div>
          </section>

          {techOptions.length ? (
            <section aria-label="Filter tech stack" className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#71717a]">
                Tech
              </span>
              {["all", ...techOptions].map((option) => {
                const isSelected = tech === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setTech(option)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      isSelected
                        ? "border-[#18181a] bg-[#18181a] text-white"
                        : "border-[#eaeaea] bg-white text-[#52525b] hover:border-[#18181a] hover:text-[#18181a]"
                    }`}
                  >
                    {option === "all" ? "Semua Tech" : option}
                  </button>
                );
              })}
            </section>
          ) : null}

          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-[#eaeaea] bg-[#fafafa] p-12 text-center">
              <span className="symbol text-3xl text-[#a1a1aa]" aria-hidden="true">
                shopping_bag
              </span>
              <p className="m-0 text-sm font-medium text-[#18181a]">
                Belum ada produk pada filter ini
              </p>
              <p className="m-0 text-xs text-[#71717a]">
                Coba ubah kategori atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-[16px] border border-[#eaeaea] bg-white shadow-[0px_1px_2px_#0000000d] transition-all hover:translate-y-[-2px] hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f0f0f0]">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail.url}
                        alt={product.thumbnail.alt || product.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#18181a]">
                        <span className="symbol text-4xl text-[#e2e89d]" aria-hidden="true">
                          {product.productType === "ui_template" ? "palette" : "code"}
                        </span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-[6px] bg-[#18181a] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                      {product.productType === "ui_template" ? "HTML UI/UX" : "Source Code"}
                    </span>
                    {product.videoUrl ? (
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-[6px] bg-[#18181a]/85 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                        <span className="symbol text-[13px] text-[#e2e89d]" aria-hidden="true">
                          play_circle
                        </span>
                        VIDEO DEMO
                      </span>
                    ) : null}
                    {product.compareAtPriceSingle !== null &&
                    product.compareAtPriceSingle > product.priceSingle ? (
                      <span className="absolute bottom-3 right-3 rounded-[6px] bg-[#e2e89d] px-2 py-1 text-[10px] font-semibold text-[#454a10]">
                        HEMAT{" "}
                        {Math.round(
                          (1 - product.priceSingle / product.compareAtPriceSingle) * 100,
                        )}
                        %
                      </span>
                    ) : null}
                    <span className="absolute right-3 top-3 rounded-[6px] bg-white/90 px-2 py-1 font-mono text-[10px] font-medium text-[#18181a]">
                      v{product.version}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex flex-col gap-1.5">
                      <h2 className="m-0 text-[17px] font-semibold leading-snug text-[#18181a]">
                        {product.title}
                      </h2>
                      {product.tagline ? (
                        <p className="m-0 line-clamp-2 text-[13px]/[1.6] text-[#52525b]">
                          {product.tagline}
                        </p>
                      ) : null}
                    </div>

                    {product.techStack.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.techStack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-[4px] bg-[#f0f0f0] px-2 py-0.5 text-[10px] font-medium text-[#52525b]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2 text-[11px] text-[#71717a]">
                      <span className="font-semibold text-[#18181a]">
                        ★ {product.ratingCount ? (product.ratingAverage / 100).toFixed(1) : "—"}
                      </span>
                      <span>({product.ratingCount})</span>
                      <span>·</span>
                      <span>{product.salesCount} terjual</span>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] uppercase tracking-[0.08em] text-[#71717a]">
                          Mulai
                        </span>
                        <span className="flex items-baseline gap-1.5">
                          {product.compareAtPriceSingle !== null &&
                          product.compareAtPriceSingle > product.priceSingle ? (
                            <span className="text-[11px] text-[#a1a1aa] line-through">
                              {rupiah(product.compareAtPriceSingle)}
                            </span>
                          ) : null}
                          <span className="text-[18px] font-semibold text-[#18181a]">
                            {rupiah(product.priceSingle)}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/store/${product.slug}`}
                          className="inline-flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-[9px] bg-[#18181a] px-3 py-2 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-[#242427]"
                        >
                          Lihat Spesifikasi &amp; Beli
                          <span className="symbol text-[15px] text-[#e2e89d]" aria-hidden="true">
                            arrow_forward
                          </span>
                        </Link>
                        {product.demoUrl ? (
                          <a
                            href={product.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[9px] border border-[#eaeaea] bg-white px-3 py-2 text-[13px] font-medium text-[#18181a] no-underline transition-colors hover:bg-[#f0f0f0]"
                          >
                            <span className="symbol text-[15px]" aria-hidden="true">
                              open_in_new
                            </span>
                            Live Demo
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          <section className="grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-[#eaeaea] bg-[#eaeaea] sm:grid-cols-3">
            {[
              {
                icon: "lock",
                title: "Pengiriman via Portal Terenkripsi",
                body: "Paket .zip tersimpan di bucket privat R2 dan hanya dapat diunduh melalui tautan Presigned bertenaga lisensi 60 detik.",
              },
              {
                icon: "verified",
                title: "Sertifikat Lisensi Resmi",
                body: "Setiap pembelian menerima kartu lisensi digital dengan SHA-256 License Fingerprint sebagai penanda forensik pembeli.",
              },
              {
                icon: "support_agent",
                title: "Opsi Konsultasi Kustomisasi",
                body: "Ingin tim OpenByte Labs yang menginstal atau memodifikasi paket? Ajukan konsultasi setelah pembelian.",
              },
            ].map((item) => (
              <div key={item.icon} className="flex flex-col gap-2 bg-white p-6">
                <span className="symbol text-[22px] text-[#82b440]" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="m-0 text-sm font-semibold text-[#18181a]">{item.title}</h3>
                <p className="m-0 text-[12px]/[1.65] text-[#52525b]">{item.body}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}
