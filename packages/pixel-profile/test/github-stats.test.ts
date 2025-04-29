import { renderStats } from '../src'
import { stats } from './utils/data'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const FIXED_DATE = new Date('2024-07-27T00:00:00.000Z')

describe('Github stats', () => {
  beforeAll(() => {
    vi.spyOn(global, 'Date').mockImplementation(() => FIXED_DATE)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('Render card', async () => {
    const png = await renderStats({ ...stats })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without pixelated avatar', async () => {
    const png = await renderStats(stats, {
      pixelateAvatar: false
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without avatar', async () => {
    const png = await renderStats(stats, {
      hiddenStatsKeys: ['avatar']
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without avatar and rank, with custom color and background', async () => {
    const png = await renderStats(stats, {
      background: 'linear-gradient(to bottom right, #74dcc4, #4597e9)',
      color: 'white',
      hiddenStatsKeys: ['avatar', 'rank']
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without rank, with theme', async () => {
    const png = await renderStats(stats, { theme: 'summer', hiddenStatsKeys: ['rank'], pixelateAvatar: false })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without avatar and rank, with theme', async () => {
    const png = await renderStats(stats, { theme: 'summer', hiddenStatsKeys: ['avatar', 'rank'] })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card with all commits, custom color, background and screen_effect', async () => {
    const png = await renderStats(stats, {
      background: 'linear-gradient(to bottom right, #2aeeff, #5580eb)',
      color: 'white',
      hiddenStatsKeys: ['avatar', 'rank'],
      includeAllCommits: true,
      screenEffect: true
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render card without total_stars', async () => {
    const png = await renderStats(stats, {
      hiddenStatsKeys: ['avatar', 'stars']
    })
    expect(png).toMatchImageSnapshot()
  })
})
