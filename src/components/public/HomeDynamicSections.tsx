import Image from "next/image";
import Link from "next/link";
import type { PublicCatalog } from "@/lib/server/public-catalog";
import type { RichText } from "@/schemas/rich-text";

type HomeProject = PublicCatalog["projects"][number];
type HomeService = PublicCatalog["services"][number];
type HomeFaq = PublicCatalog["faqs"][number];
type HomeTestimonial = PublicCatalog["testimonials"][number];
type RichTextBlock = RichText["blocks"][number];
type RichTextInline = Extract<RichTextBlock, { type: "paragraph" }>["children"][number];

const serviceIconNames: Record<string, string> = {
  BarChart3: "monitoring",
  Boxes: "widgets",
  Building2: "business",
  Cloud: "cloud",
  Code: "code",
  Cpu: "memory",
  Database: "database",
  Globe: "language",
  Image: "image",
  Layers: "layers",
  Layout: "dashboard",
  Monitor: "monitor",
  Palette: "palette",
  Rocket: "rocket_launch",
  ShieldCheck: "verified_user",
  ShoppingCart: "shopping_cart",
  Smartphone: "smartphone",
  Sparkles: "auto_awesome",
  Video: "videocam",
  Workflow: "account_tree",
  Zap: "bolt",
};

function renderInline(nodes: RichTextInline[]) {
  return nodes.map((node, index) =>
    node.type === "link" ? (
      <a
        key={`${node.url}-${index}`}
        href={node.url}
        className="font-medium text-[#3f5212] underline underline-offset-2"
      >
        {node.text}
      </a>
    ) : (
      <span key={index}>{node.text}</span>
    ),
  );
}

function renderRichText(blocks: RichText["blocks"]) {
  return blocks.map((block, index) => {
    if (block.type === "paragraph")
      return (
        <p key={index} className="m-0 text-sm leading-6 text-[#52525b]">
          {renderInline(block.children)}
        </p>
      );

    if (block.type === "heading") {
      const className = "m-0 text-sm font-semibold text-[#18181a]";
      return block.level === 2 ? (
        <h3 key={index} className={className}>
          {renderInline(block.children)}
        </h3>
      ) : (
        <h4 key={index} className={className}>
          {renderInline(block.children)}
        </h4>
      );
    }

    const List = block.ordered ? "ol" : "ul";
    return (
      <List
        key={index}
        className={`m-0 list-inside ${block.ordered ? "list-decimal" : "list-disc"} space-y-1 pl-0 text-sm leading-6 text-[#52525b]`}
      >
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInline(item)}</li>
        ))}
      </List>
    );
  });
}

export function PublicHomeServices({
  services,
  title = "Layanan Unggulan",
  description = "Solusi yang tersedia mengikuti layanan yang telah dipublikasikan. Rincian dapat disesuaikan dengan kebutuhan proyek.",
  idSuffix = "home",
}: {
  services: HomeService[];
  title?: string;
  description?: string;
  idSuffix?: string;
}) {
  const headingId = `home-services-heading-${idSuffix}`;
  return (
    <section
      aria-labelledby="home-services-heading"
      className="flex w-full flex-col gap-5"
      data-section-padding="true"
    >
      <div className="flex w-full flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="mb-1 text-[11px] font-medium tracking-[.55px] text-[#595962]">
            KATALOG REKAYASA &amp; EKSEKUSI
          </p>
          <h2
            id={headingId}
            className="m-0 text-[28px] font-semibold tracking-[-.56px] text-[#18181a]"
          >
            {title}
          </h2>
        </div>
        <p className="m-0 max-w-md text-[13px] leading-5 text-[#52525b]">
          {description}
        </p>
      </div>

      {services.length ? (
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.id}
              className="flex h-full flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_1px_3px_#0000000d]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f0f0] text-[#18181a]">
                <span
                  aria-hidden="true"
                  className="symbol font-['Material_Symbols_Outlined',system-ui,sans-serif] text-2xl leading-none"
                >
                  {serviceIconNames[service.icon] ?? "layers"}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="m-0 text-lg font-semibold tracking-[-.2px] text-[#18181a]">
                  {service.title}
                </h3>
                <p className="mb-0 mt-2 text-sm leading-5 text-[#52525b]">
                  {service.description}
                </p>
                {service.highlights.length ? (
                  <ul className="mb-0 mt-4 space-y-2 pl-4 text-xs leading-5 text-[#52525b]">
                    {service.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <Link
                href="/paket"
                className="inline-flex w-fit items-center gap-1 border-t border-neutral-100 pt-3 text-[13px] font-semibold text-[#18181a] no-underline hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#586016]"
              >
                Lihat paket
                <span aria-hidden="true" className="symbol text-sm">
                  arrow_forward
                </span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-xl border border-neutral-200 p-5 text-sm text-[#52525b]">
          Belum ada layanan yang dipublikasikan.
        </p>
      )}
    </section>
  );
}

export function PublicHomeProjects({
  projects,
  title = "Proyek Pilihan",
  limit = 3,
  featuredOnly = true,
  idSuffix = "home",
}: {
  projects: HomeProject[];
  title?: string;
  limit?: number;
  featuredOnly?: boolean;
  idSuffix?: string;
}) {
  const headingId = `home-projects-heading-${idSuffix}`;
  const featuredProjects = projects
    .filter((project) => !featuredOnly || project.isFeatured)
    .slice(0, limit);

  return (
    <section
      aria-labelledby="home-projects-heading"
      className="mt-2 flex w-full flex-col gap-5"
      data-section-padding="true"
    >
      <div className="flex w-full items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-medium tracking-[.55px] text-[#595962]">
            STUDI KASUS
          </p>
          <h2
            id={headingId}
            className="m-0 text-[28px] font-semibold tracking-[-.56px] text-[#18181a]"
          >
            {title}
          </h2>
        </div>
        <Link
          href="/proyek"
          className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#18181a] no-underline hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#586016]"
        >
          Semua proyek
          <span aria-hidden="true" className="symbol text-sm">
            arrow_forward
          </span>
        </Link>
      </div>

      {featuredProjects.length ? (
        <div className="grid w-full grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <HomeProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-xl border border-neutral-200 p-5 text-sm text-[#52525b]">
          Belum ada proyek unggulan yang dipublikasikan.
        </p>
      )}
    </section>
  );
}

function HomeProjectCard({ project }: { project: HomeProject }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_3px_#0000000d]">
      <Link
        href={`/proyek/${encodeURIComponent(project.slug)}`}
        aria-label={`Lihat proyek ${project.title}`}
        className="group flex h-full flex-col text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016]"
      >
        {project.imageUrl ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f0f0f0]">
            <Image
              src={project.imageUrl}
              alt={project.imageAlt || project.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1199px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div
            role="img"
            aria-label={`Gambar ${project.title} belum tersedia`}
            className="flex aspect-[16/9] w-full items-center justify-center bg-[#f0f0f0] text-sm text-[#52525b]"
          >
            Gambar proyek belum tersedia
          </div>
        )}
        <div className="flex flex-1 flex-col p-5">
          {project.categories.length ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {project.categories.slice(0, 2).map((category) => (
                <span
                  key={category}
                  className="rounded-md bg-[#f0f0f0] px-2 py-1 text-[11px] text-[#52525b]"
                >
                  {category}
                </span>
              ))}
            </div>
          ) : null}
          <h3 className="m-0 text-lg font-semibold text-[#18181a]">
            {project.title}
          </h3>
          <p className="mb-0 mt-2 text-sm leading-5 text-[#52525b]">
            {project.tagline || project.summary}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3 text-[11px] text-[#52525b]">
            <span>{project.clientName ?? "Studi kasus"}</span>
            {project.year ? <span>{project.year}</span> : null}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function PublicHomeFaqs({
  faqs,
  title = "Informasi sebelum memulai",
  limit = 6,
  showContact = true,
  idSuffix = "home",
}: {
  faqs: HomeFaq[];
  title?: string;
  limit?: number;
  showContact?: boolean;
  idSuffix?: string;
}) {
  const visibleFaqs = faqs.slice(0, limit);
  const headingId = `home-faq-heading-${idSuffix}`;
  return (
    <section
      aria-labelledby={headingId}
      className={`grid w-full grid-cols-1 items-stretch gap-5 ${showContact ? "lg:grid-cols-12" : ""}`}
    >
      {showContact ? <div className="flex flex-col justify-between gap-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_1px_3px_#0000000d] lg:col-span-5">
        <div>
          <p className="mb-1 text-[11px] font-medium tracking-[.55px] text-[#595962]">
            KONSULTASI
          </p>
          <h2 className="m-0 text-xl font-semibold tracking-[-.3px] text-[#18181a]">
            Bahas kebutuhan proyek Anda
          </h2>
          <p className="mb-0 mt-3 text-sm leading-6 text-[#52525b]">
            Ceritakan tujuan, calon pengguna, dan kendala yang ingin ditangani.
            Tim kami dapat membantu merumuskan ruang lingkup solusi.
          </p>
        </div>
        <Link
          href="/konsultasi"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#18181a] px-4 py-3 text-[13px] font-semibold text-white no-underline hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#586016]"
        >
          Jadwalkan konsultasi
          <span aria-hidden="true" className="symbol text-base">
            arrow_forward
          </span>
        </Link>
      </div> : null}

      <div className={`flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_1px_3px_#0000000d] ${showContact ? "lg:col-span-7" : "lg:col-span-1"}`}>
        <div>
          <p className="mb-1 text-[11px] font-medium tracking-[.55px] text-[#595962]">
            PERTANYAAN UMUM
          </p>
          <h2
            id={headingId}
            className="m-0 text-xl font-semibold tracking-[-.3px] text-[#18181a]"
          >
            {title}
          </h2>
        </div>

        {visibleFaqs.length ? (
          <div className="flex w-full flex-col gap-2">
            {visibleFaqs.map((faq) => (
              <details
                key={faq.id}
                className="group rounded-xl bg-[#f0f0f0] p-3"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[13px] font-semibold text-[#18181a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016] [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="symbol shrink-0 text-xl leading-5 text-[#52525b] transition-transform group-open:rotate-180"
                  >
                    expand_more
                  </span>
                </summary>
                <div className="mt-3 space-y-3 border-t border-neutral-200/80 pt-3">
                  {renderRichText(faq.answer.blocks)}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p className="m-0 text-sm leading-6 text-[#52525b]">
            Belum ada pertanyaan umum yang dipublikasikan.
          </p>
        )}
      </div>
    </section>
  );
}

export function PublicTestimonials({
  testimonials,
  title = "Cerita klien",
  limit = 6,
  idSuffix = "home",
}: {
  testimonials: HomeTestimonial[];
  title?: string;
  limit?: number;
  idSuffix?: string;
}) {
  const visible = testimonials.slice(0, limit);
  const headingId = `public-testimonials-title-${idSuffix}`;
  if (!visible.length) return null;
  return (
    <section aria-labelledby={headingId} className="flex w-full flex-col gap-5">
      <div>
        <p className="mb-1 text-[11px] font-medium tracking-[.55px] text-[#595962]">TESTIMONI</p>
        <h2 id={headingId} className="m-0 text-[28px] font-semibold tracking-[-.56px] text-[#18181a]">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((testimonial, index) => (
          <figure key={`${testimonial.authorName}-${index}`} className="m-0 flex h-full flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6">
            <blockquote className="m-0 flex-1 text-sm leading-6 text-[#52525b]">“{testimonial.quote}”</blockquote>
            <figcaption className="flex items-center gap-3 border-t border-neutral-100 pt-4">
              {testimonial.photoUrl ? (
                <Image src={testimonial.photoUrl} alt="" width={40} height={40} unoptimized className="h-10 w-10 rounded-full object-cover" />
              ) : null}
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-[#18181a]">{testimonial.authorName}</span>
                {testimonial.authorRole ? <span className="text-xs text-[#71717a]">{testimonial.authorRole}</span> : null}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
