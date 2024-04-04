import { Coordinates, coordsToPixel, RGBA, Texture2D } from '../common'

export function genNearestNeighborFilter(pixels: Buffer, width: number): Texture2D {
  function nearestNeighborFilter(coords: Coordinates): RGBA {
    const nearestX = Math.round(coords[0])
    const nearestY = Math.round(coords[1])

    return coordsToPixel(pixels, nearestX, nearestY, width)
  }

  return nearestNeighborFilter
}
