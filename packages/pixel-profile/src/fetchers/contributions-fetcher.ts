import { ContributionCalendar, ContributionsData } from '../types'
import { request, retryer } from '../utils'
import { type AxiosResponse } from 'axios'
import * as dotenv from 'dotenv'
import githubUsernameRegex from 'github-username-regex'

dotenv.config()

const GRAPHQL_CONTRIBUTIONS_QUERY = `
  query userContributions($login: String!, $from: DateTime, $to: DateTime) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`

const fetcher = (variables: Record<PropertyKey, unknown>, token: string): Promise<AxiosResponse> => {
  return request(
    {
      query: GRAPHQL_CONTRIBUTIONS_QUERY,
      variables
    },
    {
      Authorization: `bearer ${token}`
    }
  )
}

export async function fetchContributions(
  username: string,
  token = '',
  from?: string,
  to?: string
): Promise<ContributionsData> {
  if (!username) {
    throw new Error('needs a username')
  }

  if (!githubUsernameRegex.test(username)) {
    throw new Error('Invalid username provided.')
  }

  const variables: Record<string, unknown> = { login: username }
  if (from) variables.from = from
  if (to) variables.to = to

  let res: AxiosResponse

  if (token) {
    res = await fetcher(variables, token)
  } else {
    res = await retryer(fetcher, variables)
  }

  if (res.data.errors) {
    console.error(res.data.errors)
    if (res.data.errors[0].type === 'NOT_FOUND') {
      throw new Error(res.data.errors[0].message || 'Could not fetch user.')
    }
    throw new Error(res.data.errors[0].message || 'Failed to fetch contribution data.')
  }

  const calendar: ContributionCalendar = res.data.data.user.contributionsCollection.contributionCalendar

  return { username, calendar }
}
