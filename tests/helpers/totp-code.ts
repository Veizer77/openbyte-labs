import { createHmac } from 'node:crypto'

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Mengodekan string base32 (RFC 4648, tanpa padding) menjadi bytes.
 */
export function base32Decode(input: string): Buffer {
  const cleaned = input.toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '')
  const bytes: number[] = []
  let bitBuffer = 0
  let bitCount = 0
  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char)
    if (index === -1) {
      throw new Error(`Invalid base32 character: ${char}`)
    }
    bitBuffer = (bitBuffer << 5) | index
    bitCount += 5
    if (bitCount >= 8) {
      bytes.push((bitBuffer >>> (bitCount - 8)) & 0xff)
      bitCount -= 8
    }
  }
  return Buffer.from(bytes)
}

type TotpCodeOptions = {
  /** Waktu acuan dalam milidetik; default waktu sekarang. */
  atMs?: number
  /** Panjang langkah waktu dalam detik; default 30 (cocok plugin). */
  periodSeconds?: number
  /** Panjang kode; default 6 (cocok plugin). */
  digits?: number
}

/**
 * Menghitung kode TOTP (RFC 6238, SHA1) dari secret base32. Default
 * parameter mengikuti nilai bawaan payload-totp (SHA1, 6 digit, 30 detik)
 * sehingga kode ini sah untuk alur verifikasi nyata di tes E2E.
 */
export function totpCode(
  secretBase32: string,
  { atMs = Date.now(), periodSeconds = 30, digits = 6 }: TotpCodeOptions = {},
): string {
  const counter = Math.floor(atMs / 1000 / periodSeconds)
  const counterBuffer = Buffer.alloc(8)
  counterBuffer.writeBigUInt64BE(BigInt(counter))

  const hmac = createHmac('sha1', base32Decode(secretBase32)).update(counterBuffer).digest()
  const offset = hmac[hmac.length - 1] & 0x0f
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  return (binary % 10 ** digits).toString().padStart(digits, '0')
}
