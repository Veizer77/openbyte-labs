import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.spec.ts', 'tests/int/**/*.spec.ts'],
    clearMocks: true,
    alias: {
      'server-only': path.resolve(__dirname, 'node_modules/server-only/empty.js'),
    },
  },
})
