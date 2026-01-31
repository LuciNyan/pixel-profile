/**
 * Copyright (c) 2020 Anurag Hazra
 * https://github.com/anuraghazra/github-readme-stats/blob/master/src/fetchers/stats-fetcher.js
 */
// eslint-disable max-len
import { type Rank, rank, request, retryer } from '../utils'
import axios, { type AxiosResponse } from 'axios'
import * as dotenv from 'dotenv'
import githubUsernameRegex from 'github-username-regex'

dotenv.config()

const GRAPHQL_REPOS_FIELD = `
  repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}, after: $after) {
    totalCount
    nodes {
      name
      stargazers {
        totalCount
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
`

const GRAPHQL_REPOS_QUERY = `
  query userInfo($login: String!, $after: String) {
    user(login: $login) {
      ${GRAPHQL_REPOS_FIELD}
    }
  }
`

// eslint-disable-next-line eslint-comments/disable-enable-pair
const GRAPHQL_STATS_QUERY = /* eslint-disable max-len */ `
  query userInfo($login: String!, $after: String, $includeMergedPullRequests: Boolean!, $includeDiscussions: Boolean!, $includeDiscussionsAnswers: Boolean!, $contributionFrom: DateTime) {
    user(login: $login) {
      name
      login
      avatarUrl(size: 280)
      bio
      contributionsCollection(from: $contributionFrom) {
        totalCommitContributions,  
        totalPullRequestReviewContributions
      } 
      repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
        totalCount
      }
      pullRequests(first: 1) {
        totalCount
      }
      mergedPullRequests: pullRequests(states: MERGED) @include(if: $includeMergedPullRequests) {
        totalCount
      }
      openIssues: issues(states: OPEN) {
        totalCount
      }
      closedIssues: issues(states: CLOSED) {
        totalCount
      }
      followers {
        totalCount
      }
      repositoryDiscussions @include(if: $includeDiscussions) {
        totalCount
      }
      repositoryDiscussionComments(onlyAnswers: true) @include(if: $includeDiscussionsAnswers) {
        totalCount
      }
      ${GRAPHQL_REPOS_FIELD}
    }
  }
`

const fetcher = (variables: Record<PropertyKey, unknown>, token: string): Promise<AxiosResponse> => {
  const query = variables.after ? GRAPHQL_REPOS_QUERY : GRAPHQL_STATS_QUERY

  return request(
    {
      query,
      variables
    },
    {
      Authorization: `bearer ${token}`
    }
  )
}

/**
 * Fetch stats information for a given username.
 * @description This function supports multi-page fetching if
 * the 'FETCH_MULTI_PAGE_STARS' environment variable is set to true.
 */
type Variables = {
  token?: string
  username: string
  includeMergedPullRequests: boolean
  includeDiscussions: boolean
  includeDiscussionsAnswers: boolean
  contributionFrom: string | null
}

const statsFetcher = async ({
  token,
  username,
  includeMergedPullRequests,
  includeDiscussions,
  includeDiscussionsAnswers,
  contributionFrom
}: Variables): Promise<AxiosResponse> => {
  let stats
  let hasNextPage = true
  let endCursor = null
  while (hasNextPage) {
    const variables = {
      login: username,
      first: 100,
      after: endCursor,
      includeMergedPullRequests,
      includeDiscussions,
      includeDiscussionsAnswers,
      contributionFrom
    }

    let res: any

    if (token) {
      res = await fetcher(variables, token)
    } else {
      res = await retryer(fetcher, variables)
    }

    if (res.data.errors) {
      return res
    }

    // Store stats data.
    const repoNodes = res.data.data.user.repositories.nodes
    if (stats) {
      stats.data.data.user.repositories.nodes.push(...repoNodes)
    } else {
      stats = res
    }

    // Disable multi page fetching on public Vercel instance due to rate limits.
    const repoNodesWithStars = repoNodes.filter(
      (node: { stargazers: { totalCount: number } }) => node.stargazers.totalCount !== 0
    )
    hasNextPage =
      process.env.FETCH_MULTI_PAGE_STARS === 'true' &&
      repoNodes.length === repoNodesWithStars.length &&
      res.data.data.user.repositories.pageInfo.hasNextPage
    endCursor = res.data.data.user.repositories.pageInfo.endCursor
  }

  return stats as AxiosResponse
}

const totalCommitsFetcher = async (username: string, token?: string): Promise<number> => {
  if (!githubUsernameRegex.test(username)) {
    console.log('Invalid username provided.')
    throw new Error('Invalid username provided.')
  }

  // https://developer.github.com/v3/search/#search-commits
  const fetchTotalCommits = (variables: Record<PropertyKey, unknown>, tokenParam: string) => {
    return axios({
      method: 'get',
      url: `https://api.github.com/search/commits?q=author:${variables.login}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.cloak-preview',
        Authorization: `token ${tokenParam}`
      }
    })
  }

  let res
  try {
    if (token) {
      res = await fetchTotalCommits({ login: username }, token)
    } else {
      res = await retryer(fetchTotalCommits, { login: username })
    }
  } catch (err: any) {
    console.log(err)
    throw new Error(err)
  }

  const totalCount = res.data.total_count
  if (!totalCount || isNaN(totalCount)) {
    throw new Error('Could not fetch total commits.')
  }

  return totalCount
}

export type StatsData = {
  name: string
  username: string
  bio: string
  avatarUrl: string
  totalPRs: number
  totalPRsMerged: number
  mergedPRsPercentage: number
  totalReviews: number
  totalCommits: number
  totalIssues: number
  totalStars: number
  totalDiscussionsStarted: number
  totalDiscussionsAnswered: number
  contributedTo: number
  rank: Rank
}

export async function fetchStats(
  username: string,
  include_all_commits = false,
  exclude_repo: string[] = [],
  include_merged_pull_requests = false,
  include_discussions = false,
  include_discussions_answers = false,
  token = ''
): Promise<StatsData> {
  if (!username) {
    throw new Error('needs a username')
  }

  const stats = {
    name: '',
    username,
    avatarUrl: '',
    bio: '',
    totalPRs: 0,
    totalPRsMerged: 0,
    mergedPRsPercentage: 0,
    totalReviews: 0,
    totalCommits: 0,
    totalIssues: 0,
    totalStars: 0,
    totalDiscussionsStarted: 0,
    totalDiscussionsAnswered: 0,
    contributedTo: 0,
    rank: { level: 'C', percentile: 100, score: 0 }
  }

  const res = await statsFetcher({
    token,
    username,
    includeMergedPullRequests: include_merged_pull_requests,
    includeDiscussions: include_discussions,
    includeDiscussionsAnswers: include_discussions_answers,
    contributionFrom: include_all_commits ? null : getFirstSecondOfYear().toISOString()
  })

  // Catch GraphQL errors.
  if (res.data.errors) {
    console.error(res.data.errors)
    if (res.data.errors[0].type === 'NOT_FOUND') {
      throw new Error(res.data.errors[0].message || 'Could not fetch user.')
    }
    if (res.data.errors[0].message) {
      throw new Error(res.data.errors[0].message)
    }

    throw new Error('Something went wrong while trying to retrieve the stats data using the GraphQL API.')
  }

  const user = res.data.data.user

  stats.name = user.name || user.login
  stats.avatarUrl = user.avatarUrl
  stats.bio = user.bio

  // if include_all_commits, fetch all commits using the REST API.
  if (include_all_commits) {
    stats.totalCommits = await totalCommitsFetcher(username, token)
  } else {
    stats.totalCommits = user.contributionsCollection.totalCommitContributions
  }

  stats.totalPRs = user.pullRequests.totalCount
  if (include_merged_pull_requests) {
    stats.totalPRsMerged = user.mergedPullRequests.totalCount
    stats.mergedPRsPercentage = (user.mergedPullRequests.totalCount / user.pullRequests.totalCount) * 100
  }
  stats.totalReviews = user.contributionsCollection.totalPullRequestReviewContributions
  stats.totalIssues = user.openIssues.totalCount + user.closedIssues.totalCount
  if (include_discussions) {
    stats.totalDiscussionsStarted = user.repositoryDiscussions.totalCount
  }
  if (include_discussions_answers) {
    stats.totalDiscussionsAnswered = user.repositoryDiscussionComments.totalCount
  }
  stats.contributedTo = user.repositoriesContributedTo.totalCount

  // Retrieve stars while filtering out repositories to be hidden.
  const repoToHide = new Set(exclude_repo)

  stats.totalStars = user.repositories.nodes
    .filter((data: { name: string }) => {
      return !repoToHide.has(data.name)
    })
    .reduce((prev: number, curr: { stargazers: { totalCount: number } }) => {
      return prev + curr.stargazers.totalCount
    }, 0)

  stats.rank = rank({
    all_commits: include_all_commits,
    commits: stats.totalCommits,
    prs: stats.totalPRs,
    reviews: stats.totalReviews,
    issues: stats.totalIssues,
    // repos: user.repositories.totalCount,
    stars: stats.totalStars,
    followers: user.followers.totalCount
  })

  return stats
}

function getFirstSecondOfYear(): Date {
  const d = new Date()
  d.setFullYear(d.getFullYear())
  d.setUTCMonth(0)
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)

  return d
}
