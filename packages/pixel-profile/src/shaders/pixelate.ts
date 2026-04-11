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

  if (samplingMode === 'dominant') {
    return pixelateDominant(source, width, height, blockSize, antiAlias)
  }

  return pixelateAverage(source, width, height, blockSize, antiAlias)
}

function buildSampleOffsets(blockSize: number, antiAlias: boolean): [number, number][] {
  const samplePoints = antiAlias ? 4 : 1
  const offsets: [number, number][] = []
  for (let i = 0; i < samplePoints; i++) {
    for (let j = 0; j < samplePoints; j++) {
      offsets.push([(i + 0.5) * (blockSize / samplePoints), (j + 0.5) * (blockSize / samplePoints)])
    }
  }

  return offsets
}

function pixelateDominant(
  source: Buffer,
  width: number,
  height: number,
  blockSize: number,
  antiAlias: boolean
): Buffer {
  const maxX = width - 1
  const maxY = height - 1
  const target = Buffer.alloc(width * height * 4)
  const offsets = buildSampleOffsets(blockSize, antiAlias)
  const numSamples = offsets.length

  const blocksX = Math.ceil(width / blockSize)
  const blocksY = Math.ceil(height / blockSize)

  const blockColors = new Float64Array(blocksX * blocksY * 4)

  for (let by = 0; by < blocksY; by++) {
    const blockY = by * blockSize
    for (let bx = 0; bx < blocksX; bx++) {
      const blockX = bx * blockSize

      const colorCount = new Map<string, { color: [number, number, number, number]; count: number }>()
      let maxCount = 0
      let dominantColor: [number, number, number, number] | null = null

      for (let s = 0; s < numSamples; s++) {
        const color = sampleBilinear(source, width, maxX, maxY, blockX + offsets[s][0], blockY + offsets[s][1])
        const key = `${color[0]},${color[1]},${color[2]},${color[3]}`

        if (s === 0) dominantColor = color

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

      const bi = (by * blocksX + bx) * 4
      blockColors[bi] = dominantColor![0]
      blockColors[bi + 1] = dominantColor![1]
      blockColors[bi + 2] = dominantColor![2]
      blockColors[bi + 3] = dominantColor![3]
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

function pixelateAverage(source: Buffer, width: number, height: number, blockSize: number, antiAlias: boolean): Buffer {
  const maxX = width - 1
  const maxY = height - 1
  const target = Buffer.alloc(width * height * 4)
  const offsets = buildSampleOffsets(blockSize, antiAlias)
  const numSamples = offsets.length

  const blocksX = Math.ceil(width / blockSize)
  const blocksY = Math.ceil(height / blockSize)

  const blockColors = new Float64Array(blocksX * blocksY * 4)

  for (let by = 0; by < blocksY; by++) {
    const blockY = by * blockSize
    for (let bx = 0; bx < blocksX; bx++) {
      const blockX = bx * blockSize
      let sumR = 0
      let sumG = 0
      let sumB = 0
      let sumA = 0

      for (let s = 0; s < numSamples; s++) {
        const color = sampleBilinear(source, width, maxX, maxY, blockX + offsets[s][0], blockY + offsets[s][1])
        sumR += color[0]
        sumG += color[1]
        sumB += color[2]
        sumA += color[3]
      }

      const bi = (by * blocksX + bx) * 4
      blockColors[bi] = sumR / numSamples
      blockColors[bi + 1] = sumG / numSamples
      blockColors[bi + 2] = sumB / numSamples
      blockColors[bi + 3] = sumA / numSamples
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
