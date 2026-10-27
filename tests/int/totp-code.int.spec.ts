import { describe, expect, it } from 'vitest'

import { base32Decode, totpCode } from '../../tests/helpers/totp-code'

// Secret RFC 6238 (bagian B): ASCII "12345678901234567890" dikodekan base32.
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'

describe('TOTP helper (RFC 6238, SHA1)', () => {
  it('menghasilkan vektor resmi RFC 6238 8 digit', () => {
    expect(totpCode(RFC_SECRET, { atMs: 59_000, digits: 8 })).toBe('94287082')
    expect(totpCode(RFC_SECRET, { atMs: 1_111_111_109_000, digits: 8 })).toBe('07081804')
    expect(totpCode(RFC_SECRET, { atMs: 1_234_567_890_000, digits: 8 })).toBe('89005924')
  })

  it('menghasilkan kode 6 digit dengan nol depan terjaga', () => {
    // Trunkasi 6 digit dari vektor 8 digit: 07081804 -> 081804.
    expect(totpCode(RFC_SECRET, { atMs: 1_111_111_109_000 })).toBe('081804')
  })

  it('memakai langkah waktu default 30 detik', () => {
    // Batas ambang: 59 detik masih langkah ke-1; 60 detik pindah langkah.
    expect(totpCode(RFC_SECRET, { atMs: 60_000 })).toBe(
      totpCode(RFC_SECRET, { atMs: 89_999 }),
    )
    expect(totpCode(RFC_SECRET, { atMs: 60_000 })).not.toBe(
      totpCode(RFC_SECRET, { atMs: 90_000 }),
    )
  })

  it('menolak karakter base32 yang tidak valid', () => {
    expect(() => base32Decode('JBSWY3DPEHPK3PX1')).toThrow(/base32/)
  })
})
