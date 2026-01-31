import { fontBuffer } from '../assets/fonts/press-start-2p'
import { GithubStats, TemplateStats } from '../types'
import { getPixelsFromPngBuffer, kFormatter } from '../utils'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

export type RenderResult = {
  pixels: Buffer
  width: number
  height: number
}

/**
 * Format raw GitHub stats to template-ready data
 */
export function formatStatsData(stats: GithubStats, avatar: string): TemplateStats {
  const { name, totalStars, totalCommits, totalIssues, totalPRs, contributedTo, rank } = stats

  return {
    name,
    avatar,
    stars: kFormatter(totalStars),
    commits: kFormatter(totalCommits),
    issues: kFormatter(totalIssues),
    prs: kFormatter(totalPRs),
    contributions: kFormatter(contributedTo),
    rank: rank ? rank.level : ''
  }
}

/**
 * Render JSX element to pixels with font fallback support
 */
export async function renderToPixels(
  element: JSX.Element,
  width: number,
  height: number,
  fallbackRender?: () => JSX.Element
): Promise<RenderResult> {
  let isMissingFont = false

  let svg = await satori(element, {
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

  if (isMissingFont && fallbackRender) {
    svg = await satori(fallbackRender(), {
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
      loadSystemFonts: false
    }
  } as const

  const pngData = new Resvg(svg, opts).render()
  const pngBuffer = pngData.asPng()

  const { pixels } = await getPixelsFromPngBuffer(pngBuffer)

  return { pixels, width, height }
}
