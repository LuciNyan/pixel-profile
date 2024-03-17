import { clamp } from '../../utils'
import type { Coordinates, RGBA, Texture2D } from '../common'

export function genBiLinearFilter(source: Buffer, width: number, height: number): Texture2D {
  const maxX = width - 1
  const maxY = height - 1

  function biLinearInterpolate(v1: number, v2: number, v3: number, v4: number, sx: number, sy: number): number {
    const tmp1 = v1 * (1 - sx) + v2 * sx
    const tmp2 = v3 * (1 - sx) + v4 * sx

    return tmp1 * (1 - sy) + tmp2 * sy
  }
  function biLinearFilter(coords: Coordinates): RGBA {
    const x = coords[0] * maxX
    const y = coords[1] * maxY
    const x0 = clamp(Math.floor(x), 0, maxX)
    const x1 = clamp(x0 + 1, 0, maxX)
    const y0 = clamp(Math.floor(y), 0, maxY)
    const y1 = clamp(y0 + 1, 0, maxY)

    const sx = x - x0
    const sy = y - y0

    const p00 = (y0 * width + x0) * 4
    const p01 = (y1 * width + x0) * 4
    const p10 = (y0 * width + x1) * 4
    const p11 = (y1 * width + x1) * 4

    const r = biLinearInterpolate(source[p00], source[p10], source[p01], source[p11], sx, sy)
    const g = biLinearInterpolate(source[p00 + 1], source[p10 + 1], source[p01 + 1], source[p11 + 1], sx, sy)
    const b = biLinearInterpolate(source[p00 + 2], source[p10 + 2], source[p01 + 2], source[p11 + 2], sx, sy)
    const a = biLinearInterpolate(source[p00 + 3], source[p10 + 3], source[p01 + 3], source[p11 + 3], sx, sy)

    return [r, g, b, a]
  }

  return biLinearFilter
}
