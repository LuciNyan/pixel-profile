import { IMG_BORDER } from '../theme/images/border-frame'
import Jimp from 'jimp'

export interface BorderOptions {
  targetWidth?: number
  targetHeight?: number
}

let cachedBorderRGBA: Buffer | null = null
let cachedAlpha: Float64Array | null = null
let cachedOneMinusAlpha: Float64Array | null = null
let cachedKey = ''

async function getBorderData(targetWidth: number, targetHeight: number) {
  const key = `${targetWidth}x${targetHeight}`
  if (cachedKey === key && cachedBorderRGBA && cachedAlpha && cachedOneMinusAlpha) {
    return { borderPixels: cachedBorderRGBA, alpha: cachedAlpha, oneMinusAlpha: cachedOneMinusAlpha }
  }

  const borderPng = await Jimp.read(Buffer.from(IMG_BORDER.split(',')[1], 'base64'))
  borderPng.resize(targetWidth, targetHeight)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const borderPixels = Buffer.from(borderPng.bitmap.data as any)

  const pixelCount = targetWidth * targetHeight
  const alpha = new Float64Array(pixelCount)
  const oneMinusAlpha = new Float64Array(pixelCount)
  for (let i = 0; i < pixelCount; i++) {
    const a = borderPixels[i * 4 + 3] / 255
    alpha[i] = a
    oneMinusAlpha[i] = 1 - a
  }

  cachedBorderRGBA = borderPixels
  cachedAlpha = alpha
  cachedOneMinusAlpha = oneMinusAlpha
  cachedKey = key

  return { borderPixels, alpha, oneMinusAlpha }
}

export async function blendBorder(
  pixels: Buffer,
  width: number,
  height: number,
  options: BorderOptions = {}
): Promise<Buffer> {
  const { targetWidth = width, targetHeight = height } = options
  const { borderPixels, alpha, oneMinusAlpha } = await getBorderData(targetWidth, targetHeight)

  const blendedPixels = Buffer.allocUnsafe(pixels.length)

  for (let i = 0, p = 0; i < blendedPixels.length - 1; i += 4, p++) {
    const a = alpha[p]
    const oma = oneMinusAlpha[p]

    blendedPixels[i] = pixels[i] * oma + borderPixels[i] * a
    blendedPixels[i + 1] = pixels[i + 1] * oma + borderPixels[i + 1] * a
    blendedPixels[i + 2] = pixels[i + 2] * oma + borderPixels[i + 2] * a
    blendedPixels[i + 3] = 255
  }

  return blendedPixels
}
