import { eq } from 'drizzle-orm'
import { getDatabase } from '../db'
import { users } from '../db/schema/domain'
import type { Actor, Role } from '../access/types'
import { getAuth } from './better-auth'

/**
 * Mengambil aktor dari request / headers sesi Better Auth.
 * Menegakkan kewajiban TOTP untuk kedua role (owner & editor).
 */
export async function getActorFromRequest(req: Request | Headers): Promise<Actor> {
  const auth = getAuth()
  const headers = req instanceof Request ? req.headers : req

  try {
    const sessionData = await auth.api.getSession({
      headers,
    })

    if (!sessionData || !sessionData.user) {
      return { type: 'anonymous' }
    }

    const authUser = sessionData.user

    // TOTP Wajib: jika user belum mengaktifkan 2FA, sesi dianggap password_only
    if (!authUser.twoFactorEnabled) {
      return {
        type: 'password_only',
        userId: authUser.id,
        email: authUser.email,
      }
    }

    // Ambil profil domain admin
    const db = getDatabase()
    const [domainUser] = await db
      .select()
      .from(users)
      .where(eq(users.authUserId, authUser.id))
      .limit(1)

    if (!domainUser) {
      // Tidak terdaftar sebagai admin di domain users
      return { type: 'anonymous' }
    }

    return {
      type: 'authenticated',
      userId: domainUser.id,
      email: domainUser.email,
      role: domainUser.role as Role,
    }
  } catch {
    return { type: 'anonymous' }
  }
}
