import { sampleBilinear } from '../utils/bilinear'

const screenCurvature = 0.1

export function curve(source: Buffer, width: number, height: number): Buffer {
  const maxX = width - 1
  const maxY = height - 1
  const target = Buffer.alloc(width * height * 4)

  for (let py = 0; py < height; py++) {
    const uvY = py / height

    for (let px = 0; px < width; px++) {
      const uvX = px / width
      const idx = (py * width + px) * 4

      const ccX = uvX - 0.5
      const ccY = uvY - 0.5
      const dist = (ccX * ccX + ccY * ccY) * screenCurvature
      const temp = (1 + dist) * dist
      const targetX = (uvX + ccX * temp) * maxX
      const targetY = (uvY + ccY * temp) * maxY

      const vignette = Math.pow(uvX * (1 - uvY) * uvY * (1 - uvX) * 15, 0.25)

      const samplerColor = sampleBilinear(source, width, maxX, maxY, targetX, targetY)

      target[idx] = samplerColor[0] * vignette
      target[idx + 1] = samplerColor[1] * vignette
      target[idx + 2] = samplerColor[2] * vignette
      target[idx + 3] = 255
    }
  }

  return target
}
