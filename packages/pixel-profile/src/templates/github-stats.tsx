import {Rank} from '../utils';

type Stats = {
  name: string
  totalStars: string
  totalCommits: string
  totalPRs: string
  totalIssues: string
  contributedTo: string
  rank: Rank
  imgUrl: string
}

type Options = {
  color: string
  background: string
}

export function makeGithubStats(stats: Stats, options: Options) {
  const {
    name,
    totalStars,
    totalCommits,
    totalPRs,
    totalIssues,
    contributedTo,
    rank,
    imgUrl,
  } = stats;

  const {
    color,
    background
  } = options

  return <div
    style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      background,
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        fontSize: '23px',
        color,
        width: '92%',
        height: '80%',
        padding: 40,
        border: `${color} 4px solid`,
        position: 'relative',
      }}
    >
      <div style={{
        marginTop: 16,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        flexGrow: 1,
        paddingRight: 40
      }}>
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
          <div>{ `${totalStars}` }</div>
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
          <div>Total Commits: </div>
          <div>{ `${totalCommits}` }</div>
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
          <div>{ `${totalPRs}` }</div>
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
          <div>{ `${totalIssues}` }</div>
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
          <div>{ `${contributedTo}` }</div>
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
          <div>-------------------------------</div>
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
          <div>Score: </div>
          <div>{ `${rank.score}` }</div>
        </div>
      </div>
      <img src={imgUrl} style={{
        height: '100%'
      }} />
      <div style={{
        lineHeight: 2,
        position: 'absolute',
        top: '-6px',
        left: '33px',
        background,
        padding: '0 4px',
      }}>{ `${name}'s GitHub Stats` }</div>
    </div>
  </div>
}
