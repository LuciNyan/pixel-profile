import { addBorder, crt, curve, pixelate } from './shaders'
import { BUILTIN_PALETTES, orderedBayer, paletteDither, type PaletteId } from './shaders/dithering'
import { glow } from './shaders/glow'
import { scanline } from './shaders/scanline'

export type ShaderFn = (pixels: Buffer, width: number, height: number, opts?: any) => Buffer

export type ShaderPass = {
  name: string
  shader: ShaderFn
  options?: Record<string, any>
  enabled?: boolean
}

export type Pipeline = ShaderPass[]

export const SHADERS = {
  pixelate,
  addBorder,
  orderedBayer,
  scanline,
  glow,
  curve,
  crt
} as const

export function executePipeline(pixels: Buffer, width: number, height: number, pipeline: Pipeline): Buffer {
  let result = pixels

  for (const pass of pipeline) {
    if (pass.enabled === false) continue
    result = pass.shader(result, width, height, pass.options)
  }

  return result
}

export function buildStatsPipeline(options: {
  theme: string
  screenEffect: boolean
  isFastMode: boolean
  dithering: boolean
  ditheringPalette?: string
}): Pipeline {
  const { theme, screenEffect, isFastMode, dithering, ditheringPalette } = options

  if (theme === 'crt') {
    return [
      { name: 'crt', shader: crt },
      {
        name: 'glow',
        shader: glow,
        options: {
          radius: 5,
          intensity: 0.17,
          color: [1, 1, 1],
          layers: 5,
          falloff: 'exponential'
        }
      }
    ]
  }

  const pipeline: Pipeline = []

  if (ditheringPalette) {
    const palette = resolvePalette(ditheringPalette)
    if (palette) {
      pipeline.push({
        name: 'paletteDither',
        shader: paletteDither,
        options: palette
      })
    }
  } else if (dithering) {
    pipeline.push({ name: 'orderedBayer', shader: orderedBayer })
  }

  if (screenEffect) {
    if (!dithering && !ditheringPalette) {
      pipeline.push({ name: 'scanline', shader: scanline })
    }
    if (!isFastMode) {
      pipeline.push({
        name: 'glow',
        shader: glow,
        options: {
          radius: 3,
          intensity: 0.3,
          color: [1, 1, 1],
          layers: 2,
          falloff: 'exponential'
        }
      })
    }
    pipeline.push({ name: 'curve', shader: curve })
  }

  return pipeline
}

function resolvePalette(spec: string): number[][] | null {
  if (spec in BUILTIN_PALETTES) {
    return BUILTIN_PALETTES[spec as PaletteId]
  }

  const hexColors = spec.split(',').map((s) => s.trim().replace(/^#/, ''))
  if (hexColors.length < 2 || hexColors.some((h) => !/^[0-9a-fA-F]{6}$/.test(h))) {
    return null
  }

  return hexColors.map((h) => [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)])
}

export function buildCrtPipeline(): Pipeline {
  return [
    {
      name: 'crt',
      shader: crt,
      options: {
        curvatureX: 0.045,
        curvatureY: 0.045,
        cornerSize: 0.05,
        vignetteDarkness: 0.05,
        scanLineStrength: 0.15,
        scanLineCount: 240,
        rgbShift: 0.5,
        bloomAmount: 0.25,
        noiseIntensity: 0.05,
        borderSize: 0
      }
    },
    {
      name: 'glow',
      shader: glow,
      options: {
        radius: 5,
        intensity: 0.17,
        color: [1, 1, 1],
        layers: 1,
        falloff: 'exponential'
      }
    }
  ]
}
