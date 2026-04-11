export function addBorder(
  source: Buffer,
  width: number,
  height: number,
  options: {
    frameWidthRatio: number
    enabledTransparentBorder?: boolean
    enabledCornerRemoval?: boolean
  }
) {
  const { enabledTransparentBorder = true, enabledCornerRemoval = true, frameWidthRatio } = options
  const target = Buffer.alloc(width * height * 4)
  target.set(source)

  const frameWidth = frameWidthRatio * width
  const maxX = width - 1
  const maxY = height - 1

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const count =
        Number(x < frameWidth) + Number(y < frameWidth) + Number(x > maxX - frameWidth) + Number(y > maxY - frameWidth)

      if (count !== 0) {
        const idx = (y * width + x) * 4

        if (enabledTransparentBorder) {
          target[idx + 3] = 128
        }

        if (count === 2 && enabledCornerRemoval) {
          target[idx + 3] = 0
        }
      }
    }
  }

  return target
}
