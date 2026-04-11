import { executePipelineSmart, type Pipeline } from '../pipeline'
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

  const animatedPipelines = buildAnimatedPipelines(effect, frameCount, basePipeline)

  const frames: GifFrame[] = []
  for (const pipeline of animatedPipelines) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pixels = await executePipelineSmart(Buffer.from(basePixels as any), width, height, pipeline)
    frames.push({ pixels, delay: frameDelay })
  }

  return encodeGif(frames, width, height)
}

export { encodeGif, type GifFrame } from './gif-encoder'
