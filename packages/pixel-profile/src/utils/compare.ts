export function compare(str1: string | Array<number> | Buffer, str2: string | Array<number> | Buffer): number {
  const minLength = Math.min(str1.length, str2.length)

  for (let i = 0; i < minLength; i++) {
    if (str1[i] !== str2[i]) {
      return i
    }
  }

  if (str1.length !== str2.length) {
    return minLength
  }

  return -1
}
