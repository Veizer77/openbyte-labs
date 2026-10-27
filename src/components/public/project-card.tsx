import Link from 'next/link'
import type { ProjectCardDto } from '@/lib/content/types'
import { ContentImage, MediaPlaceholder } from './media-image'

/** Kartu proyek dari DTO CMS (F3-03). Tanpa gambar -> placeholder netral. */
export function ProjectCard({ project }: { project: ProjectCardDto }) {
  const primaryCategory = project.categories[0]

  return (
    <article className="project-card">
      <Link href={project.href} aria-label={`Baca studi kasus ${project.title}`}>
        <div className="project-card__image">
          {project.featuredImage ? (
            <ContentImage
              image={project.featuredImage}
              variant="card"
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />
          ) : (
            <MediaPlaceholder label={`Gambar proyek ${project.title} belum tersedia`} />
          )}
          <span className="project-card__arrow material-symbols-outlined" aria-hidden="true">
            arrow_outward
          </span>
        </div>
        <div className="project-card__body">
          {primaryCategory ? <span className="eyebrow-chip">{primaryCategory.name}</span> : null}
          <h2>{project.title}</h2>
          {project.tagline ? <p>{project.tagline}</p> : null}
          <div className="tag-list" aria-label="Kategori dan teknologi">
            {project.categories.slice(1).map((category) => (
              <span key={`cat-${category.slug}`}>{category.name}</span>
            ))}
            {project.technologies.map((technology) => (
              <span key={`tech-${technology}`}>{technology}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}
