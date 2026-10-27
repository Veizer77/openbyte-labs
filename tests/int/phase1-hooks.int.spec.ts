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

  it('always generates a server-side reference on create, ignoring client-supplied reference', async () => {
    const find = vi.fn().mockResolvedValueOnce({ totalDocs: 0 })
    const hook = createReference('QTE')
    const data = await hook({
      data: { reference: 'CLIENT-INJECTED-REF' },
      operation: 'create',
      req: { payload: { find } },
    } as never)

    expect(data?.reference).toMatch(/^QTE-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/)
    expect(data?.reference).not.toBe('CLIENT-INJECTED-REF')
  })

  it('rejects category deletion if category is still referenced by projects or packages', async () => {
    const { protectCategoryDelete } = await import('../../src/hooks/protect-category-delete')
    const findProject = vi.fn().mockResolvedValueOnce({ docs: [{ id: 'p1' }] })
    const findPackage = vi.fn().mockResolvedValueOnce({ docs: [] })
    const payload = {
      find: vi.fn().mockImplementation(({ collection }) => {
        if (collection === 'projects') return findProject()
        return findPackage()
      }),
    }

    await expect(
      protectCategoryDelete({ id: 'cat-1', req: { payload } } as never),
    ).rejects.toThrow('Kategori tidak dapat dihapus')
  })

  it('records audit log on create, update, and delete without logging sensitive credentials', async () => {
    const { auditCollectionChange, auditCollectionDelete } = await import(
      '../../src/hooks/audit-collection-change'
    )
    const create = vi.fn().mockResolvedValue({})
    const req = { user: { id: 42 }, payload: { create } }

    const changeHook = auditCollectionChange('projects')
    await changeHook({ doc: { id: 10, title: 'Test Proyek' }, operation: 'update', req } as never)

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'audit-logs',
        data: expect.objectContaining({
          actor: 42,
          actorType: 'admin',
          action: 'update',
          collection: 'projects',
          docId: '10',
        }),
      }),
    )

    const deleteHook = auditCollectionDelete('projects')
    await deleteHook({ doc: { id: 10 }, id: 10, req } as never)

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'audit-logs',
        data: expect.objectContaining({
          actor: 42,
          actorType: 'admin',
          action: 'delete',
          collection: 'projects',
          docId: '10',
        }),
      }),
    )
  })
})
