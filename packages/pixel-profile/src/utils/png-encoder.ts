import { deflateSync } from 'zlib'

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

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

function makeChunk(type: string, data: Buffer): Buffer {
  const typeBytes = Buffer.from(type, 'ascii')
  const chunk = Buffer.alloc(4 + 4 + data.length + 4)

  chunk.writeUInt32BE(data.length, 0)
  typeBytes.copy(chunk, 4)
  data.copy(chunk, 8)

  const crcBuf = Buffer.alloc(4 + data.length)
  typeBytes.copy(crcBuf, 0)
  data.copy(crcBuf, 4)
  chunk.writeUInt32BE(crc32(crcBuf, 0, crcBuf.length), 8 + data.length)

  return chunk
}

function encodeIHDR(width: number, height: number): Buffer {
  const buf = Buffer.alloc(13)
  buf.writeUInt32BE(width, 0)
  buf.writeUInt32BE(height, 4)
  buf[8] = 8 // bit depth
  buf[9] = 6 // color type: RGBA
  buf[10] = 0 // compression
  buf[11] = 0 // filter
  buf[12] = 0 // interlace

  return buf
}

export function encodePng(pixels: Buffer, width: number, height: number): Buffer {
  const rowBytes = width * 4
  const rawSize = (rowBytes + 1) * height
  const raw = Buffer.alloc(rawSize)

  for (let y = 0; y < height; y++) {
    const srcOff = y * rowBytes
    const dstOff = y * (rowBytes + 1)
    raw[dstOff] = 0
    pixels.copy(raw, dstOff + 1, srcOff, srcOff + rowBytes)
  }

  const compressed = deflateSync(raw)

  const ihdr = makeChunk('IHDR', encodeIHDR(width, height))
  const idat = makeChunk('IDAT', compressed)
  const iend = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([PNG_SIGNATURE, ihdr, idat, iend])
}

export function encodePngBase64(pixels: Buffer, width: number, height: number): string {
  const png = encodePng(pixels, width, height)

  return `data:image/png;base64,${png.toString('base64')}`
}
