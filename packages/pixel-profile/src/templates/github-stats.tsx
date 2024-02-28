import { Rank } from '../utils'

export type Stats = {
  name: string
  totalStars: string | null
  totalCommits: string
  totalPRs: string
  totalIssues: string
  contributedTo: string
  rank: Rank['level']
  avatar: string
}

export type TemplateOptions = {
  color: string
  background: string
  includeAllCommits: boolean
}

export const defaultTemplateOptions = {
  color: 'white',
  background: '#434343'
}

export const CARD_SIZE = {
  BIG: {
    CARD_WIDTH: 1226,
    CARD_HEIGHT: 430
  },
  SMALL: {
    CARD_WIDTH: 1226,
    CARD_HEIGHT: 350
  }
}

export function makeGithubStats(stats: Stats, options: TemplateOptions) {
  const { name, totalStars, totalCommits, totalPRs, totalIssues, contributedTo, rank, avatar } = stats

  const { color, background, includeAllCommits } = options

  const date = new Date()
  const year = date.getFullYear()

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background
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
        <div
          style={{
            display: 'flex',
            width: '100%'
          }}
        >
          <div
            style={{
              borderTop: `${color} 4px solid`,
              width: '36px'
            }}
          />
          <div
            style={{
              position: 'relative',
              top: 6
            }}
          >{`${name}'s GitHub Stats`}</div>
          <div
            style={{
              borderTop: `${color} 4px solid`,
              flexGrow: '1'
            }}
          />
        </div>
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
            {totalStars ? (
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
                <div>{`${totalStars}`}</div>
              </div>
            ) : null}

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%'
              }}
            >
              <div>{`Total Commits${includeAllCommits ? '' : `(${year})`}: `}</div>
              <div>{`${totalCommits}`}</div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%'
              }}
            >
              <div>Total PRs: </div>
              <div>{`${totalPRs}`}</div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%'
              }}
            >
              <div>Total Issues: </div>
              <div>{`${totalIssues}`}</div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%'
              }}
            >
              <div>Contributed to (last year): </div>
              <div>{`${contributedTo}`}</div>
            </div>
            {rank ? (
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
            ) : null}
            {rank ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%'
                }}
              >
                <div>Rank: </div>
                <div>{`${rank}`}</div>
              </div>
            ) : null}
          </div>
          {avatar ? <img src={avatar} style={{ height: '100%' }} /> : null}
        </div>
      </div>
    </div>
  )
}
