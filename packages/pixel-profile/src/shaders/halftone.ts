/* eslint-disable prettier/prettier */
const flatMat = new Float64Array([
  0.1, 0.9, 0.3, 0.9,
  0.9, 0.3, 0.9, 0.6,
  0.3, 0.9, 0.1, 0.9,
  0.9, 0.6, 0.9, 0.6
])
/* eslint-enable prettier/prettier */

const DARK_U32 = (7 | (85 << 8) | (59 << 16) | (255 << 24)) >>> 0
const LIGHT_U32 = (206 | (212 << 8) | (106 << 16) | (255 << 24)) >>> 0

export function halftone(source: Buffer, width: number, height: number): Buffer {
  const target = Buffer.allocUnsafe(width * height * 4)
  const u32 = new Uint32Array(target.buffer, target.byteOffset, width * height)

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width
    for (let x = 0; x < width; x++) {
      const idx = (rowOffset + x) * 4
      const grayValue = (source[idx] + source[idx + 1] + source[idx + 2]) / (3 * 255)
      const dotRadius = 1 - grayValue

      u32[rowOffset + x] = flatMat[(x & 3) * 4 + (y & 3)] < dotRadius ? DARK_U32 : LIGHT_U32
    }
  }

  return target
}
