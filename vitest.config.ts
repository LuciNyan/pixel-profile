import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 40 * 1000,
    maxConcurrency: 3
  }
})
