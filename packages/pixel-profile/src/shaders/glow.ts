import { coordsToIndex, render } from '../renderer'
import { mix3, multiply3, type Vec3 } from '../utils/math'

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
  let totalLuminance = 0
  const size = width * height

  for (let i = 0; i < size * 4; i += 4) {
    const r = source[i]
    const g = source[i + 1]
    const b = source[i + 2]
    totalLuminance += (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255
  }

  const avgLuminance = totalLuminance / size

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

export function glow(source: Buffer, width: number, height: number, userOptions: Partial<GlowOptions> = {}): Buffer {
  const options = { ...defaultOptions, ...userOptions }
  const { radius, intensity, color, layers, falloff, adaptiveThreshold, threshold: _threshold } = options
  const threshold = adaptiveThreshold ? calculateAdaptiveThreshold(source, width, height) : _threshold
  const falloffFn = getFalloffFunction(falloff)

  function horizontalPass(input: Buffer | Float32Array, output: Float32Array, currentRadius: number) {
    const radiusSquared = currentRadius * currentRadius * 2

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const centerIdx = (y * width + x) * 4
        let sumR = 0
        let sumG = 0
        let sumB = 0
        let weightSum = 0

        for (let i = -currentRadius; i <= currentRadius; i++) {
          const sampleX = Math.min(Math.max(x + i, 0), width - 1)
          const sampleIdx = (y * width + sampleX) * 4

          const r = input[sampleIdx]
          const g = input[sampleIdx + 1]
          const b = input[sampleIdx + 2]
          const luminance = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255

          if (luminance > threshold) {
            const dist = i * i
            const weight = falloffFn(dist, radiusSquared)

            sumR += r * weight
            sumG += g * weight
            sumB += b * weight
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

  function verticalPass(input: Float32Array, output: Float32Array, currentRadius: number) {
    const radiusSquared = currentRadius * currentRadius * 2

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const centerIdx = (y * width + x) * 4
        let sumR = 0
        let sumG = 0
        let sumB = 0
        let weightSum = 0

        for (let i = -currentRadius; i <= currentRadius; i++) {
          const sampleY = Math.min(Math.max(y + i, 0), height - 1)
          const sampleIdx = (sampleY * width + x) * 4

          const r = input[sampleIdx]
          const g = input[sampleIdx + 1]
          const b = input[sampleIdx + 2]
          const luminance = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255

          if (luminance > threshold) {
            const dist = i * i
            const weight = falloffFn(dist, radiusSquared)

            sumR += r * weight
            sumG += g * weight
            sumB += b * weight
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
  const horizontalBlur = new Float32Array(size * 4)

  const glowLayers: Float32Array[] = []

  for (let i = 0; i < layers; i++) {
    const currentRadius = Math.floor(radius * (i + 1))
    const currentLayer = new Float32Array(size * 4)

    horizontalPass(source, horizontalBlur, currentRadius)
    verticalPass(horizontalBlur, currentLayer, currentRadius)

    glowLayers.push(currentLayer)
  }

  return render(
    source,
    width,
    height,
    (uv, texture2D) => {
      const originalColor = texture2D(uv)
      let finalColor: Vec3 = [originalColor[0], originalColor[1], originalColor[2]]

      for (let i = 0; i < layers; i++) {
        const currentIntensity = intensity / (i + 1)
        const layerBuffer = glowLayers[i]

        const glowColor = [
          layerBuffer[coordsToIndex(uv[0], uv[1], width) * 4],
          layerBuffer[coordsToIndex(uv[0], uv[1], width) * 4 + 1],
          layerBuffer[coordsToIndex(uv[0], uv[1], width) * 4 + 2]
        ] as Vec3

        const tintedGlow = multiply3(glowColor, color)

        finalColor = mix3(finalColor, tintedGlow, currentIntensity)
      }

      return [finalColor[0], finalColor[1], finalColor[2], 255]
    },
    { textureFilter: 'NEAREST' }
  )
}
