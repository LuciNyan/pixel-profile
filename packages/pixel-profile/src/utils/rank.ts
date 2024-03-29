function calcExponentialCDF(x: number): number {
  return 1 - 2 ** -x
}

function calcLogNormalCDF(x: number): number {
  return x / (1 + x)
}

function formatScore(score: number): number {
  if (score % 1 === 0) {
    return Math.floor(score)
  }

  return score
}

export type Rank = { level: string; percentile: number; score: number }

type RankParams = {
  all_commits: boolean
  commits: number
  prs: number
  issues: number
  reviews: number
  stars: number
  followers: number
}

export function rank({ all_commits, commits, prs, issues, reviews, stars, followers }: RankParams): Rank {
  const COMMITS_MEDIAN = all_commits ? 1000 : 250
  const COMMITS_WEIGHT = 2
  const PRS_MEDIAN = 50
  const PRS_WEIGHT = 3
  const ISSUES_MEDIAN = 25
  const ISSUES_WEIGHT = 1
  const REVIEWS_MEDIAN = 2
  const REVIEWS_WEIGHT = 1
  const STARS_MEDIAN = 50
  const STARS_WEIGHT = 4
  const FOLLOWERS_MEDIAN = 10
  const FOLLOWERS_WEIGHT = 1

  const TOTAL_WEIGHT = COMMITS_WEIGHT + PRS_WEIGHT + ISSUES_WEIGHT + REVIEWS_WEIGHT + STARS_WEIGHT + FOLLOWERS_WEIGHT

  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100]
  const LEVELS = ['S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']

  const score =
    (COMMITS_WEIGHT * calcExponentialCDF(commits / COMMITS_MEDIAN) +
      PRS_WEIGHT * calcExponentialCDF(prs / PRS_MEDIAN) +
      ISSUES_WEIGHT * calcExponentialCDF(issues / ISSUES_MEDIAN) +
      REVIEWS_WEIGHT * calcExponentialCDF(reviews / REVIEWS_MEDIAN) +
      STARS_WEIGHT * calcLogNormalCDF(stars / STARS_MEDIAN) +
      FOLLOWERS_WEIGHT * calcLogNormalCDF(followers / FOLLOWERS_MEDIAN)) /
    TOTAL_WEIGHT

  const rank = 1 - score

  const level = LEVELS[THRESHOLDS.findIndex((t) => rank * 100 <= t)]

  return {
    level,
    percentile: rank * 100,
    score: formatScore(Number((score * 100).toFixed(1)))
  }
}
