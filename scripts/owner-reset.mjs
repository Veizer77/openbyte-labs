import 'dotenv/config'
import { getPayload } from 'payload'

if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
  throw new Error('Perintah ini memerlukan terminal interaktif agar kata sandi tidak ditampilkan.')
}

async function askLine(prompt) {
  const readline = await import('node:readline/promises')
  const terminal = readline.createInterface({ input: process.stdin, output: process.stdout })
  try {
    return (await terminal.question(prompt)).trim()
  } finally {
    terminal.close()
  }
}

function askSecret(prompt) {
  return new Promise((resolve, reject) => {
    let value = ''
    const stdin = process.stdin
    const wasRaw = stdin.isRaw
    process.stdout.write(prompt)
    stdin.setRawMode(true)
    stdin.resume()

    const cleanup = () => {
      stdin.off('data', onData)
      stdin.setRawMode(wasRaw ?? false)
      process.stdout.write('\n')
    }

    const onData = (chunk) => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') {
          cleanup()
          reject(new Error('Reset sandi owner dibatalkan.'))
          return
        }
        if (character === '\r' || character === '\n') {
          cleanup()
          resolve(value)
          return
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1)
        } else if (character >= ' ') {
          value += character
        }
      }
    }

    stdin.on('data', onData)
  })
}

const email = await askLine('Email akun owner: ')
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Alamat email tidak valid.')

const password = await askSecret('Kata sandi baru (min. 16 karakter): ')
const confirmation = await askSecret('Ulangi kata sandi: ')
if (password !== confirmation) throw new Error('Konfirmasi kata sandi tidak cocok.')
if (
  password.length < 16 ||
  !/[a-z]/.test(password) ||
  !/[A-Z]/.test(password) ||
  !/\d/.test(password) ||
  !/[^A-Za-z\d]/.test(password)
) {
  throw new Error('Kata sandi perlu 16 karakter serta huruf kecil, huruf besar, angka, dan simbol.')
}

const reset2FA = (await askLine('Atur ulang (reset) 2FA TOTP akun ini? (y/N): ')).toLowerCase() === 'y'

const { default: configPromise, databaseAdapterArgs } = await import('../src/payload.config.ts')
const payload = await getPayload({ config: await configPromise })

try {
  const uri = new URL(databaseAdapterArgs().pool.connectionString)
  console.log(`Target database: ${uri.hostname}/${uri.pathname.replace(/^\//, '')}`)
} catch {
  console.log('Target database: (tidak dapat diuraikan)')
}

try {
  const users = await payload.find({
    collection: 'users',
    where: { email: { equals: email.toLowerCase() } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const user = users.docs[0]
  if (!user) {
    throw new Error('Pengguna dengan email tersebut tidak ditemukan.')
  }
  if (!user.roles?.includes('owner')) {
    throw new Error('Pengguna bukan owner. Skrip ini hanya untuk pemulihan akun owner.')
  }

  const updateData = { password }
  if (reset2FA) {
    updateData.totpSecret = null
  }

  await payload.update({
    collection: 'users',
    id: user.id,
    data: updateData,
    overrideAccess: true,
  })

  console.log(`Kata sandi akun owner (${email}) berhasil diperbarui.${reset2FA ? ' 2FA TOTP telah diatur ulang.' : ''}`)
  process.exit(0)
} catch (error) {
  console.error('Gagal mengatur ulang kata sandi owner:', error.message)
  process.exit(1)
}
