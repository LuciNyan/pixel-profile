import { crt, curve, pixelate } from './packages/pixel-profile/src/shaders/index.ts'
import { glow } from './packages/pixel-profile/src/shaders/glow.ts'
import { scanline } from './packages/pixel-profile/src/shaders/scanline.ts'
import { orderedBayer } from './packages/pixel-profile/src/shaders/dithering.ts'
import { executePipelineSmart, buildStatsPipeline, buildCrtPipeline } from './packages/pixel-profile/src/pipeline.ts'
import { dispatchCrt, dispatchGlow, dispatchCurve, shutdownPool } from './packages/pixel-profile/src/workers/pool.ts'

const W = 1226, H = 430
const size = W * H * 4
const pixels = Buffer.alloc(size)

// Simulate realistic pixel data (dark background + bright text areas)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4
    const isBright = (x > 100 && x < 400 && y > 50 && y < 200) ||
                     (x > 500 && x < 900 && y > 100 && y < 300)
    if (isBright) {
      pixels[idx] = 200 + Math.random() * 55 | 0
      pixels[idx+1] = 200 + Math.random() * 55 | 0
      pixels[idx+2] = 200 + Math.random() * 55 | 0
    } else {
      pixels[idx] = Math.random() * 30 | 0
      pixels[idx+1] = Math.random() * 30 | 0
      pixels[idx+2] = Math.random() * 30 | 0
    }
    pixels[idx+3] = 255
  }
}

function bench(name, fn, iterations = 5) {
  // Warmup
  fn()
  const times = []
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    fn()
    times.push(performance.now() - start)
  }
  times.sort((a, b) => a - b)
  const median = times[Math.floor(times.length / 2)]
  const min = times[0]
  const max = times[times.length - 1]
  console.log(`${name.padEnd(35)} median=${median.toFixed(1)}ms  min=${min.toFixed(1)}ms  max=${max.toFixed(1)}ms`)
}

async function benchAsync(name, fn, iterations = 5) {
  await fn()
  const times = []
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await fn()
    times.push(performance.now() - start)
  }
  times.sort((a, b) => a - b)
  const median = times[Math.floor(times.length / 2)]
  const min = times[0]
  const max = times[times.length - 1]
  console.log(`${name.padEnd(35)} median=${median.toFixed(1)}ms  min=${min.toFixed(1)}ms  max=${max.toFixed(1)}ms`)
}

console.log(`\nBenchmark: ${W}x${H} (${(size/1024/1024).toFixed(1)}MB)\n`)
console.log('=== Individual Shaders (sync) ===')

bench('crt (sync)', () => crt(pixels, W, H))
bench('glow r3 l2 (sync)', () => glow(pixels, W, H, { radius: 3, intensity: 0.3, color: [1,1,1], layers: 2, falloff: 'exponential' }))
bench('glow r5 l5 (sync)', () => glow(pixels, W, H, { radius: 5, intensity: 0.17, color: [1,1,1], layers: 5, falloff: 'exponential' }))
bench('curve (sync)', () => curve(pixels, W, H))
bench('pixelate center', () => pixelate(pixels, W, H, { blockSize: 4, samplingMode: 'center' }))
bench('pixelate dominant', () => pixelate(pixels, W, H, { blockSize: 4, samplingMode: 'dominant' }))
bench('scanline', () => scanline(pixels, W, H))
bench('orderedBayer', () => orderedBayer(pixels, W, H))

console.log('\n=== Worker Parallel Shaders ===')
await benchAsync('crt (parallel)', () => dispatchCrt(pixels, W, H, {}))
await benchAsync('glow r3 l2 (parallel)', () => dispatchGlow(pixels, W, H, { radius: 3, intensity: 0.3, color: [1,1,1], layers: 2, falloff: 'exponential' }))
await benchAsync('glow r5 l5 (parallel)', () => dispatchGlow(pixels, W, H, { radius: 5, intensity: 0.17, color: [1,1,1], layers: 5, falloff: 'exponential' }))
await benchAsync('curve (parallel)', () => dispatchCurve(pixels, W, H))

console.log('\n=== Full Pipelines (async/smart) ===')
const screenPipeline = buildStatsPipeline({ theme: 'default', screenEffect: true, isFastMode: false, dithering: false })
await benchAsync('screen effect pipeline', () => executePipelineSmart(pixels, W, H, screenPipeline))

const crtPipeline = buildCrtPipeline()
await benchAsync('CRT pipeline (l1)', () => executePipelineSmart(pixels, W, H, crtPipeline))

const crtThemePipeline = buildStatsPipeline({ theme: 'crt', screenEffect: false, isFastMode: false, dithering: false })
await benchAsync('CRT theme pipeline (l5)', () => executePipelineSmart(pixels, W, H, crtThemePipeline))

shutdownPool()
console.log('\nDone.')
