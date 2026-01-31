export type TemplateOptions = {
  color: string
  background: string
  hiddenStatsKeys: string[]
  includeAllCommits: boolean
  backgroundImage?: string
  backgroundSize?: string
  backgroundRepeat?: string
}

export const defaultTemplateOptions = {
  color: 'white',
  background: '#434343'
}

export const AVATAR_SIZE = {
  AVATAR_WIDTH: 280,
  AVATAR_HEIGHT: 280
}

export const mainStatsItems = ['stars', 'commits', 'issues', 'prs', 'contributions']

export const getVisibleMainStatsCount = (hiddenStatsKeys: string[]) =>
  mainStatsItems.filter((stat) => !hiddenStatsKeys.includes(stat)).length
