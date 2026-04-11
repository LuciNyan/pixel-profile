/**
 * Minimal GIF89a encoder — no external dependencies.
 * Supports animated GIF with global color table and per-frame delay.
 */

export type GifFrame = {
  pixels: Buffer
  delay: number
}

/**
 * Median-cut color quantization: reduce RGBA pixels to at most 256 colors.
 * When multiple frames are provided, samples from all to build a shared palette.
 */
function buildPalette(frames: Buffer[], width: number, height: number): number[][] {
  const colorCounts = new Map<number, number>()
  const pixelCount = width * height

  for (const pixels of frames) {
    for (let i = 0; i < pixelCount; i++) {
      const pi = i * 4
      const r = pixels[pi] & 0xf8
      const g = pixels[pi + 1] & 0xfc
      const b = pixels[pi + 2] & 0xf8
      const key = (r << 16) | (g << 8) | b
      colorCounts.set(key, (colorCounts.get(key) || 0) + 1)
    }
  }

  const colors: number[][] = []
  const sorted = [...colorCounts.entries()].sort((a, b) => b[1] - a[1])
  const limit = Math.min(256, sorted.length)
  for (let i = 0; i < limit; i++) {
    const key = sorted[i][0]
    colors.push([(key >> 16) & 0xff, (key >> 8) & 0xff, key & 0xff])
  }

  while (colors.length < 256) {
    colors.push([0, 0, 0])
  }

  return colors
}

/**
 * Map RGBA pixels to palette indices using precomputed lookup table.
 */
function indexFrame(
  pixels: Buffer,
  pixelCount: number,
  palette: number[][],
  colorLookup: Map<number, number>
): Uint8Array {
  const indexed = new Uint8Array(pixelCount)

  for (let i = 0; i < pixelCount; i++) {
    const pi = i * 4
    const r = pixels[pi] & 0xf8
    const g = pixels[pi + 1] & 0xfc
    const b = pixels[pi + 2] & 0xf8
    const key = (r << 16) | (g << 8) | b
    const cached = colorLookup.get(key)
    if (cached !== undefined) {
      indexed[i] = cached
    } else {
      let bestDist = Infinity
      let bestIdx = 0
      for (let c = 0; c < 256; c++) {
        const dr = palette[c][0] - pixels[pi]
        const dg = palette[c][1] - pixels[pi + 1]
        const db = palette[c][2] - pixels[pi + 2]
        const dist = dr * dr + dg * dg + db * db
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = c
        }
      }
      colorLookup.set(key, bestIdx)
      indexed[i] = bestIdx
    }
  }

  return indexed
}

/**
 * LZW compression for GIF using numeric hash table instead of string keys.
 */
function lzwEncode(indexed: Uint8Array, minCodeSize: number): Buffer {
  const clearCode = 1 << minCodeSize
  const eoiCode = clearCode + 1
  const MAX_CODE = 4096

  // Hash table for LZW dictionary: key = (prefix << 8) | suffix
  const HASH_SIZE = 5003
  const hashKeys = new Int32Array(HASH_SIZE)
  const hashVals = new Uint16Array(HASH_SIZE)

  let codeSize = minCodeSize + 1
  let nextCode = eoiCode + 1

  function initTable() {
    hashKeys.fill(-1)
    codeSize = minCodeSize + 1
    nextCode = eoiCode + 1
  }

  const outBytes = Buffer.allocUnsafe(indexed.length + 1024)
  let outPos = 0
  let bitBuffer = 0
  let bitCount = 0

  function writeCode(code: number) {
    bitBuffer |= code << bitCount
    bitCount += codeSize
    while (bitCount >= 8) {
      outBytes[outPos++] = bitBuffer & 0xff
      bitBuffer >>= 8
      bitCount -= 8
    }
  }

  function findEntry(prefix: number, suffix: number): number {
    const key = (prefix << 8) | suffix
    let idx = ((key >> 4) ^ key) % HASH_SIZE
    if (idx < 0) idx += HASH_SIZE

    while (hashKeys[idx] !== -1) {
      if (hashKeys[idx] === key) return hashVals[idx]
      idx = (idx + 1) % HASH_SIZE
    }

    return -1
  }

  function addEntry(prefix: number, suffix: number, code: number) {
    const key = (prefix << 8) | suffix
    let idx = ((key >> 4) ^ key) % HASH_SIZE
    if (idx < 0) idx += HASH_SIZE

    while (hashKeys[idx] !== -1) {
      idx = (idx + 1) % HASH_SIZE
    }

    hashKeys[idx] = key
    hashVals[idx] = code
  }

  initTable()
  writeCode(clearCode)

  let current = indexed[0]

  for (let i = 1; i < indexed.length; i++) {
    const next = indexed[i]
    const found = findEntry(current, next)
    if (found !== -1) {
      current = found
    } else {
      writeCode(current)
      if (nextCode < MAX_CODE) {
        addEntry(current, next, nextCode++)
        if (nextCode > 1 << codeSize && codeSize < 12) {
          codeSize++
        }
      } else {
        writeCode(clearCode)
        initTable()
      }
      current = next
    }
  }

  writeCode(current)
  writeCode(eoiCode)

  if (bitCount > 0) {
    outBytes[outPos++] = bitBuffer & 0xff
  }

  // Build sub-blocked output: minCodeSize byte + sub-blocks + terminator
  const rawBytes = outPos
  const subBlockCount = Math.ceil(rawBytes / 255)
  const result = Buffer.allocUnsafe(1 + rawBytes + subBlockCount + 1)
  result[0] = minCodeSize
  let rPos = 1

  for (let i = 0; i < rawBytes; i += 255) {
    const chunkLen = Math.min(255, rawBytes - i)
    result[rPos++] = chunkLen
    outBytes.copy(result, rPos, i, i + chunkLen)
    rPos += chunkLen
  }

  result[rPos++] = 0

  return result.subarray(0, rPos)
}

export function encodeGif(frames: GifFrame[], width: number, height: number): Buffer {
  const pixelCount = width * height
  const frameBuffers = frames.map((f) => f.pixels)

  // Build shared palette from all frames
  const palette = buildPalette(frameBuffers, width, height)
  const colorLookup = new Map<number, number>()

  // Pre-seed lookup with exact palette matches
  for (let i = 0; i < 256; i++) {
    const key = (palette[i][0] << 16) | (palette[i][1] << 8) | palette[i][2]
    colorLookup.set(key, i)
  }

  // Estimate output size: header + palette + frames
  const chunks: Buffer[] = []

  // GIF89a header
  const header = Buffer.allocUnsafe(13)
  header[0] = 0x47 // G
  header[1] = 0x49 // I
  header[2] = 0x46 // F
  header[3] = 0x38 // 8
  header[4] = 0x39 // 9
  header[5] = 0x61 // a
  header.writeUInt16LE(width, 6)
  header.writeUInt16LE(height, 8)
  header[10] = 0xf7 // GCT flag, 256 colors (8 bit)
  header[11] = 0x00 // bg color index
  header[12] = 0x00 // pixel aspect ratio
  chunks.push(header)

  // Global Color Table
  const gct = Buffer.allocUnsafe(768)
  for (let i = 0; i < 256; i++) {
    gct[i * 3] = palette[i][0]
    gct[i * 3 + 1] = palette[i][1]
    gct[i * 3 + 2] = palette[i][2]
  }
  chunks.push(gct)

  // Netscape Application Extension (loop forever)
  chunks.push(Buffer.from([0x21, 0xff, 0x0b, ...Array.from(Buffer.from('NETSCAPE2.0')), 0x03, 0x01, 0x00, 0x00, 0x00]))

  for (const frame of frames) {
    const indexed = indexFrame(frame.pixels, pixelCount, palette, colorLookup)

    // Graphic Control Extension
    const delayCs = Math.round(frame.delay / 10)
    const gce = Buffer.allocUnsafe(8)
    gce[0] = 0x21
    gce[1] = 0xf9
    gce[2] = 0x04
    gce[3] = 0x00
    gce.writeUInt16LE(delayCs, 4)
    gce[6] = 0x00
    gce[7] = 0x00
    chunks.push(gce)

    // Image Descriptor
    const imgDesc = Buffer.allocUnsafe(10)
    imgDesc[0] = 0x2c
    imgDesc.writeUInt16LE(0, 1)
    imgDesc.writeUInt16LE(0, 3)
    imgDesc.writeUInt16LE(width, 5)
    imgDesc.writeUInt16LE(height, 7)
    imgDesc[9] = 0x00
    chunks.push(imgDesc)

    // LZW encoded data
    chunks.push(lzwEncode(indexed, 8))
  }

  // GIF Trailer
  chunks.push(Buffer.from([0x3b]))

  return Buffer.concat(chunks)
}
