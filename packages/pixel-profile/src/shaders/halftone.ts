const dotSize = 4
const dotDensity = 1
const mat = [
  [0.1, 0.9, 0.3, 0.9],
  [0.9, 0.3, 0.9, 0.6],
  [0.3, 0.9, 0.1, 0.9],
  [0.9, 0.6, 0.9, 0.6]
]
const ditherRange = 0

export function halftone(source: Buffer, width: number, height: number): Buffer {
  const target = Buffer.alloc(width * height * 4)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4

      const grayValue = (source[idx] + source[idx + 1] + source[idx + 2]) / (3 * 255)
      const ditherValue = (Math.random() - 0.5) * ditherRange
      const adjustedGrayValue = Math.min(Math.max(grayValue + ditherValue, 0), 1)

      const relX = x - Math.floor(x / dotSize) * dotSize
      const relY = y - Math.floor(y / dotSize) * dotSize

      const intensity = mat[relX][relY]
      const dotRadius = dotDensity * (1 - adjustedGrayValue)

      if (intensity < dotRadius) {
        target[idx] = 7
        target[idx + 1] = 85
        target[idx + 2] = 59
        target[idx + 3] = 255
      } else {
        target[idx] = 206
        target[idx + 1] = 212
        target[idx + 2] = 106
        target[idx + 3] = 255
      }
    }
  }

  return target
}
