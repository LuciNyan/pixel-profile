import { deflateSync } from 'zlib'

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const IHDR_TYPE = Buffer.from('IHDR', 'ascii')
const IDAT_TYPE = Buffer.from('IDAT', 'ascii')

const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  crcTable[n] = c
}

function crc32(buf: Buffer, start: number, end: number): number {
  let crc = 0xffffffff
  for (let i = start; i < end; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }

  return (crc ^ 0xffffffff) >>> 0
}

const IEND_CHUNK = Buffer.alloc(12)
IEND_CHUNK.writeUInt32BE(0, 0)
IDAT_TYPE.copy(IEND_CHUNK, 4) // placeholder, overwrite with IEND type
IEND_CHUNK[4] = 73 // I
IEND_CHUNK[5] = 69 // E
IEND_CHUNK[6] = 78 // N
IEND_CHUNK[7] = 68 // D
IEND_CHUNK.writeUInt32BE(crc32(IEND_CHUNK, 4, 8), 8)

export function encodePng(pixels: Buffer, width: number, height: number): Buffer {
  const rowBytes = width * 4
  const rawSize = (rowBytes + 1) * height
  const raw = Buffer.allocUnsafe(rawSize)

  for (let y = 0; y < height; y++) {
    const srcOff = y * rowBytes
    const dstOff = y * (rowBytes + 1)
    raw[dstOff] = 0
    pixels.copy(raw, dstOff + 1, srcOff, srcOff + rowBytes)
  }

  const compressed = deflateSync(raw, { level: 1 })
  const compLen = compressed.length

  const out = Buffer.allocUnsafe(57 + compLen)

  PNG_SIGNATURE.copy(out, 0)

  out.writeUInt32BE(13, 8)
  IHDR_TYPE.copy(out, 12)
  out.writeUInt32BE(width, 16)
  out.writeUInt32BE(height, 20)
  out[24] = 8
  out[25] = 6
  out[26] = 0
  out[27] = 0
  out[28] = 0
  out.writeUInt32BE(crc32(out, 12, 29), 29)

  const idatStart = 33
  out.writeUInt32BE(compLen, idatStart)
  IDAT_TYPE.copy(out, idatStart + 4)
  compressed.copy(out, idatStart + 8)
  out.writeUInt32BE(crc32(out, idatStart + 4, idatStart + 8 + compLen), idatStart + 8 + compLen)

  IEND_CHUNK.copy(out, 45 + compLen)

  return out
}

export function encodePngBase64(pixels: Buffer, width: number, height: number): string {
  const png = encodePng(pixels, width, height)

  return `data:image/png;base64,${png.toString('base64')}`
}
