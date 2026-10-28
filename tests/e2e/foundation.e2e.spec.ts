import { expect, test } from '@playwright/test'

test('public site is served and reset admin routes are closed', async ({ request }) => {
  const rootResponse = await request.get('/')
  expect(rootResponse.status()).toBe(200)

  for (const path of ['/admin', '/admin/users']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(503)
    expect(response.headers()['x-robots-tag']).toBe('noindex, nofollow')
    expect(response.headers()['cache-control']).toContain('no-store')
  }
})

test('tracking is unavailable including descendants', async ({ request }) => {
  for (const path of ['/tracking', '/tracking/proyek', '/tracking/anything/nested']) {
    expect((await request.get(path)).status(), path).toBe(404)
  }
})

test('no old CRUD or draft endpoint is exposed', async ({ request }) => {
  for (const path of ['/api/users', '/api/projects', '/api/draft']) {
    expect((await request.get(path)).status(), path).toBe(404)
  }
  expect((await request.post('/admin')).status()).toBe(405)
})

test('health fails safely with an unavailable database', async ({ request }) => {
  for (const path of ['/health', '/api/health']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(503)
    expect(await response.json()).toEqual({ status: 'unavailable', database: 'down' })
    expect(response.headers()['cache-control']).toContain('no-store')
  }
})
