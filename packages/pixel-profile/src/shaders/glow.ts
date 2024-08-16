import { coordsToIndex, render, RGBA } from '../renderer'
import { add2, Vec2 } from '../utils'
import { add3, divide3, dot3, mix3, Vec3 } from '../utils/math'

const radius = 5
const intensity = 0.7
const threshold = 0.8

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
          const _uv: Vec2 = add2(uv, [i, j])
          const key = coordsToIndex(_uv[0], _uv[1], width)
          if (memo[key]) {
            if (memo[key].result) {
              const sampledColor = memo[key].sampledColor
              const luminance = memo[key].luminance

              const dist = length2([i, j])
              const weight = Math.pow(Math.exp((-dist * dist) / (2 * radius * radius)), 3)
              glowColor = add3(
                glowColor,
                mix3(originalColor, sampledColor, weight * intensity * Math.pow(luminance, 5))
              )

              n++
            }
            continue
          }
          memo[key] = {} as any

          const sampledColor = texture2D(_uv)
          const luminance = dot3(sampledColor, [0.2126, 0.7152, 0.0722]) / 255
          if (luminance > threshold) {
            const dist = length2([i, j])
            const weight = Math.pow(Math.exp((-dist * dist) / (2 * radius * radius)), 3)
            glowColor = add3(glowColor, mix3(originalColor, sampledColor, weight * intensity * Math.pow(luminance, 5)))
            n++

            memo[key].result = true
            memo[key].sampledColor = sampledColor
            memo[key].luminance = luminance
          } else {
            memo[key].result = false
          }
        }
      }

      if (n === 0) {
        return originalColor
      }

      glowColor = divide3(glowColor, n)

      return [glowColor[0], glowColor[1], glowColor[2], 255]
    },
    {
      textureFilter: 'NEAREST'
    }
  )
}

function length2(v: Vec2): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1])
}
