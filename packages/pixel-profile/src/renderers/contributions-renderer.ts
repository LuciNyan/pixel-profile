import { type AnimationOptions, renderAnimatedGif } from '../animation'
import { buildContributionsPipeline, executePipelineSmart } from '../pipeline'
import {
  CONTRIBUTIONS_CARD,
  ContributionsTemplateOptions,
  defaultContributionsOptions,
  makeContributionsCard
} from '../templates/contributions-template'
import { getThemeOptions } from '../theme'
import { ContributionsData } from '../types'
import { getPngBufferFromPixels } from '../utils'
import { filterNotEmpty } from '../utils/filter'
import { renderToPixels } from './render-utils'

type ContributionsOptions = {
  theme?: string
  screenEffect?: boolean
  isFastMode?: boolean
  color?: string
  background?: string
  dithering?: boolean
  ditheringPalette?: string
  animation?: AnimationOptions | boolean
}

export async function renderContributions(
  data: ContributionsData,
  options: ContributionsOptions = {}
): Promise<Buffer> {
  const {
    background,
    color,
    screenEffect = false,
    isFastMode = true,
    theme = '',
    dithering = false,
    ditheringPalette
  } = options

  const themeOptions = getThemeOptions(theme)

  const width = CONTRIBUTIONS_CARD.WIDTH
  const height = CONTRIBUTIONS_CARD.HEIGHT

  const templateOptions: ContributionsTemplateOptions = {
    ...defaultContributionsOptions,
    ...themeOptions,
    ...filterNotEmpty({ color, background })
  }

  const { pixels: renderedPixels } = await renderToPixels(
    makeContributionsCard(data.username, data.calendar, templateOptions),
    width,
    height
  )

  const pipeline = buildContributionsPipeline({ theme, screenEffect, isFastMode, dithering, ditheringPalette })

  if (options.animation) {
    const animOpts: AnimationOptions = typeof options.animation === 'boolean' ? {} : options.animation

    return renderAnimatedGif(renderedPixels, width, height, pipeline, animOpts)
  }

  const pixels = await executePipelineSmart(renderedPixels, width, height, pipeline)

  return await getPngBufferFromPixels(pixels, width, height)
}
