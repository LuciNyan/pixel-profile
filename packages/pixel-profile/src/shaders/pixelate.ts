import { render } from '../renderer'

export function pixelate(source: Buffer, width: number, height: number, blockSize: number): Buffer {
  return render(source, width, height, (coords, texture) => {
    const x = Math.floor(coords[0] / blockSize)
    const y = Math.floor(coords[1] / blockSize)

    return texture([x * blockSize + blockSize / 2, y * blockSize + blockSize / 2])
  })
}
