import './utils/data'
import { renderRepo } from '../src'
import { RepoData } from '../src/types'
import { describe, expect, it } from 'vitest'

const testRepo: RepoData = {
  name: 'pixel-profile',
  owner: 'LuciNyan',
  description: 'Pixel art-styled GitHub profile stats card generator.',
  language: 'TypeScript',
  languageColor: '#3178c6',
  stars: 1234,
  forks: 89,
  isArchived: false,
  isFork: false
}

describe('Repo card', () => {
  it('Render repo card (default)', async () => {
    const png = await renderRepo(testRepo)
    expect(png).toMatchImageSnapshot()
  })

  it('Render repo card with summer theme', async () => {
    const png = await renderRepo(testRepo, { theme: 'summer' })
    expect(png).toMatchImageSnapshot()
  })

  it('Render repo card with screen effect', async () => {
    const png = await renderRepo(testRepo, {
      screenEffect: true,
      background: 'linear-gradient(to bottom right, #2aeeff, #5580eb)',
      color: 'white'
    })
    expect(png).toMatchImageSnapshot()
  })

  it('Render repo card with dithering', async () => {
    const png = await renderRepo(testRepo, { dithering: true })
    expect(png).toMatchImageSnapshot()
  })

  it('Render repo card (archived, forked, long desc)', async () => {
    const archivedRepo: RepoData = {
      name: 'legacy-tool',
      owner: 'SomeOrg',
      description: 'This is a very long description that should be truncated because it exceeds the maximum limit.',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 42,
      forks: 7,
      isArchived: true,
      isFork: true
    }
    const png = await renderRepo(archivedRepo)
    expect(png).toMatchImageSnapshot()
  })

  it('Render repo card (no language)', async () => {
    const noLangRepo: RepoData = {
      name: 'my-config',
      owner: 'dev-user',
      description: '',
      language: '',
      languageColor: '#858585',
      stars: 0,
      forks: 0,
      isArchived: false,
      isFork: false
    }
    const png = await renderRepo(noLangRepo)
    expect(png).toMatchImageSnapshot()
  })
})
