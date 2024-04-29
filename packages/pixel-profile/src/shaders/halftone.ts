import { render, RGBA } from '../renderer'

const dotSize = 4
const dotDensity = 1
const mat = [
  [0.1, 0.9, 0.3, 0.9],
  [0.9, 0.3, 0.9, 0.6],
  [0.3, 0.9, 0.1, 0.9],
  [0.9, 0.6, 0.9, 0.6]
]
const ditherRange = 0

export function halftone(source: Buffer, width: number, height: number): Buffer {
  return render(source, width, height, (pixelCoords, texture) => {
    const gridCoords = [Math.floor(pixelCoords[0] / dotSize), Math.floor(pixelCoords[1] / dotSize)]

    const samplerColor = texture(pixelCoords)
    const grayValue = (samplerColor[0] + samplerColor[1] + samplerColor[2]) / (3 * 255)
    const ditherValue = (Math.random() - 0.5) * ditherRange
    const adjustedGrayValue = Math.min(Math.max(grayValue + ditherValue, 0), 1)

    const relativeCoords = [pixelCoords[0] - gridCoords[0] * dotSize, pixelCoords[1] - gridCoords[1] * dotSize]

    const intensity = mat[relativeCoords[0]][relativeCoords[1]]

    const dotRadius = dotDensity * (1 - adjustedGrayValue)
    const isInDot = intensity < dotRadius

    const finalColor: RGBA = isInDot ? [7, 85, 59, 255] : [206, 212, 106, 255]

    return finalColor
  })
}
