import { CONSTANTS, parseArray, parseBoolean, parseString } from './utils'
import { Hono } from 'hono'
import { clamp, fetchStats, renderStats } from 'pixel-profile'

const githubStats = new Hono()

githubStats.get('/', async (c) => {
  const { req, res, body } = c
  const {
    background,
    cache_seconds = `${CONSTANTS.CARD_CACHE_SECONDS}`,
    color,
    exclude_repo,
    hide = '',
    include_all_commits,
    pixelate_avatar,
    screen_effect,
    show,
    username,
    theme,
    avatar_border
  } = req.query()

  res.headers.set('Content-Type', 'image/png')

  try {
    const showStats = parseArray(show)
    const includeAllCommits = parseBoolean(include_all_commits)

    const stats: Parameters<typeof renderStats>[0] = await fetchStats(
      typeof username === 'string' ? username : '',
      includeAllCommits,
      parseArray(exclude_repo),
      showStats.includes('prs_merged') || showStats.includes('prs_merged_percentage'),
      showStats.includes('discussions_started'),
      showStats.includes('discussions_answered')
    )

    let cacheSeconds = clamp(parseInt(parseString(cache_seconds) ?? '0', 10), CONSTANTS.SIX_HOURS, CONSTANTS.ONE_DAY)

    cacheSeconds = process.env.CACHE_SECONDS ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds : cacheSeconds

    res.headers.set(
      'Cache-Control',
      `max-age=${cacheSeconds / 2}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`
    )

    const options = {
      background: parseString(background),
      color: parseString(color),
      hiddenStatsKeys: hide ? parseArray(hide) : undefined,
      includeAllCommits,
      pixelateAvatar: parseBoolean(pixelate_avatar),
      theme: parseString(theme),
      screenEffect: parseBoolean(screen_effect),
      avatarBorder: parseBoolean(avatar_border)
    }

    const result = await renderStats(stats, options)

    return body(result)
  } catch (err) {
    console.log(err)

    res.headers.set(
      'Cache-Control',
      `max-age=${CONSTANTS.ERROR_CACHE_SECONDS / 2}, s-maxage=${
        CONSTANTS.ERROR_CACHE_SECONDS
      }, stale-while-revalidate=${CONSTANTS.ONE_DAY}`
    )

    return c.html('')
  }
})

export default githubStats
