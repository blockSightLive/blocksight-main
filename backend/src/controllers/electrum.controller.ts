/**
 * @fileoverview Electrum controller exposing HTTP endpoints
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

import { Request, Response } from 'express';
import { ElectrumAdapter } from '../adapters/electrum/types';
import type { CoreRpcAdapter } from '../adapters/core/types';
import type { L1Cache } from '../cache/l1';
import { ttlForEntity } from '../cache/ttl';
import { keys } from '../cache/keys';
import { recordCacheHit, recordCacheMiss, recordLatency } from '../metrics/metrics';

export function makeElectrumController(adapter: ElectrumAdapter, core?: CoreRpcAdapter, l1?: L1Cache) {
  return {
    bootstrap: async (_req: Request, res: Response) => {
      const started = Date.now();
      try {
                 const [height, coreHeight] = await Promise.allSettled([
           adapter.getTipHeight(),
           core ? core.getBlockCount() : Promise.resolve(null)
         ]);
        
        const payload = {
          height: height.status === 'fulfilled' ? height.value : null,
          coreHeight: coreHeight.status === 'fulfilled' ? coreHeight.value : null,
          mempoolPending: null, // TODO: Implement when Core is ready
          mempoolVsize: undefined, // TODO: Implement when Electrum mempool is ready
          asOfMs: Date.now(),
          source: 'electrum'
        };
        
        recordLatency('bootstrap', Date.now() - started);
        res.json(payload);
      } catch (error) {
        console.error('[bootstrap] error:', error);
        res.status(503).json({ error: 'bootstrap_unavailable' });
      }
    },
    health: async (_req: Request, res: Response) => {
      const started = Date.now();
      // Ensure health check never hangs; degrade quickly on failure
      const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> => {
        return new Promise((resolve, reject) => {
          const t = setTimeout(() => reject(new Error('timeout')), ms);
          p.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
        });
      };
      try {
        const [electrumOk, coreInfo] = await Promise.allSettled([
          withTimeout(adapter.ping(), 1500),
          core ? withTimeout(core.getMempoolSummary(), 1500) : Promise.resolve(null)
        ]);
        const ok = electrumOk.status === 'fulfilled' && !!electrumOk.value;
        const details = {
          electrum: ok ? 'ok' : 'degraded',
          core: coreInfo && coreInfo.status === 'fulfilled' ? 'ok' : (core ? 'degraded' : 'disabled')
        } as const;
        const durationMs = Date.now() - started;
        console.log(`[health] ok=${ok} electrum=${details.electrum} core=${details.core} durMs=${durationMs}`);
        res.json({ ok, ts: Date.now(), details });
      } catch {
        // Degraded but responsive
        const durationMs = Date.now() - started;
        console.warn(`[health] ok=false durMs=${durationMs}`);
        res.json({ ok: false, ts: Date.now(), degraded: true });
      }
    },
    fees: async (_req: Request, res: Response) => {
      const started = Date.now();
      try {
        const cacheKey = keys.feesEstimates();
        if (l1) {
          const cached = l1.get<{ fast: number; normal: number; slow: number }>(cacheKey);
          if (cached) {
            recordCacheHit('fee.estimates', cacheKey);
            recordLatency('fee.estimates', Date.now() - started);
            return res.json(cached);
          }
        }
        const estimates = await adapter.getFeeEstimates();
        const ttl = ttlForEntity('feeEstimates');
        if (l1) l1.set(cacheKey, estimates, ttl);
        recordCacheMiss('fee.estimates', cacheKey);
        recordLatency('fee.estimates', Date.now() - started);
        return res.json(estimates);
      } catch {
        const estimates = await adapter.getFeeEstimates();
        recordLatency('fee.estimates', Date.now() - started);
        return res.json(estimates);
      }
    },
    height: async (_req: Request, res: Response) => {
      const started = Date.now();
      try {
        const cacheKey = keys.tipHeight();
        if (l1) {
          const cached = l1.get<{ height: number; timestamp: number }>(cacheKey);
          if (cached) {
            recordCacheHit('network.height', cacheKey);
            recordLatency('network.height', Date.now() - started);
            return res.json(cached);
          }
        }
        const height = await adapter.getTipHeight();
        const payload = { height, timestamp: Date.now() };
        const ttl = 2; // tip height is volatile; keep very short
        if (l1) l1.set(cacheKey, payload, ttl);
        recordCacheMiss('network.height', cacheKey);
        recordLatency('network.height', Date.now() - started);
        res.json(payload);
      } catch {
        recordLatency('network.height', Date.now() - started);
        res.status(503).json({ error: 'height_unavailable' });
      }
    },
    mempool: async (_req: Request, res: Response) => {
      const started = Date.now();
      try {
        const cacheKey = keys.mempoolSummary();
        if (l1) {
          const cached = l1.get<{ pendingTransactions?: number | null; vsize?: number; timestamp: number }>(cacheKey);
          if (cached) {
            recordCacheHit('network.mempool', cacheKey);
            recordLatency('network.mempool', Date.now() - started);
            return res.json(cached);
          }
        }
        const useCore = !!core;
        const summary = useCore ? await core!.getMempoolSummary() : await adapter.getMempoolSummary();
        const durationMs = Date.now() - started;
        console.log(`[mempool] source=${useCore ? 'core' : 'electrum'} count=${summary.pendingTransactions ?? 'null'} vsize=${(summary as { vsize?: number }).vsize ?? 'n/a'} durMs=${durationMs}`);
        const payload = { ...summary, timestamp: Date.now() };
        const ttl = ttlForEntity('mempoolSummary');
        if (l1) l1.set(cacheKey, payload, ttl);
        recordCacheMiss('network.mempool', cacheKey);
        recordLatency('network.mempool', Date.now() - started);
        res.json(payload);
      } catch {
        const durationMs = Date.now() - started;
        console.warn(`[mempool] error durMs=${durationMs}`);
        recordLatency('network.mempool', durationMs);
        res.status(503).json({ error: 'mempool_unavailable' });
      }
    }
  };
}


