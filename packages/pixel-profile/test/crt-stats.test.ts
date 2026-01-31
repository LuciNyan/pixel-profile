import { renderCrtStats } from '../src'
import { stats } from './utils/data'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const FIXED_DATE = new Date('2025-07-27T00:00:00.000Z')

describe('CRT Stats', () => {
  beforeAll(() => {
    vi.spyOn(global, 'Date').mockImplementation(() => FIXED_DATE)
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('Render CRT card', async () => {
    const png = await renderCrtStats({ ...stats })
    expect(png).toMatchImageSnapshot()
  })

  it('Render CRT card with includeAllCommits', async () => {
    const png = await renderCrtStats(stats, {
      includeAllCommits: true
    })
    expect(png).toMatchImageSnapshot()
  })
})
