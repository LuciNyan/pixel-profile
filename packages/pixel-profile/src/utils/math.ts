import { RGBA } from '../renderer'

export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function kFormatter(num: number): string {
  return Math.abs(num) > 999
    ? `${Math.sign(num) * parseFloat((Math.abs(num) / 1000).toFixed(1))}K`
    : `${Math.sign(num) * Math.abs(num)}`
}

export function add2(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]]
}

export function subtract2(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]]
}

export function dot2(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1]
}

export function divide2(v: Vec2, scalar: number): Vec2 {
  return [v[0] / scalar, v[1] / scalar]
}

export function prod2(v: Vec2): number {
  return v[0] * v[1]
}

export function floor2(v: Vec2): Vec2 {
  return [Math.floor(v[0]), Math.floor(v[1])]
}

export function add3(a: Vec3 | RGBA, b: Vec3 | RGBA): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

export function dot3(v1: Vec3 | RGBA, v2: Vec3 | RGBA): number {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]
}

export function divide3(v: Vec3 | RGBA, scalar: number): Vec3 {
  return [v[0] / scalar, v[1] / scalar, v[2] / scalar]
}

export function mix3(v1: Vec3 | RGBA, v2: Vec3 | RGBA, t: number): Vec3 {
  return [v1[0] * (1 - t) + v2[0] * t, v1[1] * (1 - t) + v2[1] * t, v1[2] * (1 - t) + v2[2] * t]
}

export function floor3(pixel: Vec3 | RGBA): RGBA {
  const [r, g, b, a = 255] = pixel

  return [Math.floor(r), Math.floor(g), Math.floor(b), a]
}

export function fract(x: number): number {
  return x - Math.floor(x)
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))

  return t * t * (3 - 2 * t)
}

export function luminance(color: Vec3 | RGBA): number {
  return dot3(color, [0.2126, 0.7152, 0.0722])
}

export function pow(pixel: Vec3 | RGBA, exponent: number): RGBA {
  const [r, g, b, a = 255] = pixel

  return [Math.pow(r, exponent), Math.pow(g, exponent), Math.pow(b, exponent), a]
}
