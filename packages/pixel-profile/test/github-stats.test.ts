import { renderStats } from '../src'
// @ts-expect-error 111
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import { describe, expect, it } from 'vitest'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(): R
    }
  }
}

expect.extend({ toMatchImageSnapshot })

describe('Github stats', () => {
  it('Render card with show_avatar=false', async () => {
    const png = await renderStats({
      name: 'LuciNyan',
      username: 'username',
      totalStars: 12345,
      totalCommits: 67890,
      totalIssues: 0,
      totalPRs: 999,
      contributedTo: 9999,
      avatarUrl: '',
      rank: {
        level: 'A+',
        percentile: 0,
        score: 0
      }
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with custom color and background', async () => {
    const png = await renderStats(
      {
        name: 'LuciNyan',
        username: 'username',
        totalStars: 12345,
        totalCommits: 67890,
        totalIssues: 999,
        totalPRs: 0,
        contributedTo: 9999,
        avatarUrl: '',
        rank: {
          level: 'A',
          percentile: 0,
          score: 0
        }
      },
      {
        background: 'linear-gradient(to bottom right, #74dcc4, #4597e9)',
        color: 'white'
      }
    )
    expect(png).toMatchImageSnapshot()
  })
})
