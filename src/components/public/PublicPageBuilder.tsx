import Image from "next/image";
import Link from "next/link";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import {
  PublicHomeFaqs,
  PublicHomeProjects,
  PublicHomeServices,
  PublicTestimonials,
} from "@/components/public/HomeDynamicSections";
import { PublicPricingSection } from "@/components/public/PublicContentSections";
import { PublicRichText } from "@/components/public/PublicRichText";
import type { PublicCatalog } from "@/lib/server/public-catalog";
import type { PublicPageView } from "@/lib/server/public-pages";
import type { PageBlock } from "@/schemas/blocks";

function PageBlockView({
  block,
  catalog,
  media,
  idSuffix,
}: {
  block: PageBlock;
  catalog: PublicCatalog;
  media: PublicPageView["media"];
  idSuffix: string;
}) {
  switch (block.type) {
    case "hero": {
      const image = block.heroImageId ? media.get(block.heroImageId) : undefined;
      return (
        <section className="w-full pb-12 border-b border-[#eaeaea] hero-band">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Open Canvas Hero */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525b]">
                <span className="h-2 w-2 rounded-full bg-[#82b440]" />
                <span>OpenByte Labs · Solusi Digital</span>
              </div>

              <h1 className="m-0 text-[36px]/[1.12] sm:text-[46px]/[1.08] lg:text-[52px]/[1.06] font-semibold tracking-[-0.035em] text-[#18181a]">
                {block.headline}
              </h1>

              {block.subheadline ? (
                <p className="m-0 max-w-[58ch] text-[16px]/[1.65] text-[#52525b]">
                  {block.subheadline}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/konsultasi"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[10px] bg-[#18181a] px-6 py-3 text-[14px] font-semibold text-white no-underline transition-colors hover:bg-[#242427]"
                >
                  <span>{block.primaryCtaLabel || "Konsultasi"}</span>
                  <span className="symbol text-[16px] text-[#e2e89d]" aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  href="/paket"
                  className="inline-flex min-h-[48px] items-center rounded-[10px] border border-[#eaeaea] bg-white px-5 py-3 text-[14px] font-medium text-[#18181a] no-underline transition-colors hover:bg-[#f0f0f0]"
                >
                  {block.secondaryCtaLabel || "Lihat Layanan"}
                </Link>
              </div>

              {block.trustMetrics.length ? (
                <dl className="m-0 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 mt-2 border-t border-[#eaeaea]">
                  {block.trustMetrics.map((metric, index) => (
                    <div
                      key={`${metric.label}-${index}`}
                      className="flex flex-col gap-1 border-l-2 border-[#d2d88f] pl-3.5"
                    >
                      <dt className="text-[11px] font-medium tracking-[0.04em] uppercase text-[#52525b]">
                        {metric.label}
                      </dt>
                      <dd className="m-0 text-[18px] font-semibold text-[#18181a] tabular-nums">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>

            {/* Right Obsidian Blueprint Panel */}
            <div className="lg:col-span-5">
              <div className="rounded-[16px] border border-[#2e2e32] bg-[#18181a] text-white overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#2e2e32] px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="symbol text-[18px] text-[#e2e89d]" aria-hidden="true">
                      architecture
                    </span>
                    <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#a8a8ad]">
                      Ringkasan Sistem
                    </span>
                  </div>
                  <span className="rounded-full bg-[#242427] px-2.5 py-1 text-[11px] font-medium text-[#82b440]">
                    Terverifikasi
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-5">
                  {image ? (
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[10px] border border-[#2e2e32] bg-[#242427]">
                      <Image
                        src={image.urls.hero}
                        alt={image.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[18px] font-semibold text-white tracking-[-0.015em]">
                          Spesifikasi &amp; Ruang Lingkup
                        </span>
                        <p className="m-0 text-[13px] leading-5 text-[#a8a8ad]">
                          Kebutuhan fungsionalitas, teknologi, pengujian, dan garansi dibahas sebelum penawaran disusun.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-px bg-[#2e2e32] border border-[#2e2e32] rounded-[10px] overflow-hidden">
                        <div className="p-3.5 bg-[#242427] flex flex-col gap-0.5">
                          <span className="text-[11px] text-[#a8a8ad]">Arsitektur</span>
                          <span className="text-[14px] font-semibold text-[#82b440]">
                            Modular &amp; Terukur
                          </span>
                        </div>
                        <div className="p-3.5 bg-[#242427] flex flex-col gap-0.5">
                          <span className="text-[11px] text-[#a8a8ad]">Serah Terima</span>
                          <span className="text-[14px] font-semibold text-[#e2e89d]">
                            Dokumentasi Resmi
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-3 border-t border-[#2e2e32] flex items-center justify-between text-[12px] text-[#a8a8ad]">
                    <span>Cakupan dibahas per proyek</span>
                    <span className="symbol text-[16px] text-[#82b440]" aria-hidden="true">
                      verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    case "servicesGrid":
      return <PublicHomeServices services={catalog.services} title={block.title || "Layanan"} description={block.description} idSuffix={idSuffix} />;
    case "portfolioShowcase":
      return <PublicHomeProjects projects={catalog.projects.filter((project) => !block.featuredOnly || project.isFeatured)} title={block.title || "Proyek Pilihan"} limit={block.limit} featuredOnly={false} idSuffix={idSuffix} />;
    case "calculator":
      return (
        <section className="box-border w-full [box-shadow:0px_4px_5px_#0000001a,_0px_2px_2px_#0000001a] flex flex-col lg:flex-row gap-6 p-6 sm:p-8 justify-between items-center bg-[#e2e89d] rounded-[16px] overflow-hidden relative">
          <div className="w-48 h-48 absolute -left-12 top-12 bg-[#c6cc8566] rounded-full pointer-events-none" />
          <div className="flex flex-col gap-2 relative z-10 max-w-2xl">
            <div className="w-fit flex items-center gap-1.5 px-3 py-1 bg-[#1b1d001a] rounded-full text-[#1b1d00]">
              <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm symbol">
                calculate
              </span>
              <span className="text-[11px] font-bold tracking-[0.55px]">
                ESTIMASI ANGGARAN
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1b1d00] tracking-[-0.5px] m-0">
              {block.title || "Rencanakan kebutuhan sebelum penawaran."}
            </h2>
            <p className="text-sm text-[#1b1d00cc] m-0 leading-relaxed">
              {block.disclaimer || catalog.settings.calculator.disclaimer}
            </p>
          </div>
          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <Link
              href="/kalkulator"
              className="px-6 py-3.5 rounded-[12px] bg-[#18181a] text-white text-sm font-semibold no-underline hover:opacity-90 flex items-center gap-2 shadow-[0px_4px_8px_#0000001a]"
            >
              <span>Mulai Simulasi Biaya</span>
              <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base symbol">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>
      );
    case "pricing":
      return <PublicPricingSection packages={catalog.packages} addons={catalog.addons} title={block.title || "Paket Layanan"} showAddons={block.showAddons} />;
    case "testimonials":
      return <PublicTestimonials testimonials={catalog.testimonials} title={block.title || "Cerita Klien"} limit={block.limit} idSuffix={idSuffix} />;
    case "faq":
      return <PublicHomeFaqs faqs={catalog.faqs} title={block.title || "Pertanyaan Umum"} limit={block.limit} showContact={false} idSuffix={idSuffix} />;
    case "about": {
      const image = block.imageId ? media.get(block.imageId) : undefined;
      return (
        <section className="grid w-full gap-6 md:grid-cols-[minmax(0,1fr)_minmax(280px,.8fr)] md:items-start p-6 sm:p-8 bg-[#f0f0f0] rounded-[16px]">
          <div className="flex flex-col gap-3">
            <h2 className="m-0 text-2xl font-bold text-[#18181a] tracking-tight">{block.title}</h2>
            <div className="text-sm leading-relaxed text-[#52525b]">
              <PublicRichText value={block.body} />
            </div>
          </div>
          {image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-white shadow-sm">
              <Image src={image.urls.card} alt={image.alt} fill unoptimized sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
          ) : null}
        </section>
      );
    }
    case "ctaBanner":
      return (
        <section className="flex flex-col justify-between gap-5 rounded-[16px] bg-[#18181a] text-white p-6 sm:p-8 sm:flex-row sm:items-center shadow-[0px_4px_16px_#0000001a]">
          <div className="flex flex-col gap-1 max-w-2xl">
            <h2 className="m-0 text-2xl font-semibold text-white tracking-[-0.3px]">{block.title}</h2>
            {block.text ? <p className="m-0 text-sm leading-6 text-[#a8a8ad]">{block.text}</p> : null}
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/konsultasi" className="rounded-[10px] bg-[#e2e89d] px-5 py-3 text-sm font-semibold text-[#18181a] no-underline hover:opacity-90">
              {block.primaryCtaLabel || "Konsultasi"}
            </Link>
            {block.secondaryCtaLabel ? (
              <Link href="/paket" className="rounded-[10px] border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-white/20">
                {block.secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </section>
      );
    case "richText":
      return (
        <div className="p-6 bg-white border border-neutral-200/80 rounded-[16px]">
          <PublicRichText value={block.body} />
        </div>
      );
  }
}

export function PublicPageBuilder({
  page,
  catalog,
  preview = false,
}: {
  page: PublicPageView;
  catalog: PublicCatalog;
  preview?: boolean;
}) {
  return (
    <div
      className="screen public-screen has-editorial-hero flex min-h-screen flex-col bg-white"
      data-screen="site/page"
    >
      <PublicHeader settings={catalog.settings} />
      {preview ? (
        <div className="mt-[104px] lg:mt-[68px] bg-amber-100 px-4 py-2 text-center text-xs font-semibold text-amber-950">
          Preview konten CMS — hanya terlihat oleh admin
        </div>
      ) : null}
      <main id="konten" className={`mx-auto flex w-full max-w-[1440px] 2xl:max-w-[1600px] flex-1 flex-col gap-10 px-4 pb-16 ${preview ? "pt-10" : "pt-[120px] lg:pt-[96px]"} sm:px-6 lg:px-8`}>
        <h1 className="sr-only">{page.title}</h1>
        {page.layout.filter((block) => block.isVisible).map((block, index) => (
          <PageBlockView
            key={block.id || `${block.type}-${index}`}
            block={block}
            catalog={catalog}
            media={page.media}
            idSuffix={`page-${index}`}
          />
        ))}
      </main>
      <PublicFooter settings={catalog.settings} />
    </div>
  );
}
