import { isString } from 'ts-known'

export function parseArray(str: string | string[] | undefined): string[] {
  if (Array.isArray(str)) {
    return str
  }

  if (!str) {
    return []
  }

  return str.split(',')
}

export function parseBoolean(value: string | string[] | undefined): boolean | undefined {
  if (!isString(value)) {
    return undefined
  }

  if (value.toLowerCase() === 'true') {
    return true
  } else if (value.toLowerCase() === 'false') {
    return false
  }
}

export function parseString(value: string | string[] | undefined): string | undefined {
  return isString(value) ? value : undefined
}
