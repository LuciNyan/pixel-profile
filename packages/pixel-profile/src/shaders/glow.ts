import { coordsToIndex, render, RGBA } from '../renderer'
import { Vec2 } from '../utils'
import { add3, divide3, mix3, Vec3 } from '../utils/math'

const radius = 5
const intensity = 0.7
const threshold = 0.8
const radiusSquared = radius * radius * 2

export function glow(source: Buffer, width: number, height: number): Buffer {
  const size = width * height
  const bufferSize = (1 + 4 + 4) * size
  const sharedBuffer = new ArrayBuffer(bufferSize)
  const memoResult = new Uint8Array(sharedBuffer, 0, size)
  const memoSampledColor = new Uint8Array(sharedBuffer, size, size * 4)
  const memoLuminance = new Float32Array(sharedBuffer, size * 5, size)

  return render(
    source,
    width,
    height,
    (uv, texture2D) => {
      const originalColor = texture2D(uv)
      let glowColor: Vec3 = [0, 0, 0]
      let n = 0

      const _uv: Vec2 = [0, 0]

      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          _uv[0] = uv[0] + i
          _uv[1] = uv[1] + j
          const key = coordsToIndex(_uv[0], _uv[1], width)

          if (memoResult[key] === undefined) {
            continue
          }

          if (memoResult[key] === 0) {
            const sampledColor = texture2D(_uv)
            const luminance = (sampledColor[0] * 0.2126 + sampledColor[1] * 0.7152 + sampledColor[2] * 0.0722) / 255
            memoResult[key] = luminance > threshold ? 1 : 2
            memoSampledColor.set(sampledColor, key * 4)
            memoLuminance[key] = luminance
          }

          if (memoResult[key] === 1) {
            const sampledColor: RGBA = memoSampledColor.subarray(key * 4, key * 4 + 4) as unknown as RGBA
            const luminance = memoLuminance[key]
            const distSquared = i * i + j * j
            const weight = Math.exp(-distSquared / radiusSquared) ** 3
            const factor = weight * intensity * luminance ** 5
            glowColor = add3(glowColor, mix3(originalColor, sampledColor, factor))
            n++
          }
        }
      }

      if (n === 0) return originalColor

      return [...divide3(glowColor, n), 255]
    },
    { textureFilter: 'NEAREST' }
  )
}
