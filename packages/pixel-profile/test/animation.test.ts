import './utils/data'
import { encodeGif, type GifFrame, renderAnimatedGif } from '../src/animation'
import type { Pipeline } from '../src/pipeline'
import { describe, expect, it } from 'vitest'

function makeSolidFrame(width: number, height: number, r: number, g: number, b: number): Buffer {
  const buf = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    buf[i * 4] = r
    buf[i * 4 + 1] = g
    buf[i * 4 + 2] = b
    buf[i * 4 + 3] = 255
  }

  return buf
}

describe('GIF encoder', () => {
  it('produces a valid GIF89a header', () => {
    const frames: GifFrame[] = [{ pixels: makeSolidFrame(4, 4, 255, 0, 0), delay: 100 }]
    const gif = encodeGif(frames, 4, 4)
    const sig = gif.subarray(0, 6).toString('ascii')
    expect(sig).toBe('GIF89a')
  })

  it('encodes width and height correctly', () => {
    const w = 16
    const h = 8
    const frames: GifFrame[] = [{ pixels: makeSolidFrame(w, h, 0, 128, 255), delay: 50 }]
    const gif = encodeGif(frames, w, h)
    expect(gif.readUInt16LE(6)).toBe(w)
    expect(gif.readUInt16LE(8)).toBe(h)
  })

  it('ends with GIF trailer byte 0x3B', () => {
    const frames: GifFrame[] = [{ pixels: makeSolidFrame(2, 2, 0, 0, 0), delay: 100 }]
    const gif = encodeGif(frames, 2, 2)
    expect(gif[gif.length - 1]).toBe(0x3b)
  })

  it('encodes multiple frames without error', () => {
    const frames: GifFrame[] = [
      { pixels: makeSolidFrame(8, 8, 255, 0, 0), delay: 100 },
      { pixels: makeSolidFrame(8, 8, 0, 255, 0), delay: 100 },
      { pixels: makeSolidFrame(8, 8, 0, 0, 255), delay: 100 }
    ]
    const gif = encodeGif(frames, 8, 8)
    expect(gif.subarray(0, 6).toString('ascii')).toBe('GIF89a')
    expect(gif.length).toBeGreaterThan(13 + 768 + 19)
  })

  it('contains NETSCAPE2.0 extension for looping', () => {
    const frames: GifFrame[] = [
      { pixels: makeSolidFrame(4, 4, 255, 0, 0), delay: 100 },
      { pixels: makeSolidFrame(4, 4, 0, 255, 0), delay: 100 }
    ]
    const gif = encodeGif(frames, 4, 4)
    const str = gif.toString('binary')
    expect(str).toContain('NETSCAPE2.0')
  })

  it('handles gradient pixel data with many colors', () => {
    const w = 32
    const h = 32
    const buf = Buffer.alloc(w * h * 4)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4
        buf[i] = Math.floor((x / w) * 255)
        buf[i + 1] = Math.floor((y / h) * 255)
        buf[i + 2] = 128
        buf[i + 3] = 255
      }
    }
    const frames: GifFrame[] = [{ pixels: buf, delay: 100 }]
    const gif = encodeGif(frames, w, h)
    expect(gif.subarray(0, 6).toString('ascii')).toBe('GIF89a')
    expect(gif[gif.length - 1]).toBe(0x3b)
  })
})

describe('renderAnimatedGif', () => {
  const W = 16
  const H = 16
  const basePixels = makeSolidFrame(W, H, 100, 150, 200)

  it('produces a GIF with empty pipeline', async () => {
    const pipeline: Pipeline = []
    const gif = await renderAnimatedGif(basePixels, W, H, pipeline, {
      effect: 'scanline-scroll',
      frameCount: 3,
      frameDelay: 80
    })
    expect(gif.subarray(0, 6).toString('ascii')).toBe('GIF89a')
    expect(gif[gif.length - 1]).toBe(0x3b)
  })

  it('respects frameCount option', async () => {
    const pipeline: Pipeline = []
    const gif3 = await renderAnimatedGif(basePixels, W, H, pipeline, {
      effect: 'scanline-scroll',
      frameCount: 3,
      frameDelay: 100
    })
    const gif6 = await renderAnimatedGif(basePixels, W, H, pipeline, {
      effect: 'scanline-scroll',
      frameCount: 6,
      frameDelay: 100
    })
    expect(gif6.length).toBeGreaterThan(gif3.length)
  })

  it('scanline-scroll produces valid output', async () => {
    const pipeline: Pipeline = []
    const gif = await renderAnimatedGif(basePixels, W, H, pipeline, {
      effect: 'scanline-scroll',
      frameCount: 4,
      frameDelay: 100
    })
    expect(gif.subarray(0, 6).toString('ascii')).toBe('GIF89a')
    expect(gif.readUInt16LE(6)).toBe(W)
    expect(gif.readUInt16LE(8)).toBe(H)
  })

  it('defaults to glow-pulse effect and 8 frames', async () => {
    const pipeline: Pipeline = []
    const gif = await renderAnimatedGif(basePixels, W, H, pipeline)
    expect(gif.subarray(0, 6).toString('ascii')).toBe('GIF89a')
  })
})
