import Link from 'next/link'
import type { PageBlockDto } from '@/lib/content/types'
import { ProjectCard } from '@/components/public/project-card'

type PortfolioBlock = Extract<PageBlockDto, { type: 'portfolioShowcase' }>

/**
 * Blok portofolio (F3-02). Hanya proyek published dengan `publishedAt` yang
 * sudah lewat yang dikirim lapisan baca; blok ini tidak menambah filter sendiri.
 */
export function PortfolioShowcase({ block }: { block: PortfolioBlock }) {
  return (
    <section className="section portfolio-section" id="portofolio" aria-labelledby="portfolio-title">
      <div className="wrap">
        <div className="section-heading section-heading--split">
          <div>
            <span className="section-kicker">Pilihan proyek</span>
            <h2 id="portfolio-title">{block.title ?? 'Portofolio'}</h2>
          </div>
          {block.totalProjects > 0 ? (
            <Link className="text-link" href="/proyek">
              Lihat semua proyek{' '}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          ) : null}
        </div>

        {block.projects.length ? (
          <div className="project-grid project-grid--featured">
            {block.projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="projects-empty" role="status">
            Belum ada proyek yang diterbitkan.
          </p>
        )}
      </div>
    </section>
  )
}
