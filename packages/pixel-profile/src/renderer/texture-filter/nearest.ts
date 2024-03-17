import { Coordinates, coordsToPixel, RGBA, Texture2D } from '../common'

export function genNearestNeighborFilter(pixels: Buffer, width: number, height: number): Texture2D {
  const maxX = width - 1
  const maxY = height - 1

  function nearestNeighborFilter(coords: Coordinates): RGBA {
    const x = coords[0] * maxX
    const y = coords[1] * maxY

    // 计算最近邻像素的坐标
    const nearestX = Math.round(x)
    const nearestY = Math.round(y)

    return coordsToPixel(pixels, nearestX, nearestY, width)
  }

  return nearestNeighborFilter
}
