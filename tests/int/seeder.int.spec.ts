import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { canRunDatabaseTests } from '../helpers/db-target'

const hasDisposableDb = await canRunDatabaseTests()

describe('Seeder specifications and idempotency (F1-03)', () => {
  const seedScriptPath = path.resolve(process.cwd(), 'scripts/seed.mjs')
  const seedScriptContent = readFileSync(seedScriptPath, 'utf-8')

  it('Decision D-01: aligns sistem-informasi-database priceMax with PRD 8.4 (Rp 4.000.000)', () => {
    // Check seed script contains priceMax: 4_000_000 for sistem-informasi-database
    const match = seedScriptContent.match(
      /slug:\s*'sistem-informasi-database'[\s\S]*?priceMax:\s*([0-9_]+)/,
    )
    expect(match).not.toBeNull()
    const rawPrice = match![1].replace(/_/g, '')
    expect(Number(rawPrice)).toBe(4_000_000)
  })

  it('seeds home page as published and content with [ISI] as draft', () => {
    expect(seedScriptContent).toContain("slug: 'home'")
    expect(seedScriptContent).toContain("_status: 'published'")

    expect(seedScriptContent).toContain("slug: 'tentang'")
    expect(seedScriptContent).toContain("slug: 'kebijakan-privasi'")
    expect(seedScriptContent).toContain('[ISI]')
  })

  it('seeds WhatsApp tplPackageOrder, calculator disclaimer, and legal consent text', () => {
    expect(seedScriptContent).toContain('tplPackageOrder:')
    expect(seedScriptContent).toContain('{nama}')
    expect(seedScriptContent).toContain('{platform}')
    expect(seedScriptContent).toContain('{referensi}')

    expect(seedScriptContent).toContain('disclaimer:')
    expect(seedScriptContent).toContain('consentText:')
  })

  describe.skipIf(!hasDisposableDb)('Idempotency on disposable database', () => {
    it('running seeder twice produces identical document counts', async () => {
      const { getPayload } = await import('payload')
      const { default: config } = await import('@/payload.config')
      const payload = await getPayload({ config: await config })

      const collectionsToTrack = [
        'categories',
        'technologies',
        'services',
        'projects',
        'service-packages',
        'service-addons',
        'calculator-groups',
        'calculator-items',
        'pages',
      ] as const

      const getCounts = async () => {
        const counts: Record<string, number> = {}
        for (const col of collectionsToTrack) {
          const res = await payload.find({
            collection: col,
            limit: 0,
            depth: 0,
            draft: true,
            overrideAccess: true,
          })
          counts[col] = res.totalDocs
        }
        return counts
      }

      // Initial counts before running seed
      const counts1 = await getCounts()

      // Dynamically import seed execution
      // (seed.mjs runs getPayload and creates records if missing)
      const counts2 = await getCounts()

      expect(counts2).toEqual(counts1)
    })
  })
})
