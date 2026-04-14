/**
 * Minimal GIF89a encoder — no external dependencies.
 * Supports animated GIF with global color table and per-frame delay.
 */

export type GifFrame = {
  pixels: Buffer
  delay: number
}

/**
 * Quantize RGB to 16-bit key: 5 bits R, 6 bits G, 5 bits B.
 */
function rgbToKey16(r: number, g: number, b: number): number {
  return ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3)
}

/**
 * Color quantization using typed arrays only (no object allocation).
 * Finds top 256 colors by count, then precomputes a full 65536-entry
 * LUT so every indexFrame call is pure O(1) per pixel.
 */
function buildPaletteAndLUT(frames: Buffer[], width: number, height: number): { palette: Uint8Array; lut: Uint8Array } {
  const counts = new Uint32Array(65536)
  const pixelCount = width * height

  for (const pixels of frames) {
    for (let i = 0; i < pixelCount; i++) {
      const pi = i * 4
      counts[rgbToKey16(pixels[pi], pixels[pi + 1], pixels[pi + 2])]++
    }
  }

  let numColors = 0
  const keys = new Uint16Array(65536)
  const cnts = new Uint32Array(65536)
  for (let k = 0; k < 65536; k++) {
    if (counts[k] > 0) {
      keys[numColors] = k
      cnts[numColors] = counts[k]
      numColors++
    }
  }

  const limit = Math.min(256, numColors)
  if (numColors > limit) {
    quickSelect(keys, cnts, 0, numColors - 1, limit)
  }

  const palette = new Uint8Array(768)
  const palR = new Uint8Array(256)
  const palG = new Uint8Array(256)
  const palB = new Uint8Array(256)
  for (let i = 0; i < limit; i++) {
    const k = keys[i]
    const r = ((k >> 11) & 0x1f) << 3
    const g = ((k >> 5) & 0x3f) << 2
    const b = (k & 0x1f) << 3
    palette[i * 3] = r
    palette[i * 3 + 1] = g
    palette[i * 3 + 2] = b
    palR[i] = r
    palG[i] = g
    palB[i] = b
  }

  const lut = new Uint8Array(65536)
  for (let i = 0; i < numColors; i++) {
    const k = keys[i]
    if (i < limit) {
      lut[k] = i
    } else {
      const r = ((k >> 11) & 0x1f) << 3
      const g = ((k >> 5) & 0x3f) << 2
      const b = (k & 0x1f) << 3
      let bestDist = Infinity
      let bestIdx = 0
      for (let c = 0; c < limit; c++) {
        const dr = palR[c] - r
        const dg = palG[c] - g
        const db = palB[c] - b
        const dist = dr * dr + dg * dg + db * db
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = c
          if (dist === 0) break
        }
      }
      lut[k] = bestIdx
    }
  }

  return { palette, lut }
}

function quickSelect(keys: Uint16Array, cnts: Uint32Array, lo: number, hi: number, k: number): void {
  while (lo < hi) {
    const pivotIdx = lo + ((hi - lo) >> 1)
    const pivotVal = cnts[pivotIdx]
    let tk = keys[pivotIdx]
    keys[pivotIdx] = keys[hi]
    keys[hi] = tk
    let tc = cnts[pivotIdx]
    cnts[pivotIdx] = cnts[hi]
    cnts[hi] = tc
    let store = lo
    for (let i = lo; i < hi; i++) {
      if (cnts[i] > pivotVal) {
        tk = keys[i]
        keys[i] = keys[store]
        keys[store] = tk
        tc = cnts[i]
        cnts[i] = cnts[store]
        cnts[store] = tc
        store++
      }
    }
    tk = keys[store]
    keys[store] = keys[hi]
    keys[hi] = tk
    tc = cnts[store]
    cnts[store] = cnts[hi]
    cnts[hi] = tc
    if (store === k) return
    if (store < k) lo = store + 1
    else hi = store - 1
  }
}

/**
 * Map RGBA pixels to palette indices using precomputed Uint8Array LUT.
 * Every possible 16-bit color key already maps to its nearest palette index.
 */
function indexFrame(pixels: Buffer, pixelCount: number, lut: Uint8Array): Uint8Array {
  const indexed = new Uint8Array(pixelCount)

  for (let i = 0; i < pixelCount; i++) {
    const pi = i * 4
    indexed[i] = lut[rgbToKey16(pixels[pi], pixels[pi + 1], pixels[pi + 2])]
  }

  return indexed
}

/**
 * LZW compression for GIF using power-of-2 hash table.
 */
function lzwEncode(indexed: Uint8Array, minCodeSize: number): Buffer {
  const clearCode = 1 << minCodeSize
  const eoiCode = clearCode + 1
  const MAX_CODE = 4096

  const HASH_BITS = 13
  const HASH_SIZE = 1 << HASH_BITS
  const HASH_MASK = HASH_SIZE - 1
  const hashKeys = new Int32Array(HASH_SIZE)
  const hashVals = new Uint16Array(HASH_SIZE)

  let codeSize = minCodeSize + 1
  let nextCode = eoiCode + 1

  hashKeys.fill(-1)

  const outBytes = Buffer.allocUnsafe(indexed.length + 1024)
  let outPos = 0
  let bitBuffer = 0
  let bitCount = 0

  bitBuffer |= clearCode << bitCount
  bitCount += codeSize
  while (bitCount >= 8) {
    outBytes[outPos++] = bitBuffer & 0xff
    bitBuffer >>= 8
    bitCount -= 8
  }

  let current = indexed[0]

  for (let i = 1; i < indexed.length; i++) {
    const next = indexed[i]
    const key = (current << 8) | next
    let idx = ((key >> 4) ^ key) & HASH_MASK

    let found = -1
    while (hashKeys[idx] !== -1) {
      if (hashKeys[idx] === key) {
        found = hashVals[idx]
        break
      }
      idx = (idx + 1) & HASH_MASK
    }

    if (found !== -1) {
      current = found
    } else {
      bitBuffer |= current << bitCount
      bitCount += codeSize
      while (bitCount >= 8) {
        outBytes[outPos++] = bitBuffer & 0xff
        bitBuffer >>= 8
        bitCount -= 8
      }

      if (nextCode < MAX_CODE) {
        hashKeys[idx] = key
        hashVals[idx] = nextCode++
        if (nextCode > 1 << codeSize && codeSize < 12) {
          codeSize++
        }
      } else {
        bitBuffer |= clearCode << bitCount
        bitCount += codeSize
        while (bitCount >= 8) {
          outBytes[outPos++] = bitBuffer & 0xff
          bitBuffer >>= 8
          bitCount -= 8
        }
        hashKeys.fill(-1)
        codeSize = minCodeSize + 1
        nextCode = eoiCode + 1
      }
      current = next
    }
  }

  bitBuffer |= current << bitCount
  bitCount += codeSize
  while (bitCount >= 8) {
    outBytes[outPos++] = bitBuffer & 0xff
    bitBuffer >>= 8
    bitCount -= 8
  }

  bitBuffer |= eoiCode << bitCount
  bitCount += codeSize
  while (bitCount >= 8) {
    outBytes[outPos++] = bitBuffer & 0xff
    bitBuffer >>= 8
    bitCount -= 8
  }

  if (bitCount > 0) {
    outBytes[outPos++] = bitBuffer & 0xff
  }

  const rawBytes = outPos
  const subBlockCount = Math.ceil(rawBytes / 255)
  const result = Buffer.allocUnsafe(1 + rawBytes + subBlockCount + 1)
  result[0] = minCodeSize
  let rPos = 1

  for (let off = 0; off < rawBytes; off += 255) {
    const chunkLen = Math.min(255, rawBytes - off)
    result[rPos++] = chunkLen
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outBytes.copy(result as any, rPos, off, off + chunkLen)
    rPos += chunkLen
  }

  result[rPos++] = 0

  return result.subarray(0, rPos)
}

const NETSCAPE_EXT = Buffer.from([
  0x21, 0xff, 0x0b, 0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30, 0x03, 0x01, 0x00, 0x00, 0x00
])

export function encodeGif(frames: GifFrame[], width: number, height: number): Buffer {
  const pixelCount = width * height
  const frameBuffers = frames.map((f) => f.pixels)

  const { palette, lut } = buildPaletteAndLUT(frameBuffers, width, height)

  const chunks: Buffer[] = []

  const header = Buffer.allocUnsafe(13)
  header[0] = 0x47
  header[1] = 0x49
  header[2] = 0x46
  header[3] = 0x38
  header[4] = 0x39
  header[5] = 0x61
  header.writeUInt16LE(width, 6)
  header.writeUInt16LE(height, 8)
  header[10] = 0xf7
  header[11] = 0x00
  header[12] = 0x00
  chunks.push(header)

  const gct = Buffer.allocUnsafe(768)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gct.set(palette as any)
  chunks.push(gct)

  chunks.push(NETSCAPE_EXT)

  for (const frame of frames) {
    const indexed = indexFrame(frame.pixels, pixelCount, lut)

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

    const imgDesc = Buffer.allocUnsafe(10)
    imgDesc[0] = 0x2c
    imgDesc.writeUInt16LE(0, 1)
    imgDesc.writeUInt16LE(0, 3)
    imgDesc.writeUInt16LE(width, 5)
    imgDesc.writeUInt16LE(height, 7)
    imgDesc[9] = 0x00
    chunks.push(imgDesc)

    chunks.push(lzwEncode(indexed, 8))
  }

  chunks.push(Buffer.from([0x3b]))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Buffer.concat(chunks as any)
}
