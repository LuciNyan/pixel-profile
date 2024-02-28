import { isBase64PNG } from './is'
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

  image.scan(0, 0, width, height, (x, y, idx) => {
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
