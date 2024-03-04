import { curve, pixelate, putFrame } from '../shaders'
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
import { Resvg } from '@resvg/resvg-js'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
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
  color?: string
  showRank?: boolean
  background?: string
  hiddenStatsKeys?: string[]
  includeAllCommits?: boolean
  pixelateAvatar?: boolean
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
    theme = ''
  } = options

  if (hiddenStatsKeys.includes('avatar')) {
    modifiedAvatarUrl = ''
  }

  const themeOptions = getThemeOptions(theme)
  const baseCardSize = rank ? CARD_SIZE.BIG : CARD_SIZE.SMALL
  const width = baseCardSize.CARD_WIDTH
  const height = baseCardSize.CARD_HEIGHT

  const fontPath = join(process.cwd(), 'packages', 'pixel-profile', 'fonts', 'PressStart2P-Regular.ttf')

  const [fontData, avatar] = await Promise.all([
    readFile(fontPath),
    makeAvatar(modifiedAvatarUrl, pixelateAvatar, !!theme)
  ])

  const _stats = {
    name,
    avatar,
    stars: totalStars ? kFormatter(totalStars) : '',
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
        data: fontData,
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
          data: fontData,
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

  if (screenEffect) {
    pixels = curve(pixels, width, height)
  }

  return await getPngBufferFromPixels(pixels, width, height)
}

const BASE_AVATAR_BLOCK_SIZE = 6.82

async function makeAvatar(url: string, pixelateAvatar: boolean, enableFrame: boolean): Promise<string> {
  if (!url) {
    return ''
  }

  const png: Buffer = await getPngBufferFromURL(url)

  let { pixels, width, height } = await getPixelsFromPngBuffer(png)

  if (pixelateAvatar) {
    const blockSize = (height / AVATAR_SIZE.AVATAR_HEIGHT) * BASE_AVATAR_BLOCK_SIZE
    pixels = pixelate(pixels, width, height, blockSize)
    if (enableFrame) {
      pixels = putFrame(pixels, width, height, {
        frameWidthRatio: 0.025,
        enabledTransparentBorder: true,
        enabledCornerRemoval: true
      })
    }
  } else {
    pixels = putFrame(pixels, width, height, { frameWidthRatio: 0.0167, enabledTransparentBorder: true })
  }

  return await getBase64FromPixels(pixels, width, height)
}
