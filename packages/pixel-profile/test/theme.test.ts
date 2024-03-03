import { renderStats } from '../src'
import { BLUE_AVATAR } from './avatar/blue'
import { CYAN_AVATAR } from './avatar/cyan'
import { DARK_GREEN_AVATAR } from './avatar/dark-green'
import { LUCI_AVATAR } from './avatar/luci'
import { ORANGE_AVATAR } from './avatar/orange'
import { PIXEL_DOG_AVATAR } from './avatar/pixel-dog'
import { PIXEL_KITTEN_AVATAR } from './avatar/pixel-kitten'
import { PURPLE_AVATAR } from './avatar/purple'
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
  avatarUrl: BLUE_AVATAR,
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
    const png = await renderStats(
      { ...stats, avatarUrl: PIXEL_KITTEN_AVATAR },
      { theme: 'rainbow', pixelateAvatar: false }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with monica theme', async () => {
    const png = await renderStats({ ...stats, avatarUrl: PURPLE_AVATAR }, { theme: 'monica' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with lax theme', async () => {
    const png = await renderStats({ ...stats, avatarUrl: ORANGE_AVATAR }, { theme: 'lax' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with serene theme', async () => {
    const png = await renderStats({ ...stats, avatarUrl: CYAN_AVATAR }, { theme: 'serene', pixelateAvatar: false })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with journey theme', async () => {
    const png = await renderStats(
      { ...stats, avatarUrl: DARK_GREEN_AVATAR },
      { theme: 'journey', pixelateAvatar: false }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with fuji theme', async () => {
    const png = await renderStats({ ...stats, avatarUrl: LUCI_AVATAR }, { theme: 'fuji', pixelateAvatar: false })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with road trip theme', async () => {
    const png = await renderStats(
      { ...stats, avatarUrl: PIXEL_DOG_AVATAR },
      { theme: 'road_trip', pixelateAvatar: false }
    )
    expect(png).toMatchImageSnapshot()
  })
})
