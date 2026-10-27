import type { CollectionAfterChangeHook } from 'payload'

export function auditCollectionChange(collection: string): CollectionAfterChangeHook {
  return async ({ doc, operation, req }) => {
    const actorId = req.user?.id
    await req.payload.create({
      collection: 'audit-logs',
      data: {
        actor: actorId,
        actorType: actorId ? 'admin' : 'system',
        action: operation,
        collection,
        docId: String(doc.id),
        summary: `${operation} ${collection} record ${String(doc.id)}`,
      },
      depth: 0,
      overrideAccess: true,
      req,
    })
    return doc
  }
}
