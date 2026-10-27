import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

function refreshTag(tag: string): void {
  if (process.env.PAYLOAD_SEEDING === '1' || process.env.PAYLOAD_MIGRATING === 'true') return
  revalidateTag(tag, 'max')
}

export function revalidateCollectionTag(tag: string): {
  afterChange: CollectionAfterChangeHook
  afterDelete: CollectionAfterDeleteHook
} {
  return {
    afterChange: ({ doc }) => {
      refreshTag(tag)
      return doc
    },
    afterDelete: ({ doc }) => {
      refreshTag(tag)
      return doc
    },
  }
}

export const revalidateSettings: GlobalAfterChangeHook = ({ doc }) => {
  refreshTag('settings')
  return doc
}
