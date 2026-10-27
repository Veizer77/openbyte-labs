import { expect, Page, test } from '@playwright/test'

import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testTotpSecret, testUser } from '../helpers/seedUser'
import {
  cleanupMedia,
  deleteCalculatorFixture,
  deleteCategoryBySlug,
  deleteProjectsBySlugPrefix,
  seedMedia,
} from '../helpers/admin-collections'

const serverURL = 'http://localhost:3000'
const fixturePrefix = `uji-e2e-${Date.now().toString(36)}`

/**
 * Panggilan REST admin dari dalam halaman (bukan APIRequestContext) agar
 * Origin dan cookie dikirim seperti panggilan admin UI sungguhan — termasuk
 * pemeriksaan CSRF Payload.
 */
async function adminFetch(
  page: Page,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: Record<string, unknown>,
): Promise<{ json: unknown; status: number }> {
  return page.evaluate(
    async ({ body: requestBody, method: httpMethod, path: fetchPath }) => {
      const res = await fetch(fetchPath, {
        body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
        credentials: 'include',
        headers:
          requestBody === undefined
            ? { Accept: 'application/json' }
            : { Accept: 'application/json', 'Content-Type': 'application/json' },
        method: httpMethod,
      })
      let json: unknown = null
      try {
        json = await res.json()
      } catch {
        // Respons bukan JSON (mis. text) — biarkan null.
      }
      return { json, status: res.status }
    },
    { body, method, path },
  )
}

interface Doc {
  id: number
  _order?: string
  deletedAt?: string | null
  name?: string
  slug: string
  title?: string
  _status?: 'draft' | 'published'
  [joinKey: string]: unknown
}

function asDocs(json: unknown): Doc[] {
  const docs = (json as { docs?: Doc[] } | null)?.docs
  if (!Array.isArray(docs)) throw new Error(`Response tidak berbentuk daftar: ${JSON.stringify(json).slice(0, 200)}`)
  return docs
}

test.describe('Aksi daftar koleksi admin (12.3 butir 2)', () => {
  let page: Page
  let mediaId: number

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    mediaId = await seedMedia('Media E2E koleksi admin')

    const context = await browser.newContext()
    page = await context.newPage()
    await login({ page, serverURL, user: testUser, totpSecret: testTotpSecret })
  })

  test.afterAll(async () => {
    await deleteProjectsBySlugPrefix(fixturePrefix).catch(() => undefined)
    for (const suffix of ['a', 'b', 'c']) {
      await deleteCategoryBySlug(`${fixturePrefix}-${suffix}`).catch(() => undefined)
    }
    await deleteCalculatorFixture(fixturePrefix).catch(() => undefined)
    if (typeof mediaId === 'number') await cleanupMedia(mediaId).catch(() => undefined)
    await cleanupTestUser().catch(() => undefined)
  })

  test.describe('orderable (Kategori)', () => {
    let ids: number[]

    test.beforeAll(async () => {
      // Buat 3 kategori; slug dibuat hook createSlug dari nama.
      const names = ['a', 'b', 'c']
      ids = []
      for (const suffix of names) {
        const res = await adminFetch(page, 'POST', '/api/categories', {
          name: `Uji Kategori ${suffix.toUpperCase()} ${fixturePrefix}`,
        })
        expect(res.status).toBe(201)
        ids.push((res.json as { doc: { id: number } }).doc.id)
      }
    })

    test('reorder pertama menetapkan kunci urutan (one-time migration)', async () => {
      // Target tanpa key: handler melakukan migration kunci untuk semua dokumen.
      const res = await adminFetch(page, 'POST', '/api/reorder', {
        collectionSlug: 'categories',
        docsToMove: [ids[2]],
        newKeyWillBe: 'less',
        orderableFieldName: '_order',
        target: { id: ids[0] },
      })
      expect(res.status).toBe(200)
      expect(res.json).toMatchObject({ success: true })

      // Urutan antar dokumen hasil migration tidak deterministik; yang dijamin:
      // setiap dokumen kini memiliki kunci _order dan daftar tersortir lengkap.
      const after = asDocs((await adminFetch(page, 'GET', '/api/categories?sort=_order&limit=0')).json)
      expect(after).toHaveLength(3)
      expect(after.every((d) => typeof d._order === 'string' && d._order.length > 0)).toBe(true)
      const sortedKeys = [...after.map((d) => d._order)].sort()
      expect(after.map((d) => d._order)).toEqual(sortedKeys)
    })

    test('reorder mengubah urutan menurut fractional index', async () => {
      // Baca kunci urutan terkini dari daftar tersortir (dokumen pertama = target).
      const docs = asDocs((await adminFetch(page, 'GET', '/api/categories?sort=_order&limit=0')).json)
      expect(docs).toHaveLength(3)

      // Pindahkan kategori C ke posisi paling depan (sebelum target pertama).
      const target = docs[0]
      const res = await adminFetch(page, 'POST', '/api/reorder', {
        collectionSlug: 'categories',
        docsToMove: [ids[2]],
        newKeyWillBe: 'less',
        orderableFieldName: '_order',
        target: { id: target.id, key: target._order },
      })
      expect(res.status).toBe(200)

      const after = asDocs((await adminFetch(page, 'GET', '/api/categories?sort=_order&limit=0')).json)
      // Kategori C kini paling depan dan kuncinya di bawah target lama.
      expect(after[0].id).toBe(ids[2])
      expect(after[0]._order && target._order && after[0]._order < target._order).toBe(true)
    })

    test('tampilan daftar menampilkan urutan baru', async () => {
      // defaultSort koleksi orderable = '_order' (disetel Payload saat sanitasi).
      await page.goto(`${serverURL}/admin/collections/categories`)
      const cells = page.locator('td.cell-name')
      await expect(cells.first()).toBeVisible()
      // Hanya kategori fixture yang diadu urutannya, agar tahan bila ada data lain.
      const names = (await cells.allInnerTexts()).filter((n) => n.startsWith('Uji Kategori'))
      expect(names).toHaveLength(3)
      expect(names[0]).toBe(`Uji Kategori C ${fixturePrefix}`)
    })
  })

  test.describe('trash (Proyek Showcase)', () => {
    let projectId: number
    const projectTitle = `Uji Project Trash ${fixturePrefix}`

    test('hapus lembut memindahkan dokumen ke trash', async () => {
      const res = await adminFetch(page, 'POST', '/api/projects', {
        featuredImage: mediaId,
        summary: 'Ringkasan proyek uji trash E2E.',
        title: projectTitle,
      })
      expect(res.status).toBe(201)
      projectId = (res.json as { doc: { id: number } }).doc.id

      // Soft delete memakai PATCH deletedAt (kontrak DeleteMany UI Payload).
      const del = await adminFetch(page, 'PATCH', `/api/projects/${projectId}`, {
        deletedAt: new Date().toISOString(),
      })
      expect(del.status).toBe(200)

      // Daftar biasa tidak menampilkan dokumen trashed.
      const list = asDocs((await adminFetch(page, 'GET', '/api/projects?where[id][equals]=' + projectId)).json)
      expect(list).toHaveLength(0)

      // View trash menampilkannya dengan deletedAt terisi.
      const trash = asDocs(
        (await adminFetch(page, 'GET', `/api/projects?trash=true&where[id][equals]=${projectId}`)).json,
      )
      expect(trash).toHaveLength(1)
      expect(trash[0].deletedAt).toBeTruthy()
    })

    test('pulihkan dokumen dari trash', async () => {
      const res = await adminFetch(
        page,
        'PATCH',
        `/api/projects?trash=true&where[id][equals]=${projectId}`,
        { deletedAt: null },
      )
      expect(res.status).toBe(200)
      expect(asDocs(res.json)).toHaveLength(1)

      const back = asDocs((await adminFetch(page, 'GET', `/api/projects?where[id][equals]=${projectId}`)).json)
      expect(back).toHaveLength(1)
      expect(back[0].deletedAt ?? null).toBeNull()
    })

    test('aksi massal publikasikan menandai dokumen terpublikasi', async () => {
      // Buat proyek kedua agar aksi massal benar-benar memengaruhi 2 dokumen.
      const res = await adminFetch(page, 'POST', '/api/projects', {
        featuredImage: mediaId,
        summary: 'Ringkasan proyek uji publish massal E2E.',
        title: `Uji Project Publish ${fixturePrefix}`,
      })
      expect(res.status).toBe(201)
      const secondId = (res.json as { doc: { id: number } }).doc.id

      const publish = await adminFetch(page, 'PATCH', '/api/projects?where[id][in]=' + [projectId, secondId].join(','), {
        _status: 'published',
      })
      expect(publish.status).toBe(200)
      const publishedDocs = asDocs(publish.json)
      expect(publishedDocs.map((d) => d.id).sort()).toEqual([projectId, secondId].sort())
      expect(publishedDocs.every((d) => d._status === 'published')).toBe(true)

      // Verifikasi status via endpoint terpisah.
      for (const id of [projectId, secondId]) {
        const single = (await adminFetch(page, 'GET', `/api/projects/${id}`)).json as { _status?: string }
        expect(single._status).toBe('published')
      }

      const unpublish = await adminFetch(page, 'PATCH', '/api/projects?where[id][in]=' + [projectId, secondId].join(','), {
        _status: 'draft',
      })
      expect(unpublish.status).toBe(200)
      expect(asDocs(unpublish.json).every((d) => d._status === 'draft')).toBe(true)
    })
  })

  test.describe('join orderable (Kalkulator: grup → item)', () => {
    let groupId: number
    let itemIds: number[]
    const joinFieldName = '_calculator-items_items_order'

    test.beforeAll(async () => {
      const group = await adminFetch(page, 'POST', '/api/calculator-groups', {
        isRequired: false,
        selectionType: 'single',
        title: `Uji Grup ${fixturePrefix}`,
      })
      expect(group.status).toBe(201)
      groupId = (group.json as { doc: { id: number } }).doc.id

      itemIds = []
      for (const label of ['Satu', 'Dua']) {
        const item = await adminFetch(page, 'POST', '/api/calculator-items', {
          daysMin: 0,
          group: groupId,
          label: `Uji Item ${label} ${fixturePrefix}`,
          priceMin: 0,
          pricingType: 'flat',
        })
        expect(item.status).toBe(201)
        itemIds.push((item.json as { doc: { id: number } }).doc.id)
      }
    })

    test('reorder pertama (join) menetapkan kunci dalam scope grup', async () => {
      // Target tanpa key: handler menjalankan one-time migration hanya untuk
      // dokumen dalam scope grup yang sama (joinScopeWhere: group = groupId).
      const res = await adminFetch(page, 'POST', '/api/reorder', {
        collectionSlug: 'calculator-items',
        docsToMove: [itemIds[1]],
        newKeyWillBe: 'less',
        orderableFieldName: joinFieldName,
        target: { id: itemIds[0] },
      })
      expect(res.status).toBe(200)
      expect(res.json).toMatchObject({ success: true })
    })

    test('reorder item dalam scope grup mengubah urutan join', async () => {
      const scopedUrl = `/api/calculator-items?where[group][equals]=${groupId}&sort=${joinFieldName}&limit=0`
      const docs = asDocs((await adminFetch(page, 'GET', scopedUrl)).json)
      expect(docs).toHaveLength(2)
      const target = docs[0]

      const res = await adminFetch(page, 'POST', '/api/reorder', {
        collectionSlug: 'calculator-items',
        docsToMove: [itemIds[1]],
        newKeyWillBe: 'less',
        orderableFieldName: joinFieldName,
        target: { id: target.id, key: target[joinFieldName] },
      })
      expect(res.status).toBe(200)

      const after = asDocs((await adminFetch(page, 'GET', scopedUrl)).json)
      expect(after[0].id).toBe(itemIds[1])
      const newKey = after[0][joinFieldName] as string | undefined
      const targetKey = target[joinFieldName] as string | undefined
      expect(Boolean(newKey) && Boolean(targetKey) && newKey && targetKey && newKey < targetKey).toBe(true)
    })
  })
})
