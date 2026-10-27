import { describe, expect, it, vi } from 'vitest'
import { Dashboard } from '../../src/components/admin/Dashboard'

describe('F2-02: Admin Dashboard and Perlu Tindakan Panel', () => {
  it('returns null for non-staff or unauthenticated users', async () => {
    const resultAnon = await Dashboard({ user: null })
    expect(resultAnon).toBeNull()

    const resultClient = await Dashboard({ user: { id: 'c1', roles: ['client'] } as never })
    expect(resultClient).toBeNull()
  })

  it('renders content-only dashboard for editor without operational queries', async () => {
    const countMock = vi.fn().mockResolvedValue({ totalDocs: 4 })
    const findMock = vi.fn()

    const mockPayload = {
      count: countMock,
      find: findMock,
    } as never

    const result = await Dashboard({
      payload: mockPayload,
      user: { id: 'ed1', roles: ['editor'] } as never,
    })

    expect(result).not.toBeNull()
    // Count should ONLY be called once (for published projects)
    expect(countMock).toHaveBeenCalledTimes(1)
    expect(countMock).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'projects',
      }),
    )
    // find should NOT be called at all for editor (no operational/client data)
    expect(findMock).not.toHaveBeenCalled()
  })

  it('queries all operational metrics and pending action items for owner', async () => {
    const countMock = vi.fn().mockImplementation(({ collection }) => {
      if (collection === 'projects') return Promise.resolve({ totalDocs: 6 })
      if (collection === 'consultation-bookings') return Promise.resolve({ totalDocs: 3 })
      if (collection === 'inquiries') return Promise.resolve({ totalDocs: 2 })
      if (collection === 'quote-requests') return Promise.resolve({ totalDocs: 1 })
      return Promise.resolve({ totalDocs: 0 })
    })

    const findMock = vi.fn().mockImplementation(({ collection, where }) => {
      if (collection === 'consultation-bookings' && where?.status?.equals === 'pending') {
        return Promise.resolve({
          docs: [
            {
              id: 1,
              reference: 'BKG-20261027-0001',
              name: 'Klien A',
              slotStart: '2026-10-28T03:00:00.000Z',
              createdAt: '2026-10-27T10:00:00.000Z',
            },
          ],
        })
      }
      return Promise.resolve({ docs: [] })
    })

    const mockPayload = {
      count: countMock,
      find: findMock,
    } as never

    const result = await Dashboard({
      payload: mockPayload,
      user: { id: 'ow1', roles: ['owner'] } as never,
    })

    expect(result).not.toBeNull()
    // Owner calls count for projects, bookingsMonth, inquiries, quotes
    expect(countMock).toHaveBeenCalledWith(expect.objectContaining({ collection: 'consultation-bookings' }))
    expect(countMock).toHaveBeenCalledWith(expect.objectContaining({ collection: 'inquiries' }))
    expect(countMock).toHaveBeenCalledWith(expect.objectContaining({ collection: 'quote-requests' }))
    // Owner calls find for pending bookings, new inquiries, new quotes, and recent lists
    expect(findMock).toHaveBeenCalledWith(expect.objectContaining({ collection: 'consultation-bookings' }))
  })
})
