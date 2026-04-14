const scanlineIntensity = 0.15
const scanlineThickness = 3
const scanlineBrightness = 1 - scanlineIntensity

export function scanline(source: Buffer, width: number, height: number): Buffer {
  const rowBytes = width * 4

  for (let y = 0; y < height; y++) {
    if (y % scanlineThickness !== 0) continue
    const rowOffset = y * rowBytes
    const rowEnd = rowOffset + rowBytes
    for (let idx = rowOffset; idx < rowEnd; idx += 4) {
      source[idx] = source[idx] * scanlineBrightness
      source[idx + 1] = source[idx + 1] * scanlineBrightness
      source[idx + 2] = source[idx + 2] * scanlineBrightness
    }
  }

  return source
}
