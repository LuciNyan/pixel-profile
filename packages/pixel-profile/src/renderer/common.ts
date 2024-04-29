export type PixelCoords = [number, number]
export type RGBA = [number, number, number, number]
export type Texture = (coords: PixelCoords) => RGBA
export type FragShader = (coords: PixelCoords, texture: Texture) => RGBA

export function coordsToIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4
}

export function coordsToPixel(source: Buffer, x: number, y: number, width: number): RGBA {
  const index = coordsToIndex(x, y, width)

  return [source[index], source[index + 1], source[index + 2], source[index + 3]]
}
