import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
}
const forbiddenPackages = Object.keys(dependencies).filter((name) => name.startsWith('@vercel/'))
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mts', '.mjs'])
const sourceFiles = await findSourceFiles(path.join(root, 'src'))
const forbiddenImports = []

for (const filePath of sourceFiles) {
  const content = await readFile(filePath, 'utf8')
  if (content.includes("'@vercel/") || content.includes('"@vercel/')) {
    forbiddenImports.push(path.relative(root, filePath))
  }
}

if (forbiddenPackages.length || forbiddenImports.length) {
  console.error('Portability check failed.')
  if (forbiddenPackages.length) console.error(`Forbidden dependencies: ${forbiddenPackages.join(', ')}`)
  if (forbiddenImports.length) console.error(`Forbidden imports: ${forbiddenImports.join(', ')}`)
  process.exitCode = 1
} else {
  console.log('Portability check passed: no @vercel packages or imports found.')
}

async function findSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return findSourceFiles(entryPath)
      return sourceExtensions.has(path.extname(entry.name)) ? [entryPath] : []
    }),
  )

  return files.flat()
}
