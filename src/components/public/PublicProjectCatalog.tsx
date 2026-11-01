"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import type { PublicProject } from "@/services/public-projects";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import { PublicFooter } from "./PublicFooter";

export function PublicProjectCatalog({
  projects,
  settings,
  categories = [],
}: {
  projects: PublicProject[];
  settings: PublicSiteSettings;
  categories?: Array<{ name: string; slug: string }>;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const visibleProjects = category
    ? projects.filter((project) => project.categories.includes(category))
    : projects;
  return (
    <div className="screen public-screen min-h-screen bg-white">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-28 sm:px-6 lg:px-8"
      >
        <section className="mb-8 max-w-3xl">
          <div className="text-[11px] font-medium tracking-[.55px] text-[#52525b]">
            PORTOFOLIO PROYEK
          </div>
          <h1 className="mb-3 mt-2 text-[28px] font-semibold tracking-[-.7px] text-[#18181a] sm:text-[34px]">
            Proyek yang telah diterbitkan
          </h1>
          <p className="m-0 text-sm leading-6 text-[#52525b]">
            Jelajahi proyek OpenByte Labs yang sudah disetujui untuk tayang.
            Detail proyek hanya tersedia setelah dipublikasikan melalui CMS.
          </p>
        </section>

        <nav aria-label="Filter kategori proyek" className="mb-6 flex flex-wrap gap-2">
          <button type="button" className="secondary-button min-h-11" aria-pressed={category === null} onClick={() => setCategory(null)}>Semua Proyek ({projects.length})</button>
          {categories.map((item) => <button key={item.slug} type="button" className="secondary-button min-h-11" aria-pressed={category === item.name} onClick={() => setCategory(item.name)}>{item.name} ({projects.filter((project) => project.categories.includes(item.name)).length})</button>)}
        </nav>
        <p role="status" aria-live="polite" className="sr-only">{visibleProjects.length} proyek ditampilkan</p>
        {visibleProjects.length ? (
          <section
            aria-label="Daftar proyek"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {visibleProjects.map((project) => (
              <article
                key={project.slug}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white"
              >
                <Link
                  href={`/proyek/${encodeURIComponent(project.slug)}`}
                  aria-label={`Lihat proyek ${project.title}`}
                  className="group flex h-full flex-col text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016]"
                >
                  {project.imageUrl ? (
                    <div className="relative aspect-[16/10] w-full bg-[#f0f0f0]">
                      <Image
                        src={project.imageUrl}
                        alt={project.imageAlt || project.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div
                      role="img"
                      aria-label={project.imageAlt || `Gambar ${project.title} belum tersedia`}
                      className="flex aspect-[16/10] items-center justify-center bg-[#f0f0f0] text-sm text-[#52525b]"
                    >
                      Gambar proyek belum tersedia
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {project.categories.slice(0, 3).map((category) => (
                        <span
                          key={category}
                          className="rounded-md bg-[#f0f0f0] px-2 py-1 text-[11px] text-[#52525b]"
                        >
                          {category}
                        </span>
                      ))}
                      {project.isFeatured ? (
                        <span className="rounded-md bg-[#e8efd8] px-2 py-1 text-[11px] font-medium text-[#3f5212]">
                          Unggulan
                        </span>
                      ) : null}
                    </div>
                    <h2 className="m-0 text-xl font-semibold text-[#18181a]">
                      {project.title}
                    </h2>
                    <p className="mb-0 mt-2 text-sm leading-5 text-[#52525b]">
                      {project.tagline || project.summary}
                    </p>
                    {project.technologies.length ? (
                      <p className="mb-0 mt-auto pt-4 text-xs leading-5 text-[#71717a]">
                        {project.technologies.slice(0, 5).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </article>
            ))}
          </section>
        ) : (
          <p
            role="status"
            className="rounded-xl border border-neutral-200 bg-[#f9f9f9] p-5 text-sm text-[#52525b]"
          >
            {category ? "Belum ada proyek terbit pada kategori ini." : "Belum ada proyek yang dipublikasikan."}
          </p>
        )}
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}
