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

  const samplePoints = antiAlias ? 4 : 1
  const sampleOffsets: [number, number][] = []
  for (let i = 0; i < samplePoints; i++) {
    for (let j = 0; j < samplePoints; j++) {
      sampleOffsets.push([(i + 0.5) * (blockSize / samplePoints), (j + 0.5) * (blockSize / samplePoints)])
    }
  }

  return render(source, width, height, (coords, texture) => {
    const x = Math.floor(coords[0] / blockSize)
    const y = Math.floor(coords[1] / blockSize)
    const blockX = x * blockSize
    const blockY = y * blockSize

    if (samplingMode === 'center') {
      return texture([blockX + halfBlockSize, blockY + halfBlockSize])
    }

    const samples: RGBA[] = []
    samples.length = sampleOffsets.length
    for (let i = 0; i < sampleOffsets.length; i++) {
      const [offsetX, offsetY] = sampleOffsets[i]
      samples[i] = texture([blockX + offsetX, blockY + offsetY])
    }

    if (samplingMode === 'average') {
      const sum: RGBA = [0, 0, 0, 0]
      for (const color of samples) {
        sum[0] += color[0]
        sum[1] += color[1]
        sum[2] += color[2]
        sum[3] += color[3]
      }
      const count = samples.length

      return [sum[0] / count, sum[1] / count, sum[2] / count, sum[3] / count] as RGBA
    } else {
      const colorCount = new Map<string, { color: RGBA; count: number }>()
      let maxCount = 0
      let dominantColor = samples[0]

      for (const color of samples) {
        const key = color.join(',')
        const entry = colorCount.get(key)
        if (entry) {
          entry.count++
          if (entry.count > maxCount) {
            maxCount = entry.count
            dominantColor = entry.color
          }
        } else {
          colorCount.set(key, { color, count: 1 })
        }
      }

      return dominantColor
    }
  })
}
