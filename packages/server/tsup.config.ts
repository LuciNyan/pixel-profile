import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  target: 'node16',
  dts: false,
  minify: process.env.NODE_ENV !== 'development',
  format: ['esm'],
  esbuildOptions(options) {
    options.tsconfig = 'tsconfig.json'
    options.legalComments = 'external'
  }
})
