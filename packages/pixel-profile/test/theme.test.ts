import { renderStats } from '../src'
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

const stats = {
  name: 'User Name',
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
}

describe('Theme', () => {
  it('Render card with summer theme and custom color', async () => {
    const png = await renderStats(stats, { theme: 'summer', color: 'yellow' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with summer theme and custom background', async () => {
    const png = await renderStats(stats, { theme: 'summer', background: 'black' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with summer theme', async () => {
    const png = await renderStats(stats, { theme: 'summer' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with blue_chill theme', async () => {
    const png = await renderStats(stats, { theme: 'blue_chill' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with rainbow theme', async () => {
    const png = await renderStats(stats, { theme: 'rainbow' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with monica theme', async () => {
    const png = await renderStats(stats, { theme: 'monica' })
    expect(png).toMatchImageSnapshot()
  })
})
