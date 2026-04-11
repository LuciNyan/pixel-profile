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

const BLOOM_OFFSETS_X = [-1, 0, 1, -1, 1, -1, 0, 1]
const BLOOM_OFFSETS_Y = [-1, -1, -1, 0, 0, 1, 1, 1]

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
  const bloomAmount = opts.bloomAmount
  const scanLineCount = opts.scanLineCount
  const scanLineStrength = opts.scanLineStrength
  const noiseIntensity = opts.noiseIntensity
  const vignetteDarkness = opts.vignetteDarkness
  const cornerSize = opts.cornerSize
  const w4 = width * 4
  const oneBorderMargin = 1 - borderMargin

  for (let py = 0; py < height; py++) {
    const uvY = py / height
    const cy = uvY - 0.5
    const cy2 = cy * cy
    const rowBase = py * w4

    for (let px = 0; px < width; px++) {
      const uvX = px / width
      const idx = rowBase + px * 4

      const cx = uvX - 0.5
      const distSq = cx * cx + cy2
      const distX = cx * (1 + distSq * curvX5) + 0.5
      const distY = cy * (1 + distSq * curvY5) + 0.5

      if (distX < borderMargin || distX > oneBorderMargin || distY < borderMargin || distY > oneBorderMargin) {
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
      const cornerDist = Math.min(Math.abs(vcX) + Math.abs(vcY) * cornerSize, 1)
      let vignette = (1 - distFromCenter * 1.5) * (1 - cornerDist * 0.5)
      vignette = Math.min(1, Math.max(1 - vignetteDarkness, vignette))

      // Red channel — inline bilinear sample
      let bx: number, by: number, bx0: number, bx1: number, by0: number, by1: number
      let bsx: number, bsy: number, bosx: number, bosy: number
      let bi00: number, bi10: number, bi01: number, bi11: number

      bx = Math.min(maxX, Math.max(0, pcX + vcX * rgbShiftAmount * maxX))
      by = Math.min(maxY, Math.max(0, pcY + vcY * rgbShiftAmount * maxY))
      bx0 = Math.min(Math.max(Math.floor(bx), 0), maxX)
      bx1 = Math.min(bx0 + 1, maxX)
      by0 = Math.min(Math.max(Math.floor(by), 0), maxY)
      by1 = Math.min(by0 + 1, maxY)
      bsx = bx - bx0
      bsy = by - by0
      bosx = 1 - bsx
      bosy = 1 - bsy
      bi00 = (by0 * width + bx0) * 4
      bi10 = (by0 * width + bx1) * 4
      bi01 = (by1 * width + bx0) * 4
      bi11 = (by1 * width + bx1) * 4
      const r = (source[bi00] * bosx + source[bi10] * bsx) * bosy + (source[bi01] * bosx + source[bi11] * bsx) * bsy

      // Green channel — clamp pcX/pcY first (matches original texture() mutation)
      pcX = Math.min(maxX, Math.max(0, pcX))
      pcY = Math.min(maxY, Math.max(0, pcY))
      bx0 = Math.min(Math.max(Math.floor(pcX), 0), maxX)
      bx1 = Math.min(bx0 + 1, maxX)
      by0 = Math.min(Math.max(Math.floor(pcY), 0), maxY)
      by1 = Math.min(by0 + 1, maxY)
      bsx = pcX - bx0
      bsy = pcY - by0
      bosx = 1 - bsx
      bosy = 1 - bsy
      bi00 = (by0 * width + bx0) * 4
      bi10 = (by0 * width + bx1) * 4
      bi01 = (by1 * width + bx0) * 4
      bi11 = (by1 * width + bx1) * 4
      const g =
        (source[bi00 + 1] * bosx + source[bi10 + 1] * bsx) * bosy +
        (source[bi01 + 1] * bosx + source[bi11 + 1] * bsx) * bsy

      // Blue channel — inline bilinear sample
      bx = Math.min(maxX, Math.max(0, pcX - vcX * rgbShiftAmount * maxX))
      by = Math.min(maxY, Math.max(0, pcY - vcY * rgbShiftAmount * maxY))
      bx0 = Math.min(Math.max(Math.floor(bx), 0), maxX)
      bx1 = Math.min(bx0 + 1, maxX)
      by0 = Math.min(Math.max(Math.floor(by), 0), maxY)
      by1 = Math.min(by0 + 1, maxY)
      bsx = bx - bx0
      bsy = by - by0
      bosx = 1 - bsx
      bosy = 1 - bsy
      bi00 = (by0 * width + bx0) * 4
      bi10 = (by0 * width + bx1) * 4
      bi01 = (by1 * width + bx0) * 4
      bi11 = (by1 * width + bx1) * 4
      const b =
        (source[bi00 + 2] * bosx + source[bi10 + 2] * bsx) * bosy +
        (source[bi01 + 2] * bosx + source[bi11 + 2] * bsx) * bsy

      const scanLineY = Math.floor(rsY * scanLineCount) % 2
      const scanLine = 1 - scanLineY * scanLineStrength

      const noiseSeed = Math.sin(uvX * 12.9898 + uvY * 78.233) * 43758.5453
      const noise = 1 + ((noiseSeed - Math.floor(noiseSeed)) * 2 - 1) * noiseIntensity

      let bloom = 0
      if (hasBloom) {
        let bloomSum = 0
        for (let bi = 0; bi < 8; bi++) {
          const sx = pcX + BLOOM_OFFSETS_X[bi]
          const sy = pcY + BLOOM_OFFSETS_Y[bi]
          if (sx >= 0 && sx <= maxX && sy >= 0 && sy <= maxY) {
            bx0 = Math.min(Math.max(Math.floor(sx), 0), maxX)
            bx1 = Math.min(bx0 + 1, maxX)
            by0 = Math.min(Math.max(Math.floor(sy), 0), maxY)
            by1 = Math.min(by0 + 1, maxY)
            bsx = sx - bx0
            bsy = sy - by0
            bosx = 1 - bsx
            bosy = 1 - bsy
            bi00 = (by0 * width + bx0) * 4
            bi10 = (by0 * width + bx1) * 4
            bi01 = (by1 * width + bx0) * 4
            bi11 = (by1 * width + bx1) * 4
            const sr =
              (source[bi00] * bosx + source[bi10] * bsx) * bosy + (source[bi01] * bosx + source[bi11] * bsx) * bsy
            const sg =
              (source[bi00 + 1] * bosx + source[bi10 + 1] * bsx) * bosy +
              (source[bi01 + 1] * bosx + source[bi11 + 1] * bsx) * bsy
            const sb =
              (source[bi00 + 2] * bosx + source[bi10 + 2] * bsx) * bosy +
              (source[bi01 + 2] * bosx + source[bi11 + 2] * bsx) * bsy
            bloomSum += (sr + sg + sb) / 3
          }
        }
        bloom = (bloomSum / 8) * bloomAmount
      }

      target[idx] = Math.min(255, Math.max(0, r * vignette * scanLine * noise + bloom))
      target[idx + 1] = Math.min(255, Math.max(0, g * vignette * scanLine * noise + bloom))
      target[idx + 2] = Math.min(255, Math.max(0, b * vignette * scanLine * noise + bloom))
      target[idx + 3] = 255
    }
  }

  return target
}
