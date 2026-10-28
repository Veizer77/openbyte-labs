export interface LockoutRecord {
  attempts: number
  firstAttemptAt: number
  lastAttemptAt: number
  lockedUntil?: number
}

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 menit

class LockoutManager {
  private records = new Map<string, LockoutRecord>()

  /**
   * Periksa apakah identifier (email/username/IP) sedang dalam status terkunci.
   */
  isLocked(identifier: string): { isLocked: boolean; remainingSeconds?: number } {
    const record = this.records.get(identifier)
    if (!record || !record.lockedUntil) {
      return { isLocked: false }
    }

    const now = Date.now()
    if (now >= record.lockedUntil) {
      // Masa lockout selesai, reset
      this.records.delete(identifier)
      return { isLocked: false }
    }

    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000)
    return { isLocked: true, remainingSeconds }
  }

  /**
   * Catat kegagalan login atau TOTP.
   * Mengunci akun jika mencapai 5 kegagalan dalam 15 menit.
   */
  recordFailure(identifier: string): { isLocked: boolean; attempts: number; remainingSeconds?: number } {
    const now = Date.now()
    let record = this.records.get(identifier)

    if (!record || now - record.firstAttemptAt > WINDOW_MS) {
      record = {
        attempts: 1,
        firstAttemptAt: now,
        lastAttemptAt: now,
      }
      this.records.set(identifier, record)
      return { isLocked: false, attempts: 1 }
    }

    record.attempts += 1
    record.lastAttemptAt = now

    if (record.attempts >= MAX_ATTEMPTS) {
      record.lockedUntil = now + WINDOW_MS
      const remainingSeconds = Math.ceil(WINDOW_MS / 1000)
      return { isLocked: true, attempts: record.attempts, remainingSeconds }
    }

    return { isLocked: false, attempts: record.attempts }
  }

  /**
   * Reset pencatatan kegagalan setelah login/TOTP berhasil.
   */
  reset(identifier: string): void {
    this.records.delete(identifier)
  }

  /**
   * Helper untuk membersihkan state (pengujian).
   */
  clear(): void {
    this.records.clear()
  }
}

export const lockoutManager = new LockoutManager()
