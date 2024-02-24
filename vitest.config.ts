import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 10 * 1000,
    maxConcurrency: 3
  }
})
