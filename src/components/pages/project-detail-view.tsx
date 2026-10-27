import Link from 'next/link'
import { JsonLd } from '@/components/public/json-ld'
import { ContentImage, MediaPlaceholder } from '@/components/public/media-image'
import { ProjectContentBlocks } from '@/components/public/project-content-blocks'
import { ProjectCard } from '@/components/public/project-card'
import type { ProjectCardDto, ProjectDetailDto, SiteSettingsDto } from '@/lib/content/types'

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
}

export function ProjectDetailView({
  project,
  related,
  settings,
}: {
  project: ProjectDetailDto
  related: ProjectCardDto[]
  settings: SiteSettingsDto
}) {
  const url = siteUrl()
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.meta.description ?? project.summary,
    url: `${url}/proyek/${project.slug}`,
    creator: { '@type': 'Organization', name: settings.brandName },
  }
  if (project.featuredImage) jsonLd.image = project.featuredImage.url
  if (project.publishedAt) jsonLd.datePublished = project.publishedAt

  return (
    <>
      <JsonLd value={jsonLd} />
      <div className="detail-breadcrumb wrap" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span aria-hidden="true">/</span>
        <Link href="/proyek">Portofolio</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{project.title}</span>
      </div>

      <article className="project-detail wrap">
        <header className="project-detail__header">
          <div>
            {project.categories.length ? (
              <div className="tag-list">
                {project.categories.map((category) => (
                  <span className="eyebrow-chip" key={category.slug}>
                    {category.name}
                  </span>
                ))}
              </div>
            ) : null}
            <h1>{project.title}</h1>
            {project.tagline ? <p>{project.tagline}</p> : null}
          </div>
          <Link className="button button--dark" href="/proyek">
            Semua proyek{' '}
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </header>

        <div className="project-detail__visual">
          {project.featuredImage ? (
            <ContentImage
              image={project.featuredImage}
              variant="hero"
              sizes="(max-width: 900px) 100vw, 1200px"
              priority
            />
          ) : (
            <MediaPlaceholder label={`Gambar utama ${project.title} belum tersedia`} />
          )}
        </div>

        <div className="project-detail__grid">
          <section className="project-detail__summary">
            <span className="section-kicker">Ringkasan proyek</span>
            <h2>Solusi yang disusun mengikuti konteks.</h2>
            <p>{project.summary}</p>
            {project.year || project.clientName ? (
              <dl className="project-detail__facts">
                {project.clientName ? (
                  <div>
                    <dt>Klien</dt>
                    <dd>{project.clientName}</dd>
                  </div>
                ) : null}
                {project.year ? (
                  <div>
                    <dt>Tahun</dt>
                    <dd>{project.year}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </section>

          <aside className="project-detail__stack" aria-labelledby="stack-title">
            <span className="section-kicker">Bidang & teknologi</span>
            <h2 id="stack-title">Yang membentuk solusi ini.</h2>
            {project.technologies.length ? (
              <ul className="stack-list">
                {project.technologies.map((technology) => (
                  <li key={technology}>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      terminal
                    </span>
                    {technology}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Teknologi belum dicantumkan.</p>
            )}
            {project.links.length ? (
              <ul className="project-links">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} rel="noopener noreferrer" target="_blank">
                      {link.label}{' '}
                      <span className="material-symbols-outlined" aria-hidden="true">
                        arrow_outward
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>
        </div>

        <ProjectContentBlocks blocks={project.blocks} />

        {project.gallery.length ? (
          <section className="project-detail__gallery" aria-labelledby="gallery-title">
            <h2 id="gallery-title">Galeri proyek</h2>
            <div className="project-content__gallery">
              {project.gallery.map((entry, index) => (
                <div className="project-content__image" key={`gallery-${index}`}>
                  {entry.image ? (
                    <ContentImage
                      image={entry.image}
                      variant="card"
                      sizes="(max-width: 700px) 100vw, 45vw"
                    />
                  ) : (
                    <MediaPlaceholder label={entry.alt} />
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {related.length ? (
          <section className="section related-projects" aria-labelledby="related-title">
            <h2 id="related-title">Proyek terkait</h2>
            <div className="project-grid project-grid--featured">
              {related.map((item) => (
                <ProjectCard key={item.slug} project={item} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="detail-back-link">
          <Link className="text-link" href="/proyek">
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_back
            </span>{' '}
            Kembali ke semua proyek
          </Link>
        </div>
      </article>
    </>
  )
}
