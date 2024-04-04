import { clamp } from '../../utils'
import { Coordinates, coordsToPixel, RGBA, Texture2D } from '../common'

export function genBiLinearFilter(pixels: Buffer, width: number, height: number): Texture2D {
  const maxX = width - 1
  const maxY = height - 1

  function biLinearInterpolate(v1: number, v2: number, v3: number, v4: number, sx: number, sy: number): number {
    const tmp1 = v1 * (1 - sx) + v2 * sx
    const tmp2 = v3 * (1 - sx) + v4 * sx

    return tmp1 * (1 - sy) + tmp2 * sy
  }
  function biLinearFilter(coords: Coordinates): RGBA {
    const x = coords[0]
    const y = coords[1]
    const x0 = clamp(Math.floor(x), 0, maxX)
    const x1 = clamp(x0 + 1, 0, maxX)
    const y0 = clamp(Math.floor(y), 0, maxY)
    const y1 = clamp(y0 + 1, 0, maxY)

    const sx = x - x0
    const sy = y - y0

    const p00 = coordsToPixel(pixels, x0, y0, width)
    const p01 = coordsToPixel(pixels, x0, y1, width)
    const p10 = coordsToPixel(pixels, x1, y0, width)
    const p11 = coordsToPixel(pixels, x1, y1, width)

    const r = biLinearInterpolate(p00[0], p10[0], p01[0], p11[0], sx, sy)
    const g = biLinearInterpolate(p00[1], p10[1], p01[1], p11[1], sx, sy)
    const b = biLinearInterpolate(p00[2], p10[2], p01[2], p11[2], sx, sy)
    const a = biLinearInterpolate(p00[3], p10[3], p01[3], p11[3], sx, sy)

    return [r, g, b, a]
  }

  return biLinearFilter
}
