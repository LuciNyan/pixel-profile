const screenCurvature = 0.1

export function curve(source: Buffer, width: number, height: number): Buffer {
  const maxX = width - 1
  const maxY = height - 1
  const target = Buffer.allocUnsafe(width * height * 4)
  const w4 = width * 4

  for (let py = 0; py < height; py++) {
    const uvY = py / height
    const ccY = uvY - 0.5
    const ccY2 = ccY * ccY
    const oneMinusUvY = 1 - uvY
    const rowBase = py * w4

    for (let px = 0; px < width; px++) {
      const uvX = px / width
      const idx = rowBase + px * 4

      const ccX = uvX - 0.5
      const dist = (ccX * ccX + ccY2) * screenCurvature
      const temp = (1 + dist) * dist
      const tx = (uvX + ccX * temp) * maxX
      const ty = (uvY + ccY * temp) * maxY

      const vignette = Math.sqrt(Math.sqrt(uvX * oneMinusUvY * uvY * (1 - uvX) * 15))

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
      const bi00 = (by0 * width + bx0) * 4
      const bi10 = (by0 * width + bx1) * 4
      const bi01 = (by1 * width + bx0) * 4
      const bi11 = (by1 * width + bx1) * 4

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
