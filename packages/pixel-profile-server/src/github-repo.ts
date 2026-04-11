import { CONSTANTS, parseBoolean, parseString } from './utils'
import { Hono } from 'hono'
import { type AnimationOptions, clamp, fetchRepo, renderRepo } from 'pixel-profile'

const githubRepo = new Hono()

githubRepo.get('/', async (c) => {
  const { req, res, body } = c
  const {
    animation,
    animation_effect,
    background,
    cache_seconds = `${CONSTANTS.CARD_CACHE_SECONDS}`,
    color,
    username,
    repo,
    theme,
    screen_effect,
    dithering,
    dithering_palette
  } = req.query()

  const isAnimated = parseBoolean(animation)
  res.headers.set('Content-Type', isAnimated ? 'image/gif' : 'image/png')

  try {
    const data = await fetchRepo(parseString(username) ?? '', parseString(repo) ?? '')

    let cacheSeconds = clamp(parseInt(parseString(cache_seconds) ?? '0', 10), CONSTANTS.SIX_HOURS, CONSTANTS.ONE_DAY)
    cacheSeconds = process.env.CACHE_SECONDS ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds : cacheSeconds

    res.headers.set(
      'Cache-Control',
      `max-age=${cacheSeconds / 2}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`
    )

    let animationOpts: AnimationOptions | boolean | undefined
    if (isAnimated) {
      const effect = parseString(animation_effect)
      if (effect === 'crt-flicker' || effect === 'glow-pulse' || effect === 'scanline-scroll') {
        animationOpts = { effect }
      } else {
        animationOpts = true
      }
    }

    const result = await renderRepo(data, {
      background: parseString(background),
      color: parseString(color),
      theme: parseString(theme),
      screenEffect: parseBoolean(screen_effect),
      dithering: parseBoolean(dithering),
      ditheringPalette: parseString(dithering_palette),
      animation: animationOpts
    })

    return body(result.buffer as ArrayBuffer)
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

export default githubRepo
