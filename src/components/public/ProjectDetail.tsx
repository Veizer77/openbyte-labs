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
  return (
    <div className="screen public-screen relative w-full min-h-screen flex flex-col justify-start items-stretch bg-white">
      <PublicHeader settings={settings} />
      <main id="konten" className="pt-[88px] pb-16 px-4 sm:px-6 lg:px-8 w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto flex-1">
        <nav
          aria-label="Breadcrumb"
          className="flex gap-2 text-[11px] text-[#52525b] mb-5"
        >
          <Link href="/">Beranda</Link>
          <span>/</span>
          <Link href="/proyek">Proyek Portofolio</Link>
          <span>/</span>
          <span>{project.title}</span>
        </nav>
        <section className="grid lg:grid-cols-[1.35fr_1fr] gap-5 mb-6">
          <div className="p-6 rounded-2xl shadow-[0_1px_2px_#0000000d] flex flex-col justify-between gap-8">
            <div>
              <div className="text-[11px] tracking-[.55px] text-[#52525b] mb-3">
                DETAIL PROYEK
              </div>
              <h1 className="text-[34px] leading-[43px] tracking-[-.85px] font-semibold m-0">
                {project.title}
              </h1>
              <p className="text-[15px] leading-6 text-[#52525b]">
                {project.tagline}
              </p>
              {project.clientName || project.year ? (
                <p className="mt-3 text-xs text-[#71717a]">
                  {[project.clientName, project.year].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <span
                  key={category}
                  className="text-[11px] rounded-lg bg-[#f0f0f0] px-3 py-2"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <aside className="bg-[#18181a] text-white rounded-2xl p-6 shadow-[0_8px_16px_#0000001a]">
            <div className="text-[11px] text-[#e2e89d] tracking-[.55px] mb-4">
              ARSITEKTUR & TEKNOLOGI
            </div>
            <h2 className="text-xl font-semibold m-0 mb-5">Stack Proyek</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  className="text-xs bg-[#242427] text-[#e2e89d] px-3 py-2 rounded-lg"
                  key={technology}
                >
                  {technology}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#a8a8ad] leading-5 mt-6">
              Teknologi yang digunakan pada proyek ini.
            </p>
          </aside>
        </section>
        {project.imageUrl ? (
          <div className="relative w-full h-[280px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#f0f0f0]">
            <Image
              src={project.imageUrl}
              alt={project.imageAlt || project.title}
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            role="img"
            aria-label={project.imageAlt || `Gambar ${project.title} belum tersedia`}
            className="flex h-[280px] items-center justify-center rounded-2xl bg-[#f0f0f0] text-sm text-[#52525b] sm:h-[480px]"
          >
            Gambar proyek belum tersedia
          </div>
        )}
        <section className="grid lg:grid-cols-[1.35fr_1fr] gap-5 mt-6">
          <div className="rounded-2xl p-6 shadow-[0_1px_2px_#0000000d]">
            <div className="text-[11px] tracking-[.55px] text-[#52525b]">
              IKHTISAR PROYEK
            </div>
            <h2 className="text-[28px] font-semibold tracking-[-.56px]">
              Solusi yang dibangun
            </h2>
            <p className="text-sm leading-6 text-[#52525b]">
              {project.summary}
            </p>
          </div>
          <div className="rounded-2xl p-6 bg-[#e2e89d]">
            <h2 className="text-xl font-semibold mt-0">
              Punya kebutuhan serupa?
            </h2>
            <p className="text-sm leading-6">
              Diskusikan kebutuhan sistem dan lingkup pekerjaan Anda.
            </p>
            <Link href="/konsultasi" className="primary-button">
              Jadwalkan Konsultasi
              <span className="symbol text-base" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>
        <ProjectContent blocks={project.contentBlocks} gallery={project.gallery} media={media} />
        {related.length ? <section className="mt-10"><h2 className="text-xl font-semibold">Proyek terkait</h2><ul className="grid list-none gap-3 p-0 sm:grid-cols-3">{related.map((item) => <li key={item.slug}><Link className="block rounded-xl border border-neutral-200 p-5" href={`/proyek/${item.slug}`}>{item.title}</Link></li>)}</ul></section> : null}
        {project.links.length ? (
          <section
            aria-labelledby="project-links-heading"
            className="mt-6 rounded-2xl border border-neutral-200 p-6"
          >
            <h2
              id="project-links-heading"
              className="mb-4 mt-0 text-lg font-semibold text-[#18181a]"
            >
              Tautan proyek
            </h2>
            <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
              {project.links.map((link) => (
                <li key={`${link.type}:${link.url}`}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="secondary-button"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <Link href="/proyek" className="secondary-button mt-6">
          Kembali ke semua proyek
        </Link>
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}
