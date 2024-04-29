import { coordsToPixel, PixelCoords, RGBA, Texture } from '../common'

export function genNearestNeighborFilter(pixels: Buffer, width: number): Texture {
  function nearestNeighborFilter(coords: PixelCoords): RGBA {
    const nearestX = Math.round(coords[0])
    const nearestY = Math.round(coords[1])

    return coordsToPixel(pixels, nearestX, nearestY, width)
  }

  return nearestNeighborFilter
}
