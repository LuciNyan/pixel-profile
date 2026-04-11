import { crtCore, defaultCRTOptions } from '../shaders/crt'
import { curveCore } from '../shaders/curve'
import {
  buildLuminanceMap,
  buildWeightTable,
  calculateAdaptiveThreshold,
  getFalloffFunction,
  horizontalPassCore,
  verticalPassCore
} from '../shaders/glow'
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
  const fns = [
    crtCore,
    curveCore,
    buildLuminanceMap,
    buildWeightTable,
    getFalloffFunction,
    horizontalPassCore,
    verticalPassCore
  ]
  const fnDefs = fns.map((fn) => `var ${fn.name} = ${fn.toString()};`).join('\n')

  return `
'use strict';
var { parentPort } = require('worker_threads');

${fnDefs}

parentPort.on('message', function(msg) {
  if (msg.type === 'crt') {
    var src = new Uint8Array(msg.sourceSab);
    var tgt = new Uint8Array(msg.targetSab);
    crtCore(src, tgt, msg.width, msg.height, msg.startRow, msg.endRow, msg.opts);
  } else if (msg.type === 'curve') {
    var src = new Uint8Array(msg.sourceSab);
    var tgt = new Uint8Array(msg.targetSab);
    curveCore(src, tgt, msg.width, msg.height, msg.startRow, msg.endRow);
  } else if (msg.type === 'glow-layer') {
    var src = new Uint8Array(msg.sourceSab);
    var layerOut = new Float32Array(msg.layerSab);
    var sz = msg.width * msg.height;
    var lum = buildLuminanceMap(src, sz);
    var ffn = getFalloffFunction(msg.falloffType);
    var wt = buildWeightTable(msg.layerRadius, ffn);
    var hBlur = new Float32Array(sz * 4);
    var hLum = new Float64Array(sz);
    var w = msg.width, h = msg.height;
    var th = msg.threshold, lr = msg.layerRadius;
    horizontalPassCore(src, hBlur, lum, hLum, w, h, th, lr, wt);
    verticalPassCore(hBlur, layerOut, hLum, w, h, th, lr, wt);
  } else if (msg.type === 'glow-h-batch') {
    var src = new Uint8Array(msg.sourceSab);
    var lum = new Float64Array(msg.lumSab);
    var w = msg.width, h = msg.height;
    var sR = msg.startRow, eR = msg.endRow;
    var th = msg.threshold, ft = msg.falloffType;
    var ls = msg.layers;
    for (var li = 0; li < ls.length; li++) {
      var la = ls[li];
      var hB = new Float32Array(la.hBlurSab);
      var hL = new Float64Array(la.hLumSab);
      var ffn = getFalloffFunction(ft);
      var wt = buildWeightTable(la.radius, ffn);
      horizontalPassCore(src, hB, lum, hL, w, h, th, la.radius, wt, sR, eR);
    }
  } else if (msg.type === 'glow-v-batch') {
    var w = msg.width, h = msg.height;
    var sR = msg.startRow, eR = msg.endRow;
    var th = msg.threshold, ft = msg.falloffType;
    var ls = msg.layers;
    for (var li = 0; li < ls.length; li++) {
      var la = ls[li];
      var hB = new Float32Array(la.hBlurSab);
      var hL = new Float64Array(la.hLumSab);
      var oS = new Float32Array(la.layerOutSab);
      var ffn = getFalloffFunction(ft);
      var wt = buildWeightTable(la.radius, ffn);
      verticalPassCore(hB, oS, hL, w, h, th, la.radius, wt, sR, eR);
    }
  }
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
      pw.worker.postMessage({ type: 'crt', sourceSab, targetSab, width, height, startRow, endRow, opts })
    })
  })

  await Promise.all(promises)

  const result = Buffer.allocUnsafe(byteLen)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Buffer.from(targetSab as any).copy(result as any)

  return result
}

export async function dispatchCurve(source: Buffer, width: number, height: number): Promise<Buffer | null> {
  const workers = ensurePool()
  if (!workers) return null

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
      pw.worker.postMessage({
        type: 'curve',
        sourceSab,
        targetSab,
        width,
        height,
        startRow,
        endRow
      })
    })
  })

  await Promise.all(promises)

  const result = Buffer.allocUnsafe(byteLen)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Buffer.from(targetSab as any).copy(result as any)

  return result
}

export async function dispatchGlow(
  source: Buffer,
  width: number,
  height: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userOpts: any
): Promise<Buffer | null> {
  const workers = ensurePool()
  if (!workers) return null

  const defaultGlow = {
    radius: 1,
    intensity: 0.7,
    threshold: 0.8,
    color: [1, 1, 1] as [number, number, number],
    layers: 2,
    falloff: 'gaussian',
    adaptiveThreshold: true
  }
  const opts = { ...defaultGlow, ...userOpts }
  const { radius, intensity, color, layers, falloff, adaptiveThreshold, threshold: _threshold } = opts

  const threshold = adaptiveThreshold ? calculateAdaptiveThreshold(source, width, height) : _threshold

  const byteLen = width * height * 4
  const size = width * height
  const sourceSab = new SharedArrayBuffer(byteLen)
  new Uint8Array(sourceSab).set(new Uint8Array(source.buffer, source.byteOffset, byteLen))

  const lumSab = new SharedArrayBuffer(size * 8)
  const lumArr = new Float64Array(lumSab)
  const srcLum = buildLuminanceMap(source, size)
  lumArr.set(srcLum)

  const layerConfigs: {
    hBlurSab: SharedArrayBuffer
    hLumSab: SharedArrayBuffer
    layerOutSab: SharedArrayBuffer
    radius: number
  }[] = []
  for (let i = 0; i < layers; i++) {
    layerConfigs.push({
      hBlurSab: new SharedArrayBuffer(size * 4 * 4),
      hLumSab: new SharedArrayBuffer(size * 8),
      layerOutSab: new SharedArrayBuffer(size * 4 * 4),
      radius: Math.floor(radius * (i + 1))
    })
  }

  const rowsPerWorker = Math.ceil(height / workers.length)
  const layerMsgs = layerConfigs.map((lc) => ({
    hBlurSab: lc.hBlurSab,
    hLumSab: lc.hLumSab,
    layerOutSab: lc.layerOutSab,
    radius: lc.radius
  }))

  await Promise.all(
    workers.map((pw, i) => {
      const startRow = i * rowsPerWorker
      const endRow = Math.min(startRow + rowsPerWorker, height)
      if (startRow >= height) return Promise.resolve()

      return new Promise<void>((resolve, reject) => {
        pw.pending = { resolve, reject }
        pw.worker.postMessage({
          type: 'glow-h-batch',
          sourceSab,
          lumSab,
          layers: layerMsgs,
          width,
          height,
          threshold,
          falloffType: falloff,
          startRow,
          endRow
        })
      })
    })
  )

  await Promise.all(
    workers.map((pw, i) => {
      const startRow = i * rowsPerWorker
      const endRow = Math.min(startRow + rowsPerWorker, height)
      if (startRow >= height) return Promise.resolve()

      return new Promise<void>((resolve, reject) => {
        pw.pending = { resolve, reject }
        pw.worker.postMessage({
          type: 'glow-v-batch',
          layers: layerMsgs,
          width,
          height,
          threshold,
          falloffType: falloff,
          startRow,
          endRow
        })
      })
    })
  )

  const glowLayers: Float32Array[] = layerConfigs.map((lc) => new Float32Array(lc.layerOutSab))

  const result = Buffer.allocUnsafe(byteLen)
  const [colorR, colorG, colorB] = color
  const isWhite = colorR === 1 && colorG === 1 && colorB === 1

  const layerIntensities = new Float64Array(layers)
  const layerOneMinusT = new Float64Array(layers)
  for (let li = 0; li < layers; li++) {
    layerIntensities[li] = intensity / (li + 1)
    layerOneMinusT[li] = 1 - layerIntensities[li]
  }

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width
    for (let x = 0; x < width; x++) {
      const idx = (rowOffset + x) * 4
      let finalR = source[idx]
      let finalG = source[idx + 1]
      let finalB = source[idx + 2]

      if (isWhite) {
        for (let li = 0; li < layers; li++) {
          const ci = layerIntensities[li]
          const oi = layerOneMinusT[li]
          const lb = glowLayers[li]
          finalR = finalR * oi + lb[idx] * ci
          finalG = finalG * oi + lb[idx + 1] * ci
          finalB = finalB * oi + lb[idx + 2] * ci
        }
      } else {
        for (let li = 0; li < layers; li++) {
          const ci = layerIntensities[li]
          const oi = layerOneMinusT[li]
          const lb = glowLayers[li]
          finalR = finalR * oi + lb[idx] * colorR * ci
          finalG = finalG * oi + lb[idx + 1] * colorG * ci
          finalB = finalB * oi + lb[idx + 2] * colorB * ci
        }
      }

      result[idx] = finalR
      result[idx + 1] = finalG
      result[idx + 2] = finalB
      result[idx + 3] = 255
    }
  }

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
