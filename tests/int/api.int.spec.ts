import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'
import { canRunDatabaseTests } from '../helpers/db-target'

const hasDisposableDb = await canRunDatabaseTests()

describe.skipIf(!hasDisposableDb)('API', () => {
  let payload: Payload

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  }, 30000)

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})
