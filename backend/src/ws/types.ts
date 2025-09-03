/**
 * @fileoverview WebSocket event contracts (types and helpers) for backend → frontend real-time updates
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-22
 * @lastModified 2025-08-22
 * 
 * @description
 * Typed contracts for WebSocket events emitted by the backend hub. These align with
 * the current polling-first model and are intended to remain stable for clients.
 * 
 * @dependencies
 * - None (pure types)
 * 
 * @state
 * ✅ Functional
 */

export type WsEventType = 'tip.height' | 'network.fees' | 'network.mempool' | 'chain.reorg' | 'price.current' | 'fx.rates' | 'blockchain.info' | 'blockchain.network' | 'blockchain.mining';

export interface TipHeightPayload {
  height: number;
  lastBlockTime: number;
}

export interface NetworkFeesPayload {
  fast: number;
  normal: number;
  slow: number;
  // Optional timestamp fields from upstream may be merged by clients as needed
  lastUpdated?: number;
}

export interface NetworkMempoolPayload {
  pendingTransactions: number;
  vsize?: number;
}

export interface PriceCurrentPayload {
  currency: 'BTC';
  fiat: 'USD';
  value: number;
  asOfMs: number;
  provider: string;
}

export interface FxRatesPayload {
  base: 'USD';
  rates: Record<string, number>;
  asOfMs: number;
  provider: string;
}

export interface BaseWsEvent<TType extends WsEventType, TData> {
  type: TType;
  data: TData;
  timestamp: number;
  // Optional producer-side processing time in ms for visibility
  meta?: {
    producedInMs?: number;
  };
}

export type TipHeightEvent = BaseWsEvent<'tip.height', TipHeightPayload>;
export type NetworkFeesEvent = BaseWsEvent<'network.fees', NetworkFeesPayload>;
export type NetworkMempoolEvent = BaseWsEvent<'network.mempool', NetworkMempoolPayload>;
export type PriceCurrentEvent = BaseWsEvent<'price.current', PriceCurrentPayload>;
export type FxRatesEvent = BaseWsEvent<'fx.rates', FxRatesPayload>;
export interface ChainReorgPayload {
  depth: number;
  lcaHeight?: number;
  prevTip: { height: number; hash: string };
  newTip: { height: number; hash: string };
}
export type ChainReorgEvent = BaseWsEvent<'chain.reorg', ChainReorgPayload>;

// New blockchain data payloads
export interface BlockchainInfoPayload {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  mediantime: number;
  verificationprogress: number;
  chainwork: string;
  pruned: boolean;
  initialblockdownload: boolean;
  size_on_disk: number;
  warnings: string;
}

export interface BlockchainNetworkPayload {
  version: number;
  subversion: string;
  protocolversion: number;
  localservices: string;
  localservicesnames: string[];
  localrelay: boolean;
  timeoffset: number;
  networkactive: boolean;
  connections: number;
  connections_in: number;
  connections_out: number;
  networks: Array<{
    name: string;
    limited: boolean;
    reachable: boolean;
    proxy: string;
    proxy_randomize_credentials: boolean;
  }>;
  relayfee: number;
  incrementalfee: number;
  localaddresses: Array<{
    address: string;
    port: number;
    score: number;
  }>;
  warnings: string;
}

export interface BlockchainMiningPayload {
  blocks: number;
  currentblockweight?: number;
  currentblocktx?: number;
  difficulty: number;
  networkhashps: number;
  pooledtx: number;
  chain: string;
  warnings: string;
}

// New blockchain events
export type BlockchainInfoEvent = BaseWsEvent<'blockchain.info', BlockchainInfoPayload>;
export type BlockchainNetworkEvent = BaseWsEvent<'blockchain.network', BlockchainNetworkPayload>;
export type BlockchainMiningEvent = BaseWsEvent<'blockchain.mining', BlockchainMiningPayload>;

export type HubEvent = TipHeightEvent | NetworkFeesEvent | NetworkMempoolEvent | ChainReorgEvent | PriceCurrentEvent | FxRatesEvent | BlockchainInfoEvent | BlockchainNetworkEvent | BlockchainMiningEvent;


