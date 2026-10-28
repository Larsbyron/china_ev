import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Mirror the tsconfig `@/*` -> ./src/* path mapping. Vite does not read
    // tsconfig paths, so any tested module that value-imports via '@/' (e.g.
    // src/lib/articles.ts -> '@/lib/schemas') needs this alias.
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  test: {
    environment: 'node',
    // Collect tests anywhere under src/ (lib unit tests + app-router route
    // handler tests). Default excludes keep node_modules and .next out.
    include: ['src/**/*.test.ts'],
  },
})
