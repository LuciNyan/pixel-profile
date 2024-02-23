export type Vec2 = [number, number]

export function clamp(x: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, x))
}

export function kFormatter(num: number): string {
  return Math.abs(num) > 999
    ? `${Math.sign(num) * parseFloat((Math.abs(num) / 1000).toFixed(1))}K`
    : `${Math.sign(num) * Math.abs(num)}`
}

export function add2(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]]
}

export function dot2(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1]
}

export function prod2(v: Vec2): number {
  return v[0] * v[1]
}

export function subtract2(vec1: Vec2, vec2: Vec2): Vec2 {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1]]
}
