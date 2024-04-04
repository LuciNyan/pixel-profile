import { render, RGBA } from '../renderer'

const scanlineIntensity = 0.15
const scanlineThickness = 3

export function scanline(source: Buffer, width: number, height: number): Buffer {
  return render(source, width, height, (uv, texture2D) => {
    const onScanline = uv[1] % scanlineThickness === 0

    const samplerColor = texture2D(uv)

    const scanlineBrightness = onScanline ? 1 - scanlineIntensity : 1

    return multiply(samplerColor, scanlineBrightness)
  })
}

function multiply(color: RGBA, factor: number): RGBA {
  return [color[0] * factor, color[1] * factor, color[2] * factor, color[3]]
}
