import { crtCore, defaultCRTOptions } from '../shaders/crt'
import os from 'node:os'
import { Worker } from 'node:worker_threads'

const POOL_SIZE = Math.max(2, Math.min(os.cpus().length - 1, 6))

interface PoolWorker {
  worker: Worker
  pending: { resolve: () => void; reject: (err: Error) => void } | null
}

let pool: PoolWorker[] | null = null
let poolFailed = false

function buildWorkerCode(): string {
  const fnBody = crtCore.toString()

  return `
'use strict';
const { parentPort } = require('worker_threads');

const crtCore = ${fnBody};

parentPort.on('message', function(msg) {
  var src = new Uint8Array(msg.sourceSab);
  var tgt = new Uint8Array(msg.targetSab);
  crtCore(src, tgt, msg.width, msg.height, msg.startRow, msg.endRow, msg.opts);
  parentPort.postMessage(0);
});
`
}

function ensurePool(): PoolWorker[] | null {
  if (poolFailed) return null
  if (pool) return pool

  try {
    const code = buildWorkerCode()
    pool = Array.from({ length: POOL_SIZE }, () => {
      const w = new Worker(code, { eval: true })
      const pw: PoolWorker = { worker: w, pending: null }
      w.on('message', () => {
        const p = pw.pending
        pw.pending = null
        p?.resolve()
      })
      w.on('error', (err) => {
        const p = pw.pending
        pw.pending = null
        p?.reject(err)
      })

      return pw
    })

    return pool
  } catch {
    poolFailed = true

    return null
  }
}

export function getPoolSize(): number {
  return POOL_SIZE
}

export async function dispatchCrt(
  source: Buffer,
  width: number,
  height: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userOpts: any
): Promise<Buffer | null> {
  const workers = ensurePool()
  if (!workers) return null

  const opts = { ...defaultCRTOptions, ...userOpts }
  const byteLen = width * height * 4
  const sourceSab = new SharedArrayBuffer(byteLen)
  new Uint8Array(sourceSab).set(new Uint8Array(source.buffer, source.byteOffset, byteLen))

  const targetSab = new SharedArrayBuffer(byteLen)

  const rowsPerWorker = Math.ceil(height / workers.length)

  const promises = workers.map((pw, i) => {
    const startRow = i * rowsPerWorker
    const endRow = Math.min(startRow + rowsPerWorker, height)
    if (startRow >= height) return Promise.resolve()

    return new Promise<void>((resolve, reject) => {
      pw.pending = { resolve, reject }
      pw.worker.postMessage({ sourceSab, targetSab, width, height, startRow, endRow, opts })
    })
  })

  await Promise.all(promises)

  const result = Buffer.allocUnsafe(byteLen)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Buffer.from(targetSab as any).copy(result as any)

  return result
}

export function shutdownPool(): void {
  if (pool) {
    for (const pw of pool) {
      pw.worker.terminate()
    }
    pool = null
  }
}
