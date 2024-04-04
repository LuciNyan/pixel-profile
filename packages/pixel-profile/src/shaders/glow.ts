import { render } from '../renderer'
import { add2, Vec2 } from '../utils'
import { add3, divide3, dot3, mix3, Vec3 } from '../utils/math'

const radius = 10
const intensity = 1
const threshold = 0.9
const _threshold = threshold * 255

export function glow(source: Buffer, width: number, height: number): Buffer {
  return render(
    source,
    width,
    height,
    (uv, texture2D) => {
      const originalColor = texture2D(uv)

      let bloomColor: Vec3 = [0, 0, 0]
      let n = 0

      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          const offset: Vec2 = [i / width, j / height]
          const sampledColor = texture2D(add2(uv, offset))
          const luminance = dot3(sampledColor, [0.2126, 0.7152, 0.0722])
          if (luminance > _threshold) {
            bloomColor = add3(bloomColor, sampledColor)
            n++
          }
        }
      }

      if (n === 0) {
        return originalColor
      }

      bloomColor = divide3(bloomColor, n)

      const _bloomIntensity = intensity * (n / Math.pow(radius * 2 + 1, 2))

      const finalColor = mix3(originalColor, bloomColor, _bloomIntensity)

      return [finalColor[0], finalColor[1], finalColor[2], 255]
    },
    {
      textureFilter: 'NEAREST'
    }
  )
}
