import Image from 'next/image'
import Link from 'next/link'
import type { PublicProject } from '@/lib/public-content'

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <article className="project-card">
      <Link href={`/proyek/${project.slug}`} aria-label={`Baca studi kasus ${project.title}`}>
        <div className="project-card__image">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
          <span className="project-card__arrow material-symbols-outlined" aria-hidden="true">
            arrow_outward
          </span>
        </div>
        <div className="project-card__body">
          <span className="eyebrow-chip">{project.category}</span>
          <h2>{project.title}</h2>
          <p>{project.tagline}</p>
          <div className="tag-list" aria-label="Teknologi dan kategori">
            {project.technology.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}
