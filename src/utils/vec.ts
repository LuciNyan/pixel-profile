export type Vec = [number, number]

export function clamp(x: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, x));
}
