import { ContributionCalendar } from '../types'
import { filterNotEmpty } from '../utils/filter'
import { encodePngBase64 } from '../utils/png-encoder'

export type ContributionsTemplateOptions = {
  color: string
  background: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundRepeat?: string
}

export const defaultContributionsOptions: ContributionsTemplateOptions = {
  color: 'white',
  background: '#434343'
}

export const CONTRIBUTIONS_CARD = {
  WIDTH: 1226,
  HEIGHT: 430
}

const CELL_SIZE = 16
const CELL_GAP = 3
const CELL_UNIT = CELL_SIZE + CELL_GAP

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const GRID_PALETTE: number[][] = [
  [255, 255, 255, 20],
  [14, 68, 41, 255],
  [0, 109, 50, 255],
  [38, 166, 65, 255],
  [57, 211, 83, 255]
]

const PIXEL_GREEN_PALETTE: Record<number, string> = {
  0: 'rgba(255,255,255,0.08)',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353'
}

function getContributionLevel(count: number, maxCount: number): number {
  if (count === 0) return 0
  if (maxCount <= 0) return 1
  const ratio = count / maxCount
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3

  return 4
}

function getMonthPositions(weeks: ContributionCalendar['weeks']): Array<{ label: string; col: number }> {
  const positions: Array<{ label: string; col: number }> = []
  let lastMonth = -1

  for (let w = 0; w < weeks.length; w++) {
    const days = weeks[w].contributionDays
    if (days.length === 0) continue
    const firstDay = days[0]
    const month = new Date(`${firstDay.date}T00:00:00`).getMonth()
    if (month !== lastMonth) {
      positions.push({ label: MONTH_LABELS[month], col: w })
      lastMonth = month
    }
  }

  return positions
}

function renderGridImage(weeks: ContributionCalendar['weeks'], maxCount: number): string {
  const cols = weeks.length
  const imgW = cols * CELL_UNIT - CELL_GAP
  const imgH = 7 * CELL_UNIT - CELL_GAP
  const pixels = Buffer.alloc(imgW * imgH * 4, 0)

  for (let w = 0; w < cols; w++) {
    const days = weeks[w].contributionDays
    const cellX = w * CELL_UNIT
    for (let d = 0; d < days.length; d++) {
      const cellY = d * CELL_UNIT
      const level = getContributionLevel(days[d].contributionCount, maxCount)
      const [r, g, b, a] = GRID_PALETTE[level]

      for (let py = cellY; py < cellY + CELL_SIZE && py < imgH; py++) {
        for (let px = cellX; px < cellX + CELL_SIZE && px < imgW; px++) {
          const idx = (py * imgW + px) * 4
          pixels[idx] = r
          pixels[idx + 1] = g
          pixels[idx + 2] = b
          pixels[idx + 3] = a
        }
      }
    }
  }

  return encodePngBase64(pixels, imgW, imgH)
}

export function makeContributionsCard(
  username: string,
  calendar: ContributionCalendar,
  options: ContributionsTemplateOptions
) {
  const { color, background, backgroundRepeat, backgroundSize, backgroundImage } = options
  const { weeks, totalContributions } = calendar

  const maxCount = Math.max(...weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount)), 1)

  const monthPositions = getMonthPositions(weeks)
  const gridDataUri = renderGridImage(weeks, maxCount)

  const dayLabelWidth = 50
  const gridWidth = weeks.length * CELL_UNIT - CELL_GAP
  const gridHeight = 7 * CELL_UNIT - CELL_GAP
  const monthLabelHeight = 28

  const totalGridWidth = dayLabelWidth + gridWidth
  const legendCellSize = 12

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
          <div style={{ position: 'relative', top: 6 }}>{`${username}'s Contributions`}</div>
          <div style={{ borderTop: `${color} 4px solid`, flexGrow: '1' }} />
        </div>

        {/* Content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            padding: '16px 40px 20px 40px',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Total contributions */}
          <div
            style={{
              display: 'flex',
              fontSize: 16,
              marginBottom: 12,
              width: totalGridWidth,
              justifyContent: 'flex-start'
            }}
          >
            {`${totalContributions.toLocaleString()} contributions in the last year`}
          </div>

          {/* Month labels */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: totalGridWidth,
              height: monthLabelHeight,
              marginLeft: dayLabelWidth
            }}
          >
            {monthPositions.map((mp, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  position: 'absolute',
                  left: mp.col * CELL_UNIT,
                  top: 0,
                  fontSize: 13
                }}
              >
                {mp.label}
              </div>
            ))}
          </div>

          {/* Grid with day labels */}
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {/* Day labels */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: dayLabelWidth,
                height: gridHeight,
                justifyContent: 'space-between'
              }}
            >
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    height: CELL_SIZE,
                    alignItems: 'center',
                    fontSize: 13
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Pre-rendered grid image */}
            <img
              src={gridDataUri}
              alt=''
              width={gridWidth}
              height={gridHeight}
              style={{ width: gridWidth, height: gridHeight }}
            />
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: totalGridWidth,
              marginTop: 12,
              fontSize: 12,
              gap: 6
            }}
          >
            <div style={{ display: 'flex' }}>Less</div>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                style={{
                  width: legendCellSize,
                  height: legendCellSize,
                  backgroundColor: PIXEL_GREEN_PALETTE[level],
                  borderRadius: 2
                }}
              />
            ))}
            <div style={{ display: 'flex' }}>More</div>
          </div>
        </div>
      </div>
    </div>
  )
}
