import { type PixelCoords, render } from '../renderer'
import type { Vec2 } from '../utils'
import { add2, dot2, prod2, subtract2 } from '../utils'

const margin = [0, 0]
const screenCurvature = 0.1

export function curve(source: Buffer, width: number, height: number): Buffer {
  return render(source, width, height, (coords, texture) => {
    const uv = [coords[0] / width, coords[1] / height]

    const maxX = width - 1
    const maxY = height - 1

    function distortCoordinates(_coords: PixelCoords): Vec2 {
      const cc = subtract2(_coords, [0.5, 0.5])
      const dist = dot2(cc, cc) * screenCurvature
      const temp = (1 + dist) * dist
      cc[0] = cc[0] * temp
      cc[1] = cc[1] * temp

      return add2(_coords, cc)
    }

    const targetCoords = distortCoordinates([uv[0], uv[1]])

    targetCoords[0] = targetCoords[0] * (margin[0] * 2 + 1) - margin[0]
    targetCoords[1] = targetCoords[1] * (margin[1] * 2 + 1) - margin[1]

    const vignetteCoords: Vec2 = [uv[0] * (1 - uv[1]), uv[1] * (1 - uv[0])]
    const vignette = Math.pow(prod2(vignetteCoords) * 15, 0.25)

    const samplerColor = texture([targetCoords[0] * maxX, targetCoords[1] * maxY])

    return [samplerColor[0] * vignette, samplerColor[1] * vignette, samplerColor[2] * vignette, 255]
  })
}
