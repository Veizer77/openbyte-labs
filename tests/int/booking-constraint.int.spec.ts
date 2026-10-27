import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it, beforeAll } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { canRunDatabaseTests } from '../helpers/db-target'
import type { PostgresQueryClient } from '../../src/server/security/postgres-rate-limit'

const hasDisposableDb = await canRunDatabaseTests()

describe('Consultation booking exclusion constraint (G.7)', () => {
  it('verifies constraint definition in migration SQL', () => {
    const migrationFile = path.resolve(
      process.cwd(),
      'src/migrations/20261027_072333_phase1_release1.ts',
    )
    const content = readFileSync(migrationFile, 'utf-8')

    expect(content).toContain('consultation_bookings_no_overlap')
    expect(content).toContain('EXCLUDE USING gist (tstzrange("slot_start", "slot_end") WITH &&)')
    expect(content).toContain('WHERE ("status" IN (\'pending\', \'confirmed\'))')
  })

  describe.skipIf(!hasDisposableDb)('Live database verification (7 G.7 scenarios)', () => {
    let payload: Payload

    beforeAll(async () => {
      payload = await getPayload({ config: await config })
    }, 30000)

    function isExclusionViolation(err: unknown): boolean {
      if (!err || typeof err !== 'object') return false
      const errorStr = JSON.stringify(err) + String((err as Error).message || '')
      const code = (err as { code?: string; cause?: { code?: string } }).code ||
        (err as { cause?: { code?: string } }).cause?.code
      return code === '23P01' || errorStr.includes('23P01') || errorStr.includes('consultation_bookings_no_overlap')
    }

    it('Scenario 1: creates booking in slot 09:00-10:00', async () => {
      const doc = await payload.create({
        collection: 'consultation-bookings',
        data: {
          name: 'Klien G7 1',
          whatsapp: '081234567890',
          serviceInterest: 'Sistem Informasi',
          consultationMode: 'google_meet',
          slotStart: '2027-01-10T02:00:00.000Z', // 09:00 WIB
          slotEnd: '2027-01-10T03:00:00.000Z', // 10:00 WIB
          consentAt: new Date().toISOString(),
          status: 'pending',
        } as never,
        overrideAccess: true,
      })
      expect(doc.id).toBeDefined()
    })

    it('Scenario 2: rejects exact duplicate slot with 23P01', async () => {
      let failed = false
      try {
        await payload.create({
          collection: 'consultation-bookings',
          data: {
            name: 'Klien G7 2',
            whatsapp: '081234567891',
            serviceInterest: 'Sistem Informasi',
            consultationMode: 'google_meet',
            slotStart: '2027-01-10T02:00:00.000Z',
            slotEnd: '2027-01-10T03:00:00.000Z',
            consentAt: new Date().toISOString(),
            status: 'pending',
          } as never,
          overrideAccess: true,
        })
      } catch (err) {
        failed = true
        expect(isExclusionViolation(err), `Expected exclusion violation 23P01, got: ${err}`).toBe(true)
      }
      expect(failed).toBe(true)
    })

    it('Scenario 3: rejects overlapping slot 09:30-10:30 with 23P01', async () => {
      let failed = false
      try {
        await payload.create({
          collection: 'consultation-bookings',
          data: {
            name: 'Klien G7 3',
            whatsapp: '081234567892',
            serviceInterest: 'Sistem Informasi',
            consultationMode: 'google_meet',
            slotStart: '2027-01-10T02:30:00.000Z', // 09:30 WIB
            slotEnd: '2027-01-10T03:30:00.000Z', // 10:30 WIB
            consentAt: new Date().toISOString(),
            status: 'pending',
          } as never,
          overrideAccess: true,
        })
      } catch (err) {
        failed = true
        expect(isExclusionViolation(err)).toBe(true)
      }
      expect(failed).toBe(true)
    })

    it('Scenario 4: permits adjacent slot 10:00-11:00 (half-open interval)', async () => {
      const doc = await payload.create({
        collection: 'consultation-bookings',
        data: {
          name: 'Klien G7 4',
          whatsapp: '081234567893',
          serviceInterest: 'Sistem Informasi',
          consultationMode: 'google_meet',
          slotStart: '2027-01-10T03:00:00.000Z', // 10:00 WIB
          slotEnd: '2027-01-10T04:00:00.000Z', // 11:00 WIB
          consentAt: new Date().toISOString(),
          status: 'pending',
        } as never,
        overrideAccess: true,
      })
      expect(doc.id).toBeDefined()
    })

    it('Scenario 5: permits cancelled booking in the same slot', async () => {
      const doc = await payload.create({
        collection: 'consultation-bookings',
        data: {
          name: 'Klien G7 5',
          whatsapp: '081234567894',
          serviceInterest: 'Sistem Informasi',
          consultationMode: 'google_meet',
          slotStart: '2027-01-10T02:00:00.000Z',
          slotEnd: '2027-01-10T03:00:00.000Z',
          consentAt: new Date().toISOString(),
          status: 'cancelled',
        } as never,
        overrideAccess: true,
      })
      expect(doc.id).toBeDefined()
    })

    it('Scenario 6: permits re-booking when existing booking is cancelled', async () => {
      // First create active booking for slot 14:00-15:00
      const active = await payload.create({
        collection: 'consultation-bookings',
        data: {
          name: 'Klien G7 6A',
          whatsapp: '081234567895',
          serviceInterest: 'Sistem Informasi',
          consultationMode: 'google_meet',
          slotStart: '2027-01-10T07:00:00.000Z', // 14:00 WIB
          slotEnd: '2027-01-10T08:00:00.000Z', // 15:00 WIB
          consentAt: new Date().toISOString(),
          status: 'pending',
        } as never,
        overrideAccess: true,
      })

      // Cancel it
      await payload.update({
        collection: 'consultation-bookings',
        id: active.id,
        data: { status: 'cancelled' },
        overrideAccess: true,
      })

      // Re-book same slot
      const rebooked = await payload.create({
        collection: 'consultation-bookings',
        data: {
          name: 'Klien G7 6B',
          whatsapp: '081234567896',
          serviceInterest: 'Sistem Informasi',
          consultationMode: 'google_meet',
          slotStart: '2027-01-10T07:00:00.000Z',
          slotEnd: '2027-01-10T08:00:00.000Z',
          consentAt: new Date().toISOString(),
          status: 'confirmed',
        } as never,
        overrideAccess: true,
      })
      expect(rebooked.id).toBeDefined()
    })

    it('Scenario 7: 12 concurrent requests result in exactly 1 success and 11 rejections', async () => {
      const database = payload.db as unknown as { drizzle: { $client: PostgresQueryClient } }
      const client = database.drizzle.$client
      const referencePrefix = `BKG-TEST-${randomUUID()}`

      try {
        const results = await Promise.allSettled(
          Array.from({ length: 12 }, (_, i) => client.query(
            `INSERT INTO "consultation_bookings"
              ("reference", "name", "whatsapp", "service_interest", "slot_start", "slot_end", "consultation_mode", "status", "consent_at")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              `${referencePrefix}-${i}`,
              `Concurrent ${i + 1}`,
              '081234567899',
              'Sistem Informasi',
              '2027-01-10T04:00:00.000Z', // 11:00 WIB
              '2027-01-10T05:00:00.000Z', // 12:00 WIB
              'google_meet',
              'pending',
              new Date().toISOString(),
            ],
          )),
        )

        const successes = results.filter((result) => result.status === 'fulfilled')
        const rejections = results.filter((result) => result.status === 'rejected')

        expect(successes).toHaveLength(1)
        expect(rejections).toHaveLength(11)

        for (const rejection of rejections) {
          if (rejection.status === 'rejected') {
            expect(isExclusionViolation(rejection.reason)).toBe(true)
          }
        }

        const count = await client.query(
          'SELECT count(*) AS count FROM "consultation_bookings" WHERE "reference" LIKE $1',
          [`${referencePrefix}-%`],
        )
        expect(Number(count.rows[0]?.count)).toBe(1)
      } finally {
        await client.query(
          'DELETE FROM "consultation_bookings" WHERE "reference" LIKE $1',
          [`${referencePrefix}-%`],
        )
      }
    }, 15000)
  })
})
