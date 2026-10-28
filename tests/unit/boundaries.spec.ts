import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { GET as admin } from '../../src/app/admin/[[...path]]/route'
import { GET as tracking } from '../../src/app/(public)/tracking/[[...path]]/route'

describe('reset boundaries, not a completed admin authorization matrix', () => {
  it('does not expose the retired application as a working site', async () => {
    expect(existsSync('src/app/(public)/page.tsx')).toBe(true)
    expect(admin().status).toBe(503)
    expect((await admin().json()).code).toBe('ADMIN_NOT_IMPLEMENTED')
  })
  it('keeps tracking unavailable in Release 1', () => {
    expect(tracking().status).toBe(404)
  })
  it('has no retired generic API or CMS runtime', () => {
    for (const file of ['src/payload.config.ts', 'src/payload-types.ts', 'src/app/(payload)/api/[...slug]/route.ts']) {
      expect(existsSync(file), file).toBe(false)
    }
    const manifest = JSON.parse(readFileSync('package.json', 'utf8'))
    const names = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })
    expect(names.some((name) => name === 'payload' || name === 'payload-totp' || name.startsWith('@payloadcms/'))).toBe(false)
  })
  it('retains the owner prototype and new specification', () => {
    expect(existsSync('prototype/stitch/site/beranda.html')).toBe(true)
    expect(existsSync('prototype/stitch/cms/dashboard-cms-admin.html')).toBe(true)
    expect(existsSync('PRD_v1_5.md')).toBe(true)
  })
})
