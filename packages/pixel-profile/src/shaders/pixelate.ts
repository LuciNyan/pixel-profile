import { render } from '../renderer'

export function pixelate(source: Buffer, width: number, height: number, blockSize: number): Buffer {
  return render(source, width, height, (uv, texture2D) => {
    const blockW = blockSize / width
    const blockH = blockSize / height
    const x = Math.floor(uv[0] / blockW)
    const y = Math.floor(uv[1] / blockH)

    return texture2D([x * blockW + blockW / 2, y * blockH + blockH / 2])
  })
}
