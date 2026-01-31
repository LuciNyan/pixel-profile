import { crt } from '../shaders'
import { glow } from '../shaders/glow'
import { defaultTemplateOptions, makeGithubStats, TemplateOptions } from '../templates/crt-template'
import { getThemeOptions } from '../theme'
import { GithubStats } from '../types'
import { blendBorder, getPngBufferFromPixels } from '../utils'
import { filterNotEmpty } from '../utils/filter'
import { formatStatsData, renderToPixels } from './render-utils'

export type { GithubStats as Stats } from '../types'

type CrtOptions = {
  isFastMode?: boolean
  includeAllCommits?: boolean
}

const CRT_CARD_SIZE = { width: 900, height: 594 }

export async function renderCrtStats(stats: GithubStats, options: CrtOptions = {}): Promise<Buffer> {
  const { username } = stats
  const { includeAllCommits = false } = options

  const hiddenStatsKeys = ['avatar']
  const theme = 'road_trip_crt'

  const width = CRT_CARD_SIZE.width
  const height = CRT_CARD_SIZE.height

  const themeOptions = getThemeOptions(theme)
  const templateStats = formatStatsData(stats, '')

  const templateOptions: TemplateOptions = {
    ...defaultTemplateOptions,
    ...themeOptions,
    ...filterNotEmpty({}),
    hiddenStatsKeys,
    includeAllCommits
  }

  const { pixels: renderedPixels } = await renderToPixels(
    makeGithubStats(templateStats, templateOptions),
    width,
    height,
    () => makeGithubStats({ ...templateStats, name: username }, templateOptions)
  )

  let pixels = renderedPixels

  pixels = crt(pixels, width, height, {
    curvatureX: 0.045,
    curvatureY: 0.045,
    cornerSize: 0.05,
    vignetteDarkness: 0.05,
    scanLineStrength: 0.15,
    scanLineCount: 240,
    rgbShift: 0.5,
    bloomAmount: 0.25,
    noiseIntensity: 0.05,
    borderSize: 0
  })
  pixels = glow(pixels, width, height, {
    radius: 5,
    intensity: 0.17,
    color: [1, 1, 1],
    layers: 1,
    falloff: 'exponential'
  })

  pixels = await blendBorder(pixels, width, height, {
    targetWidth: CRT_CARD_SIZE.width,
    targetHeight: CRT_CARD_SIZE.height
  })

  return await getPngBufferFromPixels(pixels, width, height)
}
