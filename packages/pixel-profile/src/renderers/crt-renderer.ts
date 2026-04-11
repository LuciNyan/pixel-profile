import { buildCrtPipeline, executePipelineSmart } from '../pipeline'
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

  const pipeline = buildCrtPipeline()
  let pixels = await executePipelineSmart(renderedPixels, width, height, pipeline)

  pixels = await blendBorder(pixels, width, height, {
    targetWidth: CRT_CARD_SIZE.width,
    targetHeight: CRT_CARD_SIZE.height
  })

  return await getPngBufferFromPixels(pixels, width, height)
}
