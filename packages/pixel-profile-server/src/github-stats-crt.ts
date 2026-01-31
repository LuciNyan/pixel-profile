import { CONSTANTS, parseArray, parseBoolean, parseString } from './utils'
import { Hono } from 'hono'
import { clamp, fetchStats, renderCrtStats } from 'pixel-profile'

const githubStatsCrt = new Hono()

githubStatsCrt.get('/', async (c) => {
  const { req, res, body } = c
  const { cache_seconds = `${CONSTANTS.CARD_CACHE_SECONDS}`, exclude_repo, include_all_commits, username } = req.query()

  res.headers.set('Content-Type', 'image/png')

  try {
    const includeAllCommits = parseBoolean(include_all_commits)

    const stats: Parameters<typeof renderCrtStats>[0] = await fetchStats(
      typeof username === 'string' ? username : '',
      includeAllCommits,
      parseArray(exclude_repo),
      false,
      false,
      false
    )

    let cacheSeconds = clamp(parseInt(parseString(cache_seconds) ?? '0', 10), CONSTANTS.SIX_HOURS, CONSTANTS.ONE_DAY)

    cacheSeconds = process.env.CACHE_SECONDS ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds : cacheSeconds

    res.headers.set(
      'Cache-Control',
      `max-age=${cacheSeconds / 2}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`
    )

    const options = {
      includeAllCommits
    }

    const result = await renderCrtStats(stats, options)

    return body(result.buffer as ArrayBuffer)
    // return body(Uint8Array.from(result).buffer)
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

export default githubStatsCrt
