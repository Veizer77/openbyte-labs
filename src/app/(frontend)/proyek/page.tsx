import type { Metadata } from 'next'
import { ProjectGallery } from '@/components/public/project-gallery'

export const metadata: Metadata = {
  title: 'Portofolio',
  description: 'Pilihan proyek sistem informasi, aplikasi mobile, dan website OpenByte Labs.',
  alternates: { canonical: '/proyek' },
  openGraph: {
    title: 'Portofolio OpenByte Labs',
    description: 'Pilihan proyek sistem informasi, aplikasi mobile, dan website.',
    type: 'website',
  },
}

export default function ProjectsPage() {
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
            Pilihan proyek
          </span>
          <span>Studi kasus OpenByte Labs</span>
        </div>
      </section>
      <section className="section section--subtle projects-page" aria-label="Daftar proyek">
        <div className="wrap">
          <ProjectGallery />
        </div>
      </section>
    </>
  )
}
