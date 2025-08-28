/**
 * @fileoverview Bootstrap controller: orchestrates Electrum + Core for cold-start snapshot
 * @version 1.0.0
 * @since 2025-08-23
 * @state In Development
 */

import { Request, Response } from 'express'
import type { ElectrumAdapter } from '../adapters/electrum/types'
import type { CoreRpcAdapter } from '../adapters/core/types'
import type { L1Cache } from '../cache/l1'
import { keys } from '../cache/keys'
import { recordCacheHit, recordCacheMiss, recordLatency } from '../metrics/metrics'

export function makeBootstrapController(params: { adapter: ElectrumAdapter; core?: CoreRpcAdapter; l1?: L1Cache }) {
  const { adapter, core, l1 } = params
  return {
    bootstrap: async (_req: Request, res: Response) => {
      const started = Date.now()
      try {
        const cacheKey = keys.bootstrap()
        if (l1) {
          const cached = l1.get<{ height: number; coreHeight?: number; mempoolPending: number | null; mempoolVsize?: number; priceUSD?: { value: number; asOfMs: number; provider: string }; fx?: { base: string; rates: Record<string, number>; asOfMs: number; provider: string }; asOfMs: number; source: string }>(cacheKey)
          if (cached) {
            recordCacheHit('bootstrap', cacheKey)
            recordLatency('bootstrap', Date.now() - started)
            return res.json(cached)
          }
        }

        const [electrumHeight, coreHeight, mempool] = await Promise.all([
          adapter.getTipHeight(),
          core ? core.getBlockCount() : Promise.resolve(undefined),
          core ? core.getMempoolSummary() : adapter.getMempoolSummary()
        ])

        // Optionally include latest cached price and FX (non-blocking)
        let priceUSD: { value: number; asOfMs: number; provider: string } | null = null
        let fxUSD: { base: string; rates: Record<string, number>; asOfMs: number; provider: string } | null = null
        try { priceUSD = l1 ? l1.get<{ value: number; asOfMs: number; provider: string }>(keys.priceCurrent('USD')) : null } catch { /* Ignore cache errors */ }
        try { fxUSD = l1 ? l1.get<{ base: string; rates: Record<string, number>; asOfMs: number; provider: string }>(keys.fxRates('USD')) : null } catch { /* Ignore cache errors */ }

        const payload = {
          height: electrumHeight,
          coreHeight,
          mempoolPending: typeof mempool?.pendingTransactions === 'number' ? mempool.pendingTransactions : null,
          mempoolVsize: typeof (mempool as { vsize?: number })?.vsize === 'number' ? (mempool as { vsize: number }).vsize : undefined,
          priceUSD: priceUSD ? { value: priceUSD.value, asOfMs: priceUSD.asOfMs, provider: priceUSD.provider } : undefined,
          fx: fxUSD ? { base: 'USD', rates: fxUSD.rates, asOfMs: fxUSD.asOfMs, provider: fxUSD.provider } : undefined,
          asOfMs: Date.now(),
          source: 'electrum' as const
        }

        if (l1) l1.set(cacheKey, payload, 3)
        recordCacheMiss('bootstrap', cacheKey)
        recordLatency('bootstrap', Date.now() - started)
        return res.json(payload)
      } catch {
        recordLatency('bootstrap', Date.now() - started)
        return res.status(503).json({ error: 'bootstrap_unavailable' })
      }
    }
  }
}


