import { RGBA } from '../renderer'
import { isBase64PNG } from './is'
import { Vec3 } from './math'
import axios from 'axios'
import Jimp from 'jimp'

export async function getPixelsFromPngBuffer(png: Buffer): Promise<{
  pixels: Buffer
  width: number
  height: number
}> {
  const image = await Jimp.read(png)

  const width = image.getWidth()
  const height = image.getHeight()
  const pixels = Buffer.alloc(width * height * 4)

  image.scan(0, 0, width, height, (_x, _y, idx) => {
    pixels[idx] = image.bitmap.data[idx]
    pixels[idx + 1] = image.bitmap.data[idx + 1]
    pixels[idx + 2] = image.bitmap.data[idx + 2]
    pixels[idx + 3] = image.bitmap.data[idx + 3]
  })

  return {
    pixels,
    width,
    height
  }
}

export async function getBase64FromPixels(pixels: Buffer, width: number, height: number): Promise<string> {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-new
    new Jimp(width, height, (_, image) => {
      image.bitmap.data = pixels
      image.getBase64('image/png', (_, str) => {
        resolve(str)
      })
    })
  })
}

export function getPngBufferFromPixels(pixelsBuffer: Buffer, width: number, height: number): Promise<Buffer> {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-new
    new Jimp(width, height, function (_, image) {
      image.bitmap.data = pixelsBuffer
      image.getBuffer('image/png', function (_, buffer) {
        resolve(buffer)
      })
    })
  })
}

export function getPngBufferFromBase64(base64: string): Buffer {
  return Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
}

export async function getPngBufferFromURL(url: string): Promise<Buffer> {
  if (isBase64PNG(url)) {
    return getPngBufferFromBase64(url)
  } else {
    return await new Promise((resolve) => {
      axios.get(url, { responseType: 'arraybuffer' }).then((response) => {
        resolve(Buffer.from(response.data, 'binary'))
      })
    })
  }
}

export function rgbToHsl([r, g, b]: Vec3 | RGBA): Vec3 {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h = 0
  let s

  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, l]
}

export function hslToRgb([h, s, l]: Vec3): Vec3 {
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [r * 255, g * 255, b * 255]
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6

  return p
}
