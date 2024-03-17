export type Coordinates = [number, number]
export type RGBA = [number, number, number, number]
export type Texture2D = (coords: Coordinates) => RGBA
export type FragShader = (uv: Coordinates, texture2D: Texture2D) => RGBA

export function coordsToIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4
}
