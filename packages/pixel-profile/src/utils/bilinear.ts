export function sampleBilinear(
  source: Buffer,
  width: number,
  maxX: number,
  maxY: number,
  fx: number,
  fy: number
): [number, number, number, number] {
  const x = Math.min(maxX, Math.max(0, fx))
  const y = Math.min(maxY, Math.max(0, fy))
  const x0 = Math.min(Math.max(Math.floor(x), 0), maxX)
  const x1 = Math.min(x0 + 1, maxX)
  const y0 = Math.min(Math.max(Math.floor(y), 0), maxY)
  const y1 = Math.min(y0 + 1, maxY)
  const sx = x - x0
  const sy = y - y0
  const osx = 1 - sx
  const osy = 1 - sy

  const i00 = (y0 * width + x0) * 4
  const i10 = (y0 * width + x1) * 4
  const i01 = (y1 * width + x0) * 4
  const i11 = (y1 * width + x1) * 4

  return [
    (source[i00] * osx + source[i10] * sx) * osy + (source[i01] * osx + source[i11] * sx) * sy,
    (source[i00 + 1] * osx + source[i10 + 1] * sx) * osy + (source[i01 + 1] * osx + source[i11 + 1] * sx) * sy,
    (source[i00 + 2] * osx + source[i10 + 2] * sx) * osy + (source[i01 + 2] * osx + source[i11 + 2] * sx) * sy,
    (source[i00 + 3] * osx + source[i10 + 3] * sx) * osy + (source[i01 + 3] * osx + source[i11 + 3] * sx) * sy
  ]
}
