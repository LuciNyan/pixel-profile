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

  const MAX_DISTINCT = 16
  const sampleR = new Float64Array(MAX_DISTINCT)
  const sampleG = new Float64Array(MAX_DISTINCT)
  const sampleB = new Float64Array(MAX_DISTINCT)
  const sampleA = new Float64Array(MAX_DISTINCT)
  const sampleCount = new Uint8Array(MAX_DISTINCT)

  for (let by = 0; by < blocksY; by++) {
    const blockY = by * blockSize
    for (let bx = 0; bx < blocksX; bx++) {
      const blockX = bx * blockSize

      let numDistinct = 0
      let maxCount = 0
      let domR = 0
      let domG = 0
      let domB = 0
      let domA = 0

      for (let s = 0; s < numSamples; s++) {
        const fx = blockX + offsets[s][0]
        const fy = blockY + offsets[s][1]

        const cx = Math.min(maxX, Math.max(0, fx))
        const cy = Math.min(maxY, Math.max(0, fy))
        const x0 = Math.min(Math.max(Math.floor(cx), 0), maxX)
        const x1 = Math.min(x0 + 1, maxX)
        const y0 = Math.min(Math.max(Math.floor(cy), 0), maxY)
        const y1 = Math.min(y0 + 1, maxY)
        const sx = cx - x0
        const sy = cy - y0
        const osx = 1 - sx
        const osy = 1 - sy
        const i00 = (y0 * width + x0) * 4
        const i10 = (y0 * width + x1) * 4
        const i01 = (y1 * width + x0) * 4
        const i11 = (y1 * width + x1) * 4
        const r = (source[i00] * osx + source[i10] * sx) * osy + (source[i01] * osx + source[i11] * sx) * sy
        const g =
          (source[i00 + 1] * osx + source[i10 + 1] * sx) * osy + (source[i01 + 1] * osx + source[i11 + 1] * sx) * sy
        const b =
          (source[i00 + 2] * osx + source[i10 + 2] * sx) * osy + (source[i01 + 2] * osx + source[i11 + 2] * sx) * sy
        const a =
          (source[i00 + 3] * osx + source[i10 + 3] * sx) * osy + (source[i01 + 3] * osx + source[i11 + 3] * sx) * sy

        if (s === 0) {
          domR = r
          domG = g
          domB = b
          domA = a
        }

        let found = false
        for (let c = 0; c < numDistinct; c++) {
          if (sampleR[c] === r && sampleG[c] === g && sampleB[c] === b && sampleA[c] === a) {
            sampleCount[c]++
            if (sampleCount[c] > maxCount) {
              maxCount = sampleCount[c]
              domR = r
              domG = g
              domB = b
              domA = a
            }
            found = true
            break
          }
        }
        if (!found) {
          sampleR[numDistinct] = r
          sampleG[numDistinct] = g
          sampleB[numDistinct] = b
          sampleA[numDistinct] = a
          sampleCount[numDistinct] = 1
          numDistinct++
        }
      }

      const bi = (by * blocksX + bx) * 4
      blockColors[bi] = domR
      blockColors[bi + 1] = domG
      blockColors[bi + 2] = domB
      blockColors[bi + 3] = domA

      for (let c = 0; c < numDistinct; c++) sampleCount[c] = 0
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
        const fx = blockX + offsets[s][0]
        const fy = blockY + offsets[s][1]

        const cx = Math.min(maxX, Math.max(0, fx))
        const cy = Math.min(maxY, Math.max(0, fy))
        const x0 = Math.min(Math.max(Math.floor(cx), 0), maxX)
        const x1 = Math.min(x0 + 1, maxX)
        const y0 = Math.min(Math.max(Math.floor(cy), 0), maxY)
        const y1 = Math.min(y0 + 1, maxY)
        const sx = cx - x0
        const sy = cy - y0
        const osx = 1 - sx
        const osy = 1 - sy
        const i00 = (y0 * width + x0) * 4
        const i10 = (y0 * width + x1) * 4
        const i01 = (y1 * width + x0) * 4
        const i11 = (y1 * width + x1) * 4

        sumR += (source[i00] * osx + source[i10] * sx) * osy + (source[i01] * osx + source[i11] * sx) * sy
        sumG +=
          (source[i00 + 1] * osx + source[i10 + 1] * sx) * osy + (source[i01 + 1] * osx + source[i11 + 1] * sx) * sy
        sumB +=
          (source[i00 + 2] * osx + source[i10 + 2] * sx) * osy + (source[i01 + 2] * osx + source[i11 + 2] * sx) * sy
        sumA +=
          (source[i00 + 3] * osx + source[i10 + 3] * sx) * osy + (source[i01 + 3] * osx + source[i11 + 3] * sx) * sy
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
