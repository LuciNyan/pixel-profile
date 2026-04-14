import { fontBuffer } from '../assets/fonts/press-start-2p'
import { GithubStats, TemplateStats } from '../types'
import { kFormatter } from '../utils'
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

const SATORI_FONTS = [{ name: 'PressStart2P', data: fontBuffer, weight: 400 as const, style: 'normal' as const }]
const RESVG_OPTS = { fitTo: { mode: 'width' as const, value: 0 }, font: { loadSystemFonts: false } }

function renderSvgToPixels(svg: string, width: number): Buffer {
  const opts = { ...RESVG_OPTS, fitTo: { ...RESVG_OPTS.fitTo, value: width } }
  const pngData = new Resvg(svg, opts).render()
  const px = pngData.pixels

  return Buffer.from(px.buffer, px.byteOffset, px.byteLength)
}

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
    fonts: SATORI_FONTS,
    loadAdditionalAsset: async () => {
      isMissingFont = true

      return ''
    }
  })

  if (isMissingFont && fallbackRender) {
    svg = await satori(fallbackRender(), { width, height, fonts: SATORI_FONTS })
  }

  const pixels = renderSvgToPixels(svg, width)

  return { pixels, width, height }
}
