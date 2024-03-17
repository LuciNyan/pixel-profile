import { coordsToIndex, FragShader } from './common'
import { TEXTURE_FILTER, textureFilterGeneratorByName, TextureFilterName } from './texture-filter'

type Options = {
  textureFilter?: TextureFilterName
}

export function render(
  pixels: Buffer,
  width: number,
  height: number,
  fragShader: FragShader,
  options: Options = {}
): Buffer {
  const { textureFilter = TEXTURE_FILTER.LINEAR } = options

  const target = Buffer.alloc(width * height * 4)
  const maxX = width - 1
  const maxY = height - 1

  const texture2D = textureFilterGeneratorByName[textureFilter](pixels, width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rgba = fragShader([x / maxX, y / maxY], texture2D)
      const index = coordsToIndex(x, y, width)
      target[index] = rgba[0]
      target[index + 1] = rgba[1]
      target[index + 2] = rgba[2]
      target[index + 3] = rgba[3]
    }
  }

  return target
}
