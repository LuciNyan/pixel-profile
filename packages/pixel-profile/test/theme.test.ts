import { renderStats } from '../src'
import { BLUE_AVATAR } from './avatar/blue'
import { DARK_GREEN_AVATAR } from './avatar/dark-green'
import { KITTEN_AVATAR } from './avatar/kitten'
import { LUCI_AVATAR } from './avatar/luci'
import { ORANGE_AVATAR } from './avatar/orange'
import { PIXEL_DOG_AVATAR } from './avatar/pixel-dog'
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
  name: 'Kumiko',
  username: 'Reina',
  totalStars: 21999,
  totalCommits: 38,
  totalPRs: 14001,
  totalIssues: 233,
  contributedTo: 11,
  avatarUrl: BLUE_AVATAR,
  rank: {
    level: 'A',
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
    const png = await renderStats({ ...stats, avatarUrl: KITTEN_AVATAR }, { theme: 'rainbow', pixelateAvatar: false })
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
