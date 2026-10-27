import type { Metadata } from 'next'
import { ProjectsView } from '@/components/pages/projects-view'
import { listProjectCategories, listPublishedProjects } from '@/server/content'

/** Batas kesegaran PRD 60 detik (F3-04). */
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Portofolio',
  description: 'Pilihan proyek sistem informasi, aplikasi mobile, dan website OpenByte Labs.',
  alternates: { canonical: '/proyek' },
  openGraph: {
    title: 'Portofolio OpenByte Labs',
    description: 'Pilihan proyek sistem informasi, aplikasi mobile, dan website.',
    type: 'website',
    url: '/proyek',
  },
}

export default async function ProjectsPage() {
  const [projects, filters] = await Promise.all([listPublishedProjects(), listProjectCategories()])

  return <ProjectsView projects={projects} filters={filters} />
}
