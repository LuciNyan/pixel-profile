import { genBiLinearFilter } from './linear'

export const TEXTURE_FILTER = {
  NEAREST: 'NEAREST',
  LINEAR: 'LINEAR'
} as const

export type TextureFilterName = (typeof TEXTURE_FILTER)[keyof typeof TEXTURE_FILTER]

export const textureFilterGeneratorByName = {
  [TEXTURE_FILTER.NEAREST]: genBiLinearFilter,
  [TEXTURE_FILTER.LINEAR]: genBiLinearFilter
}
