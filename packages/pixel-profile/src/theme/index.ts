import { IMG_FUJI } from './images/fuji'
import { IMG_JOURNEY } from './images/journey'
import { IMG_ROAD_TRIP } from './images/road-trip'
import { IMG_ROAD_TRIP_CRT } from './images/road-trip-crt'

type Theme = Record<
  string,
  Partial<{
    color: string
    background: string
    backgroundImage: string
    backgroundSize: string
    backgroundRepeat: string
  }>
>

export const THEME: Theme = {
  summer: {
    color: 'white',
    background: 'linear-gradient(to bottom right, #74dcc4, #4597e9)'
  },
  blue_chill: {
    color: 'white',
    background: 'linear-gradient(to bottom right, #5580eb, #2aeeff)'
  },
  rainbow: {
    color: 'white',
    background:
      'linear-gradient(to bottom, #CD001A 0%, #CD001A 14.72%, #F06400 14.72%, ' +
      '#F06400 28.56%, #F2CD00 28.56%, #F2CD00 42.84%, #79c300 42.84%, ' +
      '#79c300 57.12%, #1961ae 57.12%, #1961ae 71.4%, #31137c 71.4%, ' +
      '#31137c 85.24%, #61007d 85.24%, #61007d 100%)'
  },
  monica: {
    color: 'white',
    background: 'linear-gradient(to bottom right, #0c7bb3, #f2bae8)'
  },
  lax: {
    color: 'white',
    background: 'linear-gradient(to bottom right, #F9957F, #F2F5D0)'
  },
  serene: {
    color: 'white',
    background: 'linear-gradient(to bottom right, #07A3B2, #D9ECC7)'
  },
  journey: {
    color: 'white',
    backgroundImage: `url(${IMG_JOURNEY})`,
    backgroundSize: '1226px 430px',
    backgroundRepeat: 'no-repeat'
  },
  fuji: {
    color: 'white',
    backgroundImage: `url(${IMG_FUJI})`,
    backgroundSize: '1226px 430px',
    backgroundRepeat: 'no-repeat'
  },
  road_trip: {
    color: 'white',
    backgroundImage: `url(${IMG_ROAD_TRIP})`,
    backgroundSize: '1226px 430px',
    backgroundRepeat: 'no-repeat'
  },
  crt: {
    color: 'white',
    background: 'black'
  },
  road_trip_crt: {
    color: 'white',
    backgroundImage: `url(${IMG_ROAD_TRIP_CRT})`,
    backgroundSize: '900px 594px',
    backgroundRepeat: 'no-repeat'
  }
}

export function getThemeOptions(theme: string): {
  color?: string
  background?: string
} {
  return THEME[theme] ?? {}
}
