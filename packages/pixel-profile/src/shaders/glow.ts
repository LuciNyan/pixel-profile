import { coordsToIndex, render, RGBA } from '../renderer'
import { Vec2 } from '../utils'
import { add3, divide3, mix3, Vec3 } from '../utils/math'

const radius = 5
const intensity = 0.7
const threshold = 0.8
const radiusSquared = radius * radius * 2

export function glow(source: Buffer, width: number, height: number): Buffer {
  const memo: { result: boolean; sampledColor: RGBA; luminance: number }[] = new Array(width * height)

  return render(
    source,
    width,
    height,
    (uv, texture2D) => {
      const originalColor = texture2D(uv)

      let glowColor: Vec3 = [0, 0, 0]
      let n = 0

      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          const _uv: Vec2 = [uv[0] + i, uv[1] + j]
          const key = coordsToIndex(_uv[0], _uv[1], width)

          if (!memo[key]) {
            const sampledColor = texture2D(_uv)
            const luminance = (sampledColor[0] * 0.2126 + sampledColor[1] * 0.7152 + sampledColor[2] * 0.0722) / 255
            memo[key] = {
              result: luminance > threshold,
              sampledColor,
              luminance
            }
          }

          if (memo[key].result) {
            const { sampledColor, luminance } = memo[key]
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
