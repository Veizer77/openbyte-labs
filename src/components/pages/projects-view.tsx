import { ProjectGallery } from '@/components/public/project-gallery'
import type { ProjectCardDto } from '@/lib/content/types'

export function ProjectsView({
  projects,
  filters,
}: {
  projects: ProjectCardDto[]
  filters: { slug: string; name: string }[]
}) {
  return (
    <>
      <section className="page-hero wrap" aria-labelledby="projects-title">
        <span className="section-kicker">Portofolio & studi kasus</span>
        <h1 id="projects-title">Dibangun dari kebutuhan yang nyata.</h1>
        <p>
          Jelajahi sistem informasi, aplikasi, dan website yang dirancang untuk membantu pekerjaan
          sehari-hari menjadi lebih terstruktur.
        </p>
        <div className="page-hero__meta">
          <span>
            <span className="material-symbols-outlined" aria-hidden="true">
              folder_open
            </span>{' '}
            {projects.length} proyek terbit
          </span>
        </div>
      </section>
      <section className="section section--subtle projects-page" aria-label="Daftar proyek">
        <div className="wrap">
          <ProjectGallery projects={projects} filters={filters} />
        </div>
      </section>
    </>
  )
}
