import { render } from '../renderer'
import { hslToRgb, rgbToHsl } from '../utils'
import { Vec3 } from '../utils/math'

const palette: Vec3[] = [
  [0.1498, 0.7753, 0.8255],
  [0.1024, 0.9387, 0.6804],
  [0.0699, 0.6976, 0.598],
  [0.9567, 0.2212, 0.4431],
  [0.8718, 0.2321, 0.2196],
  [0.3833, 0.3623, 0.2706],
  [0.2965, 0.3277, 0.4608],
  [0.175, 0.5405, 0.5647],
  [0.5355, 0.5341, 0.6549],
  [0.5996, 0.368, 0.5098],
  [0.6795, 0.134, 0.3804],
  [0.5333, 0.1643, 0.5824],
  [0.0764, 0.2791, 0.8314],
  [0, 0.8324, 0.649],
  [0.9194, 0.4819, 0.3784],
  [0.9423, 0.7605, 0.6725]
]

/* eslint-disable prettier/prettier */
const ditherTable: number[] = [
  0, 48, 12, 60, 3, 51, 15, 63,
  32, 16, 44, 28, 35, 19, 47, 31,
  8, 56, 4, 52, 11, 59, 7, 55,
  40, 24, 36, 20, 43, 27, 39, 23,
  2, 50, 14, 62, 1, 49, 13, 61,
  34, 18, 46, 30, 33, 17, 45, 29,
  10, 58, 6, 54, 9, 57, 5, 53,
  42, 26, 38, 22, 41, 25, 37, 21
]
/* eslint-enable prettier/prettier */

const lightnessSteps = 4
const saturationSteps = 4

function hueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2)

  return Math.min(Math.abs(1 - diff), diff)
}

function lightnessStep(l: number): number {
  return Math.floor(0.5 + l * lightnessSteps) / lightnessSteps
}

function saturationStep(s: number): number {
  return Math.floor(0.5 + s * saturationSteps) / saturationSteps
}

function closestColors(hue: number): [[number, number, number], [number, number, number]] {
  let closest: [number, number, number] = [-2, 0, 0]
  let secondClosest: [number, number, number] = [-2, 0, 0]

  for (const color of palette) {
    const tempDistance = hueDistance(color[0], hue)
    if (tempDistance < hueDistance(closest[0], hue)) {
      secondClosest = closest
      closest = color
    } else if (tempDistance < hueDistance(secondClosest[0], hue)) {
      secondClosest = color
    }
  }

  return [closest, secondClosest]
}

// 抖动和颜色量化
function dither(pos: [number, number], color: [number, number, number]): [number, number, number] {
  const x = Math.floor(pos[0] % 8)
  const y = Math.floor(pos[1] % 8)
  const index = x + y * 8

  const bias = 0.11
  const limit = (ditherTable[index] + 1) / 64 + bias

  const [closest, secondClosest] = closestColors(color[0])

  const hueDiff = hueDistance(color[0], closest[0]) / hueDistance(secondClosest[0], closest[0])

  const l1 = lightnessStep(Math.max(color[2] - 0.125, 0))
  const l2 = lightnessStep(Math.min(color[2] + 0.124, 1))
  const lightnessDiff = (color[2] - l1) / (l2 - l1)

  const resultColor: [number, number, number] = hueDiff < limit ? [...closest] : [...secondClosest]
  resultColor[2] = lightnessDiff < limit ? l1 : l2

  const s1 = saturationStep(Math.max(color[1] - 0.125, 0))
  const s2 = saturationStep(Math.min(color[1] + 0.124, 1))
  const saturationDiff = (color[1] - s1) / (s2 - s1)

  resultColor[1] = saturationDiff < limit ? s1 : s2

  return hslToRgb(resultColor)
}

export function orderedBayer(source: Buffer, width: number, height: number): Buffer {
  return render(source, width, height, (pixelCoords, texture2D) => {
    const color = texture2D(pixelCoords)
    const ditheredColor = dither(pixelCoords, rgbToHsl(color))

    return [...ditheredColor, color[3]]
  })
}
