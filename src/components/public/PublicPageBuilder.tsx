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
        <section className="grid w-full gap-8 rounded-3xl bg-[#18181a] p-7 text-white md:grid-cols-[1.1fr_.9fr] md:items-center md:p-12">
          <div>
            <h1 className="m-0 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{block.headline}</h1>
            {block.subheadline ? <p className="mb-0 mt-5 max-w-2xl text-base leading-7 text-neutral-300">{block.subheadline}</p> : null}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/konsultasi" className="rounded-lg bg-[#e2e89d] px-5 py-3 text-sm font-semibold text-[#18181a] no-underline">{block.primaryCtaLabel || "Konsultasi"}</Link>
              <Link href="/paket" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white no-underline">{block.secondaryCtaLabel || "Lihat layanan"}</Link>
            </div>
            {block.trustMetrics.length ? <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">{block.trustMetrics.map((metric, index) => <div key={`${metric.label}-${index}`} className="rounded-xl bg-white/10 p-3"><dt className="text-xs text-neutral-300">{metric.label}</dt><dd className="m-0 mt-1 text-lg font-semibold">{metric.value}</dd></div>)}</dl> : null}
          </div>
          {image ? <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/10"><Image src={image.urls.hero} alt={image.alt} fill unoptimized sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" /></div> : null}
        </section>
      );
    }
    case "servicesGrid":
      return <PublicHomeServices services={catalog.services} title={block.title || "Layanan"} description={block.description} idSuffix={idSuffix} />;
    case "portfolioShowcase":
      return <PublicHomeProjects projects={catalog.projects.filter((project) => !block.featuredOnly || project.isFeatured)} title={block.title || "Proyek pilihan"} limit={block.limit} featuredOnly={false} idSuffix={idSuffix} />;
    case "calculator":
      return (
        <section className="rounded-2xl bg-[#f2f3df] p-6 sm:p-8">
          <h2 className="m-0 text-2xl font-semibold text-[#18181a]">{block.title || "Estimasi kebutuhan"}</h2>
          <p className="mb-0 mt-3 max-w-3xl text-sm leading-6 text-[#52525b]">{block.disclaimer || catalog.settings.calculator.disclaimer}</p>
          <Link href="/kalkulator" className="mt-5 inline-flex rounded-lg bg-[#18181a] px-4 py-3 text-sm font-semibold text-white no-underline">Buka kalkulator estimasi</Link>
        </section>
      );
    case "pricing":
      return <PublicPricingSection packages={catalog.packages} addons={catalog.addons} title={block.title || "Paket layanan"} showAddons={block.showAddons} />;
    case "testimonials":
      return <PublicTestimonials testimonials={catalog.testimonials} title={block.title || "Cerita klien"} limit={block.limit} idSuffix={idSuffix} />;
    case "faq":
      return <PublicHomeFaqs faqs={catalog.faqs} title={block.title || "Pertanyaan umum"} limit={block.limit} showContact={false} idSuffix={idSuffix} />;
    case "about": {
      const image = block.imageId ? media.get(block.imageId) : undefined;
      return (
        <section className="grid w-full gap-6 md:grid-cols-[minmax(0,1fr)_minmax(240px,.8fr)] md:items-start">
          <div><h2 className="mb-4 mt-0 text-2xl font-semibold text-[#18181a]">{block.title}</h2><PublicRichText value={block.body} /></div>
          {image ? <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100"><Image src={image.urls.card} alt={image.alt} fill unoptimized sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" /></div> : null}
        </section>
      );
    }
    case "ctaBanner":
      return (
        <section className="flex flex-col justify-between gap-5 rounded-2xl bg-[#e2e89d] p-6 sm:flex-row sm:items-center sm:p-8">
          <div><h2 className="m-0 text-2xl font-semibold text-[#18181a]">{block.title}</h2>{block.text ? <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[#3f421f]">{block.text}</p> : null}</div>
          <div className="flex shrink-0 flex-wrap gap-2"><Link href="/konsultasi" className="rounded-lg bg-[#18181a] px-4 py-3 text-sm font-semibold text-white no-underline">{block.primaryCtaLabel || "Konsultasi"}</Link>{block.secondaryCtaLabel ? <Link href="/paket" className="rounded-lg border border-[#18181a]/20 bg-white/50 px-4 py-3 text-sm font-semibold text-[#18181a] no-underline">{block.secondaryCtaLabel}</Link> : null}</div>
        </section>
      );
    case "richText":
      return <PublicRichText value={block.body} />;
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
    <div className="screen public-screen flex min-h-screen flex-col bg-white">
      <PublicHeader settings={catalog.settings} />
      {preview ? <div className="mt-16 bg-amber-100 px-4 py-2 text-center text-xs font-semibold text-amber-950">Preview konten CMS — hanya terlihat oleh admin</div> : null}
      <main id="konten" className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-12 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <h1 className="sr-only">{page.title}</h1>
        {page.layout.filter((block) => block.isVisible).map((block, index) => (
          <PageBlockView key={`${block.type}-${index}`} block={block} catalog={catalog} media={page.media} idSuffix={`${index}`} />
        ))}
        {!page.layout.some((block) => block.isVisible) ? <p className="rounded-xl border border-neutral-200 p-5 text-sm text-[#52525b]">Halaman ini belum memiliki blok yang terlihat.</p> : null}
      </main>
      <PublicFooter settings={catalog.settings} />
    </div>
  );
}
