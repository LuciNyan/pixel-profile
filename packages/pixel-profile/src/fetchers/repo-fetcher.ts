import { RepoData } from '../types'
import { request, retryer } from '../utils'
import { type AxiosResponse } from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const GRAPHQL_REPO_QUERY = `
  query repoInfo($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      name
      owner { login }
      description
      primaryLanguage { name color }
      stargazerCount
      forkCount
      isArchived
      isFork
    }
  }
`

const fetcher = (variables: Record<PropertyKey, unknown>, token: string): Promise<AxiosResponse> => {
  return request(
    {
      query: GRAPHQL_REPO_QUERY,
      variables
    },
    {
      Authorization: `bearer ${token}`
    }
  )
}

export async function fetchRepo(owner: string, repo: string, token = ''): Promise<RepoData> {
  if (!owner || !repo) {
    throw new Error('needs owner and repo name')
  }

  let res: AxiosResponse

  if (token) {
    res = await fetcher({ owner, repo }, token)
  } else {
    res = await retryer(fetcher, { owner, repo })
  }

  if (res.data.errors) {
    console.error(res.data.errors)
    if (res.data.errors[0].type === 'NOT_FOUND') {
      throw new Error(res.data.errors[0].message || 'Could not fetch repository.')
    }
    throw new Error(res.data.errors[0].message || 'Failed to fetch repository data.')
  }

  const repoNode = res.data.data.repository

  return {
    name: repoNode.name,
    owner: repoNode.owner.login,
    description: repoNode.description || '',
    language: repoNode.primaryLanguage?.name || '',
    languageColor: repoNode.primaryLanguage?.color || '#858585',
    stars: repoNode.stargazerCount,
    forks: repoNode.forkCount,
    isArchived: repoNode.isArchived,
    isFork: repoNode.isFork
  }
}
