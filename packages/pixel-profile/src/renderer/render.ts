import { clamp } from '../utils'
import { Coordinates, coordsToIndex, FragShader, RGBA } from './common'
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

  const textureFilterFn = textureFilterGeneratorByName[textureFilter](pixels, width, height)

  function texture2D(coords: Coordinates): RGBA {
    coords[0] = clamp(coords[0], 0, maxX)
    coords[1] = clamp(coords[1], 0, maxY)

    return textureFilterFn(coords)
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rgba = fragShader([x, y], texture2D)
      const index = coordsToIndex(x, y, width)
      target[index] = rgba[0]
      target[index + 1] = rgba[1]
      target[index + 2] = rgba[2]
      target[index + 3] = rgba[3]
    }
  }

  return target
}
