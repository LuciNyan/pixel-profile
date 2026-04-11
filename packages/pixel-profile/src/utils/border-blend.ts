import { IMG_BORDER } from '../theme/images/border-frame'
import Jimp from 'jimp'

export interface BorderOptions {
  targetWidth?: number
  targetHeight?: number
}

/**
 * Blend border image with target pixels
 * @param pixels - Target image pixels buffer
 * @param width - Target image width
 * @param height - Target image height
 * @param options - Border blending options
 * @returns Blended pixels buffer
 */
export async function blendBorder(
  pixels: Buffer,
  width: number,
  height: number,
  options: BorderOptions = {}
): Promise<Buffer> {
  const { targetWidth = width, targetHeight = height } = options

  const borderPng = await Jimp.read(Buffer.from(IMG_BORDER.split(',')[1], 'base64'))
  borderPng.resize(targetWidth, targetHeight)
  const borderPixels = Buffer.from(borderPng.bitmap.data)

  const blendedPixels = Buffer.alloc(pixels.length)

  for (let i = 0; i < blendedPixels.length - 1; i += 4) {
    const alpha = borderPixels[i + 3] / 255

    blendedPixels[i] = pixels[i] * (1 - alpha) + borderPixels[i] * alpha
    blendedPixels[i + 1] = pixels[i + 1] * (1 - alpha) + borderPixels[i + 1] * alpha
    blendedPixels[i + 2] = pixels[i + 2] * (1 - alpha) + borderPixels[i + 2] * alpha
    blendedPixels[i + 3] = 255
  }

  return blendedPixels
}
