import { curve, pixelate } from '../shaders'
import { AVATAR_SIZE, CARD_SIZE, makeGithubStats } from '../templates/github-stats'
import { getBase64FromPixels, getPixelsFromPngBuffer, getPngBufferFromPixels, kFormatter, Rank } from '../utils'
import { Resvg } from '@resvg/resvg-js'
import axios from 'axios'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import satori from 'satori'

export type Stats = {
  name: string
  username: string
  totalStars: number | null
  totalCommits: number
  totalIssues: number
  totalPRs: number
  avatarUrl: string
  contributedTo: number
  rank: Rank | null
}

type Options = {
  screenEffect?: boolean
  color?: string
  showRank?: boolean
  background?: string
  pixelateAvatar?: boolean
  includeAllCommits?: boolean
}

export async function renderStats(stats: Stats, options: Options = {}): Promise<Buffer> {
  const { name, username, totalStars, totalCommits, totalIssues, totalPRs, avatarUrl, contributedTo, rank } = stats

  const {
    screenEffect = false,
    color = 'white',
    background = '#434343',
    pixelateAvatar = true,
    includeAllCommits = false
  } = options

  const cardSize = rank ? CARD_SIZE.BIG : CARD_SIZE.SMALL

  const width = cardSize.CARD_WIDTH
  const height = cardSize.CARD_HEIGHT

  const fontPath = join(process.cwd(), 'packages', 'pixel-profile', 'fonts', 'PressStart2P-Regular.ttf')

  const [fontData, avatar] = await Promise.all([
    readFile(fontPath),
    makeAvatar(avatarUrl, pixelateAvatar, AVATAR_SIZE.AVATAR_WIDTH, AVATAR_SIZE.AVATAR_HEIGHT)
  ])

  const _stats = {
    name,
    avatar,
    totalStars: totalStars ? kFormatter(totalStars) : '',
    totalCommits: kFormatter(totalCommits),
    totalIssues: kFormatter(totalIssues),
    totalPRs: kFormatter(totalPRs),
    contributedTo: kFormatter(contributedTo),
    rank: rank ? rank.level : ''
  }

  let isMissingFont = false

  const templateOptions = {
    color,
    background,
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

  let pixels = await getPixelsFromPngBuffer(pngBuffer)

  if (screenEffect) {
    pixels = curve(pixels, width, height)
  }

  return await getPngBufferFromPixels(pixels, width, height)
}

async function makeAvatar(
  url: string,
  pixelateAvatar: boolean,
  width: number,
  height: number,
  blockSize: number = 6.8
): Promise<string> {
  if (!url) {
    return ''
  }

  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  })

  const png = Buffer.from(response.data, 'binary')

  let pixels = await getPixelsFromPngBuffer(png)

  if (pixelateAvatar) {
    pixels = pixelate(pixels, width, height, blockSize)
  }

  return await getBase64FromPixels(pixels, width, height)
}
