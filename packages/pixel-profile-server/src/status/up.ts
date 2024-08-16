/**
 * Copyright (c) 2020 Anurag Hazra
 * https://github.com/anuraghazra/github-readme-stats/blob/master/api/status/up.js
 */
import { hasMessage, parseString } from '../utils/index.js'
import { AxiosResponse } from 'axios'
import { Hono } from 'hono'
import { request, retryer } from 'pixel-profile'

export const RATE_LIMIT_SECONDS = 60 * 5

const up = new Hono()

up.get('/', async (c) => {
  const { req, res } = c
  const _type = parseString(req.query().type)

  const type = _type ? _type.toLowerCase() : 'boolean'

  res.headers.set('Content-Type', 'application/json')

  try {
    let PATsValid = true
    try {
      await retryer(uptimeFetcher, {})
    } catch {
      PATsValid = false
    }

    if (PATsValid) {
      res.headers.set('Cache-Control', `max-age=0, s-maxage=${RATE_LIMIT_SECONDS}`)
    } else {
      res.headers.set('Cache-Control', 'no-store')
    }

    switch (type) {
      case 'shields':
        return c.json(shieldsUptimeBadge(PATsValid))
      case 'json':
        return c.json({ up: PATsValid })
      default:
        return c.json(PATsValid)
    }
  } catch (err) {
    console.error(err)

    res.headers.set('Cache-Control', 'no-store')

    if (hasMessage(err)) {
      return c.json(`Something went wrong: ${err.message}`)
    }
  }
})

const uptimeFetcher = (variables: Record<PropertyKey, unknown>, github_token: string): Promise<AxiosResponse> => {
  return request(
    {
      query: `
        query {
          rateLimit {
              remaining
          }
        }
        `,
      variables
    },
    {
      Authorization: `bearer ${github_token}`
    }
  )
}

type ShieldsResponse = {
  schemaVersion: number
  label: string
  message: 'up' | 'down'
  color: 'brightgreen' | 'red'
  isError: boolean
}

const shieldsUptimeBadge = (up: boolean): ShieldsResponse => {
  const schemaVersion = 1
  const isError = true
  const label = 'Public Instance'
  const message = up ? 'up' : 'down'
  const color = up ? 'brightgreen' : 'red'

  return {
    schemaVersion,
    label,
    message,
    color,
    isError
  }
}

export default up
