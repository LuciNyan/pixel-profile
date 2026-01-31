import { TemplateStats } from '../types'
import { filterNotEmpty } from '../utils/filter'
import { getVisibleMainStatsCount, TemplateOptions } from './shared'

export type { TemplateOptions } from './shared'
export { AVATAR_SIZE, defaultTemplateOptions } from './shared'

export function makeGithubStats(stats: TemplateStats, options: TemplateOptions) {
  const { avatar, commits, contributions, issues, name, prs, rank, stars } = stats
  const { hiddenStatsKeys, includeAllCommits, color, background, backgroundRepeat, backgroundSize, backgroundImage } =
    options
  const date = new Date()
  const year = date.getFullYear()

  const isVisible = (key: string) => !hiddenStatsKeys.includes(key)
  const visibleMainStatsCount = getVisibleMainStatsCount(hiddenStatsKeys)
  const isShowSeparator = isVisible('rank') && visibleMainStatsCount > 0

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        ...filterNotEmpty({ color, background, backgroundRepeat, backgroundSize, backgroundImage })
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 23,
          color,
          width: '92%',
          height: '80%',
          borderRight: `${color} 4px solid`,
          borderLeft: `${color} 4px solid`,
          borderBottom: `${color} 4px solid`,
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ borderTop: `${color} 4px solid`, width: '36px' }} />
          <div style={{ position: 'relative', top: 6 }}>{`${name}'s GitHub Stats`}</div>
          <div style={{ borderTop: `${color} 4px solid`, flexGrow: '1' }} />
        </div>
        {/* Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            padding: '22px 40px 56px 40px'
          }}
        >
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              flexGrow: 1,
              paddingRight: avatar ? 40 : 0
            }}
          >
            {isVisible('stars') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%'
                }}
              >
                <div>Total Stars Earned: </div>
                <div>{stars}</div>
              </div>
            )}
            {isVisible('commits') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%'
                }}
              >
                <div>{`Total Commits${includeAllCommits ? '' : `(${year})`}:`}</div>
                <div>{commits}</div>
              </div>
            )}
            {isVisible('prs') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%'
                }}
              >
                <div>Total PRs:</div>
                <div>{prs}</div>
              </div>
            )}
            {isVisible('issues') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%'
                }}
              >
                <div>Total Issues:</div>
                <div>{issues}</div>
              </div>
            )}
            {isVisible('contributions') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%'
                }}
              >
                <div>Contributed to (last year):</div>
                <div>{contributions}</div>
              </div>
            )}
            {isShowSeparator && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%',
                  lineHeight: 0.5
                }}
              >
                {avatar ? (
                  <div>--------------------------------</div>
                ) : (
                  <div>---------------------------------------------</div>
                )}
              </div>
            )}
            {isVisible('rank') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%'
                }}
              >
                <div>Rank:</div>
                <div>{rank}</div>
              </div>
            )}
          </div>
          {isVisible('avatar') && <img src={avatar} alt='Avatar' style={{ height: '100%' }} />}
        </div>
      </div>
    </div>
  )
}
