import { describe, expect, it } from 'vitest'
import type { Access, CollectionConfig, FieldAccess } from 'payload'

process.env.PAYLOAD_SECRET ??= 'access-matrix-placeholder-secret-at-least-32-chars'
process.env.SITE_URL ??= 'http://localhost:3000'
process.env.DATABASE_URI ??= 'postgres://localhost:5432/openbyte'
process.env.DATABASE_URI_DIRECT ??= 'postgres://localhost:5432/openbyte'

const { default: payloadConfigPromise } = await import('../../src/payload.config')
const payloadConfig = await payloadConfigPromise
const collections = new Map<string, CollectionConfig>(
  payloadConfig.collections.map((collection) => [collection.slug, collection]),
)

const publicContent = [
  'media',
  'categories',
  'technologies',
  'services',
  'testimonials',
  'faqs',
  'pages',
  'projects',
  'service-packages',
  'service-addons',
]
const ownerOnly = [
  'users',
  'inquiries',
  'quote-requests',
  'availability-rules',
  'blocked-dates',
  'consultation-bookings',
]
const readWriteOperations = ['read', 'create', 'update', 'delete'] as const

function requestFor(
  roles: string[] = [],
  strategy: string | null = roles.includes('owner') || roles.includes('editor') ? 'totp' : null,
) {
  return {
    req: {
      user: roles.length
        ? { id: 1, roles, ...(strategy ? { _strategy: strategy } : {}) }
        : null,
      payload: {
        config: {
          custom: {
            totp: {
              pluginOptions: {
                disabled: false,
                disableAccessWrapper: false,
                forceSetup: true,
                collection: 'users',
              },
            },
          },
        },
      },
    },
  } as never
}

function access(collection: CollectionConfig, operation: (typeof readWriteOperations)[number]): Access {
  return collection.access?.[operation] as Access
}

async function call(accessFunction: Access, roles: string[] = [], strategy?: string) {
  return accessFunction(requestFor(roles, strategy))
}

describe('Release 1 collection access matrix', () => {
  it('declares explicit CRUD access for every Release 1 collection', () => {
    const expectedSlugs = [...publicContent, ...ownerOnly, 'calculator-groups', 'calculator-items', 'audit-logs', 'rate-limits']
    for (const slug of expectedSlugs) {
      const collection = collections.get(slug)
      expect(collection, `Missing collection config: ${slug}`).toBeDefined()
      for (const operation of readWriteOperations) {
        expect(typeof collection?.access?.[operation], `${slug}.${operation}`).toBe('function')
      }
    }
  })

  it('allows anonymous reads only through published/active public filters, never anonymous writes', async () => {
    for (const slug of publicContent) {
      const collection = collections.get(slug)!
      const anonymousRead = await call(access(collection, 'read'))
      expect(anonymousRead).not.toBe(false)
      for (const operation of ['create', 'update', 'delete'] as const) {
        expect(await call(access(collection, operation)), `${slug}.${operation}`).toBe(false)
      }
    }

    expect(await call(access(collections.get('pages')!, 'read'))).toEqual({
      _status: { equals: 'published' },
    })
    expect(await call(access(collections.get('categories')!, 'read'))).toEqual({
      isActive: { equals: true },
    })
  })

  it('grants public-content CRUD only to owner/editor roles', async () => {
    for (const slug of publicContent) {
      const collection = collections.get(slug)!
      for (const operation of readWriteOperations) {
        const ownerResult = await call(access(collection, operation), ['owner'])
        if (slug === 'users' && operation === 'read') {
          expect(ownerResult).toEqual({ id: { equals: 1 } })
        } else {
          expect(ownerResult, `${slug}.${operation} owner`).toBe(true)
        }
        expect(await call(access(collection, operation), ['editor']), `${slug}.${operation} editor`).toBe(true)
        if (operation !== 'read') {
          expect(
            await call(access(collection, operation), ['editor'], 'password'),
            `${slug}.${operation} editor tanpa 2FA (D-05)`,
          ).toBe(false)
        }
      }
    }
  })

  it('restricts operational and user collections to owners; calculator collections to admins', async () => {
    for (const slug of ownerOnly) {
      const collection = collections.get(slug)!
      for (const operation of readWriteOperations) {
        expect(await call(access(collection, operation), ['owner']), `${slug}.${operation} owner`).toBe(true)
        expect(await call(access(collection, operation), ['editor']), `${slug}.${operation} editor`).toBe(false)
        expect(await call(access(collection, operation)), `${slug}.${operation} anonymous`).toBe(false)
      }
    }

    expect(
      await access(collections.get('inquiries')!, 'read')(requestFor(['owner'], null)),
    ).toBe(false)

    for (const slug of ['calculator-groups', 'calculator-items']) {
      const collection = collections.get(slug)!
      for (const operation of readWriteOperations) {
        expect(await call(access(collection, operation), ['owner'])).toBe(true)
        expect(await call(access(collection, operation), ['editor'])).toBe(true)
        expect(await call(access(collection, operation))).toBe(false)
      }
    }
  })

  it('keeps audit logs owner-readable and rate limits closed to every role', async () => {
    const audit = collections.get('audit-logs')!
    expect(await call(access(audit, 'read'), ['owner'])).toBe(true)
    expect(await call(access(audit, 'read'), ['editor'])).toBe(false)
    for (const operation of ['create', 'update', 'delete'] as const) {
      expect(await call(access(audit, operation), ['owner'])).toBe(false)
    }

    const rateLimits = collections.get('rate-limits')!
    for (const operation of readWriteOperations) {
      expect(await call(access(rateLimits, operation), ['owner'])).toBe(false)
      expect(await call(access(rateLimits, operation), ['editor'])).toBe(false)
      expect(await call(access(rateLimits, operation))).toBe(false)
    }
  })

  it('lets editors update ordinary settings but only owners read and change WhatsApp and tracking fields', async () => {
    const settings = payloadConfig.globals.find((global) => global.slug === 'site-settings')!
    const tabs = settings.fields[0]
    if (tabs.type !== 'tabs') throw new Error('Site Settings tabs field is missing.')

    for (const tabName of ['whatsapp', 'tracking']) {
      const tab = tabs.tabs.find((candidate) => 'name' in candidate && candidate.name === tabName)!
      expect(await (tab.access?.read as FieldAccess)(requestFor(['owner']))).toBe(true)
      expect(await (tab.access?.read as FieldAccess)(requestFor(['editor']))).toBe(false)
      expect(await (tab.access?.read as FieldAccess)(requestFor())).toBe(false)

      expect(await (tab.access?.update as FieldAccess)(requestFor(['owner']))).toBe(true)
      expect(await (tab.access?.update as FieldAccess)(requestFor(['editor']))).toBe(false)
      for (const field of tab.fields) {
        if (!('access' in field)) continue
        if (field.access?.read) {
          expect(await field.access.read(requestFor(['owner']))).toBe(true)
          expect(await field.access.read(requestFor(['editor']))).toBe(false)
          expect(await field.access.read(requestFor())).toBe(false)
        }
        if (field.access?.update) {
          expect(await field.access.update(requestFor(['owner']))).toBe(true)
          expect(await field.access.update(requestFor(['editor']))).toBe(false)
        }
      }
    }

    expect(await settings.access?.update?.(requestFor(['editor']))).toBe(true)
    expect(await settings.access?.update?.(requestFor(['owner'], null))).toBe(false)
    expect(await settings.access?.update?.(requestFor(['owner'], 'totp'))).toBe(true)
  })
})
