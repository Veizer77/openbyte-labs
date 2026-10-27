import { describe, expect, it } from 'vitest'
import {
  activePublicOrAdmin,
  closedAccess,
  isAdmin,
  isOwner,
  publicOrAdmin,
  publishedProjectsOrAdmin,
} from '../../src/access/roles'

function requestFor(user?: { roles?: string[] }) {
  return {
    req: {
      user: user ? { ...user, _strategy: user.roles?.includes('owner') ? 'totp' : undefined } : undefined,
    },
  } as never
}

describe('access matrix helpers', () => {
  it('restricts operational collections to owners for every operation', async () => {
    for (const operation of ['read', 'create', 'update', 'delete'] as const) {
      expect(await closedAccess[operation](requestFor())).toBe(false)
      expect(await closedAccess[operation](requestFor({ roles: ['editor'] }))).toBe(false)
      expect(await closedAccess[operation](requestFor({ roles: ['owner'] }))).toBe(true)
    }
  })

  it('allows editor and owner content permissions, but not another authenticated role', async () => {
    expect(await isAdmin(requestFor({ roles: ['editor'] }))).toBe(true)
    expect(await isAdmin(requestFor({ roles: ['owner'] }))).toBe(true)
    expect(await isAdmin(requestFor({ roles: ['other'] }))).toBe(false)
    expect(await isOwner(requestFor({ roles: ['editor'] }))).toBe(false)
    expect(await isAdmin({ req: { user: { roles: ['owner'] } } } as never)).toBe(false)
  })

  it('limits anonymous public reads to published or active records', async () => {
    expect(await publicOrAdmin(requestFor())).toEqual({ _status: { equals: 'published' } })
    expect(await activePublicOrAdmin(requestFor())).toEqual({ isActive: { equals: true } })
  })

  it('limits anonymous project reads to published records whose publish date has arrived', async () => {
    const result = await publishedProjectsOrAdmin(requestFor())
    expect(result).toEqual({
      and: [
        { _status: { equals: 'published' } },
        { publishedAt: { less_than_equal: expect.any(String) } },
      ],
    })
    const timestamp = (result as { and: [object, { publishedAt: { less_than_equal: string } }] })
      .and[1].publishedAt.less_than_equal
    expect(new Date(timestamp).toString()).not.toBe('Invalid Date')
  })
})
