export function isBase64PNG(src: string): boolean {
  return src.startsWith('data:image/png;base64,')
}
