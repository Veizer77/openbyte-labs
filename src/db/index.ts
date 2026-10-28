import 'server-only'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { getEnvironment } from '../lib/env'

let connection: ReturnType<typeof createDatabase> | undefined

function createDatabase() {
  const pool = new Pool({
    connectionString: getEnvironment().DATABASE_URI,
    max: 3,
    connectionTimeoutMillis: 2000,
    idleTimeoutMillis: 10_000,
    statement_timeout: 2000,
    allowExitOnIdle: true,
  })
  return drizzle(pool)
}

/** Koneksi lazy: import/build tidak membuka koneksi atau menjalankan DDL. */
export function getDatabase() {
  connection ??= createDatabase()
  return connection
}
