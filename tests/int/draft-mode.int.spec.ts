import { describe, expect, it, vi } from 'vitest'
import { Pages } from '../../src/collections/Pages'
import { Projects } from '../../src/collections/Projects'
import { GET as draftRoute } from '../../src/app/api/draft/route'

vi.mock('next/headers', () => ({
  draftMode: vi.fn().mockResolvedValue({
    enable: vi.fn(),
    disable: vi.fn(),
  }),
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

describe('F2-04: Draft Mode and Preview Security', () => {
  describe('Collection preview URL generators', () => {
    it('generates draft preview URL for Pages', () => {
      const previewFn = Pages.admin?.preview as ((doc: unknown) => string)
      expect(previewFn({ slug: 'tentang' })).toBe('/api/draft?collection=pages&slug=tentang')
      expect(previewFn({})).toBe('')
    })

    it('generates draft preview URL for Projects', () => {
      const previewFn = Projects.admin?.preview as ((doc: unknown) => string)
      expect(previewFn({ slug: 'pos-retail' })).toBe('/api/draft?collection=projects&slug=pos-retail')
      expect(previewFn({})).toBe('')
    })
  })

  describe('Draft mode API route verification', () => {
    it('rejects invalid or missing collection and slug params', async () => {
      const res1 = await draftRoute(new Request('http://localhost:3000/api/draft'))
      expect(res1.status).toBe(400)

      const res2 = await draftRoute(new Request('http://localhost:3000/api/draft?collection=invalid&slug=home'))
      expect(res2.status).toBe(400)
    })
  })
})
