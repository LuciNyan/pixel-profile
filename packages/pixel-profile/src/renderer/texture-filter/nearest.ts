import { clamp } from '../../utils'
import { Coordinates, coordsToPixel, RGBA, Texture2D } from '../common'

export function genNearestNeighborFilter(pixels: Buffer, width: number, height: number): Texture2D {
  const maxX = width - 1
  const maxY = height - 1

  function nearestNeighborFilter(coords: Coordinates): RGBA {
    coords[0] = clamp(coords[0], 0, 1)
    coords[1] = clamp(coords[1], 0, 1)

    const x = coords[0] * maxX
    const y = coords[1] * maxY

    const nearestX = Math.round(x)
    const nearestY = Math.round(y)

    return coordsToPixel(pixels, nearestX, nearestY, width)
  }

  return nearestNeighborFilter
}
