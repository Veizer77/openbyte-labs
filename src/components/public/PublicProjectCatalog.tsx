"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import type { PublicProject } from "@/services/public-projects";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";

export function PublicProjectCatalog({
  projects,
  settings,
  categories = [],
}: {
  projects: PublicProject[];
  settings: PublicSiteSettings;
  categories?: Array<{ name: string; slug: string }>;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const visibleProjects = selectedCategory
    ? projects.filter((project) => project.categories.includes(selectedCategory))
    : projects;

  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-stretch bg-[#ffffff] overflow-x-hidden relative screen public-screen has-editorial-hero">
      <PublicHeader settings={settings} />
      <main
        id="konten"
        className="box-border w-full flex-1 flex flex-col pt-[104px] lg:pt-[68px] pb-16 justify-start items-center bg-[#ffffff] relative"
      >
        {/* Architectural Header Band */}
        <section className="w-full border-b border-[#eaeaea] arch-grid-bg hero-band">
          <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
            <div className="max-w-3xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#52525b]">
                <span className="h-2 w-2 rounded-full bg-[#82b440]" />
                <span>Arsip &amp; Portofolio Sistem</span>
              </div>
              <h1
                className="text-[32px]/[1.14] sm:text-[42px]/[1.1] lg:text-[48px]/[1.08] text-[#18181a] font-semibold tracking-[-0.03em] m-0"
                data-heading="true"
              >
                Portofolio Sistem &amp; Rekayasa Perangkat Lunak
              </h1>
              {visibleProjects.length ? (
                <h2 className="sr-only">Proyek yang telah diterbitkan</h2>
              ) : null}
              <p className="text-[15px]/[1.65] sm:text-[16px]/[1.65] text-[#52525b] font-normal m-0 max-w-2xl">
                Dokumentasi sistem informasi, aplikasi web, dan solusi mobile yang telah dirancang serta diterbitkan sesuai kebutuhan operasional mitra.
              </p>
            </div>

            <dl className="m-0 grid grid-cols-2 gap-px bg-[#eaeaea] border border-[#eaeaea] rounded-[12px] overflow-hidden shrink-0 w-full sm:w-auto">
              <div className="bg-white px-5 py-3.5 flex flex-col gap-0.5">
                <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#52525b]">
                  Arsip Terbit
                </dt>
                <dd className="m-0 text-[20px] font-semibold text-[#18181a] tabular-nums">
                  {projects.length} Proyek
                </dd>
              </div>
              <div className="bg-white px-5 py-3.5 flex flex-col gap-0.5">
                <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#52525b]">
                  Dokumentasi
                </dt>
                <dd className="m-0 text-[15px] font-semibold text-[#454a10] pt-1">
                  Studi Kasus Nyata
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="box-border w-full max-w-[1440px] 2xl:max-w-[1600px] flex flex-col gap-8 px-4 sm:px-6 lg:px-8 pt-6 justify-start items-stretch">

          {/* Filter Bar */}
          <section className="box-border w-full flex flex-col md:flex-row gap-3 justify-between items-start md:items-center py-2">
            <nav aria-label="Filter kategori proyek" className="box-border flex flex-wrap gap-1.5 p-1 bg-[#f0f0f0] rounded-[12px]">
              <button
                type="button"
                aria-pressed={selectedCategory === null}
                onClick={() => setSelectedCategory(null)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-[#18181a] text-white shadow-[0px_1px_2px_#0000000d]"
                    : "text-[#52525b] hover:text-[#18181a]"
                }`}
              >
                <span>Semua Proyek</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === null ? "bg-white/20 text-white" : "bg-[#e2e2e2] text-[#52525b]"
                }`}>
                  {projects.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = projects.filter((p) => p.categories.includes(cat.name)).length;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                      isSelected
                        ? "bg-[#18181a] text-white shadow-[0px_1px_2px_#0000000d]"
                        : "text-[#52525b] hover:text-[#18181a]"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#e2e2e2] text-[#52525b]"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 text-xs text-[#52525b]">
              <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base symbol">
                tune
              </span>
              <span>Menampilkan {visibleProjects.length} arsitektur sistem</span>
            </div>
          </section>

          {/* Projects Bento Grid */}
          {visibleProjects.length ? (
            <section
              aria-label="Daftar proyek portofolio"
              className="box-border w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
            >
              {visibleProjects.map((project) => (
                <article
                  key={project.slug}
                  className="box-border w-full flex flex-col justify-between p-5 bg-[#ffffff] border border-neutral-200/80 rounded-[16px] shadow-[0px_1px_2px_#0000000d] hover:shadow-[0px_4px_12px_#0000000f] transition-shadow"
                >
                  <div className="flex flex-col gap-4">
                    {/* Visual Banner */}
                    <div className="relative w-full h-[260px] bg-[#18181a] rounded-[12px] overflow-hidden group">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.imageAlt || project.title}
                          fill
                          unoptimized
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          role="img"
                          aria-label={project.imageAlt || `Gambar ${project.title}`}
                          className="w-full h-full flex items-center justify-center text-xs text-[#a8a8ad] bg-[#242427]"
                        >
                          Gambar belum tersedia
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#18181a] via-[#18181a40] to-transparent z-10" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
                        {project.categories.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="backdrop-blur-md bg-[#18181acc] text-white text-[11px] font-medium px-2.5 py-1 rounded-full tracking-[0.22px]"
                          >
                            {category}
                          </span>
                        ))}
                        {project.isFeatured ? (
                          <span className="bg-[#e2e89d] text-[#1b1d00] text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-[0.22px]">
                            Unggulan
                          </span>
                        ) : null}
                      </div>

                      {/* Bottom Header Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 z-20">
                        <div className="flex flex-col">
                          <span className="text-[10px] tracking-[1px] text-[#a8a8ad] uppercase font-medium">
                            {project.clientName ?? "ARSITEKTUR TERVERIFIKASI"}
                          </span>
                          <span className="text-[17px] font-semibold text-white tracking-[-0.18px] line-clamp-1">
                            {project.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#242427] rounded-[8px] text-[11px] font-medium text-[#82b440] shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#82b440]" />
                          <span>{project.isFeatured ? "Terverifikasi" : "Terdokumentasi"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                      <Link
                        href={`/proyek/${encodeURIComponent(project.slug)}`}
                        className="text-[20px]/[26px] font-semibold text-[#18181a] tracking-[-0.3px] no-underline hover:underline"
                      >
                        {project.title}
                      </Link>
                      <p className="text-[14px]/[21px] text-[#52525b] m-0 line-clamp-2">
                        {project.tagline || project.summary}
                      </p>
                    </div>

                    {/* Tech Stack Pills */}
                    {project.technologies.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="bg-[#f0f0f0] text-[#18181a] px-2.5 py-1 rounded-[6px] text-[11px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {/* Problem / Solution / Impact Micro-Grid */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-[#f8f8f8] rounded-[12px] text-[11px] border border-neutral-100">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-[0.5px] text-[#71717a]">
                          PROBLEM
                        </span>
                        <span className="text-[#3f3f46] line-clamp-2">
                          Proses manual &amp; integritas data tersebar
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-[0.5px] text-[#71717a]">
                          SOLUTION
                        </span>
                        <span className="text-[#3f3f46] line-clamp-2">
                          Sistem modular terpusat &amp; alur otomatis
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-[0.5px] text-[#71717a]">
                          IMPACT
                        </span>
                        <span className="text-[#3f3f46] line-clamp-2">
                          Validasi real-time &amp; efisiensi tinggi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
                    <span className="text-[11px] text-[#71717a]">
                      {project.year ? `Rilis: ${project.year}` : "Spesifikasi Teruji"}
                    </span>
                    <Link
                      href={`/proyek/${encodeURIComponent(project.slug)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#18181a] text-white text-[12px] font-medium rounded-[8px] no-underline hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016]"
                    >
                      <span>Detail Proyek</span>
                      <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm symbol">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div role="alert" className="p-8 text-center bg-[#f0f0f0] rounded-[16px] text-sm text-[#52525b]">
              Belum ada proyek yang cocok dengan filter kategori yang dipilih.
            </div>
          )}

          {/* Bottom Consultation Banner */}
          <section className="box-border w-full p-6 sm:p-8 rounded-[16px] bg-[#18181a] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0px_4px_16px_#0000001a]">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="text-[11px] font-bold tracking-[0.55px] text-[#e2e89d]">
                KONSULTASI ARSITEKTUR
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold m-0 text-white tracking-[-0.5px]">
                Memiliki Kebutuhan Sistem Serupa?
              </h2>
              <p className="text-sm text-[#a8a8ad] m-0 leading-6">
                Diskusikan langsung kebutuhan arsitektur data, aplikasi mobile, atau integrasi spesifik instansi Anda bersama Lead Engineer kami.
              </p>
            </div>
            <Link
              href="/konsultasi"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-[#e2e89d] text-[#18181a] text-sm font-semibold no-underline hover:opacity-90 shrink-0"
            >
              <span>Jadwalkan Konsultasi</span>
              <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-base symbol">
                arrow_forward
              </span>
            </Link>
          </section>
        </div>
      </main>
      <PublicFooter settings={settings} />
    </div>
  );
}
