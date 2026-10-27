'use client'

import { useMemo, useState } from 'react'
import { publicProjects } from '@/lib/public-content'
import { ProjectCard } from './project-card'

const filters = ['Semua Proyek', ...new Set(publicProjects.map((project) => project.category))]

export function ProjectGallery() {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const projects = useMemo(
    () =>
      activeFilter === filters[0]
        ? publicProjects
        : publicProjects.filter((project) => project.category === activeFilter),
    [activeFilter],
  )

  return (
    <>
      <div className="project-filters" role="group" aria-label="Filter kategori proyek">
        {filters.map((filter) => (
          <button
            aria-pressed={activeFilter === filter}
            className={activeFilter === filter ? 'filter-chip filter-chip--active' : 'filter-chip'}
            key={filter}
            onClick={() => setActiveFilter(filter)}
            type="button"
          >
            {filter}
            {filter === filters[0] && <span>{publicProjects.length}</span>}
          </button>
        ))}
      </div>
      <div className="project-grid" aria-live="polite">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  )
}
