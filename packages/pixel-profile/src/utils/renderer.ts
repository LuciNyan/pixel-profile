import { clamp } from './math'

export type Coordinates = [number, number]
type RGBA = [number, number, number, number]
type Texture2D = (coords: Coordinates) => RGBA
type FragShader = (uv: Coordinates, texture2D: Texture2D) => RGBA

function coordsToIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4
}

export function render(sourcePixels: Buffer, width: number, height: number, fragShader: FragShader): Buffer {
  const targetBuffer = Buffer.alloc(width * height * 4)

  function biLinearInterpolate(v1: number, v2: number, v3: number, v4: number, sx: number, sy: number): number {
    const tmp1 = v1 * (1 - sx) + v2 * sx
    const tmp2 = v3 * (1 - sx) + v4 * sx

    return tmp1 * (1 - sy) + tmp2 * sy
  }

  function biLinearFilter(coords: Coordinates): RGBA {
    const x = coords[0] * width
    const y = coords[1] * height
    const x0 = clamp(Math.floor(x), 0, width - 1)
    const x1 = clamp(x0 + 1, 0, width - 1)
    const y0 = clamp(Math.floor(y), 0, height - 1)
    const y1 = clamp(y0 + 1, 0, height - 1)

    const sx = x - x0
    const sy = y - y0

    const p00 = (y0 * width + x0) * 4
    const p01 = (y1 * width + x0) * 4
    const p10 = (y0 * width + x1) * 4
    const p11 = (y1 * width + x1) * 4

    const r = biLinearInterpolate(sourcePixels[p00], sourcePixels[p10], sourcePixels[p01], sourcePixels[p11], sx, sy)
    const g = biLinearInterpolate(
      sourcePixels[p00 + 1],
      sourcePixels[p10 + 1],
      sourcePixels[p01 + 1],
      sourcePixels[p11 + 1],
      sx,
      sy
    )
    const b = biLinearInterpolate(
      sourcePixels[p00 + 2],
      sourcePixels[p10 + 2],
      sourcePixels[p01 + 2],
      sourcePixels[p11 + 2],
      sx,
      sy
    )
    const a = biLinearInterpolate(
      sourcePixels[p00 + 3],
      sourcePixels[p10 + 3],
      sourcePixels[p01 + 3],
      sourcePixels[p11 + 3],
      sx,
      sy
    )

    return [r, g, b, a]
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rgba = fragShader([x / width, y / height], biLinearFilter)
      const index = coordsToIndex(x, y, width)
      targetBuffer[index] = rgba[0]
      targetBuffer[index + 1] = rgba[1]
      targetBuffer[index + 2] = rgba[2]
      targetBuffer[index + 3] = rgba[3]
    }
  }

  return targetBuffer
}
