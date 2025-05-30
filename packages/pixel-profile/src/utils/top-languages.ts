import axios from 'axios'

export async function getTopLanguages(username: string, token?: string): Promise<string> {
  const headers = token ? { Authorization: `token ${token}` } : {}
  const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers })
  const repos = reposRes.data

  const languageStats: Record<string, number> = {}

  for (const repo of repos) {
    if (repo.fork) continue
    const langRes = await axios.get(repo.languages_url, { headers })
    const langs = langRes.data
    for (const [lang, bytes] of Object.entries(langs)) {
      languageStats[lang] = (languageStats[lang] || 0) + (bytes as number)
    }
  }

  const sorted = Object.entries(languageStats).sort((a, b) => b[1] - a[1])
  const top3 = sorted.slice(0, 3)
  const total = top3.reduce((sum, [, bytes]) => sum + bytes, 0)

  return top3.map(([lang, bytes]) => `${lang} ${Math.round((bytes / total) * 100)}%`).join(', ')
}
