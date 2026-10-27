import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetailView } from '@/components/pages/project-detail-view'
import { getPublicSettings, getPublishedProjectBySlug, listPublishedProjects } from '@/server/content'

type ProjectPageProps = { params: Promise<{ slug: string }> }

/**
 * Batas kesegaran PRD 60 detik (F3-04). Wajib eksplisit: halaman detail
 * bergantung pada `publishedAt` dan `discountEndsAt`, sehingga halaman yang
 * pernah dibuat sebelum waktunya tidak boleh ter-cache selamanya sebagai 404.
 */
export const revalidate = 60

/**
 * Hanya proyek published dan sudah waktunya yang diprerender. Slug draft/asing
 * tetap dapat diminta, lalu berakhir 404 karena lapisan baca mengembalikan null.
 */
export async function generateStaticParams() {
  const projects = await listPublishedProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getPublishedProjectBySlug(slug)
  if (!data) return { title: 'Proyek tidak ditemukan', robots: { index: false, follow: false } }

  const { project } = data
  const title = project.meta.title ?? project.title
  const description = project.meta.description ?? project.tagline ?? project.summary
  const ogImage = project.meta.ogImage ?? project.featuredImage

  return {
    title,
    description,
    alternates: { canonical: `/proyek/${project.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/proyek/${project.slug}`,
      ...(ogImage ? { images: [{ url: ogImage.url, alt: ogImage.alt }] } : {}),
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const [data, settings] = await Promise.all([
    getPublishedProjectBySlug(slug),
    getPublicSettings(),
  ])

  if (!data) notFound()

  return (
    <ProjectDetailView project={data.project} related={data.related} settings={settings} />
  )
}
