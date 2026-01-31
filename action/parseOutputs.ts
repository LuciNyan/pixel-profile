type Options = {
  background?: string
  color?: string
  exclude_repo?: string
  hide?: string
  include_all_commits?: string
  pixelate_avatar?: string
  screen_effect?: string
  show?: string
  username?: string
  theme?: string
  avatar_border?: string
  dithering?: string
  filename: string
}

type CrtOptions = {
  username?: string
  exclude_repo?: string
  include_all_commits?: string
  filename: string
}

export function parseOutputs(outputs: string[]): Array<Options | null> {
  return outputs.map(parseOutput)
}

export function parseCrtOutputs(outputs: string[]): Array<CrtOptions | null> {
  return outputs.map(parseCrtOutput)
}

function parseOutput(output: string): Options | null {
  const m = output.trim().match(/^(.+(\.png|))(\?(.*))$/)

  if (!m) return null

  const [, _filename, , query] = m
  const filename = _filename.endsWith('.png') ? _filename : `${_filename}.png`
  const sp = new URLSearchParams(query || '')

  const {
    background,
    color,
    exclude_repo,
    hide = '',
    include_all_commits,
    pixelate_avatar,
    screen_effect,
    show,
    username,
    theme,
    avatar_border,
    dithering
  } = Object.fromEntries(sp)

  return {
    background,
    color,
    exclude_repo,
    hide,
    include_all_commits,
    pixelate_avatar,
    screen_effect,
    show,
    username,
    theme,
    avatar_border,
    dithering,
    filename
  }
}

function parseCrtOutput(output: string): CrtOptions | null {
  const m = output.trim().match(/^(.+(\.png|))(\?(.*))$/)

  if (!m) return null

  const [, _filename, , query] = m
  const filename = _filename.endsWith('.png') ? _filename : `${_filename}.png`
  const sp = new URLSearchParams(query || '')

  const { username, exclude_repo, include_all_commits } = Object.fromEntries(sp)

  return {
    username,
    exclude_repo,
    include_all_commits,
    filename
  }
}
