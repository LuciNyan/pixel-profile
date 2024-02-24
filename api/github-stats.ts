import { CONSTANTS, parseArray, parseBoolean, parseString } from '../utils/index.js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clamp, fetchStats, renderStats } from 'pixel-profile'

export default async (req: VercelRequest, res: VercelResponse) => {
  const {
    background,
    cache_seconds = `${CONSTANTS.CARD_CACHE_SECONDS}`,
    color,
    exclude_repo,
    include_all_commits,
    pixelate_avatar,
    screen_effect,
    show,
    show_avatar,
    show_rank,
    show_total_stars,
    username
  } = req.query

  res.setHeader('Content-Type', 'image/png')

  try {
    const showStats = parseArray(show)
    const showAvatar = parseBoolean(show_avatar) ?? true
    const showRank = parseBoolean(show_rank) ?? true
    const showTotalStars = parseBoolean(show_total_stars) ?? true
    const includeAllCommits = parseBoolean(include_all_commits)

    const stats: Parameters<typeof renderStats>[0] = await fetchStats(
      typeof username === 'string' ? username : '',
      includeAllCommits,
      parseArray(exclude_repo),
      showStats.includes('prs_merged') || showStats.includes('prs_merged_percentage'),
      showStats.includes('discussions_started'),
      showStats.includes('discussions_answered')
    )

    stats.avatarUrl = showAvatar ? stats.avatarUrl : ''
    stats.rank = showRank ? stats.rank : null
    stats.totalStars = showTotalStars ? stats.totalStars : null

    let cacheSeconds = clamp(parseInt(parseString(cache_seconds) ?? '0', 10), CONSTANTS.SIX_HOURS, CONSTANTS.ONE_DAY)

    cacheSeconds = process.env.CACHE_SECONDS ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds : cacheSeconds

    res.setHeader(
      'Cache-Control',
      `max-age=${cacheSeconds / 2}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`
    )

    const options = {
      screenEffect: parseBoolean(screen_effect),
      color: parseString(color),
      background: parseString(background),
      pixelateAvatar: parseBoolean(pixelate_avatar),
      includeAllCommits
    }

    const result = await renderStats(stats, options)

    return res.send(result)
  } catch (err) {
    console.log(err)

    res.setHeader(
      'Cache-Control',
      `max-age=${CONSTANTS.ERROR_CACHE_SECONDS / 2}, s-maxage=${
        CONSTANTS.ERROR_CACHE_SECONDS
      }, stale-while-revalidate=${CONSTANTS.ONE_DAY}`
    )

    return res.send(1)
  }
}
