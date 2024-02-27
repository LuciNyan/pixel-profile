type Theme = Record<
  string,
  {
    color: string
    background: string
  }
>

export const THEME: Theme = {
  monica: {
    color: 'white',
    background: 'linear-gradient(to bottom right, #0c7bb3, #f2bae8)'
  },
  rainbow: {
    color: 'white',
    background:
      'linear-gradient(to bottom, #CD001A 0%, #CD001A 14.72%, #F06400 14.72%, ' +
      '#F06400 28.56%, #F2CD00 28.56%, #F2CD00 42.84%, #79c300 42.84%, ' +
      '#79c300 57.12%, #1961ae 57.12%, #1961ae 71.4%, #31137c 71.4%, ' +
      '#31137c 85.24%, #61007d 85.24%, #61007d 100%)'
  },
  summer: {
    color: 'white',
    background: 'linear-gradient(to bottom right, #74dcc4, #4597e9)'
  },
  blue_chill: {
    color: 'white',
    background: 'linear-gradient(to bottom right, #5580eb, #2aeeff)'
  }
}

export function getThemeOptions(theme: string): {
  color?: string
  background?: string
} {
  return THEME[theme] ?? {}
}
