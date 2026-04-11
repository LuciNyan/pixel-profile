interface CRTOptions {
  curvatureX: number
  curvatureY: number
  cornerSize: number
  vignetteDarkness: number
  scanLineStrength: number
  scanLineCount: number
  rgbShift: number
  bloomAmount: number
  noiseIntensity: number
  borderSize: number
}

const defaultCRTOptions: CRTOptions = {
  curvatureX: 0.03,
  curvatureY: 0.03,
  cornerSize: 0.05,
  vignetteDarkness: 0.05,
  scanLineStrength: 0.15,
  scanLineCount: 240,
  rgbShift: 0.5,
  bloomAmount: 0.1,
  noiseIntensity: 0.05,
  borderSize: 0.03
}

const BLOOM_OFFSETS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
] as const

function sampleBilinear(
  source: Buffer,
  width: number,
  maxX: number,
  maxY: number,
  fx: number,
  fy: number
): [number, number, number, number] {
  const x = Math.min(maxX, Math.max(0, fx))
  const y = Math.min(maxY, Math.max(0, fy))
  const x0 = Math.min(Math.max(Math.floor(x), 0), maxX)
  const x1 = Math.min(x0 + 1, maxX)
  const y0 = Math.min(Math.max(Math.floor(y), 0), maxY)
  const y1 = Math.min(y0 + 1, maxY)
  const sx = x - x0
  const sy = y - y0
  const osx = 1 - sx
  const osy = 1 - sy

  const i00 = (y0 * width + x0) * 4
  const i10 = (y0 * width + x1) * 4
  const i01 = (y1 * width + x0) * 4
  const i11 = (y1 * width + x1) * 4

  return [
    (source[i00] * osx + source[i10] * sx) * osy + (source[i01] * osx + source[i11] * sx) * sy,
    (source[i00 + 1] * osx + source[i10 + 1] * sx) * osy + (source[i01 + 1] * osx + source[i11 + 1] * sx) * sy,
    (source[i00 + 2] * osx + source[i10 + 2] * sx) * osy + (source[i01 + 2] * osx + source[i11 + 2] * sx) * sy,
    (source[i00 + 3] * osx + source[i10 + 3] * sx) * osy + (source[i01 + 3] * osx + source[i11 + 3] * sx) * sy
  ]
}

export function crt(source: Buffer, width: number, height: number, options: Partial<CRTOptions> = {}): Buffer {
  const opts: CRTOptions = { ...defaultCRTOptions, ...options }
  const maxX = width - 1
  const maxY = height - 1
  const target = Buffer.alloc(width * height * 4)

  const curvX5 = opts.curvatureX * 5
  const curvY5 = opts.curvatureY * 5
  const borderMargin = opts.borderSize
  const borderDenom = 1 - 2 * borderMargin
  const rgbShiftAmount = opts.rgbShift * 0.01
  const hasBloom = opts.bloomAmount > 0

  for (let py = 0; py < height; py++) {
    const uvY = py / height

    for (let px = 0; px < width; px++) {
      const uvX = px / width
      const idx = (py * width + px) * 4

      const cx = uvX - 0.5
      const cy = uvY - 0.5
      const distSq = cx * cx + cy * cy
      const distX = cx * (1 + distSq * curvX5) + 0.5
      const distY = cy * (1 + distSq * curvY5) + 0.5

      if (distX < borderMargin || distX > 1 - borderMargin || distY < borderMargin || distY > 1 - borderMargin) {
        target[idx] = 0
        target[idx + 1] = 0
        target[idx + 2] = 0
        target[idx + 3] = 255
        continue
      }

      const rsX = (distX - borderMargin) / borderDenom
      const rsY = (distY - borderMargin) / borderDenom
      let pcX = rsX * maxX
      let pcY = rsY * maxY

      const vcX = rsX - 0.5
      const vcY = rsY - 0.5
      const distFromCenter = Math.sqrt(vcX * vcX + vcY * vcY)
      const cornerDist = Math.min(Math.abs(vcX) + Math.abs(vcY) * opts.cornerSize, 1)
      let vignette = (1 - distFromCenter * 1.5) * (1 - cornerDist * 0.5)
      vignette = Math.min(1, Math.max(1 - opts.vignetteDarkness, vignette))

      const redSample = sampleBilinear(
        source,
        width,
        maxX,
        maxY,
        pcX + vcX * rgbShiftAmount * maxX,
        pcY + vcY * rgbShiftAmount * maxY
      )
      const r = redSample[0]

      // Green channel sample clamps pcX/pcY (matches original texture() mutation)
      pcX = Math.min(maxX, Math.max(0, pcX))
      pcY = Math.min(maxY, Math.max(0, pcY))
      const greenSample = sampleBilinear(source, width, maxX, maxY, pcX, pcY)
      const g = greenSample[1]

      const blueSample = sampleBilinear(
        source,
        width,
        maxX,
        maxY,
        pcX - vcX * rgbShiftAmount * maxX,
        pcY - vcY * rgbShiftAmount * maxY
      )
      const b = blueSample[2]

      const scanLineY = Math.floor(rsY * opts.scanLineCount) % 2
      const scanLine = 1 - scanLineY * opts.scanLineStrength

      const noiseSeed = Math.sin(uvX * 12.9898 + uvY * 78.233) * 43758.5453
      const noise = 1 + ((noiseSeed - Math.floor(noiseSeed)) * 2 - 1) * opts.noiseIntensity

      let bloom = 0
      if (hasBloom) {
        let bloomSum = 0
        for (let bi = 0; bi < 8; bi++) {
          const sx = pcX + BLOOM_OFFSETS[bi][0]
          const sy = pcY + BLOOM_OFFSETS[bi][1]
          if (sx >= 0 && sx <= maxX && sy >= 0 && sy <= maxY) {
            const s = sampleBilinear(source, width, maxX, maxY, sx, sy)
            bloomSum += (s[0] + s[1] + s[2]) / 3
          }
        }
        bloom = (bloomSum / 8) * opts.bloomAmount
      }

      target[idx] = Math.min(255, Math.max(0, r * vignette * scanLine * noise + bloom))
      target[idx + 1] = Math.min(255, Math.max(0, g * vignette * scanLine * noise + bloom))
      target[idx + 2] = Math.min(255, Math.max(0, b * vignette * scanLine * noise + bloom))
      target[idx + 3] = 255
    }
  }

  return target
}
