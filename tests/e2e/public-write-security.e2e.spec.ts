import { expect, test } from '@playwright/test'

test('anonymous REST requests cannot create public-write collections', async ({ request }) => {
  const attempts = [
    { collection: 'inquiries', data: { name: 'Uji akses', message: 'Permintaan uji akses anonim.' } },
    { collection: 'quote-requests', data: { selection: [], priceMin: 0, priceMax: 0 } },
    { collection: 'consultation-bookings', data: { name: 'Uji akses', slotStart: '2027-01-10T02:00:00.000Z' } },
  ]

  for (const { collection, data } of attempts) {
    const response = await request.post(`http://localhost:3000/api/${collection}`, {
      data,
      headers: { Origin: 'http://localhost:3000' },
    })
    expect(response.status(), `anonymous POST /api/${collection} must be denied`).toBe(403)
  }
})
