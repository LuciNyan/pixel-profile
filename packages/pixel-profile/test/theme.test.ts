import { renderStats } from '../src'
import { BLUE_AVATAR } from './utils/avatar/blue'
import { DARK_GREEN_AVATAR } from './utils/avatar/dark-green'
import { KITTEN_AVATAR } from './utils/avatar/kitten'
import { LUCI_AVATAR } from './utils/avatar/luci'
import { ORANGE_AVATAR } from './utils/avatar/orange'
import { PIXEL_DOG_AVATAR } from './utils/avatar/pixel-dog'
import { PURPLE_AVATAR } from './utils/avatar/purple'
import { stats } from './utils/data'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const TEST_TIMEOUT = 20 * 1000
const FIXED_DATE = new Date('2024-07-27T00:00:00.000Z')

describe('Theme', () => {
  beforeAll(() => {
    vi.spyOn(global, 'Date').mockImplementation(() => FIXED_DATE)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('Render card with summer theme and custom color', async () => {
    const png = await renderStats(stats, { theme: 'summer', color: 'yellow' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with summer theme and custom background', async () => {
    const png = await renderStats(stats, { theme: 'summer', background: 'black' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with summer theme', async () => {
    const png = await renderStats({ ...stats, avatarUrl: BLUE_AVATAR }, { theme: 'summer' })
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

  it('Render card with journey theme and dithering', async () => {
    const png = await renderStats(
      { ...stats, avatarUrl: DARK_GREEN_AVATAR },
      { theme: 'journey', pixelateAvatar: false, dithering: true, hiddenStatsKeys: ['avatar'] }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with fuji theme', async () => {
    const png = await renderStats({ ...stats, avatarUrl: LUCI_AVATAR }, { theme: 'fuji', pixelateAvatar: false })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with fuji theme and dithering', async () => {
    const png = await renderStats(
      { ...stats, avatarUrl: LUCI_AVATAR },
      { theme: 'fuji', pixelateAvatar: false, dithering: true }
    )
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

describe('Theme with screen effect', () => {
  beforeAll(() => {
    vi.spyOn(global, 'Date').mockImplementation(() => FIXED_DATE)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('Render card with summer theme and custom color', async () => {
    const png = await renderStats(stats, { theme: 'summer', color: 'yellow', screenEffect: true })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with summer theme and custom background', async () => {
    const png = await renderStats(stats, { theme: 'summer', background: 'black', screenEffect: true })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with summer theme', async () => {
    const png = await renderStats({ ...stats, avatarUrl: BLUE_AVATAR }, { theme: 'summer', screenEffect: true })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with blue_chill theme', async () => {
    const png = await renderStats(stats, { theme: 'blue_chill', screenEffect: true })
    expect(png).toMatchImageSnapshot()
  })

  it(
    'Render card with blue_chill theme and glow',
    {
      timeout: TEST_TIMEOUT
    },
    async () => {
      const png = await renderStats(stats, { theme: 'blue_chill', isFastMode: false, screenEffect: true })
      expect(png).toMatchImageSnapshot()
    }
  )

  it('Render card with rainbow theme', async () => {
    const png = await renderStats(
      { ...stats, avatarUrl: KITTEN_AVATAR },
      { theme: 'rainbow', pixelateAvatar: false, screenEffect: true }
    )
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with monica theme', async () => {
    const png = await renderStats({ ...stats, avatarUrl: PURPLE_AVATAR }, { theme: 'monica', screenEffect: true })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with lax theme', async () => {
    const png = await renderStats({ ...stats, avatarUrl: ORANGE_AVATAR }, { theme: 'lax', screenEffect: true })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with journey theme', async () => {
    const png = await renderStats(
      { ...stats, avatarUrl: DARK_GREEN_AVATAR },
      { theme: 'journey', pixelateAvatar: false, screenEffect: true }
    )
    expect(png).toMatchImageSnapshot()
  })

  it(
    'Render card with journey theme and glow',
    {
      timeout: TEST_TIMEOUT
    },
    async () => {
      const png = await renderStats(
        { ...stats, avatarUrl: DARK_GREEN_AVATAR },
        { theme: 'journey', pixelateAvatar: false, isFastMode: false, screenEffect: true }
      )
      expect(png).toMatchImageSnapshot()
    }
  )

  it('Render card with fuji theme', async () => {
    const png = await renderStats(
      { ...stats, avatarUrl: LUCI_AVATAR },
      { theme: 'fuji', pixelateAvatar: false, screenEffect: true }
    )
    expect(png).toMatchImageSnapshot()
  })

  it(
    'Render card with fuji theme and glow',
    {
      timeout: TEST_TIMEOUT
    },
    async () => {
      const png = await renderStats(
        { ...stats, avatarUrl: LUCI_AVATAR },
        { theme: 'fuji', pixelateAvatar: false, isFastMode: false, screenEffect: true }
      )
      expect(png).toMatchImageSnapshot()
    }
  )

  it(
    'Render card with fuji theme and glow(fast mode)',
    {
      timeout: TEST_TIMEOUT
    },
    async () => {
      const png = await renderStats(
        { ...stats, avatarUrl: LUCI_AVATAR },
        { theme: 'fuji', isFastMode: true, screenEffect: true }
      )
      expect(png).toMatchImageSnapshot()
    }
  )

  it('Render card with road trip theme', async () => {
    const png = await renderStats(
      { ...stats, avatarUrl: PIXEL_DOG_AVATAR },
      { theme: 'road_trip', pixelateAvatar: false, screenEffect: true }
    )
    expect(png).toMatchImageSnapshot()
  })

  it(
    'Render card with road trip theme and glow',
    {
      timeout: TEST_TIMEOUT
    },
    async () => {
      const png = await renderStats(
        { ...stats, avatarUrl: PIXEL_DOG_AVATAR },
        { theme: 'road_trip', pixelateAvatar: false, isFastMode: false, screenEffect: true }
      )
      expect(png).toMatchImageSnapshot()
    }
  )
})

describe('Theme with crt effect', () => {
  beforeAll(() => {
    vi.spyOn(global, 'Date').mockImplementation(() => FIXED_DATE)
  })

  it('Render card with crt theme(fast mode)', async () => {
    const png = await renderStats({ ...stats, avatarUrl: BLUE_AVATAR }, { theme: 'crt', isFastMode: true })
    expect(png).toMatchImageSnapshot()
  })

  it(
    'Render card with crt theme(slow mode)',
    {
      timeout: TEST_TIMEOUT
    },
    async () => {
      const png = await renderStats({ ...stats, avatarUrl: BLUE_AVATAR }, { theme: 'crt', isFastMode: false })
      expect(png).toMatchImageSnapshot()
    }
  )
})
