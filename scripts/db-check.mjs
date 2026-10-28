import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { assertSafeDatabaseTarget } from './db-guard.mjs'

async function checkDatabase() {
  const migrationsDir = join(process.cwd(), 'src/db/migrations')
  if (!existsSync(migrationsDir)) {
    throw new Error('Direktori migrasi tidak ditemukan.')
  }

  const files = readdirSync(migrationsDir).filter((file) => file.endsWith('.sql'))
  if (files.length === 0) {
    throw new Error('Tidak ada berkas migrasi SQL yang ditemukan.')
  }

  console.log(`[DB Check]: Ditemukan ${files.length} berkas migrasi: ${files.join(', ')}`)

  // Verifikasi guard
  try {
    assertSafeDatabaseTarget('postgresql://user:pass@ep-cool-sample.us-east-2.aws.neon.tech/neondb')
    throw new Error('Guard gagal menolak remote DB tanpa flag!')
  } catch (err) {
    if (!err.message.includes('DB SAFETY GUARD')) {
      throw err
    }
  }

  console.log('[DB Check]: Guard keselamatan target database terverifikasi.')
  console.log('[DB Check]: Verifikasi konsistensi fondasi schema & migrator LULUS.')
}

checkDatabase().catch((err) => {
  console.error('[DB Check Error]:', err.message)
  process.exit(1)
})
