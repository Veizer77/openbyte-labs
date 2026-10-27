process.env.PAYLOAD_SECRET ??= 'access-check-placeholder-secret-minimum-32-characters'
process.env.SITE_URL ??= 'http://localhost:3000'
process.env.DATABASE_URI ??= 'postgres://localhost/openbyte'
process.env.DATABASE_URI_DIRECT ??= 'postgres://localhost/openbyte'

const { default: configPromise } = await import('../src/payload.config.ts')
const config = await configPromise
const operations = ['read', 'create', 'update', 'delete']
const failures = []

for (const collection of config.collections ?? []) {
  for (const operation of operations) {
    if (typeof collection.access?.[operation] !== 'function') {
      failures.push(`${collection.slug}.${operation}`)
    }
  }
}

for (const global of config.globals ?? []) {
  for (const operation of ['read', 'update']) {
    if (typeof global.access?.[operation] !== 'function') {
      failures.push(`global:${global.slug}.${operation}`)
    }
  }
}

if (failures.length) {
  console.error(`Access check failed. Explicit access functions missing: ${failures.join(', ')}`)
  process.exitCode = 1
} else {
  const collectionCount = config.collections?.length ?? 0
  const globalCount = config.globals?.length ?? 0
  console.log(
    `Access check passed: ${collectionCount} collections and ${globalCount} globals have explicit access functions.`,
  )
}
