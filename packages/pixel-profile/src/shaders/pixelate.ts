import type { RGBA } from '../renderer'
import { render } from '../renderer'
import { sampleBilinear } from '../utils/bilinear'

export type PixelateOptions = {
  blockSize: number
  samplingMode?: 'center' | 'average' | 'dominant'
  antiAlias?: boolean
}

export function pixelate(source: Buffer, width: number, height: number, options: number | PixelateOptions): Buffer {
  const opts: PixelateOptions = typeof options === 'number' ? { blockSize: options } : options

  const { blockSize, samplingMode = 'center', antiAlias = true } = opts

  if (samplingMode === 'center') {
    return pixelateCenter(source, width, height, blockSize)
  }

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

function pixelateCenter(source: Buffer, width: number, height: number, blockSize: number): Buffer {
  const maxX = width - 1
  const maxY = height - 1
  const target = Buffer.alloc(width * height * 4)
  const halfBlock = blockSize / 2

  const blocksX = Math.ceil(width / blockSize)
  const blocksY = Math.ceil(height / blockSize)

  const blockColors = new Float64Array(blocksX * blocksY * 4)
  for (let by = 0; by < blocksY; by++) {
    const centerY = by * blockSize + halfBlock
    for (let bx = 0; bx < blocksX; bx++) {
      const centerX = bx * blockSize + halfBlock
      const color = sampleBilinear(source, width, maxX, maxY, centerX, centerY)
      const bi = (by * blocksX + bx) * 4
      blockColors[bi] = color[0]
      blockColors[bi + 1] = color[1]
      blockColors[bi + 2] = color[2]
      blockColors[bi + 3] = color[3]
    }
  }

  for (let py = 0; py < height; py++) {
    const bky = Math.floor(py / blockSize)
    for (let px = 0; px < width; px++) {
      const bkx = Math.floor(px / blockSize)
      const bi = (bky * blocksX + bkx) * 4
      const idx = (py * width + px) * 4
      target[idx] = blockColors[bi]
      target[idx + 1] = blockColors[bi + 1]
      target[idx + 2] = blockColors[bi + 2]
      target[idx + 3] = blockColors[bi + 3]
    }
  }

  return target
}
