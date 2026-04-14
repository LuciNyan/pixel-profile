/**
 * Core curve computation for a row range. Closure-free so it can be
 * serialized via Function.toString() for Worker threads.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function curveCore(
  source: any,
  target: any,
  width: number,
  height: number,
  startRow: number,
  endRow: number
): void {
  const curvature = 0.1
  const root15 = 1.9679896712654867
  const maxX = width - 1
  const maxY = height - 1
  const w4 = width * 4
  const invW = 1 / width
  const invH = 1 / height

  const colVig = new Float64Array(width)
  for (let c = 0; c < width; c++) {
    const u = c * invW
    colVig[c] = Math.pow(u * (1 - u), 0.25)
  }

  for (let py = startRow; py < endRow; py++) {
    const uvY = py * invH
    const ccY = uvY - 0.5
    const ccY2 = ccY * ccY
    const rowBase = py * w4
    const rowVig = Math.pow(uvY * (1 - uvY), 0.25) * root15

    for (let px = 0; px < width; px++) {
      const uvX = px * invW
      const idx = rowBase + px * 4

      const ccX = uvX - 0.5
      const dist = (ccX * ccX + ccY2) * curvature
      const temp = (1 + dist) * dist
      const tx = (uvX + ccX * temp) * maxX
      const ty = (uvY + ccY * temp) * maxY

      const vignette = colVig[px] * rowVig

      const bx = tx < 0 ? 0 : tx > maxX ? maxX : tx
      const by = ty < 0 ? 0 : ty > maxY ? maxY : ty
      const bx0 = bx | 0
      const bx1 = bx0 + 1 > maxX ? maxX : bx0 + 1
      const by0 = by | 0
      const by1 = by0 + 1 > maxY ? maxY : by0 + 1
      const bsx = bx - bx0
      const bsy = by - by0
      const bosx = 1 - bsx
      const bosy = 1 - bsy
      const ry0 = by0 * w4
      const ry1 = by1 * w4
      const cx0 = bx0 << 2
      const cx1 = bx1 << 2
      const bi00 = ry0 + cx0
      const bi10 = ry0 + cx1
      const bi01 = ry1 + cx0
      const bi11 = ry1 + cx1

      target[idx] =
        ((source[bi00] * bosx + source[bi10] * bsx) * bosy + (source[bi01] * bosx + source[bi11] * bsx) * bsy) *
        vignette
      target[idx + 1] =
        ((source[bi00 + 1] * bosx + source[bi10 + 1] * bsx) * bosy +
          (source[bi01 + 1] * bosx + source[bi11 + 1] * bsx) * bsy) *
        vignette
      target[idx + 2] =
        ((source[bi00 + 2] * bosx + source[bi10 + 2] * bsx) * bosy +
          (source[bi01 + 2] * bosx + source[bi11 + 2] * bsx) * bsy) *
        vignette
      target[idx + 3] = 255
    }
  }
}

export function curve(source: Buffer, width: number, height: number): Buffer {
  const target = Buffer.allocUnsafe(width * height * 4)
  curveCore(source, target, width, height, 0, height)

  return target
}
