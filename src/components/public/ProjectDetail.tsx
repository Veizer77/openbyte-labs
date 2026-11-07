import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import type { PublicProject, PublicProjectDetail } from "@/services/public-projects";
import type { PublicMediaAsset } from "@/schemas/media";
import { ProjectContent } from "./ProjectContent";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";

export function ProjectDetail({
  project,
  settings,
  media = new Map(),
  related = [],
}: {
  project: PublicProjectDetail;
  settings: PublicSiteSettings;
  media?: ReadonlyMap<string, PublicMediaAsset>;
  related?: PublicProject[];
}) {
  const githubLink = project.links.find((l) => l.type === "github")?.url;
  const liveLink = project.links.find((l) => l.type === "demo")?.url;

  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="box-border w-full flex-1 flex flex-col pt-[64px] pb-16 justify-start items-stretch bg-[#ffffff] relative"
      >
        {/* Breadcrumb Navigation Bar */}
        <div className="box-border w-full bg-[#f0f0f0] border-b border-neutral-200/80 py-2.5">
          <div className="box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center text-xs">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[#52525b]">
              <Link href="/" className="hover:text-[#18181a] no-underline text-[#52525b]">
                Beranda
              </Link>
              <span className="text-[#a8a8ad]">/</span>
              <Link href="/proyek" className="hover:text-[#18181a] no-underline text-[#52525b]">
                Portofolio
              </Link>
              <span className="text-[#a8a8ad]">/</span>
              <span className="text-[#18181a] font-medium truncate max-w-[240px] sm:max-w-none">
                {project.title}
              </span>
            </nav>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#82b440]" />
              <span className="text-[11px] font-medium tracking-[0.55px] text-[#52525b]">
                STUDI KASUS ARSITEKTUR
              </span>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="box-border w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
          {/* Header Title & Actions Row */}
          <section className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end">
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="flex flex-wrap gap-2 items-center">
                {project.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2.5 py-1 bg-[#e2e89d] text-[#1b1d00] text-[11px] font-semibold tracking-[0.22px] rounded-full"
                  >
                    {category}
                  </span>
                ))}
                <span className="px-2.5 py-1 bg-[#f0f0f0] text-[#52525b] text-[11px] font-medium tracking-[0.22px] rounded-full">
                  {project.clientName ? `Klien: ${project.clientName}` : "Sektor Publik / Komersial"}
                </span>
                <span className="px-2.5 py-1 bg-[#f0f0f0] text-[#82b440] text-[11px] font-medium tracking-[0.22px] rounded-full">
                  Status: Terverifikasi
                </span>
              </div>
              <h1 className="text-[28px]/[36px] sm:text-[36px]/[44px] font-bold text-[#18181a] tracking-[-0.7px] m-0">
                {project.title}
              </h1>
              <p className="text-[15px]/[24px] text-[#52525b] m-0">
                {project.tagline || project.summary}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 items-center">
              {githubLink ? (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#f0f0f0] text-[#18181a] text-[13px] font-medium rounded-[12px] no-underline hover:bg-[#e8e8e8]"
                >
                  <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base symbol">
                    code
                  </span>
                  <span>Repositori GitHub</span>
                </a>
              ) : null}
              {liveLink ? (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#18181a] text-white text-[13px] font-medium rounded-[12px] no-underline hover:opacity-90 shadow-[0px_1px_2px_#0000000d]"
                >
                  <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base text-[#82b440] symbol">
                    play_circle
                  </span>
                  <span>Kunjungi Sistem Live</span>
                </a>
              ) : (
                <Link
                  href="/konsultasi"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#18181a] text-white text-[13px] font-medium rounded-[12px] no-underline hover:opacity-90 shadow-[0px_1px_2px_#0000000d]"
                >
                  <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base text-[#82b440] symbol">
                    chat
                  </span>
                  <span>Konsultasi Proyek Serupa</span>
                </Link>
              )}
            </div>
          </section>

          {/* Main Layout: Sidebar & Main Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar (4 cols) */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              {/* Meta specifications card */}
              <div className="p-5 bg-[#f0f0f0] rounded-[16px] flex flex-col gap-4 border border-neutral-200/60">
                <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                  <span className="text-[11px] font-bold tracking-[0.55px] text-[#595962] uppercase">
                    SPESIFIKASI PROYEK
                  </span>
                  <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base text-[#52525b] symbol">
                    info
                  </span>
                </div>
                <dl className="grid grid-cols-1 gap-3 m-0 text-xs">
                  <div>
                    <dt className="text-[11px] text-[#71717a]">Klien / Instansi</dt>
                    <dd className="m-0 text-sm font-semibold text-[#18181a] mt-0.5">
                      {project.clientName ?? "Kemitraan Terverifikasi"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#71717a]">Tahun Rilis</dt>
                    <dd className="m-0 text-sm font-semibold text-[#18181a] mt-0.5">
                      {project.year ?? "2026"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#71717a]">Kategori Sistem</dt>
                    <dd className="m-0 text-sm font-semibold text-[#18181a] mt-0.5">
                      {project.categories.join(", ") || "Sistem Informasi"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#71717a]">Garansi &amp; Pemeliharaan</dt>
                    <dd className="m-0 text-sm font-semibold text-[#82b440] mt-0.5">
                      30 Hari Bug-Free SLA
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Tech Stack Card */}
              <div className="p-5 bg-[#18181a] text-white rounded-[16px] flex flex-col gap-4 shadow-[0px_4px_16px_#0000001a]">
                <div className="flex items-center justify-between border-b border-[#242427] pb-3">
                  <span className="text-[11px] font-bold tracking-[0.55px] text-[#e2e89d] uppercase">
                    ARSITEKTUR &amp; TEKNOLOGI
                  </span>
                  <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base text-[#e2e89d] symbol">
                    memory
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.length ? (
                    project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-[#242427] text-[#e2e89d] text-xs font-medium rounded-[8px]"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#a8a8ad]">TypeScript, Next.js, PostgreSQL</span>
                  )}
                </div>
                <p className="text-xs text-[#a8a8ad] m-0 leading-5">
                  Arsitektur modular clean-code dengan isolasi service layer dan kontrol validasi ketat.
                </p>
              </div>

              {/* Deliverables Checklist Card */}
              <div className="p-5 bg-[#ffffff] border border-neutral-200/80 rounded-[16px] shadow-[0px_1px_2px_#0000000d] flex flex-col gap-3">
                <span className="text-[11px] font-bold tracking-[0.55px] text-[#595962] uppercase">
                  DOKUMEN SERAH TERIMA
                </span>
                <ul className="m-0 p-0 list-none flex flex-col gap-2 text-xs text-[#52525b]">
                  <li className="flex items-center gap-2">
                    <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base text-[#82b440] symbol">
                      check_circle
                    </span>
                    <span>Kode Sumber Lengkap &amp; Hak Cipta</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base text-[#82b440] symbol">
                      check_circle
                    </span>
                    <span>Panduan Instalasi &amp; Deployment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base text-[#82b440] symbol">
                      check_circle
                    </span>
                    <span>Diagram ERD &amp; Skema Database</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base text-[#82b440] symbol">
                      check_circle
                    </span>
                    <span>Berita Acara Serah Terima (BAST)</span>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Right Main Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Hero Showcase Image */}
              <div className="relative w-full h-[320px] sm:h-[460px] bg-[#18181a] rounded-[16px] overflow-hidden shadow-[0px_2px_8px_#0000000f]">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.imageAlt || project.title}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={project.imageAlt || `Gambar ${project.title}`}
                    className="w-full h-full flex items-center justify-center text-sm text-[#a8a8ad] bg-[#242427]"
                  >
                    Tangkapan layar sistem resmi
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181a] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="bg-[#18181acc] backdrop-blur px-3 py-1 rounded-[8px]">
                    {project.title} • Tangkapan Layar Resmi
                  </span>
                  <span className="bg-[#242427] text-[#82b440] px-3 py-1 rounded-[8px] font-medium">
                    Verified Release
                  </span>
                </div>
              </div>

              {/* Case Study Rich Content */}
              {project.contentBlocks && project.contentBlocks.length > 0 ? (
                <div className="p-6 sm:p-8 bg-white border border-neutral-200/80 rounded-[16px] shadow-[0px_1px_2px_#0000000d]">
                  <ProjectContent
                    blocks={project.contentBlocks}
                    gallery={project.gallery}
                    media={media}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Problem & Solution Bento Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-6 bg-[#f0f0f0] rounded-[16px] flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-[#71717a]">
                        <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-xl symbol">
                          help_outline
                        </span>
                        <span className="text-[11px] font-bold tracking-[0.55px] uppercase">
                          MASALAH &amp; TANTANGAN
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#18181a] m-0">
                        Fragmentasi Data &amp; Alur Manual
                      </h3>
                      <p className="text-sm text-[#52525b] m-0 leading-6">
                        Proses operasional sebelum sistem dibangun mengandalkan pencatatan terpisah tanpa integrasi terpusat, menyebabkan latensi validasi dan ketidakkonsistenan data.
                      </p>
                    </div>

                    <div className="p-6 bg-[#fbfcf3] border border-[#aeb768] rounded-[16px] flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-[#586016]">
                        <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-xl symbol">
                          architecture
                        </span>
                        <span className="text-[11px] font-bold tracking-[0.55px] uppercase">
                          SOLUSI ARSITEKTUR
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#18181a] m-0">
                        Sistem Modular &amp; Otomasi Validasi
                      </h3>
                      <p className="text-sm text-[#52525b] m-0 leading-6">
                        Perancangan ulang alur kerja dengan validasi skema di tingkat server, database relasional terindeks, dan antarmuka responsif ramah pengguna.
                      </p>
                    </div>
                  </div>

                  {/* Impact & Results */}
                  <div className="p-6 bg-[#18181a] text-white rounded-[16px] flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[#e2e89d]">
                      <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-lg symbol">
                        trending_up
                      </span>
                      <span className="text-[11px] font-bold tracking-[0.55px] uppercase">
                        RINGKASAN PROYEK
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-3 bg-[#242427] rounded-[12px] flex flex-col">
                        <span className="text-xs text-[#a8a8ad]">Tahun Rilis</span>
                        <span className="text-xl font-bold text-[#82b440] mt-1">
                          {project.year ?? "—"}
                        </span>
                      </div>
                      <div className="p-3 bg-[#242427] rounded-[12px] flex flex-col">
                        <span className="text-xs text-[#a8a8ad]">Kategori</span>
                        <span className="text-xl font-bold text-white mt-1">
                          {project.categories.length > 0 ? project.categories.join(", ") : "—"}
                        </span>
                      </div>
                      <div className="p-3 bg-[#242427] rounded-[12px] flex flex-col">
                        <span className="text-xs text-[#a8a8ad]">Teknologi</span>
                        <span className="text-xl font-bold text-[#e2e89d] mt-1">
                          {project.technologies.length > 0 ? project.technologies.join(", ") : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Consultation Callout */}
              <div className="p-6 sm:p-8 rounded-[16px] bg-[#e2e89d] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-[0.55px] text-[#1b1d00] uppercase">
                    KONSULTASI KEBUTUHAN
                  </span>
                  <h3 className="text-xl font-bold text-[#1b1d00] m-0">
                    Tertarik dengan Hasil Implementasi Ini?
                  </h3>
                  <p className="text-sm text-[#1b1d00cc] m-0">
                    Bahas spesifikasi sistem yang Anda butuhkan langsung dengan Lead Engineer.
                  </p>
                </div>
                <Link
                  href="/konsultasi"
                  className="px-5 py-3 rounded-[10px] bg-[#18181a] text-white text-sm font-semibold no-underline hover:opacity-90 shrink-0"
                >
                  Jadwalkan Konsultasi
                </Link>
              </div>
            </div>
          </div>

          {/* Related Projects Section */}
          {related.length ? (
            <section className="flex flex-col gap-5 pt-8 border-t border-neutral-200/80">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#18181a] tracking-[-0.3px] m-0">
                  Studi Kasus Lainnya
                </h2>
                <Link
                  href="/proyek"
                  className="text-xs font-semibold text-[#18181a] hover:underline flex items-center gap-1"
                >
                  <span>Lihat Seluruh Portofolio</span>
                  <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm symbol">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.slice(0, 3).map((item) => (
                  <article
                    key={item.slug}
                    className="p-4 bg-white border border-neutral-200/80 rounded-[16px] shadow-[0px_1px_2px_#0000000d] flex flex-col justify-between gap-3"
                  >
                    <div className="relative w-full h-[160px] bg-[#18181a] rounded-[10px] overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#a8a8ad] bg-[#242427]">
                          Gambar belum tersedia
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-[#52525b] font-medium">
                        {item.categories[0] ?? "Portofolio"}
                      </span>
                      <h3 className="text-base font-semibold text-[#18181a] m-0 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#52525b] m-0 line-clamp-2">
                        {item.tagline || item.summary}
                      </p>
                    </div>
                    <Link
                      href={`/proyek/${encodeURIComponent(item.slug)}`}
                      className="pt-2 border-t border-neutral-100 text-xs font-semibold text-[#18181a] hover:underline flex items-center justify-between"
                    >
                      <span>Lihat Studi Kasus</span>
                      <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm symbol">
                        arrow_forward
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}
