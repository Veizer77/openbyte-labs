import type { CollectionBeforeChangeHook } from 'payload'

function parseMinutes(value: unknown): number | null {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export const preventAvailabilityOverlap: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  if (!data) return data

  const weekday = data.weekday ?? originalDoc?.weekday
  const start = parseMinutes(data.startTime ?? originalDoc?.startTime)
  const end = parseMinutes(data.endTime ?? originalDoc?.endTime)
  const isActive = data.isActive ?? originalDoc?.isActive ?? true
  if (!isActive || typeof weekday !== 'number' || start === null || end === null || end <= start)
    return data

  const existing = await req.payload.find({
    collection: 'availability-rules',
    where: { weekday: { equals: weekday } },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  const overlaps = existing.docs.some((rule) => {
    if (String(rule.id) === String(originalDoc?.id) || rule.isActive === false) return false
    const otherStart = parseMinutes(rule.startTime)
    const otherEnd = parseMinutes(rule.endTime)
    if (otherStart === null || otherEnd === null) return false
    return start < otherEnd && otherStart < end
  })

  if (overlaps)
    throw new Error('Rentang jam bertabrakan dengan aturan ketersediaan lain pada hari yang sama.')
  return data
}
