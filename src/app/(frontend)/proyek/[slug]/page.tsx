import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { publicProjects } from '@/lib/public-content'

type ProjectPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return publicProjects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = publicProjects.find((item) => item.slug === slug)

  if (!project) return { title: 'Proyek tidak ditemukan' }

  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/proyek/${project.slug}` },
    openGraph: {
      title: `${project.title} | Portofolio OpenByte Labs`,
      description: project.tagline,
      images: [project.image],
      type: 'article',
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = publicProjects.find((item) => item.slug === slug)
  if (!project) notFound()

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    image: project.image,
    creator: { '@type': 'Organization', name: 'OpenByte Labs' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <div className="detail-breadcrumb wrap" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span>/</span>
        <Link href="/proyek">Portofolio</Link>
        <span>/</span>
        <span aria-current="page">{project.title}</span>
      </div>
      <article className="project-detail wrap">
        <header className="project-detail__header">
          <div>
            <div className="tag-list">
              <span className="eyebrow-chip">{project.category}</span>
            </div>
            <h1>{project.title}</h1>
            <p>{project.tagline}</p>
          </div>
          <Link className="button button--dark" href="/proyek">
            Semua proyek{' '}
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </header>
        <div className="project-detail__visual">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 1200px"
          />
          <span className="project-detail__visual-caption">
            {project.title} · {project.category}
          </span>
        </div>
        <div className="project-detail__grid">
          <section className="project-detail__summary">
            <span className="section-kicker">Ringkasan proyek</span>
            <h2>Solusi yang disusun mengikuti konteks.</h2>
            <p>{project.summary}</p>
          </section>
          <aside className="project-detail__stack" aria-labelledby="stack-title">
            <span className="section-kicker">Bidang & teknologi</span>
            <h2 id="stack-title">Yang membentuk solusi ini.</h2>
            <ul className="stack-list">
              {project.technology.map((technology) => (
                <li key={technology}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    terminal
                  </span>
                  {technology}
                </li>
              ))}
            </ul>
          </aside>
        </div>
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
