import { executePipelineAsync, executePipelineSmart, type Pipeline } from '../pipeline'
import { compositeGlowFromPrecomputed, precomputeGlowLayers } from '../workers/pool'
import { encodeGif, type GifFrame } from './gif-encoder'

export type AnimationOptions = {
  frameCount?: number
  frameDelay?: number
  effect?: 'crt-flicker' | 'glow-pulse' | 'scanline-scroll'
}

const defaultAnimationOptions: Required<AnimationOptions> = {
  frameCount: 8,
  frameDelay: 100,
  effect: 'glow-pulse'
}

/**
 * Build a set of pipelines that vary per frame to create animation.
 */
function buildAnimatedPipelines(effect: string, frameCount: number, basePipeline: Pipeline): Pipeline[] {
  const pipelines: Pipeline[] = []

  for (let i = 0; i < frameCount; i++) {
    const t = i / frameCount

    switch (effect) {
      case 'crt-flicker': {
        const noiseIntensity = 0.03 + 0.04 * Math.sin(t * Math.PI * 2)
        const scanLineStrength = 0.1 + 0.1 * Math.sin(t * Math.PI * 2 + 1)
        const pipeline: Pipeline = basePipeline.map((pass) => {
          if (pass.name === 'crt') {
            return {
              ...pass,
              options: {
                ...pass.options,
                noiseIntensity,
                scanLineStrength
              }
            }
          }

          return pass
        })
        pipelines.push(pipeline)
        break
      }

      case 'glow-pulse': {
        const intensity = 0.1 + 0.15 * Math.sin(t * Math.PI * 2)
        const pipeline: Pipeline = basePipeline.map((pass) => {
          if (pass.name === 'glow') {
            return {
              ...pass,
              options: {
                ...pass.options,
                intensity
              }
            }
          }

          return pass
        })
        pipelines.push(pipeline)
        break
      }

      case 'scanline-scroll': {
        const pipeline: Pipeline = []
        for (const pass of basePipeline) {
          pipeline.push(pass)
        }
        const scrollOffset = Math.floor(t * 6)
        pipeline.push({
          name: 'scanline-animated',
          shader: (source: Buffer, width: number, height: number) => {
            return scanlineWithOffset(source, width, height, scrollOffset)
          }
        })
        pipelines.push(pipeline)
        break
      }

      default:
        pipelines.push(basePipeline)
    }
  }

  return pipelines
}

function scanlineWithOffset(source: Buffer, width: number, height: number, offset: number): Buffer {
  const target = Buffer.allocUnsafe(width * height * 4)
  const thickness = 3
  const brightness = 0.85
  const rowBytes = width * 4

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes
    if ((y + offset) % thickness === 0) {
      for (let x = 0; x < width; x++) {
        const idx = rowOffset + x * 4
        target[idx] = source[idx] * brightness
        target[idx + 1] = source[idx + 1] * brightness
        target[idx + 2] = source[idx + 2] * brightness
        target[idx + 3] = source[idx + 3]
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      source.copy(target as any, rowOffset, rowOffset, rowOffset + rowBytes)
    }
  }

  return target
}

/**
 * Render an animated GIF from base pixels and a shader pipeline.
 */
export async function renderAnimatedGif(
  basePixels: Buffer,
  width: number,
  height: number,
  basePipeline: Pipeline,
  userOptions: AnimationOptions = {}
): Promise<Buffer> {
  const options = { ...defaultAnimationOptions, ...userOptions }
  const { frameCount, frameDelay, effect } = options

  if (effect === 'glow-pulse') {
    return renderGlowPulseOptimized(basePixels, width, height, basePipeline, frameCount, frameDelay)
  }
  if (effect === 'scanline-scroll') {
    return renderScanlineScrollOptimized(basePixels, width, height, basePipeline, frameCount, frameDelay)
  }
  if (effect === 'crt-flicker') {
    return renderCrtFlickerOptimized(basePixels, width, height, basePipeline, frameCount, frameDelay)
  }

  const animatedPipelines = buildAnimatedPipelines(effect, frameCount, basePipeline)

  const frames: GifFrame[] = []
  for (const pipeline of animatedPipelines) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pixels = await executePipelineSmart(Buffer.from(basePixels as any), width, height, pipeline)
    frames.push({ pixels, delay: frameDelay })
  }

  return encodeGif(frames, width, height)
}

async function renderGlowPulseOptimized(
  basePixels: Buffer,
  width: number,
  height: number,
  basePipeline: Pipeline,
  frameCount: number,
  frameDelay: number
): Promise<Buffer> {
  const preGlowPipeline = basePipeline.filter((p) => p.name !== 'glow')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preGlowPixels = await executePipelineAsync(Buffer.from(basePixels as any), width, height, preGlowPipeline)

  const glowPass = basePipeline.find((p) => p.name === 'glow')
  if (!glowPass) {
    const frames: GifFrame[] = []
    for (let i = 0; i < frameCount; i++) {
      frames.push({ pixels: preGlowPixels, delay: frameDelay })
    }

    return encodeGif(frames, width, height)
  }

  const precomputed = await precomputeGlowLayers(preGlowPixels, width, height, glowPass.options || {})
  if (!precomputed) {
    const animatedPipelines = buildAnimatedPipelines('glow-pulse', frameCount, basePipeline)
    const frames: GifFrame[] = []
    for (const pipeline of animatedPipelines) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pixels = await executePipelineSmart(Buffer.from(basePixels as any), width, height, pipeline)
      frames.push({ pixels, delay: frameDelay })
    }

    return encodeGif(frames, width, height)
  }

  const color: [number, number, number] = glowPass.options?.color ?? [1, 1, 1]
  const frames: GifFrame[] = []
  for (let i = 0; i < frameCount; i++) {
    const t = i / frameCount
    const intensity = 0.1 + 0.15 * Math.sin(t * Math.PI * 2)
    const pixels = await compositeGlowFromPrecomputed(precomputed, intensity, color)
    frames.push({ pixels, delay: frameDelay })
  }

  return encodeGif(frames, width, height)
}

async function renderScanlineScrollOptimized(
  basePixels: Buffer,
  width: number,
  height: number,
  basePipeline: Pipeline,
  frameCount: number,
  frameDelay: number
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processed = await executePipelineSmart(Buffer.from(basePixels as any), width, height, basePipeline)

  const frames: GifFrame[] = []
  for (let i = 0; i < frameCount; i++) {
    const t = i / frameCount
    const scrollOffset = Math.floor(t * 6)
    frames.push({ pixels: scanlineWithOffset(processed, width, height, scrollOffset), delay: frameDelay })
  }

  return encodeGif(frames, width, height)
}

async function renderCrtFlickerOptimized(
  basePixels: Buffer,
  width: number,
  height: number,
  basePipeline: Pipeline,
  frameCount: number,
  frameDelay: number
): Promise<Buffer> {
  const crtPass = basePipeline.find((p) => p.name === 'crt')
  const glowPass = basePipeline.find((p) => p.name === 'glow')
  const nonGlowPipeline = basePipeline.filter((p) => p.name !== 'glow')

  if (!crtPass || !glowPass) {
    const animatedPipelines = buildAnimatedPipelines('crt-flicker', frameCount, basePipeline)
    const frames: GifFrame[] = []
    for (const pipeline of animatedPipelines) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pixels = await executePipelineSmart(Buffer.from(basePixels as any), width, height, pipeline)
      frames.push({ pixels, delay: frameDelay })
    }

    return encodeGif(frames, width, height)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseCrt = await executePipelineSmart(Buffer.from(basePixels as any), width, height, nonGlowPipeline)
  const precomputed = await precomputeGlowLayers(baseCrt, width, height, glowPass.options || {})

  if (!precomputed) {
    const animatedPipelines = buildAnimatedPipelines('crt-flicker', frameCount, basePipeline)
    const frames: GifFrame[] = []
    for (const pipeline of animatedPipelines) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pixels = await executePipelineSmart(Buffer.from(basePixels as any), width, height, pipeline)
      frames.push({ pixels, delay: frameDelay })
    }

    return encodeGif(frames, width, height)
  }

  const color: [number, number, number] = glowPass.options?.color ?? [1, 1, 1]
  const intensity = glowPass.options?.intensity ?? 0.17
  const glowOnBase = await compositeGlowFromPrecomputed(precomputed, intensity, color)
  const byteLen = width * height * 4

  const frames: GifFrame[] = []
  for (let i = 0; i < frameCount; i++) {
    const t = i / frameCount
    const noiseIntensity = 0.03 + 0.04 * Math.sin(t * Math.PI * 2)
    const scanLineStrength = 0.1 + 0.1 * Math.sin(t * Math.PI * 2 + 1)

    const frameCrtPipeline: Pipeline = nonGlowPipeline.map((pass) => {
      if (pass.name === 'crt') {
        return { ...pass, options: { ...pass.options, noiseIntensity, scanLineStrength } }
      }

      return pass
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const crtPixels = await executePipelineSmart(Buffer.from(basePixels as any), width, height, frameCrtPipeline)

    const merged = Buffer.allocUnsafe(byteLen)
    for (let j = 0; j < byteLen; j += 4) {
      let r = glowOnBase[j] + crtPixels[j] - baseCrt[j]
      let g = glowOnBase[j + 1] + crtPixels[j + 1] - baseCrt[j + 1]
      let b = glowOnBase[j + 2] + crtPixels[j + 2] - baseCrt[j + 2]
      if (r < 0) r = 0
      else if (r > 255) r = 255
      if (g < 0) g = 0
      else if (g > 255) g = 255
      if (b < 0) b = 0
      else if (b > 255) b = 255
      merged[j] = r
      merged[j + 1] = g
      merged[j + 2] = b
      merged[j + 3] = 255
    }
    frames.push({ pixels: merged, delay: frameDelay })
  }

  return encodeGif(frames, width, height)
}

export { encodeGif, type GifFrame } from './gif-encoder'
