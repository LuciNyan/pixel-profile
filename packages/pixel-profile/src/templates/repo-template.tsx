import { RepoData } from '../types'
import { filterNotEmpty } from '../utils/filter'

export type RepoTemplateOptions = {
  color: string
  background: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundRepeat?: string
}

export const defaultRepoOptions: RepoTemplateOptions = {
  color: 'white',
  background: '#434343'
}

export const REPO_CARD = {
  WIDTH: 1226,
  HEIGHT: 350
}

function kFormat(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`

  return String(n)
}

export function makeRepoCard(repo: RepoData, options: RepoTemplateOptions) {
  const { color, background, backgroundImage, backgroundSize, backgroundRepeat } = options
  const desc = repo.description.length > 80 ? `${repo.description.slice(0, 77)}...` : repo.description

  const badges: string[] = []
  if (repo.isArchived) badges.push('[ARCHIVED]')
  if (repo.isFork) badges.push('[FORK]')

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
          <div style={{ display: 'flex', position: 'relative', top: 6 }}>
            {repo.owner}/{repo.name}
          </div>
          <div style={{ borderTop: `${color} 4px solid`, flexGrow: '1' }} />
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '28px 40px 28px 40px',
            height: '100%',
            justifyContent: 'space-between'
          }}
        >
          {/* Description */}
          <div style={{ display: 'flex', fontSize: 20, opacity: 0.85, marginTop: 8 }}>
            {desc || 'No description provided.'}
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div style={{ display: 'flex', gap: 32, marginTop: 16 }}>
              {badges.map((b, i) => (
                <div key={i} style={{ display: 'flex', fontSize: 18, opacity: 0.7 }}>
                  {b}
                </div>
              ))}
            </div>
          )}

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 48,
              marginTop: 16
            }}
          >
            {/* Language */}
            {repo.language ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: repo.languageColor
                  }}
                />
                <div style={{ display: 'flex' }}>{repo.language}</div>
              </div>
            ) : null}

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex' }}>Stars:</div>
              <div style={{ display: 'flex' }}>{kFormat(repo.stars)}</div>
            </div>

            {/* Forks */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex' }}>Forks:</div>
              <div style={{ display: 'flex' }}>{kFormat(repo.forks)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
