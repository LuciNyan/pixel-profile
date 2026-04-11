/**
 * Minimal GIF89a encoder — no external dependencies.
 * Supports animated GIF with global color table and per-frame delay.
 */

function writeLittleEndian(value: number, bytes: number): number[] {
  const result: number[] = []
  for (let i = 0; i < bytes; i++) {
    result.push(value & 0xff)
    value >>= 8
  }

  return result
}

/**
 * Median-cut color quantization: reduce RGBA pixels to at most 256 colors.
 */
function quantize(pixels: Buffer, width: number, height: number): { indexed: Uint8Array; palette: number[][] } {
  const colorMap = new Map<number, number>()
  const colors: number[][] = []

  for (let i = 0; i < width * height * 4; i += 4) {
    const r = pixels[i] & 0xf8
    const g = pixels[i + 1] & 0xfc
    const b = pixels[i + 2] & 0xf8
    const key = (r << 16) | (g << 8) | b
    if (!colorMap.has(key) && colors.length < 256) {
      colorMap.set(key, colors.length)
      colors.push([r, g, b])
    }
  }

  while (colors.length < 256) {
    colors.push([0, 0, 0])
  }

  const indexed = new Uint8Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const pi = i * 4
    const r = pixels[pi] & 0xf8
    const g = pixels[pi + 1] & 0xfc
    const b = pixels[pi + 2] & 0xf8
    const key = (r << 16) | (g << 8) | b
    const idx = colorMap.get(key)
    if (idx !== undefined) {
      indexed[i] = idx
    } else {
      let bestDist = Infinity
      let bestIdx = 0
      for (let c = 0; c < 256; c++) {
        const dr = colors[c][0] - pixels[pi]
        const dg = colors[c][1] - pixels[pi + 1]
        const db = colors[c][2] - pixels[pi + 2]
        const dist = dr * dr + dg * dg + db * db
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = c
        }
      }
      indexed[i] = bestIdx
    }
  }

  return { indexed, palette: colors }
}

/**
 * LZW compression for GIF.
 */
function lzwEncode(indexed: Uint8Array, minCodeSize: number): Uint8Array {
  const clearCode = 1 << minCodeSize
  const eoiCode = clearCode + 1
  let codeSize = minCodeSize + 1
  let nextCode = eoiCode + 1
  const maxCode = 4096

  const table = new Map<string, number>()
  function initTable() {
    table.clear()
    for (let i = 0; i < clearCode; i++) {
      table.set(String(i), i)
    }
    codeSize = minCodeSize + 1
    nextCode = eoiCode + 1
  }

  let bitBuffer = 0
  let bitCount = 0
  const bytes: number[] = []

  function writeCode(code: number) {
    bitBuffer |= code << bitCount
    bitCount += codeSize
    while (bitCount >= 8) {
      bytes.push(bitBuffer & 0xff)
      bitBuffer >>= 8
      bitCount -= 8
    }
  }

  initTable()
  writeCode(clearCode)

  let current = String(indexed[0])

  for (let i = 1; i < indexed.length; i++) {
    const next = `${current},${indexed[i]}`
    if (table.has(next)) {
      current = next
    } else {
      writeCode(table.get(current)!)
      if (nextCode < maxCode) {
        table.set(next, nextCode++)
        if (nextCode > 1 << codeSize && codeSize < 12) {
          codeSize++
        }
      } else {
        writeCode(clearCode)
        initTable()
      }
      current = String(indexed[i])
    }
  }

  writeCode(table.get(current)!)
  writeCode(eoiCode)

  if (bitCount > 0) {
    bytes.push(bitBuffer & 0xff)
  }

  const subBlocks: number[] = []
  for (let i = 0; i < bytes.length; i += 255) {
    const chunk = bytes.slice(i, i + 255)
    subBlocks.push(chunk.length, ...chunk)
  }
  subBlocks.push(0)

  return new Uint8Array([minCodeSize, ...subBlocks])
}

export type GifFrame = {
  pixels: Buffer
  delay: number
}

export function encodeGif(frames: GifFrame[], width: number, height: number): Buffer {
  const parts: number[][] = []

  // GIF89a header
  parts.push([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])

  // Logical Screen Descriptor
  parts.push([...writeLittleEndian(width, 2), ...writeLittleEndian(height, 2)])

  const { palette: globalPalette } = quantize(frames[0].pixels, width, height)
  parts.push([0xf7, 0x00, 0x00])

  for (const color of globalPalette) {
    parts.push([color[0], color[1], color[2]])
  }

  // Netscape Application Extension (loop forever)
  parts.push([0x21, 0xff, 0x0b])
  parts.push(Array.from(Buffer.from('NETSCAPE2.0')))
  parts.push([0x03, 0x01, ...writeLittleEndian(0, 2), 0x00])

  for (const frame of frames) {
    const { indexed } = quantize(frame.pixels, width, height)

    // Graphic Control Extension
    const delayCs = Math.round(frame.delay / 10)
    parts.push([0x21, 0xf9, 0x04, 0x00, ...writeLittleEndian(delayCs, 2), 0x00, 0x00])

    // Image Descriptor (no local color table)
    parts.push([
      0x2c,
      ...writeLittleEndian(0, 2),
      ...writeLittleEndian(0, 2),
      ...writeLittleEndian(width, 2),
      ...writeLittleEndian(height, 2),
      0x00
    ])

    const lzwData = lzwEncode(indexed, 8)
    parts.push(Array.from(lzwData))
  }

  // GIF Trailer
  parts.push([0x3b])

  const totalSize = parts.reduce((sum, p) => sum + p.length, 0)
  const result = Buffer.alloc(totalSize)
  let offset = 0
  for (const part of parts) {
    for (const byte of part) {
      result[offset++] = byte
    }
  }

  return result
}
