'use client'

import { useMemo, useState } from 'react'
import type { ProjectCardDto } from '@/lib/content/types'
import { ProjectCard } from './project-card'

type FilterOption = { slug: string; name: string }

/**
 * Filter galeri proyek (F3-03). Data dikirim server sebagai DTO ringkas;
 * penyaringan terjadi di klien tanpa memuat ulang halaman. Proyek dengan dua
 * kategori muncul di kedua tab karena filter memeriksa seluruh kategori.
 */
export function ProjectGallery({
  projects,
  filters,
}: {
  projects: ProjectCardDto[]
  filters: FilterOption[]
}) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const visibleProjects = useMemo(() => {
    if (!activeFilter) return projects
    return projects.filter((project) =>
      project.categories.some((category) => category.slug === activeFilter),
    )
  }, [activeFilter, projects])

  if (!projects.length) {
    return (
      <p className="projects-empty" role="status">
        Belum ada proyek yang diterbitkan. Proyek akan tampil di sini setelah ditandai terbit dan
        tanggal publikasinya tiba.
      </p>
    )
  }

  return (
    <>
      {filters.length ? (
        <div className="project-filters" role="group" aria-label="Filter kategori proyek">
          <button
            aria-pressed={activeFilter === null}
            className={activeFilter === null ? 'filter-chip filter-chip--active' : 'filter-chip'}
            onClick={() => setActiveFilter(null)}
            type="button"
          >
            Semua Proyek
            <span>{projects.length}</span>
          </button>
          {filters.map((filter) => {
            const count = projects.filter((project) =>
              project.categories.some((category) => category.slug === filter.slug),
            ).length

            return (
              <button
                aria-pressed={activeFilter === filter.slug}
                className={
                  activeFilter === filter.slug ? 'filter-chip filter-chip--active' : 'filter-chip'
                }
                key={filter.slug}
                onClick={() => setActiveFilter(filter.slug)}
                type="button"
              >
                {filter.name}
                <span>{count}</span>
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="project-grid" aria-live="polite">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {visibleProjects.length === 0 ? (
        <p className="projects-empty" role="status">
          Tidak ada proyek pada kategori ini.
        </p>
      ) : null}
    </>
  )
}
