import { renderStats } from '../src'
import { BLUE_AVATAR } from './avatar/blue'
// @ts-expect-error ...
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
  it('Render card', async () => {
    const png = await renderStats({
      name: 'LuciNyan',
      username: 'username',
      totalStars: 999,
      totalCommits: 99999,
      totalIssues: 99,
      totalPRs: 9,
      contributedTo: 9999,
      avatarUrl: BLUE_AVATAR,
      rank: {
        level: 'S',
        percentile: 0,
        score: 0
      }
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without pixelated avatar', async () => {
    const png = await renderStats(
      {
        name: 'LuciNyan',
        username: 'username',
        totalStars: 999,
        totalCommits: 99999,
        totalIssues: 99,
        totalPRs: 9,
        contributedTo: 9999,
        avatarUrl: BLUE_AVATAR,
        rank: {
          level: 'S',
          percentile: 0,
          score: 0
        }
      },
      {
        pixelateAvatar: false
      }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without avatar', async () => {
    const png = await renderStats(
      {
        name: 'LuciNyan',
        username: 'username',
        totalStars: 999,
        totalCommits: 99999,
        totalIssues: 99,
        totalPRs: 9,
        contributedTo: 9999,
        avatarUrl: '',
        rank: {
          level: 'S',
          percentile: 0,
          score: 0
        }
      },
      {
        hiddenStatsKeys: ['avatar']
      }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without avatar and rank, with custom color and background', async () => {
    const png = await renderStats(
      {
        name: 'LuciNyan',
        username: 'username',
        totalStars: 999,
        totalCommits: 99999,
        totalIssues: 99,
        totalPRs: 9,
        contributedTo: 9999,
        avatarUrl: '',
        rank: null
      },
      {
        background: 'linear-gradient(to bottom right, #74dcc4, #4597e9)',
        color: 'white',
        hiddenStatsKeys: ['avatar', 'rank']
      }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without avatar, with theme', async () => {
    const png = await renderStats(
      {
        name: 'LuciNyan',
        username: 'username',
        totalStars: 999,
        totalCommits: 99999,
        totalIssues: 99,
        totalPRs: 9,
        contributedTo: 9999,
        avatarUrl: '',
        rank: {
          level: 'S',
          percentile: 0,
          score: 0
        }
      },
      { theme: 'journey' }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without avatar and rank, with theme', async () => {
    const png = await renderStats(
      {
        name: 'LuciNyan',
        username: 'username',
        totalStars: 999,
        totalCommits: 99999,
        totalIssues: 99,
        totalPRs: 9,
        contributedTo: 9999,
        avatarUrl: '',
        rank: null
      },
      { theme: 'journey' }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with all commits, custom color, background and screen_effect', async () => {
    const png = await renderStats(
      {
        name: 'LuciNyan',
        username: 'username',
        totalStars: 999,
        totalCommits: 99999,
        totalIssues: 99,
        totalPRs: 9,
        contributedTo: 9999,
        avatarUrl: '',
        rank: null
      },
      {
        background: 'linear-gradient(to bottom right, #2aeeff, #5580eb)',
        color: 'white',
        hiddenStatsKeys: ['avatar', 'rank'],
        includeAllCommits: true,
        screenEffect: true
      }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without total_stars', async () => {
    const png = await renderStats(
      {
        name: 'LuciNyan',
        username: 'username',
        totalStars: 999,
        totalCommits: 99999,
        totalIssues: 99,
        totalPRs: 9,
        contributedTo: 9999,
        avatarUrl: '',
        rank: {
          level: 'S',
          percentile: 0,
          score: 0
        }
      },
      {
        hiddenStatsKeys: ['avatar', 'stars']
      }
    )
    expect(png).toMatchImageSnapshot()
  })
})
