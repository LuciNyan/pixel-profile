import { render } from '../renderer'

export function pixelate(source: Buffer, width: number, height: number, blockSize: number): Buffer {
  return render(source, width, height, (uv, texture2D) => {
    const x = Math.floor(uv[0] / blockSize)
    const y = Math.floor(uv[1] / blockSize)

    return texture2D([x * blockSize + blockSize / 2, y * blockSize + blockSize / 2])
  })
}
