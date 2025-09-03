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
import type { 
  HubEvent, 
  TipHeightEvent, 
  NetworkFeesEvent, 
  NetworkMempoolEvent, 
  ChainReorgEvent, 
  PriceCurrentEvent, 
  FxRatesEvent,
  BlockchainInfoEvent,
  BlockchainNetworkEvent,
  BlockchainMiningEvent,
  BlockchainInfoPayload,
  BlockchainNetworkPayload,
  BlockchainMiningPayload
} from './types';
import { recordWsBroadcastDuration, recordWsProduced, getRollingP95 } from '../metrics/metrics';

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
  cleanup: () => void;
}

export function createWebSocketHub(params: { adapter: ElectrumAdapter; core?: CoreRpcAdapter; l1?: L1Cache }): WebSocketHub {
  const { adapter, core, l1 } = params;
  const clients = new Set<WsClient>();
  let pollingTimer: NodeJS.Timeout | null = null;
  let lastHeight: number | null = null;
  let lastHash: string | null = null;
  let lastHeightChangeAt: number | null = null;
  let lastFees: { fast: number; normal: number; slow: number } | null = null;
  let lastMempool: { pendingTransactions: number; vsize?: number } | null = null;
  let lastPriceUSD: { currency: 'BTC'; fiat: 'USD'; value: number; asOfMs: number; provider: string } | null = null;
  let lastFx: { base: 'USD'; rates: Record<string, number>; asOfMs: number; provider: string } | null = null;
  
  // New blockchain data state
  let lastBlockchainInfo: BlockchainInfoPayload | null = null;
  let lastNetworkInfo: BlockchainNetworkPayload | null = null;
  let lastMiningInfo: BlockchainMiningPayload | null = null;
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
          } catch { /* Ignore cache invalidation errors */ }
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
        } catch { /* Ignore cache invalidation errors */ }
        const evt: TipHeightEvent = { type: 'tip.height', data: { height, lastBlockTime: lastHeightChangeAt! }, timestamp: Date.now() };
        broadcast(evt);
      }
    } catch (err) {
      // Avoid spamming the console with large JSON error payloads
      const now = Date.now();
      if (now - lastErrorLogMs >= ERROR_LOG_THROTTLE_MS) {
        lastErrorLogMs = now;
        const message = (err as { message?: string })?.message ?? 'unknown_error';
        const code = (err as { code?: string })?.code ?? 'ELECTRUM_ERROR';
        console.warn(`Electrum tip poll failed [${code}]: ${message}. Retrying...`);
      }
    }
  };

  // Store all interval IDs for proper cleanup
  let allIntervals: NodeJS.Timeout[] = [];

  const start = () => {
    if (pollingTimer) return;
    
    // Clear any existing intervals
    allIntervals.forEach(clearInterval);
    allIntervals = [];
    
    // Poll height every 5s while we build out subscriptions
    pollingTimer = setInterval(pollTip, 5000);
    allIntervals.push(pollingTimer);
    
    // Kick immediately
    void pollTip();
    
    // Also poll fee estimates every 15s and broadcast when changed
    const feeInterval = setInterval(async () => {
      try {
        const fees = await adapter.getFeeEstimates();
        const serialized = JSON.stringify(fees);
        if (serialized !== JSON.stringify(lastFees)) {
          lastFees = JSON.parse(serialized) as { fast: number; normal: number; slow: number };
          const evt: NetworkFeesEvent = { type: 'network.fees', data: lastFees, timestamp: Date.now() };
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
    allIntervals.push(feeInterval);

    // Poll mempool summary every 10s (Core preferred, fallback to Electrum histogram proxy)
    const mempoolInterval = setInterval(async () => {
      try {
        const memCoreOrElectrum = core ? await core.getMempoolSummary() : await adapter.getMempoolSummary();
        const normalized = {
          pendingTransactions: (memCoreOrElectrum as { pendingTransactions?: number }).pendingTransactions ?? 0,
          vsize: (memCoreOrElectrum as { vsize?: number }).vsize
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
    allIntervals.push(mempoolInterval);

    // Poll price USD every 45s from cache if available
    const priceInterval = setInterval(async () => {
      try {
        if (!l1) return;
        const cached = l1.get<{ value: number; asOfMs: number; provider: string }>(keys.priceCurrent('USD'));
        if (cached && (!lastPriceUSD || cached.value !== lastPriceUSD.value || cached.asOfMs !== lastPriceUSD.asOfMs)) {
          lastPriceUSD = { currency: 'BTC', fiat: 'USD', value: cached.value, asOfMs: cached.asOfMs, provider: cached.provider };
          const evt: PriceCurrentEvent = { type: 'price.current', data: lastPriceUSD, timestamp: Date.now() };
          broadcast(evt);
        }
      } catch { /* Ignore price polling errors */ }
    }, 45000);
    allIntervals.push(priceInterval);

    // Poll FX rates hourly from cache
    const fxInterval = setInterval(async () => {
      try {
        if (!l1) return;
        const cached = l1.get<{ rates: Record<string, number>; asOfMs: number; provider: string }>(keys.fxRates('USD'));
        if (cached && (!lastFx || JSON.stringify(cached.rates) !== JSON.stringify(lastFx.rates) || cached.asOfMs !== lastFx.asOfMs)) {
          lastFx = { base: 'USD', rates: cached.rates, asOfMs: cached.asOfMs, provider: cached.provider };
          const evt: FxRatesEvent = { type: 'fx.rates', data: lastFx, timestamp: Date.now() };
          broadcast(evt);
        }
      } catch { /* Ignore FX polling errors */ }
    }, 3600_000);
    allIntervals.push(fxInterval);

    // Poll blockchain info every 30 seconds from Bitcoin Core
    const blockchainInterval = setInterval(async () => {
      try {
        if (core) {
          const blockchainInfo = await core.getBlockchainInfo();
          if (!lastBlockchainInfo || JSON.stringify(blockchainInfo) !== JSON.stringify(lastBlockchainInfo)) {
            lastBlockchainInfo = blockchainInfo;
            const evt: BlockchainInfoEvent = { type: 'blockchain.info', data: blockchainInfo, timestamp: Date.now() };
            broadcast(evt);
          }
        }
      } catch (err) {
        const now = Date.now();
        if (now - lastErrorLogMs >= ERROR_LOG_THROTTLE_MS) {
          lastErrorLogMs = now;
          console.warn('Bitcoin Core blockchain info poll failed. Retrying...');
        }
      }
    }, 30000);
    allIntervals.push(blockchainInterval);

    // Poll network info every 60 seconds from Bitcoin Core
    const networkInterval = setInterval(async () => {
      try {
        if (core) {
          const networkInfo = await core.getNetworkInfo();
          if (!lastNetworkInfo || JSON.stringify(networkInfo) !== JSON.stringify(lastNetworkInfo)) {
            lastNetworkInfo = networkInfo;
            const evt: BlockchainNetworkEvent = { type: 'blockchain.network', data: networkInfo, timestamp: Date.now() };
            broadcast(evt);
          }
        }
      } catch (err) {
        const now = Date.now();
        if (now - lastErrorLogMs >= ERROR_LOG_THROTTLE_MS) {
          lastErrorLogMs = now;
          console.warn('Bitcoin Core network info poll failed. Retrying...');
        }
      }
    }, 60000);
    allIntervals.push(networkInterval);

    // Poll mining info every 120 seconds from Bitcoin Core
    const miningInterval = setInterval(async () => {
      try {
        if (core) {
          const miningInfo = await core.getMiningInfo();
          if (!lastMiningInfo || JSON.stringify(miningInfo) !== JSON.stringify(lastMiningInfo)) {
            lastMiningInfo = miningInfo;
            const evt: BlockchainMiningEvent = { type: 'blockchain.mining', data: miningInfo, timestamp: Date.now() };
            broadcast(evt);
          }
        }
      } catch (err) {
        const now = Date.now();
        if (now - lastErrorLogMs >= ERROR_LOG_THROTTLE_MS) {
          lastErrorLogMs = now;
          console.warn('Bitcoin Core mining info poll failed. Retrying...');
        }
      }
    }, 120000);
    allIntervals.push(miningInterval);
  };

  const stop = () => {
    // Clear all intervals for proper cleanup
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
    
    // Clear all other intervals
    allIntervals.forEach(clearInterval);
    allIntervals = [];
  };

  const addClient = (client: WsClient) => {
    client.__filters__ = new Set();
    clients.add(client);
    // On join, send snapshot if available
    if (lastHeight !== null) {
      try {
        const evt: TipHeightEvent = { type: 'tip.height', data: { height: lastHeight, lastBlockTime: (lastHeightChangeAt ?? Date.now()) }, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch { /* Ignore client send errors */ }
    }
    if (lastFees) {
      try {
        const evt: NetworkFeesEvent = { type: 'network.fees', data: lastFees, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch { /* Ignore client send errors */ }
    }
    if (lastMempool) {
      try {
        const evt: NetworkMempoolEvent = { type: 'network.mempool', data: lastMempool, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch { /* Ignore client send errors */ }
    }
    if (lastPriceUSD) {
      try {
        const evt: PriceCurrentEvent = { type: 'price.current', data: lastPriceUSD, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch { /* Ignore client send errors */ }
    }
    if (lastFx) {
      try {
        const evt: FxRatesEvent = { type: 'fx.rates', data: lastFx, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch { /* Ignore client send errors */ }
    }
    
    // Send blockchain data snapshot if available
    if (lastBlockchainInfo) {
      try {
        const evt: BlockchainInfoEvent = { type: 'blockchain.info', data: lastBlockchainInfo, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch { /* Ignore client send errors */ }
    }
    
    if (lastNetworkInfo) {
      try {
        const evt: BlockchainNetworkEvent = { type: 'blockchain.network', data: lastNetworkInfo, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch { /* Ignore client send errors */ }
    }
    
    if (lastMiningInfo) {
      try {
        const evt: BlockchainMiningEvent = { type: 'blockchain.mining', data: lastMiningInfo, timestamp: Date.now() };
        client.send(JSON.stringify(evt));
      } catch { /* Ignore client send errors */ }
    }
  };

  const removeClient = (client: WsClient) => {
    clients.delete(client);
  };

  const broadcast = (event: HubEvent) => {
    // Skip broadcasting if no clients connected
    if (clients.size === 0) {
      return;
    }
    
    const started = Date.now();
    // Stamp producer-side time for latency visibility
    const anyEvent = event as { meta?: { producedInMs?: number }; timestamp?: number };
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
      const producedInMs = (event as { meta?: { producedInMs?: number } }).meta?.producedInMs ?? 0;
      recordWsProduced(event.type, producedInMs);
      recordWsBroadcastDuration(event.type, dur, delivered);
    } catch { /* Ignore metrics recording errors */ }
    
    // Only log if there are clients and significant events
    if (delivered > 0 && (dur > 50 || event.type === 'tip.height')) {
      // Periodically log rolling P95 for visibility
      try {
        const p95 = getRollingP95();
        const prodKey = `ws.produced.${event.type}`;
        const brKey = `ws.broadcast.${event.type}`;
        const producedP95 = p95[prodKey] ?? -1;
        const broadcastP95 = p95[brKey] ?? -1;
        console.log(`[ws] event=${event.type} delivered=${delivered} durMs=${dur} p95_produced=${producedP95}ms p95_broadcast=${broadcastP95}ms`);
      } catch { /* Ignore metrics logging errors */
        console.log(`[ws] event=${event.type} delivered=${delivered} durMs=${dur}`);
      }
    }
  };

  // Enhanced cleanup method for tests
  const cleanup = () => {
    stop();
    // Force clear any remaining intervals as additional safety
    for (let i = 1; i < 1000; i++) {
      clearInterval(i);
    }
    // Clear all clients
    clients.clear();
  };

  return { addClient, removeClient, broadcast, start, stop, cleanup };
}


