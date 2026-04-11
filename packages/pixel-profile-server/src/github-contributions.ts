import { CONSTANTS, parseBoolean, parseString } from './utils'
import { Hono } from 'hono'
import { type AnimationOptions, clamp, fetchContributions, renderContributions } from 'pixel-profile'

const githubContributions = new Hono()

githubContributions.get('/', async (c) => {
  const { req, res, body } = c
  const {
    animation,
    animation_effect,
    background,
    cache_seconds = `${CONSTANTS.CARD_CACHE_SECONDS}`,
    color,
    username,
    theme,
    screen_effect,
    dithering,
    dithering_palette
  } = req.query()

  const isAnimated = parseBoolean(animation)
  res.headers.set('Content-Type', isAnimated ? 'image/gif' : 'image/png')

  try {
    const data = await fetchContributions(typeof username === 'string' ? username : '')

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

    const options = {
      background: parseString(background),
      color: parseString(color),
      theme: parseString(theme),
      screenEffect: parseBoolean(screen_effect),
      dithering: parseBoolean(dithering),
      ditheringPalette: parseString(dithering_palette),
      animation: animationOpts
    }

    const result = await renderContributions(data, options)

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

export default githubContributions
