import { addBorder, crt, curve, pixelate } from '../shaders'
import { orderedBayer } from '../shaders/dithering'
import { glow } from '../shaders/glow'
import { scanline } from '../shaders/scanline'
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
    dithering = false
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

  let pixels = renderedPixels

  if (theme === 'crt') {
    pixels = crt(pixels, width, height)
    pixels = glow(pixels, width, height, {
      radius: 5,
      intensity: 0.17,
      color: [1, 1, 1],
      layers: 5,
      falloff: 'exponential'
    })
  } else {
    if (dithering) {
      pixels = orderedBayer(pixels, width, height)
    }

    if (screenEffect) {
      if (!dithering) {
        pixels = scanline(pixels, width, height)
      }
      if (!isFastMode) {
        pixels = glow(pixels, width, height, {
          radius: 3,
          intensity: 0.3,
          color: [1, 1, 1],
          layers: 2,
          falloff: 'exponential'
        })
      }
      pixels = curve(pixels, width, height)
    }
  }

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
