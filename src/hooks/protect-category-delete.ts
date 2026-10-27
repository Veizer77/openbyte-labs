import type { CollectionBeforeDeleteHook } from 'payload'

export const protectCategoryDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const [projects, packages] = await Promise.all([
    req.payload.find({
      collection: 'projects',
      where: { categories: { contains: id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
    req.payload.find({
      collection: 'service-packages',
      where: { category: { equals: id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
  ])

  if (projects.docs.length || packages.docs.length) {
    throw new Error(
      'Kategori tidak dapat dihapus selama masih digunakan oleh proyek atau paket layanan.',
    )
  }
}
