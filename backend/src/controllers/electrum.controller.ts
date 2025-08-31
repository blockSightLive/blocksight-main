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
          const cached = l1.get<{ count: number; vsize: number }>(cacheKey);
          if (cached) {
            recordCacheHit('mempool.summary', cacheKey);
            recordLatency('mempool.summary', Date.now() - started);
            return res.json(cached);
          }
        }
        const summary = await adapter.getMempoolSummary();
        const ttl = ttlForEntity('mempoolSummary');
        if (l1) l1.set(cacheKey, summary, ttl);
        recordCacheMiss('mempool.summary', cacheKey);
        recordLatency('mempool.summary', Date.now() - started);
        return res.json(summary);
      } catch {
        const summary = await adapter.getMempoolSummary();
        recordLatency('mempool.summary', Date.now() - started);
        return res.json(summary);
      }
    },

    // Enhanced endpoints with validation
    getBalance: async (req: Request, res: Response) => {
      const started = Date.now();
      try {
        const { address } = req.params;
        const balance = await adapter.getBalance(address);
        recordLatency('address.balance', Date.now() - started);
        res.json({
          ok: true,
          data: { address, balance },
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('[getBalance] error:', error);
        res.status(500).json({
          ok: false,
          error: 'balance_retrieval_failed',
          message: 'Failed to retrieve balance',
          timestamp: Date.now()
        });
      }
    },

    getTransaction: async (req: Request, res: Response) => {
      const started = Date.now();
      try {
        const { txid } = req.params;
        const transaction = await adapter.getTransaction(txid);
        recordLatency('transaction.get', Date.now() - started);
        res.json({
          ok: true,
          data: transaction,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('[getTransaction] error:', error);
        res.status(500).json({
          ok: false,
          error: 'transaction_retrieval_failed',
          message: 'Failed to retrieve transaction',
          timestamp: Date.now()
        });
      }
    },

    getHistory: async (req: Request, res: Response) => {
      const started = Date.now();
      try {
        const { address } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const history = await adapter.getHistory(address, { page: Number(page), limit: Number(limit) });
        recordLatency('address.history', Date.now() - started);
        res.json({
          ok: true,
          data: { address, history, pagination: { page: Number(page), limit: Number(limit) } },
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('[getHistory] error:', error);
        res.status(500).json({
          ok: false,
          error: 'history_retrieval_failed',
          message: 'Failed to retrieve address history',
          timestamp: Date.now()
        });
      }
    },

    getMempool: async (req: Request, res: Response) => {
      const started = Date.now();
      try {
        const { page = 1, limit = 20 } = req.query;
        const mempool = await adapter.getMempool({ page: Number(page), limit: Number(limit) });
        recordLatency('mempool.get', Date.now() - started);
        res.json({
          ok: true,
          data: { mempool, pagination: { page: Number(page), limit: Number(limit) } },
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('[getMempool] error:', error);
        res.status(500).json({
          ok: false,
          error: 'mempool_retrieval_failed',
          message: 'Failed to retrieve mempool',
          timestamp: Date.now()
        });
      }
    },

    getFeeEstimate: async (req: Request, res: Response) => {
      const started = Date.now();
      try {
        const { blocks = 6 } = req.query;
        const estimate = await adapter.getFeeEstimate(Number(blocks));
        recordLatency('fee.estimate', Date.now() - started);
        res.json({
          ok: true,
          data: { estimate, blocks: Number(blocks) },
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('[getFeeEstimate] error:', error);
        res.status(500).json({
          ok: false,
          error: 'fee_estimate_failed',
          message: 'Failed to get fee estimate',
          timestamp: Date.now()
        });
      }
    }
  };
}


