import { render } from '../src/renderer'
import { genBiLinearFilter } from '../src/renderer/texture-filter/linear'
import { compare } from '../src/utils'
import { getPixelsFromPngBuffer, getPngBufferFromBase64 } from '../src/utils/converter'
import { LUCI_AVATAR } from './utils/avatar/luci'
import { describe, expect, it } from 'vitest'

describe('Renderer', () => {
  it('Render', async () => {
    const png = getPngBufferFromBase64(LUCI_AVATAR)
    const { pixels: source, width, height } = await getPixelsFromPngBuffer(png)
    const target = render(source, width, height, (uv, texture2D) => texture2D([uv[0], uv[1]]), {
      textureFilter: 'NEAREST'
    })

    expect(compare(source, target)).toBeTruthy()
  })
})

describe('genBiLinearFilter', () => {
  const width = 4
  const height = 4
  /* eslint-disable prettier/prettier */
  const pixels = Buffer.from([
    255, 0, 0, 255,    0, 255, 0, 255,    0, 0, 255, 255,    255, 255, 0, 255,
    0, 255, 255, 255,  255, 0, 255, 255,  255, 255, 255, 255, 0, 0, 0, 255,
    255, 0, 0, 255,    0, 255, 0, 255,    0, 0, 255, 255,    255, 255, 0, 255,
    0, 255, 255, 255,  255, 0, 255, 255,  255, 255, 255, 255, 0, 0, 0, 255
  ])
  /* eslint-enable prettier/prettier */

  const biLinearFilter = genBiLinearFilter(pixels, width, height)

  it('should return the correct pixel value at integer coordinates', () => {
    expect(biLinearFilter([0, 0])).toEqual([255, 0, 0, 255])
    expect(biLinearFilter([1, 0])).toEqual([0, 255, 0, 255])
    expect(biLinearFilter([0, 1])).toEqual([0, 255, 255, 255])
    expect(biLinearFilter([3, 3])).toEqual([0, 0, 0, 255])
  })

  it('should correctly interpolate at non-integer coordinates', () => {
    const result = biLinearFilter([0.5, 0.5])
    expect(result[0]).toBeCloseTo(127.5)
    expect(result[1]).toBeCloseTo(127.5)
    expect(result[2]).toBeCloseTo(127.5)
    expect(result[3]).toBe(255)
  })

  it('should correctly handle image edges', () => {
    const result = biLinearFilter([3.9, 3.9])
    expect(result).toEqual([0, 0, 0, 255])
  })

  it('should correctly handle out of range coordinates', () => {
    const result1 = biLinearFilter([-1, -1])
    expect(result1).toEqual([255, 0, 0, 255])

    const result2 = biLinearFilter([5, 5])
    expect(result2).toEqual([0, 0, 0, 255])
  })

  it('should correctly interpolate in the x direction', () => {
    const result = biLinearFilter([0.5, 0])
    expect(result[0]).toBeCloseTo(127.5)
    expect(result[1]).toBeCloseTo(127.5)
    expect(result[2]).toBeCloseTo(0)
    expect(result[3]).toBe(255)
  })

  it('should correctly interpolate in the y direction', () => {
    const result = biLinearFilter([0, 0.5])
    expect(result[0]).toBeCloseTo(127.5)
    expect(result[1]).toBeCloseTo(127.5)
    expect(result[2]).toBeCloseTo(127.5)
    expect(result[3]).toBe(255)
  })
})
