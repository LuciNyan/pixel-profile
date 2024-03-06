import { KITTEN_AVATAR } from './avatar/kitten'
// @ts-expect-error ...
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import { expect } from 'vitest'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(): R
    }
  }
}

expect.extend({ toMatchImageSnapshot })

export const stats = {
  name: 'Kumiko',
  username: 'Reina',
  totalStars: 21999,
  totalCommits: 38,
  totalPRs: 14001,
  totalIssues: 233,
  contributedTo: 11,
  avatarUrl: KITTEN_AVATAR,
  rank: {
    level: 'A',
    percentile: 0,
    score: 0
  }
}
