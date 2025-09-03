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
    // Debug endpoint to test Core RPC connection
    debug: async (_req: Request, res: Response) => {
      try {
        const height = await core.getBlockCount()
        res.json({ 
          ok: true, 
          height, 
          message: 'Core RPC connection successful',
          timestamp: Date.now() 
        })
      } catch (error) {
        console.error('[Core Debug] Error:', error)
        res.status(503).json({ 
          ok: false, 
          error: 'core_connection_failed',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now() 
        })
      }
    },

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
      } catch (error) {
        console.error('[Core Height] Error:', error)
        recordLatency('core.height', Date.now() - started)
        return res.status(503).json({ 
          error: 'core_height_unavailable',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
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


