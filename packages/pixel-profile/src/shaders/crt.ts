import { render } from '../renderer'
import type { Vec2 } from '../utils'
import { add2, clamp, dot2, length2, subtract2 } from '../utils'

interface CRTOptions {
  // Curvature (0.0 to 0.5, higher = more curved)
  curvatureX: number
  curvatureY: number
  // Corner size (0.0 to 0.3)
  cornerSize: number
  // Vignette darkness (0.0 to 1.0)
  vignetteDarkness: number
  // Scan line strength (0.0 to 1.0)
  scanLineStrength: number
  // Scan line count (integer)
  scanLineCount: number
  // RGB separation amount (0.0 to 5.0)
  rgbShift: number
  // Bloom amount (0.0 to 0.5)
  bloomAmount: number
  // Noise intensity (0.0 to 0.3)
  noiseIntensity: number
  // Border size as fraction of screen (0.0 to 0.1)
  borderSize: number
}

// Default CRT options
const defaultCRTOptions: CRTOptions = {
  curvatureX: 0.03,
  curvatureY: 0.03,
  cornerSize: 0.05,
  vignetteDarkness: 0.2,
  scanLineStrength: 0.15,
  scanLineCount: 240,
  rgbShift: 0.5,
  bloomAmount: 0.25,
  noiseIntensity: 0.05,
  borderSize: 0.03
}

function randomNoise(coords: Vec2): number {
  const x = Math.sin(dot2(coords, [12.9898, 78.233])) * 43758.5453

  return (x - Math.floor(x)) * 2.0 - 1.0
}

export function crt(source: Buffer, width: number, height: number, options: Partial<CRTOptions> = {}): Buffer {
  const opts: CRTOptions = { ...defaultCRTOptions, ...options }

  return render(source, width, height, (coords, texture) => {
    const maxX = width - 1
    const maxY = height - 1

    const uv: Vec2 = [coords[0] / width, coords[1] / height]

    // Apply barrel distortion (CRT curvature)
    function distortCoordinates(coords: Vec2): Vec2 {
      // Center coordinates around (0,0)
      const centered: Vec2 = subtract2(coords, [0.5, 0.5])

      // Calculate distance from center (for curved screen effect)
      const distSquared = dot2(centered, centered)

      // Apply differential curvature in X and Y directions
      const curveFactor: Vec2 = [
        1.0 + distSquared * (opts.curvatureX * 5.0),
        1.0 + distSquared * (opts.curvatureY * 5.0)
      ]

      // Apply barrel distortion
      const distorted: Vec2 = [centered[0] * curveFactor[0], centered[1] * curveFactor[1]]

      // Move back to [0,1] range
      return add2(distorted, [0.5, 0.5])
    }

    // Apply barrel distortion
    const distortedCoords = distortCoordinates(uv)

    // Handle borders - check if we're outside the visible area
    const borderMargin = opts.borderSize
    const inBounds =
      distortedCoords[0] >= borderMargin &&
      distortedCoords[0] <= 1.0 - borderMargin &&
      distortedCoords[1] >= borderMargin &&
      distortedCoords[1] <= 1.0 - borderMargin

    if (!inBounds) {
      // Return black for areas outside the visible display
      return [0, 0, 0, 255]
    }

    // Rescale coordinates to account for border
    const rescaledCoords: Vec2 = [
      (distortedCoords[0] - borderMargin) / (1.0 - 2.0 * borderMargin),
      (distortedCoords[1] - borderMargin) / (1.0 - 2.0 * borderMargin)
    ]

    // Calculate pixel coordinates for texture sampling
    const pixelCoords: Vec2 = [rescaledCoords[0] * maxX, rescaledCoords[1] * maxY]

    // Vignette effect - stronger near edges and corners
    const vignetteCoords: Vec2 = subtract2(rescaledCoords, [0.5, 0.5])
    const distFromCenter = length2(vignetteCoords)
    const cornerDistance = Math.min(Math.abs(vignetteCoords[0]) + Math.abs(vignetteCoords[1]) * opts.cornerSize, 1.0)

    // Combine radial and corner vignette
    const vignette = clamp(
      (1.0 - distFromCenter * 1.5) * (1.0 - cornerDistance * 0.5),
      1.0 - opts.vignetteDarkness,
      1.0
    )

    // RGB Shift (chromatic aberration)
    const rgbShiftAmount = opts.rgbShift * 0.01
    const shiftDir = vignetteCoords

    let r = 0
    let g = 0
    let b = 0

    // Shifted red channel
    const redCoords: Vec2 = [
      pixelCoords[0] + shiftDir[0] * rgbShiftAmount * maxX,
      pixelCoords[1] + shiftDir[1] * rgbShiftAmount * maxY
    ]
    const redSample = texture(redCoords)
    r = redSample[0]

    // Green channel uses original coordinates
    const greenSample = texture(pixelCoords)
    g = greenSample[1]

    // Shifted blue channel (opposite direction)
    const blueCoords: Vec2 = [
      pixelCoords[0] - shiftDir[0] * rgbShiftAmount * maxX,
      pixelCoords[1] - shiftDir[1] * rgbShiftAmount * maxY
    ]
    const blueSample = texture(blueCoords)
    b = blueSample[2]

    // Scan lines effect
    const scanLineY = Math.floor(rescaledCoords[1] * opts.scanLineCount) % 2
    const scanLine = 1.0 - scanLineY * opts.scanLineStrength

    // Add subtle noise/grain
    const noise = 1.0 + randomNoise(uv) * opts.noiseIntensity

    // Bloom/glow effect for bright areas
    let bloom = 0
    if (opts.bloomAmount > 0) {
      const sampleOffsets = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]
      ]
      let bloomSum = 0

      for (const offset of sampleOffsets) {
        const sampleCoord: Vec2 = [pixelCoords[0] + offset[0], pixelCoords[1] + offset[1]]

        if (sampleCoord[0] >= 0 && sampleCoord[0] <= maxX && sampleCoord[1] >= 0 && sampleCoord[1] <= maxY) {
          const sample = texture(sampleCoord)
          bloomSum += (sample[0] + sample[1] + sample[2]) / 3
        }
      }

      bloom = (bloomSum / sampleOffsets.length) * opts.bloomAmount
    }

    return [
      clamp(r * vignette * scanLine * noise + bloom, 0, 255),
      clamp(g * vignette * scanLine * noise + bloom, 0, 255),
      clamp(b * vignette * scanLine * noise + bloom, 0, 255),
      255
    ]
  })
}
