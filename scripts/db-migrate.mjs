import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'
import { assertSafeDatabaseTarget } from './db-guard.mjs'

const { Client } = pg

async function runMigration() {
  const connectionString = process.env.DATABASE_URI_DIRECT || process.env.DATABASE_URI
  assertSafeDatabaseTarget(connectionString)

  const client = new Client({ connectionString })
  await client.connect()

  try {
    const db = drizzle(client)
    console.log('[DB Migrate]: Menjalankan migrasi SQL dari ./src/db/migrations ...')
    await migrate(db, { migrationsFolder: './src/db/migrations' })
    console.log('[DB Migrate]: Migrasi selesai dengan sukses.')
  } finally {
    await client.end()
  }
}

runMigration().catch((err) => {
  console.error('[DB Migrate Error]:', err.message)
  process.exit(1)
})
