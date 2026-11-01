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
  Smartphone: "phone_iphone",
  Sparkles: "auto_awesome",
  Video: "videocam",
  Workflow: "account_tree",
  Zap: "speed",
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
  description = "Cakupan, teknologi, pengujian, dan dokumentasi dibahas serta disepakati untuk setiap proyek.",
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
      aria-labelledby={headingId}
      className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start"
    >
      <div className="box-border w-full h-fit shrink-0 flex flex-col md:flex-row gap-[12px] justify-between items-start md:items-end">
        <div className="flex flex-col gap-[4px] justify-start items-start">
          <div className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]">
            KATALOG REKAYASA &amp; EKSEKUSI
          </div>
          <h2
            id={headingId}
            className="text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.56px] text-left [white-space:nowrap] m-0"
          >
            {title}
          </h2>
        </div>
        <div className="text-[13px]/[18px] box-border max-w-[448px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left">
          {description}
        </div>
      </div>

      {services.length ? (
        <div className="box-border w-full grid grid-cols-1 lg:grid-cols-12 gap-[20px] items-stretch">
          {services.map((service, index) => {
            // Asymmetric Bento: Row 1 = 7 cols + 5 cols; Row 2 = 5 cols + 7 cols
            const isWide = index % 4 === 0 || index % 4 === 3;
            const colSpan = isWide ? "lg:col-span-7" : "lg:col-span-5";
            const iconName = serviceIconNames[service.icon] ?? "dataset";

            return (
              <article
                key={service.id}
                className={`box-border ${colSpan} [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col justify-between p-[24px] bg-[#ffffff] rounded-[16px] min-h-[230px]`}
              >
                <div className="box-border w-full flex flex-col gap-0 pb-[20px] justify-start items-start">
                  <div className="box-border w-[40px] h-[40px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[12px] text-[#18181a]">
                    <span
                      aria-hidden="true"
                      className="text-[24px]/[24px] box-border font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal symbol"
                    >
                      {iconName}
                    </span>
                  </div>
                  <div className="box-border w-full h-[20px] shrink-0" />
                  <h3 className="text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left m-0">
                    {service.title}
                  </h3>
                  <div className="box-border w-full h-[4px] shrink-0" />
                  <p className="text-[14px]/[20px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left m-0">
                    {service.description}
                  </p>
                </div>
                <div className="box-border w-full flex flex-row gap-0 pt-[12px] justify-between items-center border-t border-neutral-100">
                  <div className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]">
                    {service.highlights[0] ?? "Sektor & ruang lingkup dibahas per proyek"}
                  </div>
                  <Link
                    href="/paket"
                    className="box-border w-fit shrink-0 h-[20px] flex flex-row gap-[4px] justify-start items-center text-inherit no-underline hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016]"
                  >
                    <span className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      Pelajari Solusi
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[14px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal symbol"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
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
  title = "Proyek contoh menunggu tinjauan",
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
      aria-labelledby={headingId}
      className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start"
    >
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-end">
        <div className="box-border w-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
          <div className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]">
            PROYEK PILIHAN • DRAF
          </div>
          <h2
            id={headingId}
            className="text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.56px] text-left [white-space:nowrap] m-0"
          >
            {title}
          </h2>
        </div>
        <Link
          href="/proyek"
          className="box-border w-fit shrink-0 h-[20px] flex flex-row gap-[4px] justify-start items-center text-inherit no-underline hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016]"
        >
          <span className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
            Buka Semua Studi Kasus
          </span>
          <span
            aria-hidden="true"
            className="text-[14px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal symbol"
          >
            arrow_forward
          </span>
        </Link>
      </div>

      {featuredProjects.length ? (
        <div className="box-border w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] items-stretch">
          {featuredProjects.map((project) => (
            <article
              key={project.slug}
              className="box-border [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col justify-between items-start bg-[#ffffff] rounded-[16px] overflow-hidden"
            >
              <div className="box-border w-full h-[192px] shrink-0 bg-[#18181a] relative overflow-hidden">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.imageAlt || project.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={project.imageAlt || `Gambar ${project.title}`}
                    className="w-full h-full flex items-center justify-center text-xs text-[#a8a8ad] bg-[#242427]"
                  >
                    Gambar proyek belum tersedia
                  </div>
                )}
              </div>
              <div className="box-border w-full flex-1 flex flex-col p-[24px] justify-between items-start gap-4">
                <div className="box-border w-full flex flex-col gap-[4px] justify-start items-start">
                  <div className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]">
                    {project.categories[0] ?? "Kategori Belum Diverifikasi"}
                  </div>
                  <h3 className="text-[18px]/[24px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left m-0">
                    {project.title}
                  </h3>
                  <p className="text-[14px]/[20px] box-border w-full text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left m-0 line-clamp-2">
                    {project.tagline || project.summary}
                  </p>
                </div>
                <div className="box-border w-full flex flex-row gap-0 pt-[8px] justify-between items-center border-t border-neutral-100">
                  <div className="text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]">
                    {project.isFeatured ? "Unggulan • Terverifikasi" : "Draf • belum disetujui"}
                  </div>
                  <Link
                    href={`/proyek/${encodeURIComponent(project.slug)}`}
                    className="box-border w-fit shrink-0 h-[18px] flex flex-row gap-[4px] justify-start items-center text-inherit no-underline hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016]"
                  >
                    <span className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
                      Studi Kasus
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[12px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal symbol"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-xl border border-neutral-200 p-5 text-sm text-[#52525b]">
          Belum ada proyek yang dipublikasikan.
        </p>
      )}
    </section>
  );
}

export function PublicHomeFaqs({
  faqs,
  title = "Informasi Proyek",
  limit = 4,
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
    <div
      aria-labelledby={headingId}
      className="box-border w-full [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col gap-[12px] p-[24px] justify-start items-start bg-[#ffffff] rounded-[16px]"
    >
      <div className="box-border w-full flex flex-col gap-[4px] justify-start items-start">
        <div className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]">
          PERTANYAAN UMUM
        </div>
        <h2
          id={headingId}
          className="text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left [white-space:nowrap] m-0"
        >
          {title}
        </h2>
      </div>

      <div className="box-border w-full flex flex-col gap-[8px] justify-start items-start">
        {visibleFaqs.length ? (
          visibleFaqs.map((faq) => (
            <details
              key={faq.id}
              className="group box-border w-full flex flex-col gap-0 p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
            >
              <summary className="box-border w-full flex flex-row gap-0 justify-between items-center cursor-pointer list-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016] [&::-webkit-details-marker]:hidden">
                <span className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left">
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  className="text-[24px]/[24px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal symbol shrink-0 transition-transform group-open:rotate-180"
                >
                  expand_more
                </span>
              </summary>
              <div className="mt-3 space-y-2 border-t border-neutral-200/80 pt-3 text-[13px]/[19px] text-[#52525b]">
                {renderRichText(faq.answer.blocks)}
              </div>
            </details>
          ))
        ) : (
          <p className="m-0 text-sm leading-6 text-[#52525b]">
            Belum ada pertanyaan umum yang dipublikasikan.
          </p>
        )}
      </div>

      {showContact ? (
        <div className="box-border w-full flex flex-col sm:flex-row gap-3 p-[12px] justify-between items-start sm:items-center bg-[#f0f0f0] rounded-[12px]">
          <div className="flex flex-col gap-[4px] justify-start items-start">
            <div className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
              Ada pertanyaan teknis spesifik?
            </div>
            <div className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left">
              Konsultasikan kebutuhan arsitektur Anda langsung bersama Engineer.
            </div>
          </div>
          <Link
            href="/konsultasi"
            className="box-border w-fit shrink-0 flex flex-col gap-0 p-[8px_14px] justify-center items-center bg-[#18181a] rounded-[8px] text-inherit no-underline hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016]"
          >
            <span className="text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]">
              Jadwalkan Diskusi
            </span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function PublicTestimonials({
  testimonials,
  title = "Testimoni Klien",
  limit = 2,
  idSuffix = "home",
}: {
  testimonials: HomeTestimonial[];
  title?: string;
  limit?: number;
  idSuffix?: string;
}) {
  const visible = testimonials.slice(0, limit);
  const headingId = `public-testimonials-title-${idSuffix}`;

  return (
    <div
      aria-labelledby={headingId}
      className="box-border w-full [box-shadow:0px_1px_2px_#0000000d] border border-neutral-200/80 flex flex-col justify-between p-[24px] bg-[#ffffff] rounded-[16px] min-h-[440px]"
    >
      <div className="box-border w-full flex flex-col gap-0 justify-start items-start">
        <div className="text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]">
          TESTIMONI • DIVERIFIKASI
        </div>
        <div className="box-border w-full h-[4px] shrink-0" />
        <h2
          id={headingId}
          className="text-[20px]/[26px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.3px] text-left [white-space:nowrap] m-0"
        >
          {title}
        </h2>
        <div className="box-border w-full h-[12px] shrink-0" />
        <div className="box-border w-full flex flex-col gap-[12px] justify-start items-start">
          {visible.length ? (
            visible.map((testimonial, index) => (
              <figure
                key={`${testimonial.authorName}-${index}`}
                className="box-border w-full m-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]"
              >
                <div className="box-border w-full flex flex-row gap-[4px] justify-start items-center">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="text-[14px]/[20px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal symbol"
                    >
                      more_horiz
                    </span>
                  ))}
                </div>
                <blockquote className="text-[14px]/[20px] box-border w-full text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal italic text-left m-0">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="box-border w-full flex flex-row gap-[12px] justify-start items-center pt-1">
                  <div className="box-border w-[32px] shrink-0 h-[32px] flex flex-col justify-center items-center bg-[#e2e2e2] rounded-[9999px] overflow-hidden">
                    {testimonial.photoUrl ? (
                      <Image
                        src={testimonial.photoUrl}
                        alt={testimonial.authorName}
                        width={32}
                        height={32}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[12px]/[16px] text-[#18181a] font-bold">
                        {testimonial.authorName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-[2px] justify-start items-start">
                    <span className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]">
                      {testimonial.authorName}
                    </span>
                    <span className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]">
                      {testimonial.authorRole ?? "Klien OpenByte Labs"}
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))
          ) : (
            <div className="box-border w-full flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#f0f0f0] rounded-[12px]">
              <div className="box-border w-full flex flex-row gap-[4px] justify-start items-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="text-[14px]/[20px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal symbol"
                  >
                    more_horiz
                  </span>
                ))}
              </div>
              <p className="text-[14px]/[20px] box-border w-full text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal italic text-left m-0">
                Testimoni menunggu persetujuan rilis. Hasil kerja dan dokumen serah terima diverifikasi untuk setiap sistem.
              </p>
              <div className="box-border w-full flex flex-row gap-[12px] justify-start items-center">
                <div className="box-border w-[32px] shrink-0 h-[32px] flex flex-col justify-center items-center bg-[#e2e2e2] rounded-[9999px]">
                  <span className="text-[12px]/[16px] text-[#18181a] font-bold">—</span>
                </div>
                <div className="flex flex-col gap-[2px] justify-start items-start">
                  <span className="text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left">
                    Klien Terverifikasi
                  </span>
                  <span className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left">
                    Instansi &amp; Pengelola Sistem
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="box-border w-full flex flex-row gap-[8px] pt-[16px] justify-start items-center border-t border-neutral-100">
        <span
          aria-hidden="true"
          className="text-[16px]/[24px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal symbol"
        >
          verified
        </span>
        <span className="text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]">
          Dokumen serah terima dibahas dan disepakati per proyek
        </span>
      </div>
    </div>
  );
}
