/**
 * @fileoverview WebSocket Hub: plugin-based event broadcasting for minimal viable data flow
 * @version 1.0.0
 * @since 2025-08-20
 * @state In Development
 */

import type { ElectrumAdapter } from '../adapters/electrum/types';
import type { CoreRpcAdapter } from '../adapters/core/types';
import type { L1Cache } from '../cache/l1';
import { keys } from '../cache/keys';
import type { HubEvent, TipHeightEvent, NetworkFeesEvent, NetworkMempoolEvent, ChainReorgEvent, PriceCurrentEvent, FxRatesEvent } from './types';
import { recordWsBroadcastDuration, recordWsProduced } from '../metrics/metrics';

export type WsClient = {
  send: (data: string) => void;
  readyState?: number;
  // Optional server-side filters attached per connection
  __filters__?: Set<string>;
};

// HubEvent now imported from ws/types to enforce stable contracts

export interface WebSocketHub {
  addClient: (client: WsClient) => void;
  removeClient: (client: WsClient) => void;
  broadcast: (event: HubEvent) => void;
  start: () => void;
  stop: () => void;
}

export function createWebSocketHub(params: { adapter: ElectrumAdapter; core?: CoreRpcAdapter; l1?: L1Cache }): WebSocketHub {
  const { adapter, core, l1 } = params;
  const clients = new Set<WsClient>();
  let pollingTimer: NodeJS.Timeout | null = null;
  let lastHeight: number | null = null;
  let lastHash: string | null = null;
  let lastHeightChangeAt: number | null = null;
  let lastFees: unknown = null;
  let lastMempool: { pendingTransactions: number; vsize?: number } | null = null;
  let lastPriceUSD: { currency: 'BTC'; fiat: 'USD'; value: number; asOfMs: number; provider: string } | null = null;
  let lastFx: { base: 'USD'; rates: Record<string, number>; asOfMs: number; provider: string } | null = null;
  let lastErrorLogMs: number = 0;
  const ERROR_LOG_THROTTLE_MS = 30_000; // avoid noisy logs when electrs is down

  const pollTip = async () => {
    try {
      const header = await adapter.getTipHeader();
      const height = header.height;
      const hash = header.headerHex ? header.headerHex.slice(0, 16) : undefined; // lightweight fingerprint
      if (typeof height === 'number' && height >= 0) {
        // Reorg detection: if height decreased or same height but hash fingerprint changed
        const isNewHeight = lastHeight === null || height !== lastHeight;
        const hashChanged = typeof hash === 'string' && lastHash !== null && hash !== lastHash;
        const heightDecreased = lastHeight !== null && height < lastHeight;
        if (heightDecreased || (isNewHeight && hashChanged)) {
          // Depth is unknown without full chain headers; approximate by |lastHeight - height|
          const depth = lastHeight !== null ? Math.max(1, Math.abs(lastHeight - height)) : 1;
          // Invalidate hot keys that could be impacted by reorg
          try {
            if (l1) {
              l1.del(keys.tipHeight());
              // Future: invalidate block/tx/address keys based on depth/lca
            }
          } catch {}
          const reorgEvt: ChainReorgEvent = {
            type: 'chain.reorg',
            data: {
              depth,
              prevTip: { height: lastHeight ?? 0, hash: lastHash ?? 'unknown' },
              newTip: { height, hash: hash ?? 'unknown' }
            },
            timestamp: Date.now()
          };
          broadcast(reorgEvt);
        }
        lastHeight = height;
        lastHash = hash ?? lastHash;
        lastHeightChangeAt = Date.now();
        // Cache invalidation hooks: tip height changes invalidate height key; reorg branch above handles deeper keys
        try {
          if (l1) l1.del(keys.tipHeight());
        } catch {}
        const evt: TipHeightEvent = { type: 'tip.height', data: { height, lastBlockTime: lastHeightChangeAt! }, timestamp: Date.now() };
        broadcast(evt);
      }
    } catch (err) {
      // Avoid spamming the console with large JSON error payloads
      const now = Date.now();
      if (now - lastErrorLogMs >= ERROR_LOG_THROTTLE_MS) {
        lastErrorLogMs = now;
        const message = (err as any)?.message ?? 'unknown_error';
        const code = (err as any)?.code ?? 'ELECTRUM_ERROR';
        console.warn(`Electrum tip poll failed [${code}]: ${message}. Retrying...`);
      }
    }
  };

  const start = () => {
    if (pollingTimer) return;
    // Poll height every 5s while we build out subscriptions
    pollingTimer = setInterval(pollTip, 5000);
    // Kick immediately
    void pollTip();
    // Also poll fee estimates every 15s and broadcast when changed
    setInterval(async () => {
      try {
        const fees = await adapter.getFeeEstimates();
        const serialized = JSON.stringify(fees);
        if (serialized !== JSON.stringify(lastFees)) {
          lastFees = JSON.parse(serialized);
          const evt: NetworkFeesEvent = { type: 'network.fees', data: lastFees as any, timestamp: Date.now() };
          broadcast(evt);
        }
      } catch (err) {
        const now = Date.now();
        if (now - lastErrorLogMs >= ERROR_LOG_THROTTLE_MS) {
          lastErrorLogMs = now;
          console.warn('Electrum fee poll failed. Retrying...');
        }
      }
    }, 15000);

    // Poll mempool summary every 10s (Core preferred, fallback to Electrum histogram proxy)
    setInterval(async () => {
      try {
        const memCoreOrElectrum = core ? await core.getMempoolSummary() : await adapter.getMempoolSummary();
        const normalized = {
          pendingTransactions: (memCoreOrElectrum as any).pendingTransactions ?? 0,
          vsize: (memCoreOrElectrum as any).vsize
        } as { pendingTransactions: number; vsize?: number };
        if (!lastMempool || normalized.pendingTransactions !== lastMempool.pendingTransactions || normalized.vsize !== lastMempool.vsize) {
          lastMempool = normalized;
          const evt: NetworkMempoolEvent = { type: 'network.mempool', data: normalized, timestamp: Date.now() };
          broadcast(evt);
        }
      } catch (err) {
        const now = Date.now();
        if (now - lastErrorLogMs >= ERROR_LOG_THROTTLE_MS) {
          lastErrorLogMs = now;
          console.warn('Electrum mempool poll failed. Retrying...');
        }
      }
    }, 10000);

    // Poll price USD every 45s from cache if available
    setInterval(async () => {
      try {
        if (!l1) return;
        const cached = l1.get<any>(keys.priceCurrent('USD'));
        if (cached && (!lastPriceUSD || cached.value !== lastPriceUSD.value || cached.asOfMs !== lastPriceUSD.asOfMs)) {
          lastPriceUSD = { currency: 'BTC', fiat: 'USD', value: cached.value, asOfMs: cached.asOfMs, provider: cached.provider };
          const evt: PriceCurrentEvent = { type: 'price.current', data: lastPriceUSD, timestamp: Date.now() } as any;
          broadcast(evt);
        }
      } catch {}
    }, 45000);

    // Poll FX rates hourly from cache
    setInterval(async () => {
      try {
        if (!l1) return;
        const cached = l1.get<any>(keys.fxRates('USD'));
        if (cached && (!lastFx || JSON.stringify(cached.rates) !== JSON.stringify(lastFx.rates) || cached.asOfMs !== lastFx.asOfMs)) {
          lastFx = { base: 'USD', rates: cached.rates, asOfMs: cached.asOfMs, provider: cached.provider };
          const evt: FxRatesEvent = { type: 'fx.rates', data: lastFx, timestamp: Date.now() } as any;
          broadcast(evt);
        }
      } catch {}
    }, 3600_000);
  };

  const stop = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  };

  const addClient = (client: WsClient) => {
    client.__filters__ = new Set();
    clients.add(client);
    // On join, send snapshot if available
    if (lastHeight !== null) {
      try {
        const evt: TipHeightEvent = { type: 'tip.height', data: { height: lastHeight, lastBlockTime: (lastHeightChangeAt ?? Date.now()) }, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch {}
    }
    if (lastFees) {
      try {
        const evt: NetworkFeesEvent = { type: 'network.fees', data: lastFees as any, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch {}
    }
    if (lastMempool) {
      try {
        const evt: NetworkMempoolEvent = { type: 'network.mempool', data: lastMempool, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch {}
    }
    if (lastPriceUSD) {
      try {
        const evt: PriceCurrentEvent = { type: 'price.current', data: lastPriceUSD, timestamp: Date.now() } as any;
        client.send(JSON.stringify(evt));
      } catch {}
    }
    if (lastFx) {
      try {
        const evt: FxRatesEvent = { type: 'fx.rates', data: lastFx, timestamp: Date.now() } as any;
        client.send(JSON.stringify(evt));
      } catch {}
    }
  };

  const removeClient = (client: WsClient) => {
    clients.delete(client);
  };

  const broadcast = (event: HubEvent) => {
    const started = Date.now();
    // Stamp producer-side time for latency visibility
    const anyEvent: any = event as any;
    anyEvent.meta = anyEvent.meta || {};
    anyEvent.meta.producedInMs = Math.max(0, started - (anyEvent.timestamp || started));
    const payload = JSON.stringify(event);
    let delivered = 0;
    for (const c of clients) {
      try {
        // Filter by subscription if present
        if (c.__filters__ && c.__filters__.size > 0 && !c.__filters__.has(event.type)) {
          continue;
        }
        c.send(payload);
        delivered++;
      } catch {
        // Drop failing client silently; proper metrics to be added later
      }
    }
    const dur = Date.now() - started;
    // record producer + broadcast metrics
    try {
      const producedInMs = (event as any).meta?.producedInMs ?? 0;
      recordWsProduced(event.type, producedInMs);
      recordWsBroadcastDuration(event.type, dur, delivered);
    } catch {}
    if (dur > 50 || event.type === 'tip.height') {
      // Periodically log rolling P95 for visibility
      try {
        const { getRollingP95 } = require('../metrics/metrics');
        const p95 = getRollingP95();
        const prodKey = `ws.produced.${event.type}`;
        const brKey = `ws.broadcast.${event.type}`;
        const producedP95 = p95[prodKey] ?? -1;
        const broadcastP95 = p95[brKey] ?? -1;
        console.log(`[ws] event=${event.type} delivered=${delivered} durMs=${dur} p95_produced=${producedP95}ms p95_broadcast=${broadcastP95}ms`);
      } catch {
        console.log(`[ws] event=${event.type} delivered=${delivered} durMs=${dur}`);
      }
    }
  };

  return { addClient, removeClient, broadcast, start, stop };
}


