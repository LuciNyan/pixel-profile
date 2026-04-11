import type { Vec3 } from '../utils/math'

interface GlowOptions {
  radius: number
  intensity: number
  threshold: number
  color: Vec3
  layers: number
  falloff: 'exponential' | 'linear' | 'gaussian'
  adaptiveThreshold: boolean
}

const defaultOptions: GlowOptions = {
  radius: 1,
  intensity: 0.7,
  threshold: 0.8,
  color: [1, 1, 1],
  layers: 2,
  falloff: 'gaussian',
  adaptiveThreshold: true
}

function calculateAdaptiveThreshold(source: Buffer, width: number, height: number): number {
  let totalWeightedSum = 0
  const size = width * height

  for (let i = 0; i < size * 4; i += 4) {
    totalWeightedSum += source[i] * 0.2126 + source[i + 1] * 0.7152 + source[i + 2] * 0.0722
  }

  const avgLuminance = totalWeightedSum / (size * 255)

  return Math.max(0.6, Math.min(0.9, avgLuminance + 0.3))
}

function getFalloffFunction(type: string): (dist: number, radiusSquared: number) => number {
  switch (type) {
    case 'linear':
      return (dist, radiusSquared) => Math.max(0, 1 - dist / Math.sqrt(radiusSquared))
    case 'gaussian':
      return (dist, radiusSquared) => Math.exp(-dist / radiusSquared)
    case 'exponential':
      return (dist, radiusSquared) => Math.exp(-Math.sqrt(dist / radiusSquared))
    default:
      return (dist, radiusSquared) => Math.exp(-dist / radiusSquared)
  }
}

function buildWeightTable(
  currentRadius: number,
  falloffFn: (dist: number, radiusSquared: number) => number
): Float64Array {
  const radiusSquared = currentRadius * currentRadius * 2
  const weights = new Float64Array(currentRadius * 2 + 1)

  for (let i = -currentRadius; i <= currentRadius; i++) {
    weights[i + currentRadius] = falloffFn(i * i, radiusSquared)
  }

  return weights
}

function buildLuminanceMap(input: Buffer | Float32Array, size: number): Float64Array {
  const lum = new Float64Array(size)

  for (let i = 0; i < size; i++) {
    const idx = i * 4
    lum[i] = (input[idx] * 0.2126 + input[idx + 1] * 0.7152 + input[idx + 2] * 0.0722) / 255
  }

  return lum
}

export function glow(source: Buffer, width: number, height: number, userOptions: Partial<GlowOptions> = {}): Buffer {
  const options = { ...defaultOptions, ...userOptions }
  const { radius, intensity, color, layers, falloff, adaptiveThreshold, threshold: _threshold } = options
  const threshold = adaptiveThreshold ? calculateAdaptiveThreshold(source, width, height) : _threshold
  const falloffFn = getFalloffFunction(falloff)

  const rowPrefix = new Int32Array(width + 1)
  const colPrefix = new Int32Array((height + 1) * width)

  function horizontalPass(
    input: Buffer | Float32Array,
    output: Float32Array,
    luminance: Float64Array,
    currentRadius: number,
    weights: Float64Array
  ) {
    const maxX = width - 1
    const diameter = currentRadius * 2 + 1
    let totalWeight = 0
    for (let w = 0; w < diameter; w++) totalWeight += weights[w]

    for (let y = 0; y < height; y++) {
      const rowOffset = y * width

      rowPrefix[0] = 0
      for (let x = 0; x < width; x++) {
        rowPrefix[x + 1] = rowPrefix[x] + (luminance[rowOffset + x] > threshold ? 1 : 0)
      }

      for (let x = 0; x < width; x++) {
        const centerIdx = (rowOffset + x) * 4

        const lo = Math.max(0, x - currentRadius)
        const hi = Math.min(maxX, x + currentRadius)
        const brightCount = rowPrefix[hi + 1] - rowPrefix[lo]

        if (brightCount === 0) {
          output[centerIdx] = input[centerIdx]
          output[centerIdx + 1] = input[centerIdx + 1]
          output[centerIdx + 2] = input[centerIdx + 2]
          output[centerIdx + 3] = input[centerIdx + 3]
          continue
        }

        if (x >= currentRadius && x <= maxX - currentRadius && brightCount === diameter) {
          let sumR = 0
          let sumG = 0
          let sumB = 0
          let si = (rowOffset + x - currentRadius) * 4
          for (let i = 0; i < diameter; i++) {
            const wt = weights[i]
            sumR += input[si] * wt
            sumG += input[si + 1] * wt
            sumB += input[si + 2] * wt
            si += 4
          }
          output[centerIdx] = sumR / totalWeight
          output[centerIdx + 1] = sumG / totalWeight
          output[centerIdx + 2] = sumB / totalWeight
          output[centerIdx + 3] = 255
          continue
        }

        let sumR = 0
        let sumG = 0
        let sumB = 0
        let weightSum = 0

        for (let i = -currentRadius; i <= currentRadius; i++) {
          const sampleX = Math.min(Math.max(x + i, 0), maxX)
          const sampleIdx = (rowOffset + sampleX) * 4

          if (luminance[rowOffset + sampleX] > threshold) {
            const weight = weights[i + currentRadius]

            sumR += input[sampleIdx] * weight
            sumG += input[sampleIdx + 1] * weight
            sumB += input[sampleIdx + 2] * weight
            weightSum += weight
          }
        }

        if (weightSum > 0) {
          output[centerIdx] = sumR / weightSum
          output[centerIdx + 1] = sumG / weightSum
          output[centerIdx + 2] = sumB / weightSum
          output[centerIdx + 3] = 255
        } else {
          output[centerIdx] = input[centerIdx]
          output[centerIdx + 1] = input[centerIdx + 1]
          output[centerIdx + 2] = input[centerIdx + 2]
          output[centerIdx + 3] = input[centerIdx + 3]
        }
      }
    }
  }

  function verticalPass(
    input: Float32Array,
    output: Float32Array,
    luminance: Float64Array,
    currentRadius: number,
    weights: Float64Array
  ) {
    const maxY = height - 1
    const diameter = currentRadius * 2 + 1
    let totalWeight = 0
    for (let w = 0; w < diameter; w++) totalWeight += weights[w]
    const w4 = width * 4

    for (let y = 0; y < height; y++) {
      const currRow = (y + 1) * width
      const prevRow = y * width
      for (let x = 0; x < width; x++) {
        colPrefix[currRow + x] = colPrefix[prevRow + x] + (luminance[prevRow + x] > threshold ? 1 : 0)
      }
    }

    for (let y = 0; y < height; y++) {
      const lo = Math.max(0, y - currentRadius)
      const hi = Math.min(maxY, y + currentRadius)
      const loRow = lo * width
      const hiRow = (hi + 1) * width

      for (let x = 0; x < width; x++) {
        const centerIdx = (y * width + x) * 4
        const brightCount = colPrefix[hiRow + x] - colPrefix[loRow + x]

        if (brightCount === 0) {
          output[centerIdx] = input[centerIdx]
          output[centerIdx + 1] = input[centerIdx + 1]
          output[centerIdx + 2] = input[centerIdx + 2]
          output[centerIdx + 3] = input[centerIdx + 3]
          continue
        }

        if (y >= currentRadius && y <= maxY - currentRadius && brightCount === diameter) {
          let sumR = 0
          let sumG = 0
          let sumB = 0
          let si = ((y - currentRadius) * width + x) * 4
          for (let i = 0; i < diameter; i++) {
            const wt = weights[i]
            sumR += input[si] * wt
            sumG += input[si + 1] * wt
            sumB += input[si + 2] * wt
            si += w4
          }
          output[centerIdx] = sumR / totalWeight
          output[centerIdx + 1] = sumG / totalWeight
          output[centerIdx + 2] = sumB / totalWeight
          output[centerIdx + 3] = 255
          continue
        }

        let sumR = 0
        let sumG = 0
        let sumB = 0
        let weightSum = 0

        for (let i = -currentRadius; i <= currentRadius; i++) {
          const sampleY = Math.min(Math.max(y + i, 0), maxY)
          const sampleIdx = (sampleY * width + x) * 4

          if (luminance[sampleY * width + x] > threshold) {
            const weight = weights[i + currentRadius]

            sumR += input[sampleIdx] * weight
            sumG += input[sampleIdx + 1] * weight
            sumB += input[sampleIdx + 2] * weight
            weightSum += weight
          }
        }

        if (weightSum > 0) {
          output[centerIdx] = sumR / weightSum
          output[centerIdx + 1] = sumG / weightSum
          output[centerIdx + 2] = sumB / weightSum
          output[centerIdx + 3] = 255
        } else {
          output[centerIdx] = input[centerIdx]
          output[centerIdx + 1] = input[centerIdx + 1]
          output[centerIdx + 2] = input[centerIdx + 2]
          output[centerIdx + 3] = input[centerIdx + 3]
        }
      }
    }
  }

  const size = width * height
  const sourceLuminance = buildLuminanceMap(source, size)
  const horizontalBlur = new Float32Array(size * 4)
  const hBlurLuminance = new Float64Array(size)
  const glowLayers: Float32Array[] = []

  for (let i = 0; i < layers; i++) {
    const currentRadius = Math.floor(radius * (i + 1))
    const currentLayer = new Float32Array(size * 4)
    const weights = buildWeightTable(currentRadius, falloffFn)

    horizontalPass(source, horizontalBlur, sourceLuminance, currentRadius, weights)

    for (let j = 0; j < size; j++) {
      const idx = j * 4
      hBlurLuminance[j] =
        (horizontalBlur[idx] * 0.2126 + horizontalBlur[idx + 1] * 0.7152 + horizontalBlur[idx + 2] * 0.0722) / 255
    }
    verticalPass(horizontalBlur, currentLayer, hBlurLuminance, currentRadius, weights)

    glowLayers.push(currentLayer)
  }

  const result = Buffer.allocUnsafe(size * 4)
  const [colorR, colorG, colorB] = color

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width

    for (let x = 0; x < width; x++) {
      const idx = (rowOffset + x) * 4
      let finalR = source[idx]
      let finalG = source[idx + 1]
      let finalB = source[idx + 2]

      for (let i = 0; i < layers; i++) {
        const currentIntensity = intensity / (i + 1)
        const oneMinusT = 1 - currentIntensity
        const layerBuffer = glowLayers[i]

        const tintedR = layerBuffer[idx] * colorR
        const tintedG = layerBuffer[idx + 1] * colorG
        const tintedB = layerBuffer[idx + 2] * colorB

        finalR = finalR * oneMinusT + tintedR * currentIntensity
        finalG = finalG * oneMinusT + tintedG * currentIntensity
        finalB = finalB * oneMinusT + tintedB * currentIntensity
      }

      result[idx] = finalR
      result[idx + 1] = finalG
      result[idx + 2] = finalB
      result[idx + 3] = 255
    }
  }

  return result
}
