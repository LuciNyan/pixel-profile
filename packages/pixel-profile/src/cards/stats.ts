import { addBorder, curve, pixelate } from '../shaders'
import { orderedBayer } from '../shaders/dithering'
import { glow } from '../shaders/glow'
import { scanline } from '../shaders/scanline'
import {
  AVATAR_SIZE,
  CARD_SIZE,
  defaultTemplateOptions,
  makeGithubStats,
  TemplateOptions
} from '../templates/github-stats'
import { getThemeOptions } from '../theme'
import { getBase64FromPixels, getPixelsFromPngBuffer, getPngBufferFromPixels, kFormatter, Rank } from '../utils'
import { getPngBufferFromURL } from '../utils/converter'
import { filterNotEmpty } from '../utils/filter'
import { fontBuffer } from './PressStart2P-Regular'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

export type Stats = {
  name: string
  username: string
  totalStars: number
  totalCommits: number
  totalIssues: number
  totalPRs: number
  avatarUrl: string
  contributedTo: number
  rank: Rank | null
}

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

export async function renderStats(stats: Stats, options: Options = {}): Promise<Buffer> {
  const { name, username, totalStars, totalCommits, totalIssues, totalPRs, avatarUrl, contributedTo, rank } = stats
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

  const avatar = await makeAvatar(modifiedAvatarUrl, pixelateAvatar, applyAvatarBorder)

  const _stats = {
    name,
    avatar,
    stars: kFormatter(totalStars),
    commits: kFormatter(totalCommits),
    issues: kFormatter(totalIssues),
    prs: kFormatter(totalPRs),
    contributions: kFormatter(contributedTo),
    rank: rank ? rank.level : ''
  }

  let isMissingFont = false

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

  let svg = await satori(makeGithubStats(_stats, templateOptions), {
    width,
    height,
    fonts: [
      {
        name: 'PressStart2P',
        data: fontBuffer,
        weight: 400,
        style: 'normal'
      }
    ],
    loadAdditionalAsset: async () => {
      isMissingFont = true

      return ''
    }
  })

  if (isMissingFont) {
    _stats.name = username

    svg = await satori(makeGithubStats(_stats, templateOptions), {
      width,
      height,
      fonts: [
        {
          name: 'PressStart2P',
          data: fontBuffer,
          weight: 400,
          style: 'normal'
        }
      ]
    })
  }

  const opts = {
    fitTo: {
      mode: 'width',
      value: width
    },
    font: {
      loadSystemFonts: false // It will be faster to disable loading system fonts.
    }
  } as const

  const pngData = new Resvg(svg, opts).render()
  const pngBuffer = pngData.asPng()

  let { pixels } = await getPixelsFromPngBuffer(pngBuffer)

  if (dithering) {
    pixels = orderedBayer(pixels, width, height)
  }

  if (screenEffect) {
    if (!dithering) {
      pixels = scanline(pixels, width, height)
    }
    if (!isFastMode) {
      pixels = glow(pixels, width, height)
    }
    pixels = curve(pixels, width, height)
  }

  return await getPngBufferFromPixels(pixels, width, height)
}

const BASE_AVATAR_BLOCK_SIZE = 6.82

async function makeAvatar(url: string, pixelateAvatar: boolean, applyAvatarBorder: boolean): Promise<string> {
  if (!url) {
    return ''
  }

  const png: Buffer = await getPngBufferFromURL(url)

  let { pixels, width, height } = await getPixelsFromPngBuffer(png)

  if (pixelateAvatar) {
    const blockSize = (height / AVATAR_SIZE.AVATAR_HEIGHT) * BASE_AVATAR_BLOCK_SIZE
    pixels = pixelate(pixels, width, height, blockSize)
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
