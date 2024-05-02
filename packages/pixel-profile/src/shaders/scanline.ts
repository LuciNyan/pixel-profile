import { render } from '../renderer'

const scanlineIntensity = 0.15
const scanlineThickness = 3
const scanlineBrightness = 1 - scanlineIntensity

export function scanline(source: Buffer, width: number, height: number): Buffer {
  return render(source, width, height, (coords, texture) => {
    const samplerColor = texture(coords)

    if (coords[1] % scanlineThickness === 0) {
      return [
        samplerColor[0] * scanlineBrightness,
        samplerColor[1] * scanlineBrightness,
        samplerColor[2] * scanlineBrightness,
        samplerColor[3]
      ]
    }

    return samplerColor
  })
}
