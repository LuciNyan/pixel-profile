import { Vec3 } from '../utils/math'

const PALETTE_256: Vec3[] = [
  [0, 0, 0],
  [0, 1, 0.251],
  [0.3333, 1, 0.251],
  [0.1667, 1, 0.251],
  [0.6667, 1, 0.251],
  [0.8333, 1, 0.251],
  [0.5, 1, 0.251],
  [0, 0, 0.7529],
  [0.3333, 0.2857, 0.8078],
  [0.5856, 0.7115, 0.7961],
  [0.6393, 0.6038, 0.4157],
  [0.6502, 1, 0.5824],
  [0.2596, 1, 0.1863],
  [0.4686, 0.3869, 0.2686],
  [0.5977, 0.6038, 0.4157],
  [0.6252, 1, 0.5824],
  [0.2782, 1, 0.249],
  [0.4176, 0.503, 0.3314],
  [0.556, 0.6038, 0.4157],
  [0.6002, 1, 0.5824],
  [0.2893, 1, 0.3118],
  [0.3946, 0.5821, 0.3941],
  [0.5143, 0.6038, 0.4157],
  [0.5751, 1, 0.5824],
  [0.2967, 1, 0.3745],
  [0.3814, 0.6395, 0.4569],
  [0.4765, 0.6395, 0.4569],
  [0.5501, 1, 0.5824],
  [0.3019, 1, 0.4373],
  [0.3729, 0.7388, 0.5196],
  [0.4512, 0.7388, 0.5196],
  [0.525, 1, 0.5824],
  [0.3059, 1, 0.5],
  [0.367, 1, 0.5824],
  [0.4335, 1, 0.5824],
  [0.5, 1, 0.5824],
  [0, 1, 0.1667],
  [0.8333, 1, 0.1667],
  [0.75, 1, 0.3333],
  [0.7222, 1, 0.5],
  [0.0608, 1, 0.1667],
  [0.8333, 0.4655, 0.2275],
  [0.7314, 0.6915, 0.3941],
  [0.7068, 1, 0.5608],
  [0.1235, 1, 0.1667],
  [0.8333, 0.1486, 0.2902],
  [0.7009, 0.4592, 0.4569],
  [0.6858, 1, 0.6235],
  [0.1842, 1, 0.1863],
  [0.3333, 0.0556, 0.3529],
  [0.6471, 0.3333, 0.5],
  [0.6569, 1, 0.6667],
  [0.2218, 1, 0.249],
  [0.3333, 0.1981, 0.4157],
  [0.5843, 0.3333, 0.5],
  [0.6255, 1, 0.6667],
  [0.2442, 1, 0.3118],
  [0.3333, 0.3033, 0.4784],
  [0.5216, 0.3333, 0.5],
  [0.5941, 1, 0.6667],
  [0.2592, 1, 0.3745],
  [0.3333, 0.453, 0.5412],
  [0.467, 0.453, 0.5412],
  [0.5627, 1, 0.6667],
  [0.2698, 1, 0.4373],
  [0.3333, 0.6832, 0.6039],
  [0.436, 0.6832, 0.6039],
  [0.5314, 1, 0.6667],
  [0.2778, 1, 0.5],
  [0.3333, 1, 0.6667],
  [0.4167, 1, 0.6667],
  [0.5, 1, 0.6667],
  [0, 1, 0.249],
  [0.8885, 1, 0.249],
  [0.7912, 1, 0.3333],
  [0.7497, 1, 0.5],
  [0.0407, 1, 0.249],
  [0.9063, 0.6076, 0.3098],
  [0.7818, 0.6915, 0.3941],
  [0.7381, 1, 0.5608],
  [0.0827, 1, 0.249],
  [0.9427, 0.3368, 0.3725],
  [0.7664, 0.4592, 0.4569],
  [0.7222, 1, 0.6235],
  [0.1247, 1, 0.249],
  [0.0397, 0.1981, 0.4157],
  [0.7378, 0.3061, 0.5196],
  [0.7, 1, 0.6863],
  [0.1667, 1, 0.249],
  [0.1667, 0.1981, 0.4157],
  [0.6667, 0.2019, 0.5824],
  [0.6667, 1, 0.749],
  [0.2002, 1, 0.3118],
  [0.2387, 0.3033, 0.4784],
  [0.5426, 0.2019, 0.5824],
  [0.625, 1, 0.749],
  [0.2225, 1, 0.3745],
  [0.2673, 0.453, 0.5412],
  [0.4453, 0.3333, 0.6235],
  [0.5833, 1, 0.749],
  [0.2384, 1, 0.4373],
  [0.2826, 0.6832, 0.6039],
  [0.408, 0.6, 0.6863],
  [0.5417, 1, 0.749],
  [0.2503, 1, 0.5],
  [0.2922, 1, 0.6667],
  [0.3893, 1, 0.749],
  [0.5, 1, 0.749],
  [0, 1, 0.3333],
  [0.9167, 1, 0.3333],
  [0.8333, 1, 0.3333],
  [0.7778, 1, 0.5],
  [0.0304, 1, 0.3333],
  [0.9353, 0.6915, 0.3941],
  [0.8333, 0.6915, 0.3941],
  [0.7701, 1, 0.5608],
  [0.0618, 1, 0.3333],
  [0.9657, 0.4592, 0.4569],
  [0.8333, 0.4592, 0.4569],
  [0.7595, 1, 0.6235],
  [0.0931, 1, 0.3333],
  [0.0196, 0.3333, 0.5],
  [0.8333, 0.3061, 0.5196],
  [0.7448, 1, 0.6863],
  [0.1245, 1, 0.3333],
  [0.0824, 0.3333, 0.5],
  [0.8333, 0.2019, 0.5824],
  [0.7227, 1, 0.749],
  [0.1559, 1, 0.3333],
  [0.1451, 0.3333, 0.5],
  [0.8333, 0.0608, 0.6451],
  [0.6858, 1, 0.8118],
  [0.185, 1, 0.3745],
  [0.1997, 0.453, 0.5412],
  [0.3333, 0.1409, 0.7078],
  [0.6255, 1, 0.8333],
  [0.2063, 1, 0.4373],
  [0.2307, 0.6832, 0.6039],
  [0.3333, 0.453, 0.7706],
  [0.5627, 1, 0.8333],
  [0.2222, 1, 0.5],
  [0.25, 1, 0.6667],
  [0.3333, 1, 0.8333],
  [0.5, 1, 0.8333],
  [0, 1, 0.4157],
  [0.9332, 1, 0.4157],
  [0.8664, 1, 0.4157],
  [0.8052, 1, 0.5],
  [0.0244, 1, 0.4157],
  [0.9503, 0.7449, 0.4765],
  [0.872, 0.7449, 0.4765],
  [0.8013, 1, 0.5608],
  [0.0495, 1, 0.4157],
  [0.9754, 0.634, 0.5392],
  [0.8803, 0.634, 0.5392],
  [0.796, 1, 0.6235],
  [0.0747, 1, 0.4157],
  [0.0131, 0.5962, 0.5824],
  [0.8932, 0.5764, 0.602],
  [0.7885, 1, 0.6863],
  [0.0998, 1, 0.4157],
  [0.0551, 0.5962, 0.5824],
  [0.9157, 0.4971, 0.6647],
  [0.7773, 1, 0.749],
  [0.125, 1, 0.4157],
  [0.0971, 0.5962, 0.5824],
  [0.9654, 0.3813, 0.7275],
  [0.7587, 1, 0.8118],
  [0.1502, 1, 0.4157],
  [0.1391, 0.5962, 0.5824],
  [0.0833, 0.3281, 0.749],
  [0.7214, 1, 0.8745],
  [0.1749, 1, 0.4373],
  [0.18, 0.6832, 0.6039],
  [0.2013, 0.453, 0.7706],
  [0.624, 1, 0.9157],
  [0.1948, 1, 0.5],
  [0.2088, 1, 0.6667],
  [0.251, 1, 0.8333],
  [0.5, 1, 0.9157],
  [0.9444, 1, 0.5],
  [0.8889, 1, 0.5],
  [0.0203, 1, 0.5],
  [0.9598, 1, 0.5608],
  [0.8966, 1, 0.5608],
  [0.8333, 1, 0.5608],
  [0.0412, 1, 0.5],
  [0.9809, 1, 0.6235],
  [0.9071, 1, 0.6235],
  [0.8333, 1, 0.6235],
  [0.0621, 1, 0.5],
  [0.0098, 1, 0.6667],
  [0.9219, 1, 0.6863],
  [0.8333, 1, 0.6863],
  [0.083, 1, 0.5],
  [0.0412, 1, 0.6667],
  [0.944, 1, 0.749],
  [0.8333, 1, 0.749],
  [0.1039, 1, 0.5],
  [0.0725, 1, 0.6667],
  [0.9809, 1, 0.8118],
  [0.8333, 1, 0.8118],
  [0.1248, 1, 0.5],
  [0.1039, 1, 0.6667],
  [0.0412, 1, 0.8333],
  [0.8333, 1, 0.8745],
  [0.1458, 1, 0.5],
  [0.1353, 1, 0.6667],
  [0.1039, 1, 0.8333],
  [0.8333, 1, 0.9373],
  [0.1667, 1, 0.6667],
  [0.1667, 1, 0.8333],
  [0.6667, 1, 0.9],
  [0.8333, 1, 0.9],
  [0.5, 1, 0.6],
  [0.5, 1, 0.7],
  [0.5, 1, 0.8],
  [0.5, 1, 0.9],
  [0.3333, 1, 0.249],
  [0.4449, 1, 0.249],
  [0.5422, 1, 0.3333],
  [0.5837, 1, 0.5],
  [0.3333, 1, 0.3118],
  [0.4224, 1, 0.3118],
  [0.5108, 1, 0.3333],
  [0.5627, 1, 0.5],
  [0.3333, 1, 0.3745],
  [0.4075, 1, 0.3745],
  [0.4817, 1, 0.3745],
  [0.5418, 1, 0.5],
  [0.3333, 1, 0.4373],
  [0.3969, 1, 0.4373],
  [0.4604, 1, 0.4373],
  [0.5209, 1, 0.5],
  [0.3889, 1, 0.5],
  [0.4444, 1, 0.5],
  [0, 1, 0.0824],
  [0.749, 1, 0.1667],
  [0.7078, 1, 0.3333],
  [0.6941, 1, 0.5],
  [0.123, 1, 0.0824],
  [0.7006, 0.4655, 0.2275],
  [0.6799, 0.6915, 0.3941],
  [0.6749, 1, 0.5608],
  [0.2222, 1, 0.1235],
  [0.5853, 0.3386, 0.249],
  [0.1222, 1, 0.9706],
  [0.6667, 0.0215, 0.6353],
  [0, 0, 0.502],
  [0, 1, 0.5],
  [0.3333, 1, 0.5],
  [0.1667, 1, 0.5],
  [0.6667, 1, 0.5],
  [0.8333, 1, 0.5],
  [0.5, 1, 0.5],
  [0, 0, 1]
]

const BIAS_256 = 0
const lightnessSteps = 4
const saturationSteps = 4
const invLightnessSteps = 1 / lightnessSteps
const invSaturationSteps = 1 / saturationSteps

/* eslint-disable prettier/prettier */
const ditherTable = new Uint8Array([
  0, 48, 12, 60, 3, 51, 15, 63,
  32, 16, 44, 28, 35, 19, 47, 31,
  8, 56, 4, 52, 11, 59, 7, 55,
  40, 24, 36, 20, 43, 27, 39, 23,
  2, 50, 14, 62, 1, 49, 13, 61,
  34, 18, 46, 30, 33, 17, 45, 29,
  10, 58, 6, 54, 9, 57, 5, 53,
  42, 26, 38, 22, 41, 25, 37, 21
])
/* eslint-enable prettier/prettier */

const ditherLimits = new Float64Array(64)
for (let i = 0; i < 64; i++) {
  ditherLimits[i] = (ditherTable[i] + 1) / 64 + BIAS_256
}

function hueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2)

  return diff < 0.5 ? diff : 1 - diff
}

const lightnessStep = (l: number) => Math.round(l * lightnessSteps) * invLightnessSteps
const saturationStep = (s: number) => Math.round(s * saturationSteps) * invSaturationSteps

const closestColorsCache = new Map<number, [Vec3, Vec3]>()

function closestColors(hue: number): [Vec3, Vec3] {
  const cachedResult = closestColorsCache.get(hue)
  if (cachedResult) return cachedResult

  let closest: Vec3 = [-2, 0, 0]
  let secondClosest: Vec3 = [-2, 0, 0]
  let minDist = Infinity
  let secondMinDist = Infinity

  for (const color of PALETTE_256) {
    const dist = hueDistance(color[0], hue)
    if (dist < minDist) {
      secondClosest = closest
      secondMinDist = minDist
      closest = color
      minDist = dist
    } else if (dist < secondMinDist) {
      secondClosest = color
      secondMinDist = dist
    }
  }

  const result: [Vec3, Vec3] = [closest, secondClosest]
  closestColorsCache.set(hue, result)

  return result
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6

  return p
}

interface DitherEntry {
  hueDiff: number
  lightDiff: number
  satDiff: number
  combos: Uint8Array
}

const ditherRgbCache = new Map<number, DitherEntry>()

function buildDitherEntry(rRaw: number, gRaw: number, bRaw: number): DitherEntry {
  const r = rRaw / 255
  const g = gRaw / 255
  const b = bRaw / 255

  const cmax = Math.max(r, g, b)
  const cmin = Math.min(r, g, b)

  let h = 0
  let s = 0
  const l = (cmax + cmin) / 2

  if (cmax !== cmin) {
    const d = cmax - cmin
    s = l > 0.5 ? d / (2 - cmax - cmin) : d / (cmax + cmin)
    switch (cmax) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  const [closest, secondClosest] = closestColors(h)
  const hueDiff = hueDistance(h, closest[0]) / hueDistance(secondClosest[0], closest[0])

  const l1 = lightnessStep(Math.max(l - 0.125, 0))
  const l2 = lightnessStep(Math.min(l + 0.124, 1))
  const lightDiff = (l - l1) / (l2 - l1)

  const s1 = saturationStep(Math.max(s - 0.125, 0))
  const s2 = saturationStep(Math.min(s + 0.124, 1))
  const satDiff = (s - s1) / (s2 - s1)

  const hueOpts = [closest[0], secondClosest[0]]
  const lightOpts = [l1, l2]
  const satOpts = [s1, s2]

  const combos = new Uint8Array(24)
  for (let dh = 0; dh < 2; dh++) {
    const rH = hueOpts[dh]
    for (let dl = 0; dl < 2; dl++) {
      const rL = lightOpts[dl]
      for (let ds = 0; ds < 2; ds++) {
        const rS = satOpts[ds]
        const ci = (dh * 4 + dl * 2 + ds) * 3
        if (rS === 0) {
          const v = rL * 255
          combos[ci] = v
          combos[ci + 1] = v
          combos[ci + 2] = v
        } else {
          const q2 = rL < 0.5 ? rL * (1 + rS) : rL + rS - rL * rS
          const p2 = 2 * rL - q2
          combos[ci] = hue2rgb(p2, q2, rH + 1 / 3) * 255
          combos[ci + 1] = hue2rgb(p2, q2, rH) * 255
          combos[ci + 2] = hue2rgb(p2, q2, rH - 1 / 3) * 255
        }
      }
    }
  }

  return { hueDiff, lightDiff, satDiff, combos }
}

export type PaletteId = 'gameboy' | 'nokia' | 'cga' | 'grayscale' | 'sepia' | 'neon'

export const BUILTIN_PALETTES: Record<PaletteId, number[][]> = {
  gameboy: [
    [15, 56, 15],
    [48, 98, 48],
    [139, 172, 15],
    [155, 188, 15]
  ],
  nokia: [
    [67, 82, 61],
    [199, 240, 216]
  ],
  grayscale: [
    [0, 0, 0],
    [85, 85, 85],
    [170, 170, 170],
    [255, 255, 255]
  ],
  sepia: [
    [43, 23, 0],
    [110, 76, 30],
    [176, 128, 80],
    [232, 208, 160]
  ],
  neon: [
    [0, 0, 0],
    [255, 0, 102],
    [0, 255, 204],
    [255, 255, 0],
    [102, 0, 255]
  ],
  cga: [
    [0, 0, 0],
    [0, 0, 170],
    [0, 170, 0],
    [0, 170, 170],
    [170, 0, 0],
    [170, 0, 170],
    [170, 85, 0],
    [170, 170, 170],
    [85, 85, 85],
    [85, 85, 255],
    [85, 255, 85],
    [85, 255, 255],
    [255, 85, 85],
    [255, 85, 255],
    [255, 255, 85],
    [255, 255, 255]
  ]
}

export function paletteDither(source: Buffer, width: number, height: number, paletteColors: number[][]): Buffer {
  const target = Buffer.allocUnsafe(width * height * 4)
  const palLen = paletteColors.length

  if (palLen < 2) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source.copy(target as any)

    return target
  }

  const palR = new Uint8Array(palLen)
  const palG = new Uint8Array(palLen)
  const palB = new Uint8Array(palLen)
  for (let i = 0; i < palLen; i++) {
    palR[i] = paletteColors[i][0]
    palG[i] = paletteColors[i][1]
    palB[i] = paletteColors[i][2]
  }

  const cache = new Map<number, number>()

  function findTwoClosest(r: number, g: number, b: number): number {
    const key = (r << 16) | (g << 8) | b
    const cached = cache.get(key)
    if (cached !== undefined) return cached

    let minDist = Infinity
    let secondDist = Infinity
    let closest = 0
    let second = 0

    for (let i = 0; i < palLen; i++) {
      const dr = r - palR[i]
      const dg = g - palG[i]
      const db = b - palB[i]
      const dist = dr * dr + dg * dg + db * db
      if (dist < minDist) {
        secondDist = minDist
        second = closest
        minDist = dist
        closest = i
      } else if (dist < secondDist) {
        secondDist = dist
        second = i
      }
    }

    const totalDist = minDist + secondDist
    const factor = totalDist > 0 ? minDist / totalDist : 0
    const factorQ = (factor * 63 + 0.5) | 0

    const packed = (closest & 0xff) | ((second & 0xff) << 8) | ((factorQ & 0xff) << 16)
    cache.set(key, packed)

    return packed
  }

  for (let y = 0; y < height; y++) {
    let prevR = -1
    let prevG = -1
    let prevB = -1
    let packed = 0

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const r = source[idx]
      const g = source[idx + 1]
      const b = source[idx + 2]

      if (r !== prevR || g !== prevG || b !== prevB) {
        prevR = r
        prevG = g
        prevB = b
        packed = findTwoClosest(r, g, b)
      }

      const closest = packed & 0xff
      const second = (packed >> 8) & 0xff
      const factorQ = (packed >> 16) & 0xff

      const threshold = ditherTable[(x & 7) + ((y & 7) << 3)]
      const pick = factorQ > threshold ? second : closest

      target[idx] = palR[pick]
      target[idx + 1] = palG[pick]
      target[idx + 2] = palB[pick]
      target[idx + 3] = source[idx + 3]
    }
  }

  return target
}

export function orderedBayer(source: Buffer, width: number, height: number): Buffer {
  const target = Buffer.allocUnsafe(width * height * 4)

  for (let y = 0; y < height; y++) {
    let prevR = -1
    let prevG = -1
    let prevB = -1
    let hueDiff = 0
    let lightDiff = 0
    let satDiff = 0
    let combos: Uint8Array = null!

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4

      const rRaw = source[idx]
      const gRaw = source[idx + 1]
      const bRaw = source[idx + 2]

      if (rRaw !== prevR || gRaw !== prevG || bRaw !== prevB) {
        prevR = rRaw
        prevG = gRaw
        prevB = bRaw

        const key = (rRaw << 16) | (gRaw << 8) | bRaw
        let entry = ditherRgbCache.get(key)
        if (!entry) {
          entry = buildDitherEntry(rRaw, gRaw, bRaw)
          ditherRgbCache.set(key, entry)
        }
        hueDiff = entry.hueDiff
        lightDiff = entry.lightDiff
        satDiff = entry.satDiff
        combos = entry.combos
      }

      const limit = ditherLimits[(x & 7) + ((y & 7) << 3)]
      const ci = ((hueDiff < limit ? 0 : 4) + (lightDiff < limit ? 0 : 2) + (satDiff < limit ? 0 : 1)) * 3
      target[idx] = combos[ci]
      target[idx + 1] = combos[ci + 1]
      target[idx + 2] = combos[ci + 2]
      target[idx + 3] = source[idx + 3]
    }
  }

  return target
}
