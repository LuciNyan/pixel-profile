import { type AnimationOptions, renderAnimatedGif } from '../animation'
import { buildStatsPipeline, executePipelineSmart } from '../pipeline'
import { defaultRepoOptions, makeRepoCard, REPO_CARD, RepoTemplateOptions } from '../templates/repo-template'
import { getThemeOptions } from '../theme'
import { RepoData } from '../types'
import { getPngBufferFromPixels } from '../utils'
import { filterNotEmpty } from '../utils/filter'
import { renderToPixels } from './render-utils'

type RepoOptions = {
  theme?: string
  screenEffect?: boolean
  isFastMode?: boolean
  color?: string
  background?: string
  dithering?: boolean
  ditheringPalette?: string
  animation?: AnimationOptions | boolean
}

export async function renderRepo(repo: RepoData, options: RepoOptions = {}): Promise<Buffer> {
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

  const width = REPO_CARD.WIDTH
  const height = REPO_CARD.HEIGHT

  const templateOptions: RepoTemplateOptions = {
    ...defaultRepoOptions,
    ...themeOptions,
    ...filterNotEmpty({ color, background })
  }

  const { pixels: renderedPixels } = await renderToPixels(makeRepoCard(repo, templateOptions), width, height)

  const pipeline = buildStatsPipeline({ theme, screenEffect, isFastMode, dithering, ditheringPalette })

  if (options.animation) {
    const animOpts: AnimationOptions = typeof options.animation === 'boolean' ? {} : options.animation

    return renderAnimatedGif(renderedPixels, width, height, pipeline, animOpts)
  }

  const pixels = await executePipelineSmart(renderedPixels, width, height, pipeline)

  return await getPngBufferFromPixels(pixels, width, height)
}
