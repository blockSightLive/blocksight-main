/**
 * @fileoverview Bitcoin Core controller: Core-only HTTP endpoints
 * @version 1.0.0
 * @since 2025-08-23
 * @state In Development
 */

import { Request, Response } from 'express'
import type { CoreRpcAdapter } from '../adapters/core/types'
import type { L1Cache } from '../cache/l1'
import { keys } from '../cache/keys'
import { recordCacheHit, recordCacheMiss, recordLatency } from '../metrics/metrics'

export function makeCoreController(core: CoreRpcAdapter, l1?: L1Cache) {
  return {
    height: async (_req: Request, res: Response) => {
      const started = Date.now()
      try {
        const cacheKey = keys.coreTipHeight()
        if (l1) {
          const cached = l1.get<{ height: number; timestamp: number }>(cacheKey)
          if (cached) {
            recordCacheHit('core.height', cacheKey)
            recordLatency('core.height', Date.now() - started)
            return res.json(cached)
          }
        }
        const height = await core.getBlockCount()
        const payload = { height, timestamp: Date.now() }
        if (l1) l1.set(cacheKey, payload, 2)
        recordCacheMiss('core.height', cacheKey)
        recordLatency('core.height', Date.now() - started)
        return res.json(payload)
      } catch {
        recordLatency('core.height', Date.now() - started)
        return res.status(503).json({ error: 'core_height_unavailable' })
      }
    },

    mempool: async (_req: Request, res: Response) => {
      const started = Date.now()
      try {
        const cacheKey = keys.coreMempoolSummary()
        if (l1) {
          const cached = l1.get<{ pendingTransactions: number; bytes?: number; usage?: number; minFee?: number; timestamp: number }>(cacheKey)
          if (cached) {
            recordCacheHit('core.mempool', cacheKey)
            recordLatency('core.mempool', Date.now() - started)
            return res.json(cached)
          }
        }
        const summary = await core.getMempoolSummary()
        const payload = { ...summary, timestamp: Date.now() }
        // Mempool changes quickly but doesn’t require per-second accuracy for dashboard shell
        if (l1) l1.set(cacheKey, payload, 5)
        recordCacheMiss('core.mempool', cacheKey)
        recordLatency('core.mempool', Date.now() - started)
        return res.json(payload)
      } catch {
        recordLatency('core.mempool', Date.now() - started)
        return res.status(503).json({ error: 'core_mempool_unavailable' })
      }
    }
  }
}


