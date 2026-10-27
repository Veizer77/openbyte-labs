import { describe, expect, it, vi } from 'vitest'
import { createReference } from '../../src/hooks/create-reference'
import { createSlug } from '../../src/hooks/create-slug'

describe('Phase 1 data hooks', () => {
  it('generates editable ASCII slugs from titles on create', async () => {
    const hook = createSlug('title')
    const data = await hook({ data: { title: 'Tentang OpenByte Labs' }, operation: 'create' } as never)
    expect(data).toEqual({ title: 'Tentang OpenByte Labs', slug: 'tentang-openbyte-labs' })
  })

  it('preserves supplied slugs and does not regenerate them on update', async () => {
    const hook = createSlug('title')
    expect(await hook({ data: { title: 'Nama Baru', slug: 'slug-manual' }, operation: 'create' } as never)).toEqual({
      title: 'Nama Baru',
      slug: 'slug-manual',
    })
    expect(await hook({ data: { title: 'Nama Baru' }, operation: 'update' } as never)).toEqual({ title: 'Nama Baru' })
  })

  it('creates a WIB month reference and retries when a candidate already exists', async () => {
    const find = vi.fn().mockResolvedValueOnce({ totalDocs: 1 }).mockResolvedValueOnce({ totalDocs: 0 })
    const hook = createReference('INQ')
    const data = await hook({
      data: {},
      operation: 'create',
      req: { payload: { find } },
    } as never)

    expect(data?.reference).toMatch(/^INQ-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/)
    expect(find).toHaveBeenCalledTimes(2)
  })
})
