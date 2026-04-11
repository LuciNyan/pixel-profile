const scanlineIntensity = 0.15
const scanlineThickness = 3
const scanlineBrightness = 1 - scanlineIntensity

export function scanline(source: Buffer, width: number, height: number): Buffer {
  const target = Buffer.alloc(width * height * 4)

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width * 4
    const isScanline = y % scanlineThickness === 0

    if (isScanline) {
      for (let x = 0; x < width; x++) {
        const idx = rowOffset + x * 4
        target[idx] = source[idx] * scanlineBrightness
        target[idx + 1] = source[idx + 1] * scanlineBrightness
        target[idx + 2] = source[idx + 2] * scanlineBrightness
        target[idx + 3] = source[idx + 3]
      }
    } else {
      target.set(source.subarray(rowOffset, rowOffset + width * 4), rowOffset)
    }
  }

  return target
}
