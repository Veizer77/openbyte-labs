import type { CollectionBeforeValidateHook } from 'payload'

function toSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\da-z]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createSlug(sourceField: string): CollectionBeforeValidateHook {
  return ({ data, operation }) => {
    if (operation !== 'create' || data?.slug || typeof data?.[sourceField] !== 'string') return data
    return { ...data, slug: toSlug(data[sourceField]) }
  }
}
