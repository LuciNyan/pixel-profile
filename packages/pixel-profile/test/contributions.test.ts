import './utils/data'
import { renderContributions } from '../src'
import { ContributionsData, ContributionWeek } from '../src/types'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const FIXED_DATE = new Date('2024-07-27T00:00:00.000Z')

const SEED_WEEKS = (() => {
  const weeks: ContributionWeek[] = []
  const startDate = new Date('2023-07-30T00:00:00.000Z')
  const pattern = [0, 3, 0, 7, 1, 0, 12, 0, 5, 0, 2, 15, 0, 8]

  for (let w = 0; w < 53; w++) {
    const days = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + w * 7 + d)
      const idx = (w * 7 + d) % pattern.length
      const count = pattern[idx]
      const level = count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 10 ? 3 : 4
      const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
      days.push({
        contributionCount: count,
        date: date.toISOString().split('T')[0],
        color: colors[level]
      })
    }
    weeks.push({ contributionDays: days })
  }

  return weeks
})()

const testContributions: ContributionsData = {
  username: 'Kumiko',
  calendar: {
    totalContributions: SEED_WEEKS.reduce(
      (sum, w) => sum + w.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
      0
    ),
    weeks: SEED_WEEKS
  }
}

describe('Contributions heatmap', () => {
  beforeAll(() => {
    vi.spyOn(global, 'Date').mockImplementation(() => FIXED_DATE)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('Render contributions card', async () => {
    const png = await renderContributions(testContributions)
    expect(png).toMatchImageSnapshot()
  })

  it('Render contributions card with custom color and background', async () => {
    const png = await renderContributions(testContributions, {
      background: 'linear-gradient(to bottom right, #1a1b27, #414868)',
      color: '#c0caf5'
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render contributions card with summer theme', async () => {
    const png = await renderContributions(testContributions, {
      theme: 'summer'
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render contributions card with screen effect', async () => {
    const png = await renderContributions(testContributions, {
      screenEffect: true,
      background: 'linear-gradient(to bottom right, #2aeeff, #5580eb)',
      color: 'white'
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render contributions card with dithering', async () => {
    const png = await renderContributions(testContributions, {
      dithering: true
    })
    expect(png).toMatchImageSnapshot()
  })
})
