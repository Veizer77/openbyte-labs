import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const manifest = JSON.parse(await readFile('package.json', 'utf8'))
const forbidden = /^(?:@vercel\/|@payloadcms\/|payload$|payload-totp$)/
const failures = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })
  .filter((name) => forbidden.test(name))

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await inspect(file)
    } else if (/\.(?:ts|tsx|js|jsx|mjs|mts)$/.test(entry.name)) {
      const content = await readFile(file, 'utf8')
      if (/["'](?:@vercel\/|@payloadcms\/|payload(?:-totp)?["'])/.test(content)) failures.push(file)
    }
  }
}

await inspect('src')
const nextConfig = await readFile('next.config.ts', 'utf8')
if (/withPayload|@payloadcms\//.test(nextConfig)) failures.push('next.config.ts')
if (failures.length) {
  console.error(`Portabilitas gagal: ${failures.join(', ')}`)
  process.exitCode = 1
} else {
  console.log('Portabilitas lulus: tidak ada dependency/import CMS lama atau @vercel di aplikasi.')
}
