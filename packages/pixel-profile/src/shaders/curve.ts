const screenCurvature = 0.1

const FOURTH_ROOT_15 = Math.pow(15, 0.25)

export function curve(source: Buffer, width: number, height: number): Buffer {
  const maxX = width - 1
  const maxY = height - 1
  const target = Buffer.allocUnsafe(width * height * 4)
  const w4 = width * 4

  const colVignette = new Float64Array(width)
  const invW = 1 / width
  for (let px = 0; px < width; px++) {
    const uvX = px * invW
    colVignette[px] = Math.pow(uvX * (1 - uvX), 0.25)
  }

  const invH = 1 / height

  for (let py = 0; py < height; py++) {
    const uvY = py * invH
    const ccY = uvY - 0.5
    const ccY2 = ccY * ccY
    const rowBase = py * w4

    const rowVignette = Math.pow(uvY * (1 - uvY), 0.25) * FOURTH_ROOT_15

    for (let px = 0; px < width; px++) {
      const uvX = px * invW
      const idx = rowBase + px * 4

      const ccX = uvX - 0.5
      const dist = (ccX * ccX + ccY2) * screenCurvature
      const temp = (1 + dist) * dist
      const tx = (uvX + ccX * temp) * maxX
      const ty = (uvY + ccY * temp) * maxY

      const vignette = colVignette[px] * rowVignette

      const bx = Math.min(maxX, Math.max(0, tx))
      const by = Math.min(maxY, Math.max(0, ty))
      const bx0 = bx | 0
      const bx1 = Math.min(bx0 + 1, maxX)
      const by0 = by | 0
      const by1 = Math.min(by0 + 1, maxY)
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

  return target
}
