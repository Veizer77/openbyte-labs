import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { hasAdminSession } from '@/access/roles'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const collection = searchParams.get('collection')
  const slug = searchParams.get('slug')

  if (!collection || !slug || !['pages', 'projects'].includes(collection)) {
    return new Response('Parameter koleksi atau slug tidak valid', { status: 400 })
  }

  const payload = await getPayload({ config: await configPromise })
  const { user } = await payload.auth({ headers: request.headers })

  if (!hasAdminSession(user)) {
    return new Response('Akses ditolak: autentikasi staf diperlukan untuk mengaktifkan mode pratinjau.', {
      status: 401,
    })
  }

  const result = await payload.find({
    collection: collection as 'pages' | 'projects',
    where: { slug: { equals: slug } },
    draft: true,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (!result.docs.length) {
    return new Response('Dokumen tidak ditemukan', { status: 404 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(`/preview/${collection}/${slug}`)
}
