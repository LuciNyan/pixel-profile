import { crtCore, defaultCRTOptions } from '../shaders/crt'
import { curveCore } from '../shaders/curve'
import {
  buildColumnPrefixMap,
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

const POOL_INIT_TIMEOUT_MS = 3000

let pool: PoolWorker[] | null = null
let poolFailed = false
let poolReadyPromise: Promise<boolean> | null = null

function buildWorkerCode(): string {
  const fns = [
    crtCore,
    curveCore,
    buildColumnPrefixMap,
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
  } else if (msg.type === 'glow-v-only') {
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
      var cp = la.colPrefixSab ? new Int32Array(la.colPrefixSab) : undefined;
      verticalPassCore(hB, oS, hL, w, h, th, la.radius, wt, sR, eR, cp);
    }
  } else if (msg.type === 'glow-composite') {
    var src = new Uint8Array(msg.sourceSab);
    var res = new Uint8Array(msg.resultSab);
    var w = msg.width, h = msg.height;
    var sR = msg.startRow, eR = msg.endRow;
    var ls = msg.layers, nL = ls.length;
    var layerOuts = new Array(nL);
    for (var li = 0; li < nL; li++) {
      layerOuts[li] = new Float32Array(ls[li].layerOutSab);
    }
    var cI = msg.colorIsWhite;
    var cR = msg.colorR, cG = msg.colorG, cB = msg.colorB;
    var lI = msg.layerIntensities, lO = msg.layerOneMinusT;
    for (var y = sR; y < eR; y++) {
      var rOff = y * w;
      for (var x = 0; x < w; x++) {
        var idx = (rOff + x) * 4;
        var fR = src[idx], fG = src[idx+1], fB = src[idx+2];
        if (cI) {
          for (var j = 0; j < nL; j++) {
            var ci = lI[j], oi = lO[j], lb = layerOuts[j];
            fR = fR*oi + lb[idx]*ci;
            fG = fG*oi + lb[idx+1]*ci;
            fB = fB*oi + lb[idx+2]*ci;
          }
        } else {
          for (var j = 0; j < nL; j++) {
            var ci = lI[j], oi = lO[j], lb = layerOuts[j];
            fR = fR*oi + lb[idx]*cR*ci;
            fG = fG*oi + lb[idx+1]*cG*ci;
            fB = fB*oi + lb[idx+2]*cB*ci;
          }
        }
        res[idx] = fR; res[idx+1] = fG;
        res[idx+2] = fB; res[idx+3] = 255;
      }
    }
  } else if (msg.type === 'glow-vc-batch') {
    var w = msg.width, h = msg.height;
    var sR = msg.startRow, eR = msg.endRow;
    var th = msg.threshold, ft = msg.falloffType;
    var ls = msg.layers, nL = ls.length;
    var layerOuts = new Array(nL);
    for (var li = 0; li < nL; li++) {
      var la = ls[li];
      var hB = new Float32Array(la.hBlurSab);
      var hL = new Float64Array(la.hLumSab);
      var oS = new Float32Array(la.layerOutSab);
      layerOuts[li] = oS;
      var ffn = getFalloffFunction(ft);
      var wt = buildWeightTable(la.radius, ffn);
      var cp = la.colPrefixSab ? new Int32Array(la.colPrefixSab) : undefined;
      verticalPassCore(hB, oS, hL, w, h, th, la.radius, wt, sR, eR, cp);
    }
    var src = new Uint8Array(msg.sourceSab);
    var res = new Uint8Array(msg.resultSab);
    var cI = msg.colorIsWhite;
    var cR = msg.colorR, cG = msg.colorG, cB = msg.colorB;
    var lI = msg.layerIntensities;
    var lO = msg.layerOneMinusT;
    for (var y = sR; y < eR; y++) {
      var rOff = y * w;
      for (var x = 0; x < w; x++) {
        var idx = (rOff + x) * 4;
        var fR = src[idx], fG = src[idx+1], fB = src[idx+2];
        if (cI) {
          for (var j = 0; j < nL; j++) {
            var ci = lI[j], oi = lO[j], lb = layerOuts[j];
            fR = fR*oi + lb[idx]*ci;
            fG = fG*oi + lb[idx+1]*ci;
            fB = fB*oi + lb[idx+2]*ci;
          }
        } else {
          for (var j = 0; j < nL; j++) {
            var ci = lI[j], oi = lO[j], lb = layerOuts[j];
            fR = fR*oi + lb[idx]*cR*ci;
            fG = fG*oi + lb[idx+1]*cG*ci;
            fB = fB*oi + lb[idx+2]*cB*ci;
          }
        }
        res[idx] = fR; res[idx+1] = fG;
        res[idx+2] = fB; res[idx+3] = 255;
      }
    }
  }
  parentPort.postMessage(0);
});
parentPort.postMessage(0);
`
}

function initPool(): { workers: PoolWorker[]; ready: Promise<boolean> } | null {
  try {
    const code = buildWorkerCode()
    const readyPromises: Array<Promise<void>> = []

    const workers = Array.from({ length: POOL_SIZE }, () => {
      const w = new Worker(code, { eval: true })
      const pw: PoolWorker = { worker: w, pending: null }

      let isReady = false
      let readyResolve: () => void
      readyPromises.push(
        new Promise<void>((resolve) => {
          readyResolve = resolve
        })
      )

      w.on('message', () => {
        if (!isReady) {
          isReady = true
          readyResolve()

          return
        }
        const p = pw.pending
        pw.pending = null
        p?.resolve()
      })
      w.on('error', (err) => {
        if (!isReady) {
          isReady = true
          readyResolve()

          return
        }
        const p = pw.pending
        pw.pending = null
        p?.reject(err)
      })

      return pw
    })

    const ready = Promise.race([
      Promise.all(readyPromises).then(() => true),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), POOL_INIT_TIMEOUT_MS))
    ])

    return { workers, ready }
  } catch {
    return null
  }
}

function ensurePool(): void {
  if (poolFailed || pool || poolReadyPromise) return

  const result = initPool()
  if (!result) {
    poolFailed = true

    return
  }

  pool = result.workers
  poolReadyPromise = result.ready.then((ok) => {
    if (!ok) {
      poolFailed = true
      for (const w of pool!) {
        try {
          w.worker.terminate()
        } catch {
          /* ignore */
        }
      }
      pool = null
    }

    return ok
  })
}

async function getPool(): Promise<PoolWorker[] | null> {
  ensurePool()
  if (poolFailed) return null

  if (poolReadyPromise) {
    const ok = await poolReadyPromise
    if (!ok) return null
  }

  return pool
}

export function getPoolSize(): number {
  return POOL_SIZE
}

function toSharedSource(source: Buffer, byteLen: number): SharedArrayBuffer {
  if (source.buffer instanceof SharedArrayBuffer && source.byteOffset === 0 && source.byteLength >= byteLen) {
    return source.buffer
  }
  const sab = new SharedArrayBuffer(byteLen)
  new Uint8Array(sab).set(new Uint8Array(source.buffer, source.byteOffset, byteLen))

  return sab
}

export async function dispatchCrt(
  source: Buffer,
  width: number,
  height: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userOpts: any
): Promise<Buffer | null> {
  const workers = await getPool()
  if (!workers) return null

  const opts = { ...defaultCRTOptions, ...userOpts }
  const byteLen = width * height * 4
  const sourceSab = toSharedSource(source, byteLen)

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Buffer.from(targetSab as any) as Buffer
}

export async function dispatchCurve(source: Buffer, width: number, height: number): Promise<Buffer | null> {
  const workers = await getPool()
  if (!workers) return null

  const byteLen = width * height * 4
  const sourceSab = toSharedSource(source, byteLen)

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Buffer.from(targetSab as any) as Buffer
}

const DEFAULT_GLOW = {
  radius: 1,
  intensity: 0.7,
  threshold: 0.8,
  color: [1, 1, 1] as [number, number, number],
  layers: 2,
  falloff: 'gaussian',
  adaptiveThreshold: true
}

export interface PrecomputedGlowLayers {
  layerMsgs: {
    hBlurSab: SharedArrayBuffer
    hLumSab: SharedArrayBuffer
    layerOutSab: SharedArrayBuffer
    radius: number
  }[]
  sourceSab: SharedArrayBuffer
  threshold: number
  falloff: string
  numLayers: number
  width: number
  height: number
}

export async function precomputeGlowLayers(
  source: Buffer,
  width: number,
  height: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userOpts: any
): Promise<PrecomputedGlowLayers | null> {
  const workers = await getPool()
  if (!workers) return null

  const opts = { ...DEFAULT_GLOW, ...userOpts }
  const { radius, layers, falloff, adaptiveThreshold, threshold: _threshold } = opts
  const threshold = adaptiveThreshold ? calculateAdaptiveThreshold(source, width, height) : _threshold

  const byteLen = width * height * 4
  const size = width * height
  const sourceSab = toSharedSource(source, byteLen)

  const lumSab = new SharedArrayBuffer(size * 8)
  buildLuminanceMap(source, size, new Float64Array(lumSab))

  const colPrefixLen = (height + 1) * width
  const layerMsgs: PrecomputedGlowLayers['layerMsgs'] = []
  for (let i = 0; i < layers; i++) {
    layerMsgs.push({
      hBlurSab: new SharedArrayBuffer(size * 4 * 4),
      hLumSab: new SharedArrayBuffer(size * 8),
      layerOutSab: new SharedArrayBuffer(size * 4 * 4),
      radius: Math.floor(radius * (i + 1))
    })
  }

  const rowsPerWorker = Math.ceil(height / workers.length)

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

  for (const lm of layerMsgs) {
    const hLum = new Float64Array(lm.hLumSab)
    const cpSab = new SharedArrayBuffer(colPrefixLen * 4)
    buildColumnPrefixMap(hLum, width, height, threshold, new Int32Array(cpSab))
    ;(lm as { colPrefixSab?: SharedArrayBuffer }).colPrefixSab = cpSab
  }

  await Promise.all(
    workers.map((pw, i) => {
      const startRow = i * rowsPerWorker
      const endRow = Math.min(startRow + rowsPerWorker, height)
      if (startRow >= height) return Promise.resolve()

      return new Promise<void>((resolve, reject) => {
        pw.pending = { resolve, reject }
        pw.worker.postMessage({
          type: 'glow-v-only',
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

  return { layerMsgs, sourceSab, threshold, falloff, numLayers: layers, width, height }
}

export async function compositeGlowFromPrecomputed(
  precomputed: PrecomputedGlowLayers,
  intensity: number,
  color: [number, number, number]
): Promise<Buffer> {
  const workers = await getPool()
  const { layerMsgs, sourceSab, numLayers, width, height } = precomputed
  const byteLen = width * height * 4

  const [colorR, colorG, colorB] = color
  const isWhite = colorR === 1 && colorG === 1 && colorB === 1
  const layerIntensities: number[] = []
  const layerOneMinusT: number[] = []
  for (let li = 0; li < numLayers; li++) {
    layerIntensities.push(intensity / (li + 1))
    layerOneMinusT.push(1 - intensity / (li + 1))
  }

  if (workers) {
    const resultSab = new SharedArrayBuffer(byteLen)
    const rowsPerWorker = Math.ceil(height / workers.length)

    await Promise.all(
      workers.map((pw, i) => {
        const startRow = i * rowsPerWorker
        const endRow = Math.min(startRow + rowsPerWorker, height)
        if (startRow >= height) return Promise.resolve()

        return new Promise<void>((resolve, reject) => {
          pw.pending = { resolve, reject }
          pw.worker.postMessage({
            type: 'glow-composite',
            layers: layerMsgs,
            sourceSab,
            resultSab,
            width,
            height,
            startRow,
            endRow,
            colorIsWhite: isWhite,
            colorR,
            colorG,
            colorB,
            layerIntensities,
            layerOneMinusT
          })
        })
      })
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Buffer.from(resultSab as any) as Buffer
  }

  const source = Buffer.from(sourceSab)
  const result = Buffer.allocUnsafe(byteLen)
  const glowLayers: Float32Array[] = layerMsgs.map((lm) => new Float32Array(lm.layerOutSab))

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width
    for (let x = 0; x < width; x++) {
      const idx = (rowOffset + x) * 4
      let fR = source[idx]
      let fG = source[idx + 1]
      let fB = source[idx + 2]
      for (let li = 0; li < numLayers; li++) {
        const ci = layerIntensities[li]
        const oi = layerOneMinusT[li]
        const lb = glowLayers[li]
        if (isWhite) {
          fR = fR * oi + lb[idx] * ci
          fG = fG * oi + lb[idx + 1] * ci
          fB = fB * oi + lb[idx + 2] * ci
        } else {
          fR = fR * oi + lb[idx] * colorR * ci
          fG = fG * oi + lb[idx + 1] * colorG * ci
          fB = fB * oi + lb[idx + 2] * colorB * ci
        }
      }
      result[idx] = fR
      result[idx + 1] = fG
      result[idx + 2] = fB
      result[idx + 3] = 255
    }
  }

  return result
}

export async function dispatchGlow(
  source: Buffer,
  width: number,
  height: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userOpts: any
): Promise<Buffer | null> {
  const workers = await getPool()
  if (!workers) return null

  const opts = { ...DEFAULT_GLOW, ...userOpts }
  const { radius, intensity, layers, falloff, adaptiveThreshold, threshold: _threshold, color } = opts
  const threshold = adaptiveThreshold ? calculateAdaptiveThreshold(source, width, height) : _threshold

  const byteLen = width * height * 4
  const size = width * height
  const sourceSab = toSharedSource(source, byteLen)
  const colPrefixLen = (height + 1) * width

  const lumSab = new SharedArrayBuffer(size * 8)
  buildLuminanceMap(source, size, new Float64Array(lumSab))

  const layerMsgs: {
    hBlurSab: SharedArrayBuffer
    hLumSab: SharedArrayBuffer
    layerOutSab: SharedArrayBuffer
    radius: number
    colPrefixSab?: SharedArrayBuffer
  }[] = []
  for (let i = 0; i < layers; i++) {
    layerMsgs.push({
      hBlurSab: new SharedArrayBuffer(size * 4 * 4),
      hLumSab: new SharedArrayBuffer(size * 8),
      layerOutSab: new SharedArrayBuffer(size * 4 * 4),
      radius: Math.floor(radius * (i + 1))
    })
  }

  const rowsPerWorker = Math.ceil(height / workers.length)

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

  for (const lm of layerMsgs) {
    const hLum = new Float64Array(lm.hLumSab)
    const cpSab = new SharedArrayBuffer(colPrefixLen * 4)
    buildColumnPrefixMap(hLum, width, height, threshold, new Int32Array(cpSab))
    lm.colPrefixSab = cpSab
  }

  const [colorR, colorG, colorB] = color
  const isWhite = colorR === 1 && colorG === 1 && colorB === 1
  const layerIntensities: number[] = []
  const layerOneMinusT: number[] = []
  for (let li = 0; li < layers; li++) {
    layerIntensities.push(intensity / (li + 1))
    layerOneMinusT.push(1 - intensity / (li + 1))
  }

  const resultSab = new SharedArrayBuffer(byteLen)

  await Promise.all(
    workers.map((pw, i) => {
      const startRow = i * rowsPerWorker
      const endRow = Math.min(startRow + rowsPerWorker, height)
      if (startRow >= height) return Promise.resolve()

      return new Promise<void>((resolve, reject) => {
        pw.pending = { resolve, reject }
        pw.worker.postMessage({
          type: 'glow-vc-batch',
          layers: layerMsgs,
          sourceSab,
          resultSab,
          width,
          height,
          threshold,
          falloffType: falloff,
          startRow,
          endRow,
          colorIsWhite: isWhite,
          colorR,
          colorG,
          colorB,
          layerIntensities,
          layerOneMinusT
        })
      })
    })
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Buffer.from(resultSab as any) as Buffer
}

export function shutdownPool(): void {
  if (pool) {
    for (const pw of pool) {
      pw.worker.terminate()
    }
    pool = null
  }
}
