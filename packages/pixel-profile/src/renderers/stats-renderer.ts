import { type AnimationOptions, renderAnimatedGif } from '../animation'
import { buildStatsPipeline, executePipelineSmart } from '../pipeline'
import { pixelate } from '../shaders'
import { addBorder } from '../shaders/border'
import { AVATAR_SIZE, defaultTemplateOptions, makeGithubStats, TemplateOptions } from '../templates/stats-template'
import { getThemeOptions } from '../theme'
import { GithubStats } from '../types'
import { getBase64FromPixels, getPixelsFromPngBuffer, getPngBufferFromPixels } from '../utils'
import { getPngBufferFromURL } from '../utils/converter'
import { filterNotEmpty } from '../utils/filter'
import { formatStatsData, renderToPixels } from './render-utils'

export type { GithubStats as Stats } from '../types'

type Options = {
  theme?: string
  screenEffect?: boolean
  isFastMode?: boolean
  color?: string
  showRank?: boolean
  background?: string
  hiddenStatsKeys?: string[]
  includeAllCommits?: boolean
  pixelateAvatar?: boolean
  avatarBorder?: boolean
  dithering?: boolean
  ditheringPalette?: string
  animation?: AnimationOptions | boolean
}

const CARD_SIZE = {
  BIG: {
    CARD_WIDTH: 1226,
    CARD_HEIGHT: 430
  },
  SMALL: {
    CARD_WIDTH: 1226,
    CARD_HEIGHT: 350
  }
}

export async function renderStats(stats: GithubStats, options: Options = {}): Promise<Buffer> {
  const { username, avatarUrl } = stats
  let modifiedAvatarUrl = avatarUrl

  const {
    background,
    color,
    hiddenStatsKeys = [],
    includeAllCommits = false,
    pixelateAvatar = true,
    screenEffect = false,
    isFastMode = true,
    avatarBorder,
    theme = '',
    dithering = false,
    ditheringPalette
  } = options

  const applyAvatarBorder = avatarBorder !== undefined ? avatarBorder : theme !== ''

  if (hiddenStatsKeys.includes('avatar')) {
    modifiedAvatarUrl = ''
  }

  const themeOptions = getThemeOptions(theme)
  const baseCardSize = !hiddenStatsKeys.includes('rank') ? CARD_SIZE.BIG : CARD_SIZE.SMALL
  const width = baseCardSize.CARD_WIDTH
  const height = baseCardSize.CARD_HEIGHT

  const avatar = await makeAvatar(modifiedAvatarUrl, pixelateAvatar, applyAvatarBorder, isFastMode)
  const templateStats = formatStatsData(stats, avatar)

  const templateOptions: TemplateOptions = {
    ...defaultTemplateOptions,
    ...themeOptions,
    ...filterNotEmpty({
      color,
      background
    }),
    hiddenStatsKeys,
    includeAllCommits
  }

  const { pixels: renderedPixels } = await renderToPixels(
    makeGithubStats(templateStats, templateOptions),
    width,
    height,
    () => makeGithubStats({ ...templateStats, name: username }, templateOptions)
  )

  const pipeline = buildStatsPipeline({ theme, screenEffect, isFastMode, dithering, ditheringPalette })

  if (options.animation) {
    const animOpts: AnimationOptions = typeof options.animation === 'boolean' ? {} : options.animation

    return await renderAnimatedGif(renderedPixels, width, height, pipeline, animOpts)
  }

  const pixels = await executePipelineSmart(renderedPixels, width, height, pipeline)

  return await getPngBufferFromPixels(pixels, width, height)
}

const BASE_AVATAR_BLOCK_SIZE = 4

async function makeAvatar(
  url: string,
  pixelateAvatar: boolean,
  applyAvatarBorder: boolean,
  isFastMode: boolean = true
): Promise<string> {
  if (!url) {
    return ''
  }

  const png: Buffer = await getPngBufferFromURL(url)

  let { pixels, width, height } = await getPixelsFromPngBuffer(png)

  if (pixelateAvatar) {
    const blockSize = (height / AVATAR_SIZE.AVATAR_HEIGHT) * BASE_AVATAR_BLOCK_SIZE
    pixels = pixelate(pixels, width, height, {
      blockSize,
      samplingMode: isFastMode ? 'center' : 'dominant',
      antiAlias: true
    })
    if (applyAvatarBorder) {
      pixels = addBorder(pixels, width, height, {
        frameWidthRatio: 0.025
      })
    }
  } else {
    if (applyAvatarBorder) {
      pixels = addBorder(pixels, width, height, { frameWidthRatio: 0.0167, enabledCornerRemoval: false })
    }
  }

  return await getBase64FromPixels(pixels, width, height)
}
