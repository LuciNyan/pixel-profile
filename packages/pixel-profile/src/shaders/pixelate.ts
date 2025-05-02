import type { RGBA } from '../renderer'
import { render } from '../renderer'

export type PixelateOptions = {
  blockSize: number
  samplingMode?: 'center' | 'average' | 'dominant'
  antiAlias?: boolean
}

export function pixelate(source: Buffer, width: number, height: number, options: number | PixelateOptions): Buffer {
  const opts: PixelateOptions = typeof options === 'number' ? { blockSize: options } : options

  const { blockSize, samplingMode = 'center', antiAlias = true } = opts
  const halfBlockSize = blockSize / 2

  return render(source, width, height, (coords, texture) => {
    const x = Math.floor(coords[0] / blockSize)
    const y = Math.floor(coords[1] / blockSize)
    const blockX = x * blockSize
    const blockY = y * blockSize

    if (samplingMode === 'center') {
      return texture([blockX + halfBlockSize, blockY + halfBlockSize])
    }

    const samples: RGBA[] = []
    const samplePoints = antiAlias ? 4 : 1

    for (let i = 0; i < samplePoints; i++) {
      for (let j = 0; j < samplePoints; j++) {
        const offsetX = (i + 0.5) * (blockSize / samplePoints)
        const offsetY = (j + 0.5) * (blockSize / samplePoints)
        samples.push(texture([blockX + offsetX, blockY + offsetY]))
      }
    }

    if (samplingMode === 'average') {
      const sum = samples.reduce(
        (acc, color) => {
          return [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2], acc[3] + color[3]] as RGBA
        },
        [0, 0, 0, 0] as RGBA
      )

      return sum.map((v) => v / samples.length) as RGBA
    } else {
      const colorMap = new Map<string, RGBA>()
      samples.forEach((color) => {
        const key = color.join(',')
        colorMap.set(key, color)
      })

      let maxCount = 0
      let dominantColor = samples[0]

      colorMap.forEach((color, key) => {
        const count = samples.filter((c) => c.join(',') === key).length
        if (count > maxCount) {
          maxCount = count
          dominantColor = color
        }
      })

      return dominantColor
    }
  })
}
