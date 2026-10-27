import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

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

export function auditCollectionDelete(collection: string): CollectionAfterDeleteHook {
  return async ({ doc, id, req }) => {
    const actorId = req.user?.id
    const targetId = id ?? doc?.id
    await req.payload.create({
      collection: 'audit-logs',
      data: {
        actor: actorId,
        actorType: actorId ? 'admin' : 'system',
        action: 'delete',
        collection,
        docId: targetId ? String(targetId) : undefined,
        summary: `delete ${collection} record ${targetId ? String(targetId) : ''}`.trim(),
      },
      depth: 0,
      overrideAccess: true,
      req,
    })
    return doc
  }
}
