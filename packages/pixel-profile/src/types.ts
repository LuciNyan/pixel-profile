import { Rank } from './utils'

/**
 * Raw GitHub statistics data (fetched from API)
 */
export type GithubStats = {
  name: string
  username: string
  totalStars: number
  totalCommits: number
  totalIssues: number
  totalPRs: number
  avatarUrl: string
  contributedTo: number
  rank: Rank | null
}

/**
 * Formatted template data (used for rendering)
 */
export type TemplateStats = {
  name: string
  avatar: string
  stars: string
  commits: string
  issues: string
  prs: string
  contributions: string
  rank: Rank['level']
}
