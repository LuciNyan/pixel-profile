export type Vec = [number, number]

export function clamp(x: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, x))
}

export function kFormatter(num: number): string {
  return Math.abs(num) > 999
    ? `${Math.sign(num) * parseFloat((Math.abs(num) / 1000).toFixed(1))}K`
    : `${Math.sign(num) * Math.abs(num)}`
}
