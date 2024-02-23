import type { Coordinates, Vec2 } from '../utils'
import { add2, dot2, prod2, render, subtract2 } from '../utils'

const margin = [0, 0]
const screenCurvature = 0.1

export function curve(source: Buffer, width: number, height: number): Buffer {
  return render(source, width, height, (uv, texture2D) => {
    function distortCoordinates(coords: Coordinates): Vec2 {
      const cc = subtract2(coords, [0.5, 0.5])
      const dist = dot2(cc, cc) * screenCurvature
      const temp = (1 + dist) * dist
      cc[0] = cc[0] * temp
      cc[1] = cc[1] * temp

      return add2(coords, cc)
    }

    const coords = distortCoordinates(uv)

    coords[0] = coords[0] * (margin[0] * 2 + 1) - margin[0]
    coords[1] = coords[1] * (margin[1] * 2 + 1) - margin[1]

    const vignetteCoords: Vec2 = [uv[0] * (1 - uv[1]), uv[1] * (1 - uv[0])]
    const vignette = Math.pow(prod2(vignetteCoords) * 15, 0.25)

    const samplerColor = texture2D(coords)

    return [samplerColor[0] * vignette, samplerColor[1] * vignette, samplerColor[2] * vignette, 255]
  })
}
