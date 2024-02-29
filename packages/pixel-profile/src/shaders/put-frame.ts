import { render, type RGBA } from '../utils'

export function putFrame(
  source: Buffer,
  width: number,
  height: number,
  options: {
    frameWidthRatio: number
    enabledTransparentBorder?: boolean
    enabledCornerRemoval?: boolean
  }
) {
  const { enabledTransparentBorder = false, enabledCornerRemoval = false, frameWidthRatio } = options

  return render(source, width, height, (uv, texture2D) => {
    const maxX = width - 1
    const maxY = height - 1
    const x = uv[0] * maxX
    const y = uv[1] * maxY

    const frameWidth = frameWidthRatio * width

    const rgba: RGBA = texture2D([uv[0], uv[1]])

    const count =
      Number(x < frameWidth) + Number(y < frameWidth) + Number(x > maxX - frameWidth) + Number(y > maxY - frameWidth)

    if (count !== 0) {
      if (enabledTransparentBorder) {
        rgba[3] = 128
      }

      if (count === 2 && enabledCornerRemoval) {
        rgba[3] = 0
      }

      return rgba
    }

    return rgba
  })
}
