import { sql } from 'drizzle-orm'
import { getDatabase } from '../../../db'
import { checkHealth } from '../../../services/health'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return checkHealth(() => getDatabase().execute(sql`select 1`))
}
